FROM openjdk:8u181-jdk-stretch


# Gradle
COPY ./bin/gradle-4.2.1-all.zip /tmp
RUN unzip -qq /tmp/gradle-4.2.1-all.zip -d /opt && \
    ln -s /opt/gradle-4.2.1/bin/gradle /bin/gradle


# Node.js
COPY ./bin/node-v8.12.0-linux-x64.tar.xz /tmp
RUN tar -xf /tmp/node-v8.12.0-linux-x64.tar.xz -C /opt && \
    ln -s /opt/node-v8.12.0-linux-x64/bin/node /bin/node && \
    ln -s /opt/node-v8.12.0-linux-x64/bin/npm /bin/npm && \
    ln -s /opt/node-v8.12.0-linux-x64/bin/npx /bin/npx


COPY ./ozone-classic-bom /opt/owf/ozone-classic-bom
COPY ./owf-appconfig /opt/owf/owf-appconfig
COPY ./owf-auditing /opt/owf/owf-auditing
COPY ./owf-custom-tomcat /opt/owf/owf-custom-tomcat
COPY ./owf-messaging /opt/owf/owf-messaging
COPY ./owf-security /opt/owf/owf-security

COPY ./owf-framework /opt/owf/owf-framework

COPY ./scripts /opt/owf

WORKDIR /opt/owf
CMD ["sh", "./bootRun.sh"]

