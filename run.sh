#!/bin/bash

COMMIT=$(git rev-parse --short HEAD)-local
LASTMOD=$(date -u +%Y-%m-%dT%H:%M:%SZ)

npx nodemon
