# Note
This README included to assist in giving giving developers / users insight on how the whole migration
process may look like.

Please refer to the official documentation for official migration steps (configuration_guide_upgrading)

## MySQL
### Setup
* start python virtualenv `pipenv shell` from the ozone-framework-python-server project.
* `pip install mysqlclient` in the ozone-framework-python-server project. 
* run `docker-compose up -d mysqldb phpmyadmin`
* load ozone mysql dump `docker-compose exec -T mysqldb mysql -uroot -ppassword mysql_db < mysqlozonedump.sql`
(creates new "owf" database)

* OR
    * use phpmyadmin (should be available on localhost:5000) to import the legacy dump `mysqlozonedump.sql`.
 It will create the "owf" database. You can then export that, to get the schemas and data of legacy database 
 using migration_owf/export.py. Make sure to modify the export.py connection settings to connect to your mysql instance.
 
    * create a database "owf_new" through phpmyadmin. 
    
* Update `migration_owf/export.py` to connect to database containing legacy data
```
databases = [
  MySQLAdapter({
      'host': 'localhost',
      'database': 'owf',
      'user': 'root',
      'password': 'password',
      #'unix_socket': "/tmp/mysql.sock", # uncomment if you are on a unix-based os
  })
]
```
* temporarily modify the "DATABASE" setting in config/base.py to reflect new mysql database
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mysql_db',
        'USER': 'admin',
        'PASSWORD': 'password',
        'HOST': 'localhost', # if localhost doesn't work, try '127.0.0.1'
        'PORT': '3306',
        # Wraps each web request in a transaction. So if anything fails, it will rollback automatically.
        'ATOMIC_REQUESTS': True,
    }
}
```
* make the following modifications to the data to make it importable/usable
    * go to folder "migration_result" and create a folder "mapping" and create/open person.json file and update the file with following
    ```json
    {"is_active": true, "is_admin":  false}
   ```
* run `python manage.py migrate` to create load the new owf schema (do not run load the default data)
* run `python export.py` and the data will be exported from the desired database.
* modify the `migration_owf/import.py` settings to connect to your mysql instance

```
    mysql = MySQLAdapter({
        'host': 'localhost',
        'database': 'mysql_db',  # new mysql database connection
        'user': 'root',
        'password': 'password',
        # 'unix_socket': "/tmp/mysql.sock",
    }),

```
* run `python export.py` and the data will be exported from the desired database.
* run `python import.py` and the data will be migrated.
* if there are integrity or duplicate errors, manually truncate all the tables in the database. import script does run reset() function to truncate all tables but in case you get duplicate/integrity errors, manually truncate all tables in new db.
* run `./manage.py runserver`
    * if you see any migration warnings while running ./manage.py runserver , run ./manage.py migrate --fake
* if login fails due to invalid password, open python shell and run the following command to generate password hash and update the person table manually.
    ```
    from django.contrib.auth.hashers import make_password
    make_password("password")
   ```
    Or just use this hash in password field `pbkdf2_sha256$150000$XU4NH5WtGior$kHsgbMCSxImX8Y/v2Ys56zIQj0WeIIK1sUmesUeiUZ8=` which translates to `password`


If you have issues on your mac with the mysqlclient package, try the following:
  
  * I ran the following commands and it worked on my macOS 10.14.6 (mojave)
  https://stackoverflow.com/questions/43612243/install-mysqlclient-for-django-python-on-mac-os-x-sierra
  ```
  brew install mysql-client
  # mysql-client is not on the `PATH` by default
  export PATH="/usr/local/opt/mysql-client/bin:$PATH"
  # openssl is not on the link path by default
  export LIBRARY_PATH="$LIBRARY_PATH:/usr/local/opt/openssl/lib/"
  ```
### Reset DB entirely
* While mysql container is running 
    * docker ps 
    * docker rm -f <ID_OF_MYSQL>
    * docker-compose up mysqldb


## MSSQL
* Install required packages
    * pip install django-mssql-backend pymssql
* Install required drivers (if needed)
    * Microsoft® ODBC Driver 17 for SQL Server
        * https://www.microsoft.com/en-us/download/details.aspx?id=56567
* run `docker-compose up -d mssqldb`
* copy the dump file to docker container so we can import it, run 
    `docker cp mssqlozonedump.bak  mssqldb:/tmp/mssqlozonedump.bak`
* load ozone mssql dump and create new database to import to
    ```
    docker exec -it mssqldb bash
    
    /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "superstrong_password123" -Q "RESTORE DATABASE owf FROM DISK = '/tmp/mssqlozonedump.bak' WITH MOVE 'owf' TO '/var/opt/mssql/data/owf.mdf', MOVE 'owf_log' TO '/var/opt/mssql/data/owf_log.ldf'"
    
    // create new database
    /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "superstrong_password123" -Q "CREATE DATABASE owf_new"
    
    ```
* Update `migration_owf/export.py` to connect to database containing legacy data
    * Assure MSSQL adaptor is not commented out
        * ```migration_tool.adapters.mssql import MSSQLAdapter```
```
databases = [
    MSSQLAdapter({
        'host': 'localhost',
        'database': 'owf',
        'user': 'sa',
        'password': 'superstrong_password123',
    })
]
```
* temporarily modify the "DATABASE" setting in config/base.py to be
```
DATABASES = {
    'default': {
        'ENGINE': 'sql_server.pyodbc',
        'NAME': 'owf_new',
        'USER': 'sa',
        'PASSWORD': 'superstrong_password123',
        'HOST': 'localhost',
        'PORT': '1433',
        # Wraps each web request in a transaction. So if anything fails, it will rollback automatically.
        'ATOMIC_REQUESTS': True,
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',
        },
    }
}
```

* modify the `migration_owf/import.py` settings to be able connect to your mssql instance
    * Assure MSSQL adaptor is imported
        * ```migration_tool.adapters.mssql import MSSQLAdapter```
```
    mssql = MSSQLAdapter({
        'host': 'localhost',
        'database': 'owf_new',
        'user': 'sa',
        'password': 'superstrong_password123',
    })
    
    # Select mysql
    JSONtoSQL(mssql)
