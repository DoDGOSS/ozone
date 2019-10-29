# Minimal makefile for Sphinx documentation
#

# You can set these variables from the command line, and also
# from the environment for the first two.
SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = ./docs
BUILDDIR      = ./docs/_build

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

.PHONY: help Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

.PHONY: serve
serve:             ## make serve to serve docs
	python3 ./docs/serve_docs.py

dev:             ## make dev to create a dev settings file
	@touch owf_framework/dev_settings.py

populate:        ## populate db
	python manage.py loaddata resources/fixtures/default_data.json
#	@python manage.py loaddata ./tests/people/fixtures/people_data.json && \
#	echo people && \
#	python manage.py loaddata ./tests/widgets/fixtures/widget_data.json && \
#	echo widgets && \
#	python manage.py loaddata ./tests/owf_groups/fixtures/groups_data.json && \
#	echo groups && \
#	python manage.py loaddata ./tests/preferences/fixtures/pref_data.json && \
#	echo preferences && \
#	python manage.py loaddata ./tests/stacks/fixtures/stacks_data.json && \
#	echo stacks && \
#	python manage.py loaddata ./tests/dashboards/fixtures/dashboard_data.json && \
#	echo dashboards && \
#	python manage.py loaddata ./tests/roles/fixtures/roles_data.json && \
#	echo roles && \
#	python manage.py loaddata ./tests/appconf/fixtures/appconf_data.json && \
#	echo appconf && \
#	python manage.py loaddata ./tests/domain_mappings/fixtures/domain_mapping_data.json && \
#	echo domain_mappings

pep8:             ## make pep8 to change the file to best pep8 format before commit
	@autopep8 --max-line-length=120 --in-place --aggressive $(file)

checkPEP:
	@pycodestyle --max-line-length=120 --show-source --show-pep8 --count --exclude="*/migrations" . > pep8-results.txt

dbDown:
	@psql -c "DROP DATABASE postgres"

dbUp:
	@psql -c "CREATE DATABASE postgres"

resetDB:
	psql -c "DROP DATABASE postgres" && psql -c "CREATE DATABASE postgres" && \
	python manage.py makemigrations && \
	python manage.py migrate && make populate \
	&& echo "DB reset"
