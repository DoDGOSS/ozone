FROM nikolaik/python-nodejs:python3.7-nodejs12
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code/ozone
COPY . /code/ozone
RUN chmod +x /code/ozone/*.sh