@ECHO OFF
SETLOCAL


@ECHO ON

sqlcmd ^
 -S pc-2327-bv\OWF ^
 -U owf ^
 -d master ^
 -i drop-tables-sqlserver.ddl

liquibase ^
 --driver=com.microsoft.sqlserver.jdbc.SQLServerDriver  ^
 --classpath=./drivers/sqljdbc4-2.0.jar ^
 --changeLogFile=changelog-master.yaml ^
 --url="jdbc:sqlserver://localhost:1433;databaseName=owf-new;integratedSecurity=false;" ^
 --username=owf ^
 --password=helpmeplease1! ^
 migrate
