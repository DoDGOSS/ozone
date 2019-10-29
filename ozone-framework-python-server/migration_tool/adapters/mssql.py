# coding: utf-8

import pymssql
import types
from itertools import chain
from .abstract import DatabaseAdapter


class MSSQLAdapter(DatabaseAdapter):
    last_table = None

    def get_connection(self):
        if hasattr(self, 'connection') and self.connection:
            return self.connection

        params = {
            'server': self.params.get('host', 'localhost'),
            'user': self.params.get('user'),
            'password': self.params.get('password'),
            'database': self.params.get('database'),
            'autocommit': True,
        }

        if self.params.get('unix_socket'):
            params.update({'unix_socket': self.params.get('unix_socket')})
        else:
            params.update({'port': self.params.get('port', 1433)})

        conn = pymssql.connect(**params)

        return conn

    def foreign_keys_freeze(self):
        self.query("""
            DECLARE @sql AS NVARCHAR(max)='';
            select @sql = @sql +
                          'ALTER INDEX ALL ON [' + t.[name] + '] DISABLE;' + CHAR(13)
            from sys.tables t
            where type = 'u';

            select @sql = @sql +
                          'ALTER INDEX ' + i.[name] + ' ON [' + t.[name] + '] REBUILD;' + CHAR(13)
            from sys.key_constraints i
                     join
                 sys.tables t on i.parent_object_id = t.object_id
            where i.type = 'PK';

            exec dbo.sp_executesql @sql
        """)

    def foreign_keys_unfreeze(self):
        self.query('''
            DECLARE @sql AS NVARCHAR(max)=''
            select @sql = @sql +
                'ALTER INDEX ALL ON [' + t.[name] + '] REBUILD;'+CHAR(13)
            from
                sys.tables t
            where type='u'

            exec dbo.sp_executesql @sql
        ''')

    def drop_all(self):
        self.query('drop database {0} go'.format(self.params.get('database')))
        self.query('create database {0} go'.format(self.params.get('database')))

    def reset(self):
        pass

    def insert(self, table_name, dict_data):
        # if identity_insert is on, it wont add null values for primary key.
        if 'id' in dict_data.keys() and dict_data.get('id') is None:
            del dict_data['id']

        placeholders = ', '.join(['%s'] * len(dict_data))
        columns = ', '.join(dict_data.keys())
        sql = "INSERT INTO %s ( %s ) VALUES ( %s )" % (table_name, columns, placeholders)

        on_sql = f"SET IDENTITY_INSERT {table_name} ON"
        off_sql = f"SET IDENTITY_INSERT {table_name} OFF"
        if_exists_sql = f"IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'{table_name}'))"

        if 'id' in dict_data.keys():
            sql = "%s %s; %s; %s;" % (if_exists_sql, on_sql, sql, off_sql)

        return self.query(sql, tuple(dict_data.values()))

    def query(self, q: str, params=()):
        super().query(q, params)
        return self.cursor.execute(q, params)

    def column_exists(self, table_name, column_name):
        self.query("""
            SELECT count(*) as count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=%s AND COLUMN_NAME=%s
            """, (table_name, column_name))

        return bool(self.fetchone()[0])

    def table_exists(self, table_name):
        self.query("""
            SELECT count(*) as table_count FROM INFORMATION_SCHEMA.TABLES WHERE 
            TABLE_TYPE='BASE TABLE' AND TABLE_NAME=%s
            """, table_name)

        return bool(self.fetchone()[0])

    def get_table_names(self):
        self.query("""
            SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY 1
            """)

        return list(sum(self.fetchall(), ()))

    def get_table_schema(self, table_name):
        self.query("""
            SELECT column_name, data_type, is_nullable FROM INFORMATION_SCHEMA.COLUMNS WHERE 
            TABLE_NAME = %s ORDER BY LEN(column_name), column_name ASC
            """, table_name)

        schema = [dict(zip([column[0] for column in self.cursor.description], row)) for row in
                  self.cursor.fetchall()]

        return schema

    def get_records_count(self, table_name):
        self.query("""
            SELECT count(*) AS count FROM {}
            """.format(table_name))

        fetch = self.fetchone()
        return int(fetch[0]) if fetch is not None else 0

    def get_table_as_json(self, table_name, transformer=None):
        schema = self.get_table_schema(table_name)
        column_names = [col['column_name'] for col in schema]
        columns = ', '.join(chain(*zip(map(lambda x: '"%s"' % x, column_names), column_names)))

        self.query("""
            SELECT * FROM {table_name} FOR JSON PATH, INCLUDE_NULL_VALUES
        """.format(columns=columns, table_name=table_name))

        results = ''
        for row in self.fetchall():
            results += row[0]

        if isinstance(transformer, types.FunctionType):
            results = transformer(results)

        return results

    def fetchone(self):
        return self.cursor.fetchone()

    def fetchall(self):
        return self.cursor.fetchall()
