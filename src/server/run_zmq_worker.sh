#!/bin/bash
BASHSOURCE=$0
DIR="$( cd "$( dirname "$BASHSOURCE" )" && pwd )"
export PYTHONPATH=$DIR
watchmedo auto-restart -p "*.py;" --recursive python /www/electric/worker/worker.py