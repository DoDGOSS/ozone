#!/usr/bin/env bash

function build() {
  local src="$1"
  local name="$2"

  print_bold "Building '$name'...\n"

  asciidoctor \
    -a source-highlighter="highlightjs" \
    -D build \
    -o "$name.html" \
    "$src/content/index.asciidoc"

  asciidoctor-pdf \
    -a pdf-stylesdir="common/resources" \
    -a pdf-fontsdir="common/resources/fonts" \
    -a pdf-style="ozone-pdf" \
    -a pdf-page-size="letter" \
    -D build \
    -o "$name.pdf" \
    "$src/content/index.asciidoc"
}

function print_bold() {
	printf "\e[1m$1\e[0m"
}


build administrators_guide "Ozone Administrator's Guide"
build build_instructions "Ozone Build Instructions"
build configuration_guide "Ozone Configuration Guide"
build developers_guide "Ozone Developer's Guide"
build quick_start_guide "Ozone Quick Start Guide"
build release_notes "Ozone Release Notes"
build users_guide "Ozone User's Guide"
build version_description "Ozone Software Version Description"
