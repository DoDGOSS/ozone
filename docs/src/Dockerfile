FROM asciidoctor/docker-asciidoctor
COPY ./bin/generate.sh /bin
COPY ./ /documents/
RUN chmod +x /bin/*.sh
