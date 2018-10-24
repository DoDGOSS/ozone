## Interested in becoming a contributor? 
Fork the code for this repository. Make your changes and submit a pull request. The Ozone team will review your pull request and evaluate if it should be part of the project. For more information on the patch process please review the Patch Process at https://ozone.nextcentury.com/patch_process.

# Build and Deployment Steps

## Prerequisites
### For building locally
Maven and Java

### For deploying and releasing
* Write-access credentials to the org.ozoneplatform group on the
Central Repository (managed by sonatype).  To obtain this, sign up
for an account on their JIRA, and then have someone else with write-access
put in a ticket to get you added.
* Git installed locally
* GPG installed locally
* A GPG key posted to a public keyserver

## Building
Run `mvn clean install`, just like any other maven project

## Deploying (Snapshots)
Run `mvn clean deploy`.  This will deploy the current version to the Central
Repository.  If the current version is a snapshot, this is a straightforward
one-step process.

## Releasing
1. Ensure that you have no local changes or un-pushed commits
2. run `mvn release:prepare`.  You may want to read up on the maven-release-plugin
to see what this does.  WARNING: This pushes changes to git to do not run it
unless you are sure you are ready.
3. run `mvn release:perform`  This will build and deploy the release version of
the code to the Central Repository.  It will not be immediately available to others
but will instead go into a "staging" repo
4. Close and release the staging repo as explained
[here](http://central.sonatype.org/pages/releasing-the-deployment.html)
5. If not done automatically, push the new commits made by the release plugin