```
* make the following modifications to the data to make it importable/usable
    * go to folder "migration_result" and create a folder "mapping" and create/open person.json file and update the file with following
    ```json
    {"is_active": true, "is_admin":  false}
    ``` 
* run `python manage.py migrate` to create load the new owf schema (do not run load the default data)
* run `python export.py` and the data will be exported from the desired database.
* run `python import.py` and the data will be migrated.
* run `./manage.py runserver`
    * if you see any migration warnings while running ./manage.py runserver , run ./manage.py migrate --fake
* if login fails due to invalid password, open python shell and run the following command to generate password hash and update the person table manually.
    ```
    from django.contrib.auth.hashers import make_password
    make_password("password")
   ```
  Or just use this hash in password field `pbkdf2_sha256$150000$XU4NH5WtGior$kHsgbMCSxImX8Y/v2Ys56zIQj0WeIIK1sUmesUeiUZ8=` which translates to `password`


## POSTGRES
* run `docker-compose up postgresdb`
* load ozone postgresql dump `docker-compose exec -T postgresdb pg_restore --no-owner -U owf -d owf < postgresozonedump`
    * if you get an error `The '<' operator is reserved for future use.` try to wrap the above command in `cmd -c "docker-compose exec -T postgresdb pg_restore --no-owner -U owf -d owf < postgresozonedump"`
* Update `migration_owf/export.py` to connect to database containing legacy data
```
databases = [
  PostgresAdapter({
      'host': 'localhost',
      'database': 'owf',
      'user': 'owf',
      'password': 'password',
  })
]
```

* temporarily modify the "DATABASE" setting in config/base.py to be
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'owf',
        'PASSWORD': 'password',
        'HOST': 'localhost', # if localhost doesn't work, try '127.0.0.1'
        'PORT': '5432',
        # Wraps each web request in a transaction. So if anything fails, it will rollback automatically.
        'ATOMIC_REQUESTS': True,
    }
}
```

* modify the `migration_owf/import.py` settings to connect to your postgres instance.

```
    postgres = PostgresAdapter({
        'host': 'localhost',
        'database': 'postgres',
        'user': 'owf',
        'password': 'password',
    })
    
    # Select mysql
    JSONtoSQL(postgres)
```
* make the following modifications to the data to make it importable/usable
    * go to folder "migration_result" and create a folder "mapping" and create/open person.json file and update the file with following
    ```json
    {"is_active": true, "is_admin":  false}
    ```
* run `python manage.py migrate` to create load the new owf schema (do not run load the default data)
* make the following modifications to the data to make it importable/usable
    * go to folder "migration_result" and create a folder "mapping" and create/open person.json file and update the file with following
    ```json
    {"is_active": true, "is_admin":  false}
   ```
* run `python export.py` and the data will be exported from the desired database.
* run `python import.py` and the data will be migrated.
* run `./manage.py runserver`
    * if you see any migration warnings while running ./manage.py runserver , run ./manage.py migrate --fake
* if login fails due to invalid password, open python shell and run the following command to generate password hash and update the person table manually.
    ```
    from django.contrib.auth.hashers import make_password
    make_password("password")
   ```
  Or just use this hash in password field `pbkdf2_sha256$150000$XU4NH5WtGior$kHsgbMCSxImX8Y/v2Ys56zIQj0WeIIK1sUmesUeiUZ8=` which translates to `password`

