# Release Notes
All notable changes to this project will be documented in this file.

## [OWF 8.0.0.0-RC2] - 2019-12-02

Backend:
* Rewrite backend from Grails (Java) to Django (Python)
* Postgres, Mysql, Mssql, Oracle database support
* Add database migration scripts
* CAC and CAS Authentication
* Database schema improvements
* Add legacy backend endpoints called directly from widget API

Frontend:
* Client API Refactor
* AML Marketplace Integration

## [OWF 8.0.0.0-RC1] - 2019-07-31

Backend:
* An external application.yml is now read from the classpath (e.g. /tomcat/lib/ozone/framework/application.yml), rather than requiring the changes to be made within the unpacked WAR or specifying an alternate location on the command line
* Added security handler classes for REST-based authentication
* A “login/status/” endpoint has been added (in the LoginController) to return the user profile & details.S
* The “config.js” endpoint is no longer used (but has not been removed) for initial application configuration. All pre-launch configuration can now be set in the application.yml file and is provided to the client by injecting global JavaScript values into the rendered GSPs.
* Example widgets are no longer bundled with / served by the backend. 
* The patch utility JAR (and the associated process) is no longer needed or included.
* Small bug fixes

Frontend:
* Rewrite frontend client from ExtJS to React (Typescript)
* Functionality from 7.17.2.X replicated
* Removal of ExtJS
* OMP Marketplace Integration
* Updated Dashboard Builder
* Add configurable consent page
* Add configurable classification banners
* UI/UX Improvements