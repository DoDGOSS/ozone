# Note
This README included to assist in giving giving developers / users insight on how the whole migration
process may look like.

* Changing the database connections in `import.py` and `export.py` files.
* Export the databases by running `cd migration_owf` & `python export.py`

To use the migration tooling install requirements from pip.
 
 * `pip install -r migration_owf/requirements.txt`

Please refer to the official documentation for official migration steps (configuration_guide_upgrading)

## MySQL
### Setup
* start python virtualenv `pipenv shell` from the ozone-framework-python-server project.
* `pip install mysqlclient` in the ozone-framework-python-server project. 
* cd into the `migration_owf/test_data/` directory & run `docker-compose up -d mysqldb phpmyadmin`
* load ozone mysql dump `docker-compose exec -T mysqldb mysql -uroot -ppassword mysql_db < mysqlozonedump.sql`
(creates new "owf" database)

* OR
    * use phpmyadmin (should be available on localhost:5000) to import the legacy dump `mysqlozonedump.sql`.
 It will create the "owf" database. You can then export that, to get the schemas and data of legacy database 
 using `migration_owf/export.py`. Make sure to modify the `export.py` connection settings to connect to your mysql instance.
 
    * create a database "owf_new" through phpmyadmin. 
    
* Update `migration_owf/export.py` to connect to database containing legacy data
```python
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
* temporarily modify the "DATABASE" setting in `config/base.py` to reflect new mysql database
```python
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
    * If it does not exist go to folder `migration_result` and create a folder `mapping` and create/open `person.json` file and update the file with following
    ```json
    {"is_active": true, "is_admin":  false}
   ```
* From the root of the project directory where `manage.py` is located run `python manage.py migrate` to create load the new owf schema (do not run load the default data)
* From `migration_owf` run `python export.py` and the data will be exported from the desired database.
* modify the `migration_owf/import.py` settings to connect to your mysql instance

```python
    mysql = MySQLAdapter({
        'host': 'localhost',
        'database': 'mysql_db',  # new mysql database connection
        'user': 'root',
        'password': 'password',
        # 'unix_socket': "/tmp/mysql.sock",
    }),

    # The Import DB Var is the name of the database service followed by your exported DB
    # It can be found in the migration result folder
    import_db_var = 'mysql_owf'

```
* From `migration_owf` run  `python export.py` and the data will be exported from the desired database.
* From `migration_owf` run  `python import.py` and the data will be migrated.
* if there are integrity or duplicate errors, manually truncate all the tables in the database. import script does run reset() function to truncate all tables but in case you get duplicate/integrity errors, manually truncate all tables in new db.
* From the root of the project directory where `manage.py` is located run `./manage.py runserver`
    * if you see any migration warnings while running `./manage.py runserver` , run `./manage.py migrate --fake`
* if login fails due to invalid password, open python shell and run the following command to generate password hash and update the person table manually.
    ```python
    from django.contrib.auth.hashers import make_password
    make_password("password")
   ```
    Or just use this hash in password field `pbkdf2_sha256$150000$XU4NH5WtGior$kHsgbMCSxImX8Y/v2Ys56zIQj0WeIIK1sUmesUeiUZ8=` which translates to `password`


If you have issues on your mac with the mysqlclient package, try the following:
  
  * I ran the following commands and it worked on my macOS 10.14.6 (mojave)
  https://stackoverflow.com/questions/43612243/install-mysqlclient-for-django-python-on-mac-os-x-sierra
  ```bash
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
    * `pip install django-mssql-backend pymssql`
* Install required drivers (if needed)
    * Microsoft® ODBC Driver 17 for SQL Server
        * https://www.microsoft.com/en-us/download/details.aspx?id=56567
* cd into `migration_owf/test_data/` directory & the run `docker-compose up -d mssqldb`
* copy the dump file to docker container so we can import it, run 
    `docker cp mssqlozonedump.bak  mssqldb:/tmp/mssqlozonedump.bak`
* load ozone mssql dump and create new database to import to
    ```bash
    docker exec -it mssqldb bash
    
    /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "superstrong_password123" -Q "RESTORE DATABASE owf FROM DISK = '/tmp/mssqlozonedump.bak' WITH MOVE 'owf' TO '/var/opt/mssql/data/owf.mdf', MOVE 'owf_log' TO '/var/opt/mssql/data/owf_log.ldf'"
    
    /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "superstrong_password123" -Q "CREATE DATABASE owf_new"
    ```

* Update `migration_owf/export.py` to connect to database containing legacy data
    * Assure MSSQL adaptor is not commented out
        * ```migration_tool.adapters.mssql import MSSQLAdapter```
```python
databases = [
    MSSQLAdapter({
        'host': 'localhost',
        'database': 'owf',
        'user': 'sa',
        'password': 'superstrong_password123',
    })
]
```
* temporarily modify the "DATABASE" setting in `config/base.py` to be
```python
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
```python
    mssql = MSSQLAdapter({
        'host': 'localhost',
        'database': 'owf_new',
        'user': 'sa',
        'password': 'superstrong_password123',
    })

    # The Import DB Var is the name of the database service followed by your exported DB
    # It can be found in the migration result folder
    import_db_var = 'mssql_owf'
```
* make the following modifications to the data to make it importable/usable
    * If it does not exist go to folder `migration_result` and create a folder `mapping` and create/open `person.json` file and update the file with following
    ```json
    {"is_active": true, "is_admin":  false}
    ``` 
