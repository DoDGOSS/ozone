@ECHO OFF
SETLOCAL

IF "%PGPASSWORD%"=="" SET PGPASSWORD=password

@ECHO ON

echo exit | sqlplus owf/password @drop-tables-oracle.ddl

liquibase --driver=oracle.jdbc.OracleDriver ^
          --changeLogFile=changelog-master.yaml ^
          --classpath=drivers/ojdbc6-12cR1-11g.jar ^
          --url="jdbc:oracle:thin:@localhost:1521:XE" ^
           --username=owf ^
           --password=password ^
           migrate