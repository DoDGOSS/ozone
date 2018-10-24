@ECHO OFF
SETLOCAL

IF "%PGPASSWORD%"=="" SET PGPASSWORD=password

@ECHO ON

mysql ^
 -u owf_user ^
 -p  ^
 owf ^
 < drop-tables.ddl

liquibase ^
 --driver=com.mysql.jdbc.Driver ^
 --changeLogFile=changelog-master.yaml ^
 --classpath=./drivers/mysql-connector-java-5.1.46.jar ^
 --url="jdbc:mysql://localhost:3306/owf?verifyServerCertificate=false&useSSL=false" ^
 --username=owf_user ^
 --password=password ^
 --defaultSchemaName=owf ^
 migrate
