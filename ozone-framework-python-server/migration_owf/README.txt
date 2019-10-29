SETUP
    Install requirements from pip.
        pip install -r migration_owf/requirements.txt

    Start a mssql-server instance running as the SQL Express edition
        docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=reallyStrongPwd123' -e 'MSSQL_PID=Express' -p 1433:1433 -d mcr.microsoft.com/mssql/server:2017-latest-ubuntu

    Database configuration for django app to set up initial tables on default django postgres db.
        DATABASES = {
            # POSTGRES
            # 'default': {
            #     'ENGINE': 'django.db.backends.postgresql',
            #     'NAME': 'postgres',
            #     'USER': 'postgres',
            #     'PASSWORD': 'postgres',
            #     'HOST': 'localhost',
            #     'PORT': 5432,
            # }

            # ORACLE
            # 'default': {
            #     'ENGINE': 'django.db.backends.oracle',
            #     'NAME': 'oracle',
            #     'USER': 'admin',
            #     'PASSWORD': 'adminadmin',
            #     'HOST': 'database-1.cu1fayu7dbph.us-east-1.rds.amazonaws.com',
            #     'PORT': '1521',
            # }

            # MS SQL
            'default': {
                'ENGINE': 'sql_server.pyodbc',
                'NAME': 'owf2',
                'USER': 'sa',
                'PASSWORD': 'reallyStrongPwd123',
                'HOST': 'localhost',
                'PORT': '1433',
            }
        }

USAGE
    Change the database connections in import.py and export.py files.
    Export the databases by running cd migration_owf; python export.py

    Generate Field Map:
        generate_mapping.py is a helper script which would show the fields which does not exists in target database.
        for example, legacy db (source db) does not have fields for password, is_active, is_admin in person table.
        But target db requires those fields so the mapping file helps you define a default value to those fields.
        Or you can simply remove those fields from the mapping file and it wont be included while inserting the data.
        Sometimes a field requires more than a string or a bool, int, for example, in case of password field,
        we cannot simply write a default password for all users. In this case, we modify migration_owf/transformers/
        file and define how to handle password field, like generating a random password compatible with django.

    Once mapping is defined how the data needs to be exported in your case, you can simple run
    cd migration_owf; python import.py
    Make sure to change source json data path and target database connection.
    Note: On a fresh django db, make sure to run ./manage.py migrate for initial table setup.