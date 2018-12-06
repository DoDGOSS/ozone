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

RUN cd /opt/owf/ozone-classic-bom && \
    gradle --no-daemon install && \
\
    cd /opt/owf/owf-appconfig && \
    gradle --no-daemon install  && \
\
    cd /opt/owf/owf-auditing && \
    gradle --no-daemon install && \
\
    cd /opt/owf/owf-custom-tomcat && \
    gradle --no-daemon install && \
\
    cd /opt/owf/owf-messaging && \
    gradle --no-daemon install && \
\
    cd /opt/owf/owf-security && \
    gradle --no-daemon install


COPY ./owf-framework /opt/owf/owf-framework

RUN cd /opt/owf/owf-framework && \
    gradle --no-daemon build testClasses integrationTestClasses -x test -x integrationTest

COPY ./scripts /opt/owf

WORKDIR /opt/owf
CMD ["sh", "./boot_run.sh"]

