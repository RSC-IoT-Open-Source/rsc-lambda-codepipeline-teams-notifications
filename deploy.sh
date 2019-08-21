#!/bin/bash -e

zip -FSr lambda.zip index.js *.json functions/
cd terraform
terraform apply
