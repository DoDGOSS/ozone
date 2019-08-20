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

populate:             ## adds data to the database from fixtures
	python manage.py loaddata dashboards/fixtures/default_objects.json && echo dashboards && python manage.py loaddata people/fixtures/default_users.json && echo people && \
	python manage.py loaddata owf_groups/fixtures/default_objects.json && echo groups && python manage.py loaddata preferences/fixtures/default_data.json && echo preferences && \
	python manage.py loaddata stacks/fixtures/default_objects.json && echo stacks && python manage.py loaddata widgets/fixtures/default_objects.json && echo widgets


pep8:             ## make pep8 to change the file to best pep8 format before commit
	@autopep8 --max-line-length=120 --in-place --aggressive $(file)