* From the root of the project directory where `manage.py` is located run `python manage.py migrate` to create load the new owf schema (do not run load the default data)
* From `migration_owf` run `python export.py` and the data will be exported from the desired database.
* From `migration_owf` run `python import.py` and the data will be migrated.
* From the root of the project directory where `manage.py` is located run `./manage.py runserver`
    * if you see any migration warnings while running `./manage.py runserver` , run `./manage.py migrate --fake`
* if login fails due to invalid password, open python shell and run the following command to generate password hash and update the person table manually.
    ```python
    from django.contrib.auth.hashers import make_password
    make_password("password")
   ```
  Or just use this hash in password field `pbkdf2_sha256$150000$XU4NH5WtGior$kHsgbMCSxImX8Y/v2Ys56zIQj0WeIIK1sUmesUeiUZ8=` which translates to `password`


## POSTGRES
* From `migration_owf/test_data/` run `docker-compose up postgresdb`
* load ozone postgresql dump `docker-compose exec -T postgresdb pg_restore --no-owner -U owf -d owf < postgresozonedump`
    * if you get an error `The '<' operator is reserved for future use.` try to wrap the above command in `cmd -c "docker-compose exec -T postgresdb pg_restore --no-owner -U owf -d owf < postgresozonedump"`
* Update `migration_owf/export.py` to connect to database containing legacy data
```python
databases = [
  PostgresAdapter({
      'host': 'localhost',
      'database': 'owf',
      'user': 'owf',
      'password': 'password',
  })
]
```

* temporarily modify the "DATABASE" setting in `config/base.py` to be
```python
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

```python
    postgres = PostgresAdapter({
        'host': 'localhost',
        'database': 'postgres',
        'user': 'owf',
        'password': 'password',
    })

    # The Import DB Var is the name of the database service followed by your exported DB
    # It can be found in the migration result folder
    import_db_var = 'postgres_owf'

```
* From the root of the project directory where `manage.py` is located run `python manage.py migrate` to create load the new owf schema (do not run load the default data)
* make the following modifications to the data to make it importable/usable
    * If it does not exist go to folder `migration_result` and create a folder `mapping` and create/open `person.json` file and update the file with following
    ```json
    {"is_active": true, "is_admin":  false}
   ```
* From `migration_owf` run `python export.py` and the data will be exported from the desired database.
* From `migration_owf` run `python import.py` and the data will be migrated.
* From the root of the project directory where `manage.py` is located run `./manage.py runserver`
    * if you see any migration warnings while running `./manage.py runserver` , run `./manage.py migrate --fake`
* if login fails due to invalid password, open python shell and run the following command to generate password hash and update the person table manually.
    ```python
    from django.contrib.auth.hashers import make_password
    make_password("password")
   ```
  Or just use this hash in password field `pbkdf2_sha256$150000$XU4NH5WtGior$kHsgbMCSxImX8Y/v2Ys56zIQj0WeIIK1sUmesUeiUZ8=` which translates to `password`

## ORACLE
* Make a directory to house the Oracle project and docker files. `mkdir oracle`

* Step into that directory `cd oracle`

* Clone the official docker tools from Oracle `git clone https://github.com/oracle/docker-images.git`

* Step into the database section of the tools `cd docker-images/OracleDatabase/SingleInstance/dockerfiles`

* Build the version of Oracle you wish to create.  OZONE was tested against 19.3.0 `./buildDockerImage.sh -v 19.3.0 -e`

* Run the docker image that we have built `docker run --name oracle19c -p 1521:1521 -p 5500:5500 -v /path/to/oracle/oradata:/opt/oracle/oradata oracle/database:19.3.0-ee`

* To make passwords different from the default that is generated by the Oracle docker container for SYS, SYSTEM AND PDBADMIN run `docker exec oracle19c ./setPassword.sh Welcome1`

