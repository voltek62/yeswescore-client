#!/bin/bash

export NODE_ENV="DEV"
if [ -f ".port" ]
then
  utport=`cat .port | head -1`
  echo ""
  echo "using port number $utport from file .port for static client"
  export YESWESCORE_UT_PORT=$utport
  node static.js
else
  echo "  Please create .port file containing port number "
  echo "  Exemple:  echo \"4000\" > .port "
  exit;
fi


