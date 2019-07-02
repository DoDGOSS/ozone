#!/usr/bin/env bash

function build() {
  local src="$1"
  local name="$2"

  print_bold "Building '$name'...\n"

  asciidoctor \
    -D build \
    -o "$name.html" \
    "$src/content/index.asciidoc"

  asciidoctor-pdf \
    -a pdf-fontsdir="common/resources/fonts" \
    -D build \
    -o "$name.pdf" \
    "$src/content/index.asciidoc"
}

function print_bold() {
	printf "\e[1m$1\e[0m"
}


build configuration_guide "Ozone Configuration Guide"
build developers_guide "Ozone Developer's Guide"
build quick_start_guide "Ozone Quick Start Guide"
build release_notes "Ozone Release Notes"
build users_guide "Ozone User's Notes"
