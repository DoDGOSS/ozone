# coding: utf-8

import pymysql
import types
import pymysql.cursors
from itertools import chain
from .abstract import DatabaseAdapter


class MySQLAdapter(DatabaseAdapter):
    DB_CHARSET = 'utf8mb4'
    DB_COLLATION = 'utf8mb4_general_ci'

    # def __init__(self, params=None, dsn=None, *args, **kwargs):
    #     super().__init__(params, dsn, *args, **kwargs)
    #     # self._set_charset(self.DB_CHARSET, self.DB_COLLATION)

    def get_connection(self):
        if hasattr(self, 'connection') and self.connection:
            return self.connection

        params = {
            'host': self.params.get('host', 'localhost'),
            'user': self.params.get('user'),
            'passwd': self.params.get('password'),
            'db': self.params.get('database'),
            'charset': self.DB_CHARSET,
            'cursorclass': pymysql.cursors.DictCursor,
            'autocommit': True,
        }

        if self.params.get('unix_socket'):
            params.update({'unix_socket': self.params.get('unix_socket')})
        else:
            params.update({'port': self.params.get('port', 3306)})

        conn = pymysql.connect(**params)

        return conn

    def foreign_keys_freeze(self):
        self.query('SET GLOBAL FOREIGN_KEY_CHECKS=0')

    def foreign_keys_unfreeze(self):
        # self.query('SET GLOBAL FOREIGN_KEY_CHECKS=1')
        pass

    def drop_all(self):
        self.foreign_keys_freeze()
        for table_name in self.get_table_names():
            table_name = '`%s`.`%s`' % (self.params.get('database'), table_name)
            self.query('DROP TABLE %s' % table_name)
        self.foreign_keys_unfreeze()

    def reset(self):
        self.foreign_keys_freeze()
        self.query('''
                SELECT CONCAT('TRUNCATE TABLE ', TABLE_NAME, ';')
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_SCHEMA = database()
        ''')
        self.foreign_keys_unfreeze()

    def insert(self, table_name, dict_data):
        placeholders = ', '.join(['%s'] * len(dict_data))
        columns = ', '.join(dict_data.keys())
        table_name = '`%s`.`%s`' % (self.params.get('database'), table_name)
        sql = "INSERT INTO %s ( %s ) VALUES ( %s )" % (table_name, columns, placeholders)

        return self.query(sql, tuple(dict_data.values()))

    def query(self, q: str, params=()):
        super().query(q, params)
        return self.cursor.execute(q, params)

    def column_exists(self, table_name, column_name):
        self.query("""
            SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = database() AND 
            TABLE_NAME = %s AND COLUMN_NAME = %s
            """, (table_name, column_name))

        return bool(self.fetchone())

    def table_exists(self, table_name):
        self.query("""
            SELECT COUNT(*) as table_count FROM information_schema.tables WHERE TABLE_SCHEMA = database() AND TABLE_NAME = %s
            """, table_name)

        return bool(self.fetchone()['table_count'])

    def get_table_names(self):
        self.query("""
            SELECT table_name AS "table" -- , ROUND(((data_length + index_length) / 1024 / 1024), 2) "size_in_mb"
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = database()
            ORDER BY 1 -- (data_length + index_length) DESC
            """)

        return [e['table'] for e in self.fetchall()]

    def get_table_schema(self, table_name):
        self.query("""
            SELECT column_name, data_type, is_nullable FROM information_schema.COLUMNS WHERE 
            TABLE_NAME = %s AND TABLE_SCHEMA = database()
            ORDER BY LENGTH(column_name), column_name ASC
            """, table_name)
        results = []
        for row in self.cursor.fetchall():
            results.append({k.lower(): v for k, v in row.items()})

        return results

    def get_records_count(self, table_name):
        table_name = '`%s`.`%s`' % (self.params.get('database'), table_name)
        self.query("""
            SELECT count(*) AS count FROM {}
            """.format(table_name))

        return int(self.fetchone()['count'])

    def get_table_as_json(self, table_name, transformer=None):
        if self._db_version() <= '5.7.21':
            raise ValueError('SQL TO JSON OBJECTS NOT SUPPORTED IN MYSQL VERSION <= 5.7.21.')

        schema = self.get_table_schema(table_name)
        column_names = [col['column_name'] for col in schema]
        columns = ', '.join(chain(*zip(map(lambda x: '"%s"' % x, column_names), column_names)))
        table_name = '`%s`.`%s`' % (self.params.get('database'), table_name)

        self.query("""
            SELECT JSON_ARRAYAGG(JSON_OBJECT({columns})) as results FROM {table_name};
        """.format(columns=columns, table_name=table_name))

        results = self.fetchall()[0]['results']
        if isinstance(transformer, types.FunctionType):
            results = transformer(results)
        return results

    def fetchone(self):
        return self.cursor.fetchone()

    def fetchall(self):
        return self.cursor.fetchall()

    def _set_charset(self, charset, collate=None):
        sql = 'SET NAMES %s' % charset

        if collate is not None:
            sql += ' COLLATE %s' % collate

        self.query(sql)
        self.query('SET CHARACTER_SET_RESULTS=%s', charset)

    def _db_version(self):
        self.query('SELECT version() as version')
        return self.fetchone()['version']
