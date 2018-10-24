#!/bin/sh
#echo off

export GRAILS_ENV=production
export CONFIG_PATH="classpath:/config/ozone-framework_h2.yml"
export AUTO_USER=testAdmin1


while (( "$#" )); do
	if [ $1 = "--dev" ] ; then
        export GRAILS_ENV=development
	fi
	if [ $1 = "--db" ] ; then
	   case $2 in
	        "h2" )
				export CONFIG_PATH="classpath:/config/ozone-framework_h2.yml" ;;
	        "pg" )
				export CONFIG_PATH="classpath:/config/ozone-framework_postgresql.yml" ;;
	        "mysql" )
				export CONFIG_PATH="classpath:/config/ozone-framework_mysql.yml" ;;
	        "oracle" )
				export CONFIG_PATH="classpath:/config/ozone-framework_oracle.yml" ;;
	        "mssql" )
				export CONFIG_PATH="classpath:/config/ozone-framework_sqlserver.yml" ;;
	    esac
	    shift
	fi
    shift
done


export JAVA_OPTS="$JAVA_OPTS -Dgrails.env=$GRAILS_ENV"
export JAVA_OPTS="$JAVA_OPTS -Dspring.config.location=$CONFIG_PATH"

if [ $GRAILS_ENV = "development" ]; then
    export JAVA_OPTS="$JAVA_OPTS -Duser=$AUTO_USER"
fi


./bin/catalina.sh run
