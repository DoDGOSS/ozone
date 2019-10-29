import loader

from migration_tool.adapters.mssql import MSSQLAdapter
from migration_tool.adapters.mysql import MySQLAdapter
from migration_tool.adapters.postgres import PostgresAdapter
from migration_tool.adapters.oracle import OracleAdapter
from migration_tool.sql2json import SQLtoJSON

if __name__ == '__main__':

    databases = [
        PostgresAdapter({
            'host': 'localhost',
            'database': 'postgres',
            'user': 'user',
            'password': '123123',
        }),
        MySQLAdapter({
            'host': 'localhost',
            'database': 'owf',
            'user': 'root',
            'password': 'password',
            'unix_socket': "/tmp/mysql.sock",
        }),
        OracleAdapter({
            'host': 'database-1.cu1fayu7dbph.us-east-1.rds.amazonaws.com',
            'database': 'oracle',
            'user': 'admin',
            'password': 'adminadmin',
            'port': '1521',
        }),
        MSSQLAdapter({
            'host': 'localhost',
            'database': 'owf',
            'user': 'sa',
            'password': 'reallyStrongPwd123',
        })
    ]

    for adapter in databases:
        SQLtoJSON(adapter) \
            .with_tables() \
            .with_schema() \
            .to_json()
