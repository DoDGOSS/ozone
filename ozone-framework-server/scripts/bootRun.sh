#!/usr/bin/env bash

cd /opt/owf/ozone-classic-bom
gradle --no-daemon install

cd /opt/owf/owf-appconfig
gradle --no-daemon install

cd /opt/owf/owf-auditing
gradle --no-daemon install

cd /opt/owf/owf-custom-tomcat
gradle --no-daemon install

cd /opt/owf/owf-messaging
gradle --no-daemon install

cd /opt/owf/owf-security
gradle --no-daemon install

cd /opt/owf/owf-framework
gradle --no-daemon :bootRun
