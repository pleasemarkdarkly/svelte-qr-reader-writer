#!/usr/bin/env bash

SUBJECT="06e32e4504d4b678ecbda0b069a468c05867871" # look for this to remove lock
PATH="${PWD}"
MODE=''

# export FIREBASE_CONFIG="$(awk 'BEGIN{}{out=out$0"\n"}END{print out}' "${FIREBASE_KEYPATH}" | sed 's/\n$//')"

development=(
  NODE_ENV=development
  FIREBASE_KEYPATH='./keys/ex.json'
  FIREBASE_DB_URL='https://ex.firebaseapp.com'
  FIREBASE_STORAGE='gs://ex.appspot.com'
  GCLOUD_PROJECT='ex'
)

staging=(
  NODE_ENV=development
  FIRESTORE_EMULATOR_HOST='localhost:8888'
  FIREBASE_KEYPATH='./keys/ex.json'
  FIREBASE_DB_URL='https://ex-staging.firebaseio.com'
  FIREBASE_STORAGE='gs://ex-staging.appspot.com'
)

production=(
  NODE_ENV=production
  FIREBASE_KEYPATH='./keys/ex.json'
  FIREBASE_DB_URL='https://ex.firebaseio.com'
  FIREBASE_STORAGE='gs://ex.appspot.com'
)

additional=(  
  MAUTIC_HOST='https://mautic.ex.com/api'
  MAUTIC_USERNAME=''
  MAUTIC_PASSWORD=''
  SENDGRID_API_KEY=''
  SENDGRID_TEMPLATE_ID_EX_MMS=''
  TWILIO_ACCOUNT_SID=''
  TWILIO_AUTH_TOKEN=''
  TWILIO_NUMBER_ONE='+1'
  PUSHOVER_USER=''
  PUSHOVER_TOKEN=''  
  SLACK_OAUTH_TOKEN=''
  SLACK_SOCKET_TOKEN=''  
)

function clear_env() {
  export GOOGLE_APPLICATION_CREDENTIALS=
  export GCLOUD_PROJECT=
  export FIREBASE_KEYPATH=
  export FIREBASE_CONFIG=
}

function export_additional() {
  for var in "${additional[@]}"; do
    export "${var}"
  done
}

function export_development() {
  for var in "${development[@]}"; do
    export "${var}"
  done
}

function export_staging() {
  for var in "${staging[@]}"; do
    export "${var}"
  done
}

function export_production() {
  for var in "${production[@]}"; do
    export "${var}"
  done
}

usage() {
  echo "Usage: $(basename "$0") [option]"
  echo "  options:"
  echo "    -f : Export contents of file"
  echo "    -d : Default export .env.development"
  echo "    -s : Default export .env.staging"
  echo "    -p : Default export .env.production"
  echo "    -m : Show interactive menu"
  echo "    -h : Show this help"
  echo ""
  exit
}

show_menus() {
  clear
  echo "  1. Export contents of file"
  echo "  2. Default export .env.development"
  echo "  3. Default export .env.staging"
  echo "  4. Default export .env.production"
  echo "  ---"
  echo "  0. Exit"
  echo ""
}

read_options() {
  local choice
  read -p "Enter choice [ 1 - 5 ] " choice
  case $choice in
  1)
    echo "Use cmd arguments to specify filename"
    ;;
  2)
    export_development
    export_additional
    ;;
  3)
    export_staging
    export_additional
    ;;
  4)
    export_production
    export_additional
    ;;
  0) exit 0 ;;
  *) echo -e "${RED} Incorrect choice...take a breather for 2 seconds...${STD}" && sleep 2 ;;
  esac
}

do_menu() {
  while true; do
    show_menus
    read_options
  done
}

# If no arguments provided, display usage information
[[ $# -eq 0 ]] && usage

# debugging
# LOCK_FILE="/tmp/${SUBJECT}.lock"
if [ -f "$LOCK_FILE" ]; then
  echo "Script is already running"
  exit
fi
# trap "rm -f $LOCK_FILE" EXIT
# touch "$LOCK_FILE"

# Process command line arguments
if [[ $@ ]]; then
  while getopts "fdspmh" opt; do
    case $opt in
    d)
      clear_env
      export_development
      export_additional
      shift
      ;;
    s)
      clear_env
      export_staging
      export_additional
      shift
      ;;
    p)
      clear_env
      export_production
      export_additional
      shift
      ;;
    m)
      shift
      ;;
    h)
      clear_env
      exit 0
      ;;
    \?) ;;

    esac
  done
else
  usage
  exit 0
fi
