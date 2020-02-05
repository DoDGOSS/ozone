## Interested in becoming a contributor? 
Fork the code for this repository. Make your changes and submit a pull request. The Ozone team will review your pull request and evaluate if it should be part of the project. For more information on the patch process please review the Patch Process at https://ozone.nextcentury.com/patch_process.

# OZONE Widget Framework Backend
 
### Getting Started

#### Bundle Installation and Run
1. `./start.sh` - installs dependencies, migrates sample data, and starts web server
2. Visit `http://localhost:8000`
3. Username and passwords included below in Test Data

or
1. `docker-compose up`

#### Repo Installation and Run

1. `pip install -r requirements.txt` - install the root dependencies
2. `./start-dev.sh` - Run backend in development mode
3. Visit `http://localhost:8000`

OWF v8.0.0.0 introduced server-side rendering for the pages requested by the client(browser). Which requires the both the client and the backend to be built, in order to properly run OWF. A more detailed explanation of the server-side mechanism exists in the development section of the Quick Start Guide.

#### Client setup

```
# from the /ozone-framework-client/packages/application directory

# install dependencies
npm install

# build the client project bundle
npm run build
# or if the webpack hot-reload feature is desired changes will be seen from the the server side `index.html` page (default `localhost:8000`).
npm run start

# copy the static files(icon images and etc.) to the build directory 
npm run copy-required-public

```

#### Example widgets setup

```
# from the /ozone-example-widgets directory

# install dependencies
npm install

# build the client project bundle
npm run build
# or if the OWF application expects the widgets to be hosted on a standalone server running on localhost:4000
npm run start

# copy the pre-bundled client widget api to the build directory
npm run copy-owf-js

```
The repo includes a set of example widgets that will run inside of a dashboard in OWF. The loading of these example widgets will depend on the location of the widgets defined in the database.

#### Backend setup
```
# from the /ozone-framework-python-server directory

# it is recommended that you create a virtual python environment to avoid poluting the global packages environment
# this can be achieved using the pipenv package
pip install pipenv
# create virtual env
pipenv shell

# install dependencies
pip install -r requirements.txt

# run migrations to create the database schema, if needed
python manage.py makemigrations

# run the start script, which will assure that the database schema is up-to-date and load the default data.
./start-dev.sh

```

#### Running OWF via Docker
To facilitate running OWF in any environment, a `/docker-compose.yml` in the root of the repo exists to run OWF inside a Docker container.

Run the following command to start OWF inside a Docker container
```
# from the repo root 

docker-compose up -d
```


#### Migration
See Upgrading section of Configuration Guide 

##### Run unit tests

`./manage.py test`
 
##### Test Data

| Users | Passwords |
|---|---|
| admin | password |
| user  | password |

##### CAS Configuration

To enable CAS, set the `OWF_ENABLE_CAS` environment variable to `'True'` and set the `OWF_CAS_SERVER_URL` environment variable to the CAS server's URL.

Optional parameters:
* `OWF_CAS_EXTRA_LOGIN_PARAMETERS`. A Python dict with additional values to send to the CAS server on login. Example: `{'key': 'value'}`
* `OWF_CAS_USERNAME_ATTRIBUTE`. The CAS response attribute to use to set the user's username. Defaults to `uid`. Example: `nickname`
* `OWF_CAS_VERSION`. The CAS version to use, defaults to `2`. Example: `3`


## Copyrights

> The United States Government has unlimited rights in this software, pursuant to the contracts under which it was developed.  
 
The OZONE Widget Framework is released to the public as Open Source Software, because it's the Right Thing To Do. Also, it was required by [Section 924 of the 2012 National Defense Authorization Act](http://www.gpo.gov/fdsys/pkg/PLAW-112publ81/pdf/PLAW-112publ81.pdf "NDAA FY12").

Released under the [Apache License, Version 2](http://www.apache.org/licenses/LICENSE-2.0.html "Apache License v2").
 
## Community

[Support Guidance] (https://github.com/ozoneplatform/owf-framework/wiki/Support-Guidance): Provides information about resources including related projects.

### Google Groups

[ozoneplatform-users](https://groups.google.com/forum/?fromgroups#!forum/ozoneplatform-users) : This list is for users, for questions about the platform, for feature requests, for discussions about the platform and its roadmap, etc.

[ozoneplatform-dev](https://groups.google.com/forum/?fromgroups#!forum/ozoneplatform-dev) : This deprecated list provides historical information relating to extending the platform. It is no longer maintained but old posts often serve as resources for developers new to the platform. 


### OWF GOSS Board
OWF started as a project at a single US Government agency, but developed into a collaborative project spanning multiple federal agencies.  Overall project direction is managed by "The OWF Government Open Source Software Board"; i.e. what features should the core team work on next, what patches should get accepted, etc.  Gov't agencies wishing to be represented on the board should check http://owfgoss.org for more details.  Membership on the board is currently limited to Government agencies that are using OWF and have demonstrated willingness to invest their own energy and resources into developing it as a shared resource of the community.  At this time, the board is not considering membership for entities that are not US Government Agencies, but we would be willing to discuss proposals.
 
### Contributions

#### Non-Government
Contributions to the baseline project from outside the US Federal Government should be submitted as a pull request to the core project on GitHub.  Before patches will be accepted by the core project, contributions are reviewed by the core team, see [Contributor Guidelines](https://github.com/ozoneplatform/owf-framework/blob/master/CONTRIBUTING.md).  If you or your company wish your copyright in your contribution to be annotated in the project documentation (such as this README), then your pull request should include that annotation.
 
#### Government
Contributions from government agencies do not need to have a CLA on file, but do require verification that the government has unlimited rights to the contribution.  An email to goss-support@owfgoss.org is sufficient, stating that the contribution was developed by an employee of the United States Government in the course of his or her duties. Alternatively, if the contribution was developed by a contractor, the email should provide the name of the Contractor, Contract number, and an assertion that the contract included the standard "Unlimited rights" clause specified by [DFARS 252.227.7014](http://www.acq.osd.mil/dpap/dars/dfars/html/current/252227.htm#252.227-7014) "Rights in noncommercial computer software and noncommercial computer software documentation".
 
Government agencies are encouraged to submit contributions as pull requests on GitHub.  If your agency cannot use GitHub, contributions can be emailed as patches to goss-support@owfgoss.org.
