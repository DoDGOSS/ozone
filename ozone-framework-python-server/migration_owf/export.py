import loader

from migration_tool.adapters.mssql import MSSQLAdapter
from migration_tool.adapters.mysql import MySQLAdapter
from migration_tool.adapters.postgres import PostgresAdapter
from migration_tool.adapters.oracle import OracleAdapter
from migration_tool.sql2json import SQLtoJSON

if __name__ == '__main__':

    databases = [

        # PostgresAdapter({
        #     'host': 'localhost',
        #     'database': 'owf',
        #     'user': 'owf',
        #     'password': 'password',
        # }),

        # MySQLAdapter({
        #     'host': 'localhost',
        #     'database': 'owf',
        #     'user': 'root',
        #     'password': 'password',
        #     # 'unix_socket': "/tmp/mysql.sock",
        # }),

        # OracleAdapter({
        #     'host': 'localhost',
        #     'database': 'ORCLCDB',
        #     'user': 'system',
        #     'password': 'Welcome1',
        #     'port': '1521',
        #     'client_path': 'C:\instantclient_19_5',  # needed for windows.
        # }),

        MSSQLAdapter({
            'host': 'localhost',
            'database': 'owf',
            'user': 'sa',
            'password': 'superstrong_password123',
        })

    ]

    for adapter in databases:
        SQLtoJSON(adapter) \
            .with_tables() \
            .with_schema() \
            .to_json()
