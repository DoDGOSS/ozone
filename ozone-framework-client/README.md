## Interested in becoming a contributor? 
Fork the code for this repository. Make your changes and submit a pull request. The Ozone team will review your pull request and evaluate if it should be part of the project. For more information on the patch process please review the Patch Process at https://ozone.nextcentury.com/patch_process.

# OZONE Widget Framework
 
## Description

The OZONE Widget Framework (OWF) is a framework that allows data from different servers to communicate inside a browser window without sending information back to the respective servers. This unique capability allows the OWF web portal to offer decentralized data manipulation. It includes a secure, in-browser, pub-sub eventing system which allows widgets from different domains to share information. The combination of decentralized content and in-browser messaging makes OWF particularly suited for large distributed enterprises with legacy stovepipes that need to combine capability. Use it to quickly link applications and make composite tools.

### Getting Started

#### Installation and Run

1. `npm install` - install the root dependencies
2. `npm run bootstrap` - bootstrap (install and link) the packages 
3. `npm run start` - start the application development server (runs the _start_ script)

#### Build, Test, and Run
1. `cd packages/application` - Go to frontend application folder 

##### Run unit tests

`npm run test`

##### Run end-to-end tests

_Requires a running instance of the Ozone Framework Server_

`npm run test:e2e`

##### Run functional tests

_Requires running instances of the Ozone Framework Server and the Ozone Framework Client_

`npm run test:functional`

##### Build the production assets

`npm run build`
 
 
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

#### AML Marketplace
AML, [Marketplace](https://github.com/aml-development) is a search engine for "widgets", effectively the "apps store" for OWF.  
