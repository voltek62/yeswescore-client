#!/bin/bash

BASEDIR=$(dirname $0)
cd $BASEDIR;

# are we in dev or in prod.
if [ "$NODE_ENV" = "PROD" ]
then
  echo "you are in prod environment, you cannot launch tests"
  exit 1
fi

export NODE_ENV="DEV"
if [ -f ".port" ]
then
  utport=`cat .port | head -1`
  fbport=`cat ../../../yeswescore-facebook/server/.port`
  port=`cat ../../../yeswescore-server/server/.port`
  echo "using port number $utport from file .port for static client"
  echo "using port number $fbport from file .port for yeswescore-facebook"
  echo "using port number $port from file .port for yeswescore-server"
  export YESWESCORE_UT_PORT=$utport
  export YESWESCORE_FACEBOOK_PORT=$fbport
  export YESWESCORE_PORT=$port
  casperjs --disable-we-security $1
  if [ $? -ne 0 ]
  then
    echo ""
    echo "( usage: ./test.sh test/dev/launch.js )"
  fi
else
  echo "  Please create .port file containing port number "
  echo "  Exemple:  echo \"4000\" > .port "
  exit;
fi
