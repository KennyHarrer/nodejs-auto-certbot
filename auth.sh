#!/bin/bash
echo $CERTBOT_VALIDATION > ./public/.well-known/acme-challenge/$CERTBOT_TOKEN