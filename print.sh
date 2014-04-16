#!/bin/bash

rm -Rf print/*
casperjs print-casper.js
convert print/slide* -quality 100 JavaScript-the-next-big...bytecode.pdf
rm -Rf print/*