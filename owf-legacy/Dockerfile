FROM centos:7

RUN yum install java-1.8.0-openjdk unzip -y

# Install OWF 7.17.2 Patch
COPY ./bin/ozone-framework-7.17.2.0-RC1.zip /tmp
RUN unzip -qq /tmp/ozone-framework-7.17.2.0-RC1.zip -d /opt/owf

# Extract 7.12.1 WAR file to patch
COPY ./bin/OWF-bundle-7.17.1.zip /tmp
RUN unzip -p /tmp/OWF-bundle-7.17.1.zip apache-tomcat/webapps/owf.war > /opt/owf/owf.war

# Perform patch
WORKDIR /opt/owf
RUN java -jar owf-patch.jar owf.war tomcat/webapps/owf.war

# Default start script
RUN chmod +x /opt/owf/tomcat/start.sh /opt/owf/tomcat/bin/catalina.sh
WORKDIR /opt/owf/tomcat
CMD ["./start.sh", "init", "dev"]