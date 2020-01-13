# CAC Auth

CAC Auth is essentially a client certificate authentication. The details of the reverse proxy's configuration is beyond the scope of this README, but an example is provided in the nginx.conf file.

## Configuring the reverse proxy
The following steps will help to start and configure the sample reverse proxy provided with this package.


1. Go into the config/ssl_auth/examples directory and use the docker-compose to stand up an nginx server.
    ```
    docker-compose up -d
    ```

2. Copy the nginx config file (you may need to replace ozone-framework-python-server_nginx_1, if you have a different container name)
    ```
    docker cp ./nginx.conf ozone-framework-python-server_nginx_1:/etc/nginx/nginx.conf
    ```

3. Copy the necessary cert files in the example-certs directory (Server certs and the DoD CA cert)
    ```
    docker cp ./localhost.crt ozone-framework-python-server_nginx_1:/etc/nginx/certs/
    docker cp ./localhost.key ozone-framework-python-server_nginx_1:/etc/nginx/certs/
    docker cp ./alldodcerts.pem ozone-framework-python-server_nginx_1:/etc/nginx/certs/
    ```

4. Reload NGINX
    ```
    docker exec -it ozone-framework-python-server_nginx_1 service nginx reload
    ```

    *NOTE*: If you don't have a CAC or a CAC reader, you can test using example user certs provided in the config/ssl_auth/examples directory. You will need to use ca.crt instead of alldodcerts.pem. And then install the testUser1 and/or testAdmin1 certs in your browser. In Chrome, you can follow instructions here to install client certs.


## Configuring the application
### Options
**ENABLE_SSL_AUTH** (default: False) - used to enabled or disable ssl based authentication.

<!-- This isn't fully implemented -->
<!-- **AUTOCREATE_VALID_SSL_USERS** (default: False) - automatically creates a user, if the user does not exist in the application. -->

**EXTRACT_USERDATA_FN** - points to the function that will return a dictionary of the user's data. At the least, the dictionary must contain the key *username*

**USER_DN_SSL_HEADER** (default: 'HTTP_X_SSL_USER_DN') - used to specify the header that will include the DN provided by the client's certificate.

1. In the base.py settings file, set ENABLE_SSL_AUTH to True
2. 
    * If you are using the example client certs, you should be good to go after installing the example user certs in your browser.
    * If you are using your CAC, you will need to create a new user in OWF with the username set to the CN on your CAC. The CN is a combination of lastname.firstname.middle.EDIPI, so for me it was REYES.LEONARDO.YONIL.123XXXXX. Create a user in OWF with this as your username. You can get your CAC info via the ActiveClient Agent.
