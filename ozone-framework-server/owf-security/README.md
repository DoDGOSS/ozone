# OZONE Widget Framework Security Plugin

## Building the Project

1. Install Gradle
2. Navigate to the project folder and run the command `gradle assemble`
  * This will build the entire project, including the security extras

## Sample Security Configurations (for OWF and Marketplace 7.x)

We ship with 6 sample security projects.  Each security project has an
associated Spring XML Configuration file.

1.  Default, x509 fallback to Basic HTTP
2.  CAS only
3.  x509/CAS
4.  x509 only
5.  x509/LDAP
6.  HTTP Basic Only

## Configuring the Plugin

1.  Choose the spring configuration file that maps to the sample of your
choice.  The six samples and associated Spring configuration files are:
- (Default) x509 fallback to Basic HTTP - `OWFsecurityContext.xml`
- CAS only - `OWFsecurityContext_CAS_only.xml`
- x509/CAS - `OWFsecurityContext_x509_CAS.xml`
- x509 only - `OWFsecurityContext_cert_only.xml`
- x509/LDAP - `OWFsecurityContext_BasicSpringLogin.xml`
- HTTP Basic only - `OWFsecurityContext_cert_ldap.xml`

Copy the Spring configuration file into the Tomcat `lib` directory. Delete
any other Spring configuration files contained in the directory, such
as the default `OWFSecurityContext.xml`.

2.  Beginning with OWF 7.5, CAS is no longer bundled with the application.
Should you wish to try either of the CAS security plugins, the `cas.war`
file is available from the OWF GOSS download site in older versions of
the bundle.  In addition to copying the appropriate configuration file
(from step 1), copy `cas.war` to the Tomcat `webapp` directory of your
bundle.

3.  If you are trying out the x509/LDAP sample, it is designed to work with
Apache DS installed on `localhost` and running on the default port, 10389.
You can download Apache DS from http://directory.apache.org and install
it.  There are directions on the Apache DS website on how to install and
run the Apache DS server.

If you want to connect to an LDAP server other than the default
`localhost:10389`, the URL can be configured in the
`OWFSecurityContext_cert_ldap.xml` Spring config file.

Next, for the LDAP sample, we have included a sample Apache DS
`server.xml` file, called `src/main/resources/conf/apache-ds-server.xml`.
The one change it has in it is the requirement that you add the
partition owf-1.  To do that, add the following line to the XPATH
`spring:beans/defaultDirectoryService/partitions` as shown in the example file:

```
<jdbmPartition id="owf-1" suffix="o=Ozone,l=Columbia,st=Maryland,c=US" />
```

Now, you need to load our sample data into your directory service. 
A sample LDIF file is provided at `src/main/resources/conf/testUsers.ldif`.
The Apache DS site explains how to load the LDIF file. 
Hint--download the Apache Directory Studio!

Restart your directory service to make sure all changes are applied.

4.  Start up OWF.  Authenticate.

## Interested in becoming a contributor? 
Fork the code for this repository. Make your changes and submit a pull
request. The Ozone team will review your pull request and evaluate if it
should be part of the project. For more information on the patch process
please review the Patch Process at https://ozone.nextcentury.com/patch_process.
