#! /usr/bin/env bash

CWD=`dirname $0`

export KUB_ENVIRONMENT=${KUB_ENVIRONMENT:=local}

case "$KUB_ENVIRONMENT" in
    *prod*) source $CWD/config-prod.sh;;
    *dev*) source $CWD/config-dev.sh;;
    *local*) source $CWD/config-local.sh;;
esac

export NODE_ENV=${NODE_ENV:=development}

# Remove $0 from the arguments
shift

node "$@" --harmony-async-await $CWD/spark.js
