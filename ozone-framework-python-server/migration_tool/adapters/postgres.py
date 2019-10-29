# coding: utf-8
import psycopg2
from psycopg2.extensions import AsIs
# from psycopg2.extras import RealDictCursor
from .abstract import DatabaseAdapter
import json
from ..utils import json_serializer


class PostgresAdapter(DatabaseAdapter):

    def get_connection(self):
        if hasattr(self, 'connection') and self.connection:
            return self.connection

        if self.dsn:
            conn = psycopg2.connect(dsn=self.dsn)
        else:
            conn = psycopg2.connect(**self.params)
            # return conn.cursor(cursor_factory=RealDictCursor)
        return conn

    def foreign_keys_freeze(self):
        self.query('SET session_replication_role = "replica"')

    def foreign_keys_unfreeze(self):
        self.query('SET session_replication_role = "origin"')

    def drop_all(self):
        self.foreign_keys_freeze()
        for table_name in self.get_table_names():
            self.query('DROP TABLE %s' % table_name)
        self.foreign_keys_unfreeze()

    def reset(self):
        self.foreign_keys_freeze()
        for table_name in self.get_table_names():
            self.query('TRUNCATE TABLE %s' % table_name)
        self.foreign_keys_unfreeze()

    def insert(self, table_name, dict_data):
        placeholders = ', '.join(['%s'] * len(dict_data))
        columns = ', '.join(dict_data.keys())
        sql = "INSERT INTO %s ( %s ) VALUES ( %s )" % (table_name, columns, placeholders)

        self.query(sql, list(dict_data.values()))

    def query(self, q: str, params=()):
        try:
            super().query(q, params)
            self.cursor.execute(q, params)
            self.connection.commit()
        except Exception as e:
            self.connection.rollback()
            raise e

    def column_exists(self, table_name, column_name):
        self.query("""
        SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=%s AND column_name=%s)
        """, (table_name, column_name))
        return self.fetchone()[0]

    def table_exists(self, table_name):
        self.query("""
            SELECT EXISTS( SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = %s );
        """, (table_name,))
        return self.fetchone()[0]

    def get_table_names(self):
        self.query("""
            SELECT table_name FROM information_schema.tables WHERE table_schema='public'
            """)
        return list(sum(self.cursor.fetchall(), ()))
        # return [e.get('table_name') for e in self.cursor.fetchall()]

    def get_table_schema(self, table_name):
        self.query("""
            SELECT column_name, data_type, is_nullable FROM information_schema.COLUMNS WHERE TABLE_NAME = %s
            ORDER BY LENGTH(column_name), column_name ASC
            """, (table_name,))
        schema = [dict(zip([column[0] for column in self.cursor.description], row)) for row in
                  self.cursor.fetchall()]
        return schema

    def get_records_count(self, table_name):
        self.query("SELECT count(*) AS count FROM %s", (AsIs(table_name),))
        return self.fetchone()[0]

    def get_table_as_json(self, table_name, transformer=None):
        self.query("""
            SELECT json_agg(result) FROM (SELECT * FROM %s) as result
            """, (AsIs(table_name),))
        results = self.fetchall()
        return json.dumps(results[0][0], indent=2, default=json_serializer)

    def fetchone(self):
        return self.cursor.fetchone()

    def fetchall(self):
        return self.cursor.fetchall()
