# coding: utf-8
# python -m pip install cx_Oracle --upgrade
import cx_Oracle
import types
from .abstract import DatabaseAdapter


class OracleAdapter(DatabaseAdapter):
    DB_ENCODING = 'UTF-8'

    def get_connection(self):
        if hasattr(self, 'connection') and self.connection:
            return self.connection

        conn = cx_Oracle.connect(
            self.params['user'],
            self.params['password'],
            f"{self.params['host']}/{self.params['database']}",
            encoding=self.DB_ENCODING
        )
        return conn

    def foreign_keys_freeze(self):
        self.query('''
        begin
            for disable_constraint_ in
                (select * from dba_constraints where owner = 'ADMIN' and constraint_type IN ('R', 'P'))
                loop
                    execute immediate 'alter table ' || disable_constraint_.owner || '.' || disable_constraint_.table_name ||
                                      ' disable constraint ' || disable_constraint_.constraint_name;
                end loop;
        end;
        ''')

    def foreign_keys_unfreeze(self):
        try:
            self.query('''
                begin
                    for enable_constaint_ in
                        (select * from dba_constraints where owner = 'ADMIN' and constraint_type IN ('R', 'P'))
                        loop
                            execute immediate 'alter table ' || enable_constaint_.owner || '.' || enable_constaint_.table_name ||
                                              ' enable constraint ' || enable_constaint_.constraint_name;
                        end loop;
                end;
            ''')
        except cx_Oracle.DatabaseError:
            pass

    def drop_all(self):
        self.foreign_keys_freeze()
        self.query('''
            begin
                for table_ in
                    (select * from dba_tables where owner = 'ADMIN')
                    loop
                        execute immediate 'DROP TABLE ' || table_.owner || '.' || table_.table_name || ' CASCADE CONSTRAINTS';
                    end loop;
            end;
        ''')
        self.foreign_keys_unfreeze()

    def reset(self):
        self.foreign_keys_freeze()
        self.query('''
            begin
                for table_ in
                    (select * from dba_tables where owner = 'ADMIN')
                    loop
                        execute immediate 'truncate table ' || table_.owner || '.' || table_.table_name || ' cascade';
                    end loop;
            end;
        ''')
        self.foreign_keys_unfreeze()

    def insert(self, table_name, dict_data):
        placeholders = ', '.join([':%d' % i for i, e in enumerate(dict_data)])
        columns = ', '.join(dict_data.keys())
        sql = "INSERT INTO %s ( %s ) VALUES ( %s )" % (table_name.upper(), columns, placeholders)
        return self.query(sql, list(dict_data.values()))

    def query(self, q: str, params=()):
        super().query(q, params)
        executed = self.cursor.execute(q, params)
        self.connection.commit()
        return executed

    def column_exists(self, table_name, column_name):
        self.query("""
            SELECT count(*) AS table_count FROM all_tab_columns WHERE COLUMN_NAME=UPPER(:column_name) AND 
            TABLE_NAME=UPPER(:table_name)
            """, {'column_name': column_name, 'table_name': table_name})

        return bool(self.fetchone()[0])

    def table_exists(self, table_name):
        self.query("""
            SELECT count(*) AS table_count FROM all_objects WHERE object_type IN ('TABLE','VIEW') 
            AND object_name = UPPER(:table_name)
            """, {'table_name': table_name})

        return bool(self.fetchone()[0])

    def get_table_names(self):
        self.query("""
            -- SELECT table_name FROM user_tables ORDER BY 1
            SELECT DISTINCT OBJECT_NAME
              FROM USER_OBJECTS
             WHERE OBJECT_TYPE = 'TABLE'
            ORDER BY 1
            """)

        return [e[0] for e in self.fetchall()]

    def get_table_schema(self, table_name):
        self.query("""
            SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, DATA_DEFAULT, NULLABLE FROM ALL_TAB_COLS
            WHERE owner = 'ADMIN' AND TABLE_NAME=UPPER(:table_name)
            ORDER BY LENGTH(COLUMN_NAME), COLUMN_NAME ASC
            """, {'table_name': table_name})
        schema = [dict(zip([column[0].lower() for column in self.cursor.description], row)) for row in
                  self.cursor.fetchall()]
        return schema

    def get_records_count(self, table_name):
        self.query("""
            SELECT count(*) AS count FROM {0}
            """.format(table_name.upper()))

        return self.fetchone()[0]

    def get_table_as_json(self, table_name, transformer=None):
        schema = self.get_table_schema(table_name)
        column_names = [col['column_name'] for col in schema]
        columns = ', '.join(map(lambda x: "'{0}' value {1}".format(x.lower(), x), column_names))

        self.query("""
            SELECT JSON_ARRAYAGG( JSON_OBJECT( {columns} ) returning clob ) AS dataset FROM {table_name}
        """.format(columns=columns, table_name=table_name.upper()))

        clob = self.fetchone()[0]
        results = clob.read()
        if isinstance(transformer, types.FunctionType):
            results = transformer(results)
        return results

    def fetchone(self):
        return self.cursor.fetchone()

    def fetchall(self):
        return self.cursor.fetchall()
