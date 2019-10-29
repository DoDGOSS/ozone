import loader

from migration_owf.transformers import import_transform
from migration_tool.adapters.mssql import MSSQLAdapter
from migration_tool.adapters.mysql import MySQLAdapter
from migration_tool.adapters.oracle import OracleAdapter
from migration_tool.adapters.postgres import PostgresAdapter
from migration_tool.json2sql import JSONtoSQL

if __name__ == '__main__':
    postgres = PostgresAdapter({
        'host': 'localhost',
        'database': 'postgres',
        'user': 'user',
        'password': '123123',
    })

    mysql = MySQLAdapter({
        'host': 'localhost',
        'database': 'owf',
        'user': 'root',
        'password': 'password',
        'unix_socket': "/tmp/mysql.sock",
    })

    oracle = OracleAdapter({
        'host': 'database-1.cu1fayu7dbph.us-east-1.rds.amazonaws.com',
        'database': 'oracle',
        'user': 'admin',
        'password': 'adminadmin',
        'port': '1521',
    })

    mssql = MSSQLAdapter({
        'host': 'localhost',
        'database': 'owf',
        'user': 'sa',
        'password': 'reallyStrongPwd123',
    })

    JSONtoSQL(mssql) \
        .reset() \
        .to_sql(
        json_db_path='migration_result/mysql_owf',
        schema_path='migration_result/mysql_owf_schema',
        transformer=import_transform
    )
