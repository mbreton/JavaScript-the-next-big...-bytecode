#!/bin/bash

rm -Rf print/*
casperjs print-casper.js
convert print/slide* -quality 100 print/JavaScript-the-next-big...bytecode.pdf