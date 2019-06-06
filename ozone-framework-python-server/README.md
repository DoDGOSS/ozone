# Ozone Widget Framework Server - Python Django Implementation

### Running the python server and database using docker:
```
docker-compose up
```

Connect to service at `localhost:8000` and Postgresql at `localhost:54321`.

Default Django user credentials are `admin` : `password`.
This is set in `people/fixtures/default_users.json`.

### PEP-8 checks
The web container runs PEP-8 checks as it spins up and the results are stored in `pep8-resuts.txt`.

You can auto fix the errors by logging into the container and running the `autopep8` command:
```
docker-compose exec web bash
autopep8 --max-line-length=120 --in-place --recursive --aggressive owf_framework
```
