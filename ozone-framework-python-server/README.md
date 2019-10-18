# Ozone Widget Framework Server - Python Django Implementation

### Running the python server and database using docker:

With Python (please make sure that you are in a virtual env with all the required packages installed see the config docs)
```python3

python manage.py runserver

# Run with specific configuration settings
python manage.py runserver --settings=config.settings.local
# Or set DJANGO_SETTINGS_MODULE environment variable
export DJANGO_SETTINGS_MODULE=config.settings.local

```

With Docker / Docker Compose
```
docker-compose up
```

Connect to service at `localhost:8000` and Postgresql at `localhost:54321`.

Default Django user credentials are `admin` : `password`.
This is set in `people/fixtures/default_users.json`.

### Tests
```
docker-compose exec web bash
python manage.py test
```

### PEP-8 checks
The web container runs PEP-8 checks as it spins up and the results are stored in `pep8-results.txt`.

You can auto fix the errors by logging into the container and running the `autopep8` command:
```
docker-compose exec web bash
make pep8 file=YOUR_FILE
```


### Test Data

Login with test data after `python manage.py loaddata resources/fixtures/all_data.json `

| Users | Passwords |
|---|---|
| admin@goss.com | password |
| user@goss.com | password |


### CAS Configuration

To enable CAS, set the `OWF_ENABLE_CAS` environment variable to `'True'` and set the `OWF_CAS_SERVER_URL` environment variable to the CAS server's URL.

Optional parameters:
* `OWF_CAS_EXTRA_LOGIN_PARAMETERS`. A Python dict with additional values to send to the CAS server on login. Example: `{'key': 'value'}`
* `OWF_CAS_USERNAME_ATTRIBUTE`. The CAS response attribute to use to set the user's username. Defaults to `uid`. Example: `nickname`
* `OWF_CAS_VERSION`. The CAS version to use, defaults to `2`. Example: `3`