* Copy the legacy data into the docker container:
```bash
docker cp /path/to/oracleozonedump.dmp oracle19c:/home/oracle/oracleozonedump.dmp
```

* To load the legacy data after the dump is copied into the oracle container run:
```bash
docker exec -it oracle19c bash -c "cd $ORACLE_HOME; imp system/Welcome1@//localhost:1521/ORCLCDB FULL=Y FILE=/home/oracle/oracleozonedump.dmp"
```

_NOTE: Depending on how you exported the data, it may adjust the passwords for the system, sys and other users.  Within the docker files run_
`docker exec oracle19c ./setPassword.sh Welcome1` _to correct this._

* Once the legacy data has been loaded into the database run `docker ps` to get the container ID (write this ID down or save it to memory)

* Run the splplus command to run the Oracle service as a sysdba `docker exec -ti < Container ID > sqlplus sys/Welcome1@orclpdb1 as sysdba`

* Follow the steps bellow to setup the database for migrating and new development:

    * `SHUTDOWN IMMEDIATE;`
    
    * `STARTUP UPGRADE;`
    
    * `ALTER SYSTEM SET max_string_size=extended;`
    
    * `START $ORACLE_HOME/rdbms/admin/utl32k.sql`
    
    * `SHUTDOWN IMMEDIATE;`
    
    * `STARTUP;`
    
    * Lets now test to see if the alteration to the max string size worked.  Run the following command.
    
    * `show parameter max_string_size;` // should show value "Extended"
    
    * `alter session set "_ORACLE_SCRIPT"=true;`
    
    * Create a user schema for the Django application `create user dummy identified by dummy;`
    
    * `GRANT ALL privileges TO dummy;`
    
    * `grant sysdba to dummy;`
    
    *  `exit;`
    
    * Update `migration_owf/export.py` to connect to database containing legacy data

```python
       OracleAdapter({
            'host': 'localhost',
            'database': 'ORCLCDB',
            'user': 'system',
            'password': 'Welcome1',
            'port': '1521',
            'client_path': 'C:\instantclient_19_5',  # needed for windows.
        }),
```

   * From `migration_owf` run `python export.py` and the data will be exported from the desired database. 
_NOTE: Oracle will require you to edit the `owf_group.json` and remove the stack_id from each of the json objects to import the data._ 

At this point in the database setup we should be looking to run Django
and its migrations as well as load the data. For Django to run it will
require a driver from Oracle
(`https://oracle.github.io/odpi/doc/installation.html`). Once the driver
is downloaded we can proceed to exporting the location of the drivers
with `export LD_LIBRARY_PATH=~/path/opt/oracle/instantclient_19_3:$LD_LIBRARY_PATH`.

* Modify the "DATABASE" setting in `config/base.py` Django will need the following as the database object:

```python

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.oracle',
        'NAME': 'localhost:1521/orclpdb1', # The name orclpdb1 comes from the container when it its created, if you have created your own use that one.
        'USER': 'dummy',
        'PASSWORD': 'dummy',
        # Wraps each web request in a transaction. So if anything fails, it will rollback automatically.
        'ATOMIC_REQUESTS': True,
    }
}


```


*  Oracle does not support Char Field Length greater than 2000
   characters.
   
   * So in Django app find all `max_length=2083` and replace
   with `max_length=2000`
   
   * Find all `max_length=4000` and replace with `max_length=2000`

* From the root of the project directory where `manage.py` is located run the make migrations command `python manage.py makemigrations`.

* From the root of the project directory where `manage.py` is located run the migrate `python manage.py migrate` command to create the need database structure.

* Modify the `migration_owf/import.py` settings to connect to your Oracle instance. 

_NOTE: Oracle will require you to edit the `owf_group.json` and remove the stack_id from each of the json objects to import the data._ 


```python
    oracle = OracleAdapter({
        'host': 'localhost',
        'database': 'orclpdb1',
        'user': 'dummy',
        'password': 'dummy',
        'port': '1521',
    })

    # The Import DB Var is the name of the database service followed by your exported DB
    # It can be found in the migration result folder
    import_db_var = 'oracle_ORCLCDB'
```
 
* From `migration_owf` run `python import.py` and the data will be migrated.

* Run `python manage.py runserver`
    * if you see any migration warnings while running `python manage.py runserver` , run `python manage.py migrate --fake`

_NOTE: To provide a password for login open python shell with Django `python manage.pt shell` and run the following command to generate password hash and update the person table manually._

 ```python
from django.contrib.auth.hashers import make_password
make_password("password")
```
