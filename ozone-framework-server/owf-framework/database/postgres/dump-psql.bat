@ECHO OFF
SETLOCAL

IF "%PGPASSWORD%"=="" SET PGPASSWORD=owf

@ECHO ON

pg_dump ^
 --dbname=owf ^
 --host=localhost ^
 --username=owf ^
 --no-password ^
 --schema-only ^
 --no-owner ^
 --file=owf-new.sql

pg_dump ^
 --dbname=owf-old ^
 --host=localhost ^
 --username=owf ^
 --no-password ^
 --schema-only ^
 --no-owner ^
 --file=owf-old.sql
