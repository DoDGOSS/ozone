# CAC Auth
CAC Auth is essentially a client certificate authentication. The details of the reverse proxy's configuration is beyond the scope of this README, but an example is provided in the nginx.conf file.

## Configuring the reverse proxy
An example nginx config is provided in nginx.conf. The example file will include comments with explanation of the config options.

## Configuring the application
### Options
**ENABLE_SSL_AUTH** (default: False) - used to enabled or disable ssl based authentication.

**AUTOCREATE_VALID_SSL_USERS** (default: False) - automatically creates a user, if the user does not exist in the application.

**EXTRACT_USERDATA_FN** - points to the function that will return a dictionary of the user's data. At the least, the dictionary must contain the key *username*

**USER_DN_SSL_HEADER** (default: 'HTTP_X_SSL_USER_DN') - used to specify the header that will include the DN provided by the client's certificate.

example.py includes an example function used to extract the username from the example certificates. In a real production environment, if the automatic creation of SSL users is turned on, you will want to extract more information than just the username.
