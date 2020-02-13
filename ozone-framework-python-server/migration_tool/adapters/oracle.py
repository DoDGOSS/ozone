# coding: utf-8
# python -m pip install cx_Oracle --upgrade
import cx_Oracle
import types
import os
import re
import csv
import json
from .abstract import DatabaseAdapter


class OracleAdapter(DatabaseAdapter):
    DB_ENCODING = 'UTF-8'

    def __init__(self, params=None, dsn=None, *args, **kwargs):
        if os.name == 'nt':
            client_path = kwargs.get("client_path", r"C:\instantclient_19_5")
            os.environ["PATH"] = client_path + ";" + os.environ["PATH"]
        super().__init__(params, dsn, *args, **kwargs)

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
                for i in (select constraint_name, table_name from user_constraints where constraint_type IN ('R', 'P', 'U')) LOOP
                    execute immediate 'alter table '||i.table_name||' disable constraint '||i.constraint_name||'';
                end loop;
            end;
        ''')

    def foreign_keys_unfreeze(self):
        try:
            self.query('''
                begin
                    for i in (select constraint_name, table_name from user_constraints where constraint_type IN ('R', 'P', 'U')) LOOP
                        execute immediate 'alter table '||i.table_name||' enable constraint '||i.constraint_name||'';
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
                    (select * from dba_tables where owner=UPPER(:username))
                    loop
                        execute immediate 'DROP TABLE ' || table_.owner || '.' || table_.table_name || ' CASCADE CONSTRAINTS';
                    end loop;
            end;
        ''', {'username': self.params['user']})
        self.foreign_keys_unfreeze()

    def reset(self):
        self.foreign_keys_freeze()
        self.query('''
            begin
                for table_ in
                    (select * from dba_tables where owner=UPPER(:username))
                    loop
                        execute immediate 'truncate table ' || table_.owner || '.' || table_.table_name || ' cascade';
                    end loop;
            end;
        ''', {'username': self.params['user']})
        self.foreign_keys_unfreeze()

    def insert(self, table_name, dict_data):
        placeholders = ', '.join([':%d' % i for i, e in enumerate(dict_data)])
        columns = ', '.join(dict_data.keys())
        sql = "INSERT INTO %s ( %s ) VALUES ( %s )" % (table_name.upper(), columns, placeholders)
        return self.query(sql, tuple(dict_data.values()))

    def query(self, q: str, params=()):
        super().query(q, params)
        try:
            executed = self.cursor.execute(q, params)
            self.connection.commit()
            return executed
        except Exception as e:
            print(e)

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

        return [e[0] for e in self.fetchall() if re.match(r'^[a-zA-Z_]+$', e[0], re.I)]

    def get_table_schema(self, table_name):
        self.query("""
            SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, DATA_DEFAULT, NULLABLE FROM ALL_TAB_COLS
            WHERE owner=UPPER(:username) AND TABLE_NAME=UPPER(:table_name)
            ORDER BY LENGTH(COLUMN_NAME), COLUMN_NAME ASC
            """, {'table_name': table_name, 'username': self.params['user']})
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

        for i in schema:
            if i['data_type'] == "LONG":
                self.csv_gen(table_name=table_name)
                # csv_gen(table_name=table_name, user=self.params['user'], password=self.params['password'],
                #         host=self.params['host'], database=self.params['database'], port=self.params['port'])
                self.csv_json(schema=schema,
                              csv_file_path=f"./migration_result/oracle_{self.params['database']}/{table_name.lower()}.csv",
                              json_file_path=f"./migration_result/oracle_{self.params['database']}/{table_name.lower()}.json"
                              )
                os.remove(f"./migration_result/oracle_{self.params['database']}/{table_name.lower()}.csv")

        try:
            clob = self.cursor.fetchone()[0]
            results = clob.read()
            if isinstance(transformer, types.FunctionType):
                results = transformer(results)
            return results
        except Exception as e:
            print(e)
            # Insert function here for dashboards
            self.csv_gen(table_name=table_name)
            # csv_gen(table_name=table_name, user=self.params['user'], password=self.params['password'],
            #         host=self.params['host'], database=self.params['database'], port=self.params['port'])
            self.csv_json(schema=schema,
                          csv_file_path=f"./migration_result/oracle_{self.params['database']}/{table_name.lower()}.csv",
                          json_file_path=f"./migration_result/oracle_{self.params['database']}/{table_name.lower()}.json")
            os.remove(f"./migration_result/oracle_{self.params['database']}/{table_name.lower()}.csv")

    def fetchone(self):
        return self.cursor.fetchone()

    def fetchall(self):
        return self.cursor.fetchall()

    def csv_gen(self, table_name):
        # db = cx_Oracle.connect(f'{user}/{password}@{host}:{port}/{database}')
        # cursor = db.cursor()
        SQL = f"SELECT * FROM {table_name}"
        self.cursor.execute(SQL)

        # Extract headers from cursor.description:
        headers = [i[0] for i in self.cursor.description]

        # Open a file for writing, and create a csv.writer instance:

        with open(f"./migration_result/oracle_{self.params['database']}/{table_name.lower()}.csv", "w") as f:
            fcsv = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)

            # Write header row, then write the rest of the data:
            fcsv.writerow(headers)
            for record in self.cursor:
                fcsv.writerow(record)

        assert f.closed

    @staticmethod
    def lower_dict_key(d):
        new_dict = dict((k.lower(), v) for k, v in d.items())
        return new_dict

    def csv_json(self, schema, csv_file_path, json_file_path):
        arr = []
        with open(csv_file_path) as csv_file:
            csv_reader = csv.DictReader(csv_file)
            data = {}
            for rows in csv_reader:
                data = rows
                arr.append(data)

        transform_arr = []
        with open(json_file_path, 'w') as json_file:
            for item in arr:
                low_key = self.lower_dict_key(item)
                for i in schema:
                    var = i['column_name'].lower()
                    if var in low_key.keys() and i["data_type"] == "NUMBER" and low_key[var] is not '':
                        low_key[var] = int(low_key[var])
                    elif var in low_key.keys() and i["data_type"] == "NUMBER" and low_key[var] is '':
                        low_key[var] = None
                    elif var in low_key.keys() and low_key[var] is '' and i["nullable"] == "Y":
                        low_key[var] = None

                transform_arr.append(low_key)
            json_file.write(json.dumps(transform_arr, indent=4))
