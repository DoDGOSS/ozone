@ECHO OFF
SETLOCAL

IF "%PGPASSWORD%"=="" SET PGPASSWORD=omp

@ECHO ON

mysqldump ^
 -d ^
 -u owf_user ^
 -ppassword ^
 owf ^
 > owf-new.sql

mysqldump ^
 -d ^
 -u owf_user ^
 -ppassword ^
 owf_old ^
 > owf-old.sql
