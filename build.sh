#!/bin/bash
./node_modules/.bin/tsc --target ES5 --outDir ./dist ./src/geom.ts &&
./node_modules/.bin/tsc --target ES5 --outDir ./dist ./src/solids.ts
