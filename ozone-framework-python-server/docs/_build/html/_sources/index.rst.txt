.. OWF-OZONE documentation master file, created by
   sphinx-quickstart on Fri Jul 26 17:27:09 2019.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

OWF-OZONE Server's V2 dev docs!
===========================================================

.. image:: ./_static/tenor.gif
   :width: 500px
   :height: 400px



.... Django Is So Fun ...

.. toctree::
   :maxdepth: 1
   :caption: Contents:

   configserver
   development
   authentication
   testing
   tools
   changelog









-------------------------------------------------------------------------------------------------------------------

In this will be documentation for the OWF Ozone REST APIs, development, configuration and change logs. The documentation
for this REST service will come with a direct, hands-on approach of development.

As you explore the existing API endpoints, you’ll learn about developing the endpoints, parameters, data types, authentication, and more.
The idea is that rather than learning about these concepts independent of any context, you learn them by immersing yourself in the
user interface provided by Swagger Docs that allow you to interact with each endpoint after initial authentication.

By following simple patterns described int the development documentation, no code should look surprising and should be very
understandable to every developer.  While some custom logic may be at play within some of the files, the majority of the code
should be common ground while using the framework as much as possible.


-------------------------------------------------------------------------------------------------------------------


Getting started:
-----------------

First choose your method of getting up and running, either Docker or Python(3.7).

**Docker / Docker Compose** at
`docs.docker.com <https://docs.docker.com/install/>`_

With the docker installation you will want to get comfortable with the commands and terminology associated with docker.


From the command line run:

.. code-block:: bash


    docker-compose up

Then go to http://localhost:8000 to see the application up and running




-------------------------------------------------------------------------------------------------------------------




**Python** at
`python.org <https://www.python.org/downloads/>`_

With a python install you will want to use `pipenv <https://github.com/pypa/pipenv>`_ ito manage all the packages we will be
installing for development.


From the command line run:



.. code-block:: bash

    pipenv install
    python manage.py migrate && python manage.py runserver



Then go to http://localhost:8000 to see the application up and running