## ORACLE
* run `docker login -u email -p password`
* run `docker login -u amasood@geocent.com -p Ahsen123 container-registry.oracle.com`
* run `docker-compose up oracledb`
* run `docker exec -it oracledb bash -c "source /home/oracle/.bashrc; sqlplus /nolog"`
    * After execution of the command, execute the following
    ```
        connect sys as sysdba;
        alter session set "_ORACLE_SCRIPT"=true;
        create user dummy identified by dummy;
        ~~~GRANT CONNECT, RESOURCE, DBA TO dummy;~~~
        GRANT ALL privileges TO dummy;
        CREATE OR REPLACE DIRECTORY DATA_DIR AS '/home/oracle/';
        Grant IMP_FULL_DATABASE to dummy;
        GRANT READ, WRITE ON DIRECTORY DATA_DIR TO IMP_FULL_DATABASE;
        alter user system identified by "dummy";
        alter user sys identified by "dummy";
    ```
* copy the dump file to docker container so we can import it, run 
    ```
    cd migration_owf/test_data/;
    docker cp oracleozonedump.dmp  oracledb:/home/oracle/oracleozonedump.dmp
    docker exec -it oracledb bash -c "chown oracle /home/oracle/oracleozonedump.dmp"
    ```
* load dump 
    ```
    docker exec -it oracledb bash -c "cd /home/oracle/; /u01/app/oracle/product/12.2.0/dbhome_1/bin/imp dummy/dummy@//localhost:1521/ORCLCDB.localdomain FULL=Y FILE=/home/oracle/oracleozonedump.dmp"
  OR
    docker exec -it oracledb bash -c "cd /home/oracle/; /u01/app/oracle/product/12.2.0/dbhome_1/bin/impdp dummy/dummy@//localhost:1521/ORCLCDB.localdomain DIRECTORY=DATA_DIR DUMPFILE=oracleozonedump.dmp"
    ```
* Download Oracle instant client from `https://oracle.github.io/odpi/doc/installation.html#windows`
* Unzip the instant client in `C:\` dir so your path will be `C:\instantclient_19_5`, use this path in export.py and import.py.
* Update `migration_owf/export.py` to connect to database containing legacy data
    * legacy dump seems to have system database tables and owf tables are into system table, we need to use system user to be able to access the dump.
```
databases = [
    OracleAdapter({
        'host': 'localhost',
        'database': 'ORCLCDB.localdomain',
        'user': 'system',  # use system user.
        'password': 'dummy',
        'port': '1521',
        'client_path': 'C:\instantclient_19_5',
    }),
]
```
* modify the `migration_owf/import.py` settings to connect to your oracle instance and run it.
```
    oracle = OracleAdapter({
        'host': 'localhost',
        'database': 'ORCLCDB.localdomain',
        'user': 'dummy',
        'password': 'dummy',
        'port': '1521',
        'client_path': 'C:\instantclient_19_5',
    })
    
    # Select oracle
    JSONtoSQL(oracle)
```
* temporarily modify the "DATABASE" setting in config/base.py to be
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.oracle',
        'NAME': 'localhost:1521/ORCLCDB.localdomain',
        'USER': 'dummy',
        'PASSWORD': 'dummy',
        # Wraps each web request in a transaction. So if anything fails, it will rollback automatically.
        'ATOMIC_REQUESTS': True,
    }
}
```
* if you get `Cannot locate a 64-bit Oracle Client library`, open `settings/base.py` and copy/paste the following anywhere in the file.
```
    client_path = r"C:\instantclient_19_5"
    os.environ["PATH"] = client_path + ";" + os.environ["PATH"]
```
* make the following modifications to the data to make it importable/usable
    * go to folder "migration_result" and create a folder "mapping" and create/open person.json file and update the file with following
    ```json
    {"is_active": true, "is_admin":  false}
    ```
* Oracle does not support Char Field Length greater than 2000 characters.
    * So in Django app find all `max_length=2000` and replace with `max_length=2000`
    * find all `max_length=2000` and replace with `max_length=2000`
* run `python manage.py migrate` to create load the new owf schema (do not run load the default data)
* run `python import.py` and the data will be migrated.
* run `./manage.py runserver`
    * if you see any migration warnings while running ./manage.py runserver , run `./manage.py migrate --fake`
* if login fails due to invalid password, open python shell and run the following command to generate password hash and update the person table manually.
    ```
    from django.contrib.auth.hashers import make_password
    make_password("password")
   ```
  Or just use this hash in password field `pbkdf2_sha256$150000$XU4NH5WtGior$kHsgbMCSxImX8Y/v2Ys56zIQj0WeIIK1sUmesUeiUZ8=` which translates to `password`
