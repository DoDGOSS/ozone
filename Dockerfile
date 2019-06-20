FROM openjdk:8u212-jdk-stretch

# Install Gradle
COPY ozone-framework-server/bin/gradle-4.10.3-bin.zip /tmp
RUN unzip -qq /tmp/gradle-4.10.3-bin.zip -d /opt && \
    ln -s /opt/gradle-4.10.3/bin/gradle /bin/gradle


# Install Node.js
COPY ozone-framework-server/bin/node-v10.16.0-linux-x64.tar.xz /tmp
RUN tar -xf /tmp/node-v10.16.0-linux-x64.tar.xz -C /opt && \
    ln -s /opt/node-v10.16.0-linux-x64/bin/node /bin/node && \
    ln -s /opt/node-v10.16.0-linux-x64/bin/npm /bin/npm && \
    ln -s /opt/node-v10.16.0-linux-x64/bin/npx /bin/npx


# Build application sub-modules
COPY ozone-framework-server/ozone-classic-bom /opt/owf/ozone-classic-bom
RUN cd /opt/owf/ozone-classic-bom && gradle --no-daemon install

COPY ozone-framework-server/owf-appconfig /opt/owf/owf-appconfig
RUN cd /opt/owf/owf-appconfig && gradle --no-daemon install

COPY ozone-framework-server/owf-auditing /opt/owf/owf-auditing
RUN cd /opt/owf/owf-auditing && gradle --no-daemon install

COPY ozone-framework-server/owf-messaging /opt/owf/owf-messaging
RUN cd /opt/owf/owf-messaging && gradle --no-daemon install

COPY ozone-framework-server/owf-security /opt/owf/owf-security
RUN cd /opt/owf/owf-security && gradle --no-daemon install

COPY ozone-framework-server/owf-custom-tomcat /opt/owf/owf-custom-tomcat
RUN cd /opt/owf/owf-custom-tomcat && gradle --no-daemon install


# Build application frontend module
## Pre-install dependencies from package.json and run bootstrap
COPY ozone-framework-client/package.json ozone-framework-client/lerna.json /opt/owf/owf-frontend/
COPY ozone-framework-client/packages/application/package.json /opt/owf/owf-frontend/packages/application/
RUN cd /opt/owf/owf-frontend && \
    npm config set user 0 && \
    npm config set unsafe-perm true && \
    npm install --no-optional && \
    npm run bootstrap -- -- --no-optional

## Build and install the module
COPY ozone-framework-client /opt/owf/owf-frontend
RUN cd /opt/owf/owf-frontend && \
    gradle --no-daemon install


# Build application backend module
COPY ozone-framework-server/owf-framework /opt/owf/owf-framework

RUN cd /opt/owf/owf-framework && \
    gradle --no-daemon build testClasses integrationTestClasses -x test -x integrationTest


# Copy utility scripts (start, test, etc.)
COPY ozone-framework-server/scripts /opt/owf
RUN chmod a+x /opt/owf/*.sh


# Default start script
WORKDIR /opt/owf
CMD ["sh", "./boot_run.sh"]
