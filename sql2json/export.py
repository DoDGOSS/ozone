from psycopg2.extras import RealDictCursor
from datetime import date, datetime
import psycopg2
import json
import os


# Using dataframes? :p
# gives more options to export
# import pandas as pd
# from pandas.io import sql
# conn = psycopg2.connect(**connection_parameters)
# e = pd.read_sql('select * from products;', conn)
# b = e.to_json()
# print(b)


class SqlToJson:
    QUERIES = {
        "total_records": "SELECT count(*) AS count FROM {}",
        "all_tables": "SELECT table_name FROM information_schema.tables WHERE table_schema='public'",
        "select_table": "SELECT json_agg(result) FROM (SELECT * FROM {0}) as result",
        # "select_table": "SELECT to_json(result) FROM (SELECT * FROM {0}) result,
        # "select_table": "SELECT * FROM {0}",
    }

    def __init__(self, db_params):
        self.db_params = db_params
        self.cursor = self.get_cursor()

    def conn_to_dsn(self):
        pass

    def get_cursor(self):
        conn = psycopg2.connect(**self.db_params)
        # return conn.cursor(cursor_factory=RealDictCursor)
        return conn.cursor()

    def query(self, q: str, args=()):
        return self.cursor.execute(q, args)

    def get_tables(self):
        self.cursor.execute(self.QUERIES['all_tables'])
        return list(sum(self.cursor.fetchall(), ()))
        # return [e.get('table_name') for e in self.cursor.fetchall()]

    def to_json(self, tables: [] = None, path: str = None):
        if not tables:
            tables = self.get_tables()
        assert tables, 'No tables found.'

        print('TOTAL TABLES %d' % len(tables))
        for table in tables:
            if not path:
                path = 'sql2json_result/{}'.format(self.db_params.get('database'))

            # total records
            self.cursor.execute(self.QUERIES['total_records'].format(table))
            total_records = self.cursor.fetchone()[0]

            # grab records
            if total_records > 0:
                self.cursor.execute(self.QUERIES['select_table'].format(table))
                items = self.cursor.fetchall()
                output = json.dumps(items, indent=2, default=self._json_serializer)
                self._write(output, path, table)
            print(
                '  {} \n    {} records {}'.format(table.upper(), total_records, 'dumped' if total_records > 0 else ''))

    def _write(self, data, path, filename):
        os.makedirs(path, exist_ok=True)
        with open('{}/{}.json'.format(path, filename), 'w+') as outfile:
            outfile.write(data)
        outfile.close()

    def _json_serializer(self, obj: {}):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        # failure fallback
        if not isinstance(obj, str):
            return str(obj)
        raise TypeError("Object of type '%s' is not JSON serializable" % type(obj).__name__)


if __name__ == '__main__':
    db = SqlToJson({
        'host': 'localhost',
        'database': 'owf',
        'user': 'user',
        'password': '123123',
    })
    # db.to_json(['intent', 'owf_group'])
    db.to_json()
