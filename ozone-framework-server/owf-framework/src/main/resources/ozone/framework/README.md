## External Configuration

As of OWF v8, all end-user configurable settings may be found in the `ozone/framework/application.yml` file in the
classpath. In the provided Tomcat bundle, this file will be located in the `tomcat/lib/ozone/framework` folder.

### `environments`

This section contains environment-specific (e.g. `development`, `production`) settings that override the default
top-level configuration values.

For example, the `environments.development` section configures the in-memory database, while the
`environments.production` section configures the external database (PostgreSQL, Oracle, etc.)

### `owf`

This section contains the OWF application-specific configuration. It is provides both the front-end and back-end with
runtime environment settings, such as server URLs, feature flags, and user-customizable consent banners and user
agreements.

`owf.server.url` -- The base URL for the server, not including the context path.

_Example:_ `http://localhost:8080`

`owf.login.enabled` -- Whether the login page is enabled.

May be disabled when using alternate login schemes such as certificates (CAC/PKI) or centralized authentication such 
as CAS or SAML. 

`owf.login.url` -- The URL of the login page.

_Example:_ `/login`

`owf.login.nextUrl` -- The URL to direct users to after login is successful.

_Example:_ `/`

`owf.logout.enabled` -- Whether the user may logout from the application.

May be disabled when using alternate login schemes such as certificates (CAC/PKI) or centralized authentication such 
as CAS or SAML. 

`owf.logout.url` -- The URL of the page to direct users to after logout is successful.

_Example:_ `/login?out=1`

`owf.consent.enabled` -- Whether the Consent Banner is displayed before login.

`owf.consent.nextUrl` -- The URL to direct users to after agreeing to the Consent Banner.

_Example:_ `/login`

_Note: Not used if the consent banner is displayed as part of the login page._ 

`owf.consent.title` -- The title text to be displayed on the Consent Banner.

`owf.consent.details.enabled` -- Whether the Consent Banner displays a link to an additional details page such as 
a User Agreement.

`owf.consent.details.linkText` -- The text to display in the Consent Banner to the additional details page.

`owf.consent.message` -- The body text to be displayed on the Consent Banner. May be formatted using Markdown syntax.

`owf.agreement.title` -- The title text to be displayed on the Consent Banner additional details page (if enabled).

`owf.agreement.message` -- The body text to be displayed on the Consent Banner additional details page (if enabled).
May be formatted using Markdown syntax.


## Certificate (CAC/PKI) authentication

### Development

* `application-dev.xml` 
  * Change resource import from `security/security-dev.xml` to `security/security_cert-only.xml`

* `application.yml`
  * Copy `environments.production.server` settings to `environments.development`
  
        environments:
          development:
            server:
              port: 8443
              contextPath: "/owf"
              ssl:
                enabled: true
                protocol: "TLS"
                client-auth: "want"
                key-store: "./certs/keystore.jks"
                key-store-password: "changeit"
                trust-store: "./certs/keystore.jks"
                trust-store-password: "changeit"
  
  * Change `owf.server.url` to `"https://localhost:8443"`
  * Change `owf.login.enabled` to `false`
  * Change `owf.logout.enabled` to `false`
 
* Start the server in development mode.
* Ensure that you have imported the client certificates (`owf-framework/certs/testAdmin1.*`) into you browser.
* Navigate to `https://localhost:8443/owf/` in the browser, and select the client certificate when prompted.
