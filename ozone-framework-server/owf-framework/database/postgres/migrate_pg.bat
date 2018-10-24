@ECHO OFF
SETLOCAL

IF "%PGPASSWORD%"=="" SET PGPASSWORD=owf

@ECHO ON

psql ^
 --dbname=owf ^
 --host=localhost ^
 --username=owf ^
 --no-password ^
 --quiet ^
 --file=drop-tables.ddl

liquibase ^
 --driver=org.postgresql.Driver ^
 --classpath=./drivers/postgresql-42.1.4.jre7.jar ^
 --changeLogFile=changelog-master.yaml ^
 --url="jdbc:postgresql://localhost:5432/owf" ^
 --username=owf ^
 --password=owf ^
 migrate
