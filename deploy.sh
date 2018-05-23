#!/bin/bash -e

zip -FSr lambda.zip * -x terraform -x docs
cd terraform
terraform apply
