#!/bin/sh
/usr/bin/keytool -genkey -alias owf -keyalg RSA -keysize 1024 -dname "CN=testUser1,O=Ozone3,ST=Maryland,C=US" -keypass changeit -keystore ../keystore.jks -storepass changeit
