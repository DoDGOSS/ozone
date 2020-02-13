import loader

from migration_owf.transformers import import_transform
from migration_tool.adapters.mssql import MSSQLAdapter
from migration_tool.adapters.mysql import MySQLAdapter
from migration_tool.adapters.oracle import OracleAdapter
from migration_tool.adapters.postgres import PostgresAdapter
from migration_tool.json2sql import JSONtoSQL

if __name__ == '__main__':

    # postgres = PostgresAdapter({
    #     'host': 'localhost',
    #     'database': 'postgres',
    #     'user': 'owf',
    #     'password': 'password',
    # })

    # mysql = MySQLAdapter({
    #     'host': 'localhost',
    #     'database': 'mysql_db',
    #     'user': 'root',
    #     'password': 'password',
    #     # 'unix_socket': "/tmp/mysql.sock",
    # })

    # oracle = OracleAdapter({
    #     'host': 'localhost',
    #     'database': 'orclpdb1',
    #     'user': 'dummy',
    #     'password': 'dummy',
    #     'port': '1521',
    # })

    mssql = MSSQLAdapter({
        'host': 'localhost',
        'database': 'owf_new',
        'user': 'sa',
        'password': 'superstrong_password123',
    })

    # TODO - improve
    import_db = mssql
    import_db_var = 'mssql_owf'

    # add .reset() \ if you wish the destination db to be wiped
    JSONtoSQL(import_db) \
        .reset() \
        .to_sql(
        json_db_path=f'migration_result/{import_db_var}',
        schema_path=f'migration_result/{import_db_var}_schema',
        transformer=import_transform
    )
