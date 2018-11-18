#!/bin/bash

export $(cat .env)

tsc && node dist/server.js
