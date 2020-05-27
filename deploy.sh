#!/bin/bash -e

zip -FSr lambda.zip index.js *.json functions/ node_modules/
npm install
cd terraform
terraform apply
