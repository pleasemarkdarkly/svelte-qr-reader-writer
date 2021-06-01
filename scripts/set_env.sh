#!/usr/bin/env bash

ENV_LOCATION="${PWD}"

if [ "$NODE_ENV" == 'production' ]; then
  echo "production setup"
  export GOOGLE_APPLICATION_CREDENTIALS='./keys/ex.json'
  export GCLOUD_PROJECT='ex'
  FIREBASE_KEYPATH=$GOOGLE_APPLICATION_CREDENTIALS
  echo export FIREBASE_KEYPATH='./keys/ex.json'
  export FIREBASE_CONFIG="$(awk 'BEGIN{}{out=out$0"\n"}END{print out}' "${FIREBASE_KEYPATH}" | sed 's/\n$//')"
else
  echo "staging setup"
  export GOOGLE_APPLICATION_CREDENTIALS='./keys/ex-staging.json'
  export GCLOUD_PROJECT='ex-staging'
  FIREBASE_KEYPATH=$GOOGLE_APPLICATION_CREDENTIALS
  echo export FIREBASE_KEYPATH='./keys/ex-staging.json'
  export FIREBASE_CONFIG="$(awk 'BEGIN{}{out=out$0"\n"}END{print out}' "${FIREBASE_KEYPATH}" | sed 's/\n$//')"
fi

echo GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS
echo FIREBASE_KEYPATH=$FIREBASE_KEYPATH
echo GCLOUD_PROJECT=$GCLOUD_PROJECT
echo FIREBASE_CONFIG=$FIREBASE_CONFIG

emulator_env=(
  SENDGRID_API_KEY=''
  SENDGRID_TEMPLATE_ID_EX_MMS=''
  TWILIO_ACCOUNT_SID=''
  TWILIO_AUTH_TOKEN=''
  TWILIO_NUMBER_ONE='+1'
  PUSHOVER_USER=''
  PUSHOVER_TOKEN=''
  SLACK_OATH_TOKEN=''
  SLACK_SOCKET_TOKEN=''
  FORWARDING_NUMBER_ONE='+1'
  FORWARDING_NUMBER_TWO='+1'
  PUBSUB_SUBSCRIPTION='projects/ex/subscriptions/messages-sub'
)

firebase_config=(
  project
  twilio
  sendgrid
  idi
  mautic
  pushover
  slack
  developer
)

firebase_env=(
  twilio.account_sid=''
  twilio.auth_token=''
  twilio.number_one='+1'
  sendgrid.api_key=''
  sendgrid.templateid_ex_mms=''  
  pushover.user=''
  pushover.token=''
  slack.oauth_token=''
  slack.socket_token=''
  ex.subscription='projects/ex/subscriptions/messages-sub'
  developer.phone='+1'
  forwarding.number_one='+1'
  forwarding.number_two='+1'
)

function print_development_env() {
  echo GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS
  echo FIREBASE_KEYPATH=$FIREBASE_KEYPATH
  echo GCLOUD_PROJECT=$GCLOUD_PROJECT
  echo FIREBASE_CONFIG=$FIREBASE_CONFIG
}

function clear_env() {
  export GOOGLE_APPLICATION_CREDENTIALS=
  export GCLOUD_PROJECT=
  export FIREBASE_KEYPATH=
  export FIREBASE_CONFIG=
}

function firebase_config_set() {
  for var in "${firebase_env[@]}"; do
    firebase functions:config:set "${var}"
  done
  echo "exporting development .runtimeconfig.json"
  firebase functions:config:get >.runtimeconfig.json
}

function firebase_config_unset_all() {
  for var in "${firebase_config[@]}"; do
    firebase functions:config:unset "${var}"
  done
  echo
  echo "Firebase env variables cleared"
  for var in "${emulator_env[@]}"; do
    export "$(echo "${var}" | sed 's/\=.*$//g')"
  done
  echo "Firebase config variables unset."
  firebase functions:config:get
}

function emulator_config_set() {
  for var in "${emulator_env[@]}"; do
    export "${var?}"
  done
  export FIREBASE_CONFIG="$(awk 'BEGIN{}{out=out$0"\n"}END{print out}' "${FIREBASE_KEYPATH}" | sed 's/\n$//')"
}

function env_generator() {
  echo "Clearing existing .env" && echo "" >"${ENV_LOCATION}/.env"
  for var in "${emulator_env[@]}"; do
    echo "${var}" >>"${ENV_LOCATION}/.env"
  done
  echo "Wrote new ${ENV_LOCATION}/.env"
  echo
  cat "${ENV_LOCATION}/.env"
}

function display_emulator_firebase_config() {
  echo "🔥🔥🔥 Firebase Emulator settings:"
  echo
  for var in "${emulator_env[@]}"; do
    echo "${var}"
  done
  echo
  echo FIREBASE_CONFIG="$(awk 'BEGIN{}{out=out$0"\n"}END{print out}' $FIREBASE_KEYPATH | sed 's/\n$//')"
  echo
  echo "🔥🔥🔥 Firebase Config settings:"
  echo
  for var in "${firebase_env[@]}"; do
    echo "${var}"
  done
  echo
}

function usage() {
  echo
  echo " Usage: ./env.sh [option]"
  echo "  -e - 1. Set 🔥🔥🔥 Firebase Emulator environment variables"
  echo "  -f - 2. Set 🔥🔥🔥 Firebase Configuration variables"
  echo "  -s - 3. Show 🔥🔥🔥 Firebase Emulator & Configuration variables"
  echo "  -g - 4. Generate Node .env variables"
  echo "  -u - 8. Unset all Firebase Configuration variables"
  echo "  -m - Show Menu"
  echo "  -h - Usage/Help"
  echo
}

function show_menus() {
  clear
  echo
  echo "  1. Set 🔥🔥🔥 Firebase Emulator environment variables"
  echo "  2. Set 🔥🔥🔥 Firebase Configuration variables"
  echo "  3. Show 🔥🔥🔥 Firebase Emulator & Configuration variables"
  echo "  4. Generate Node .env variables"
  echo "  5. Generate and set Firebase all"
  echo "  8. Unset all 🔥🔥🔥 Firebase Configuration variables"
  echo "  0. Exit"
  echo
}

function read_options() {
  local choice
  read -p "Enter choice [ 1 2 3 0 ] => " choice
  case $choice in
  1) emulator_config_set ;;
  2) firebase_config_set ;;
  3) display_emulator_firebase_config ;;
  4) env_generator ;;
  5)
    firebase_config_unset_all &&
      emulator_config_set &&
      firebase_config_set &&
      display_emulator_firebase_config &&
      print_development_env
    ;;
  8) firebase_config_unset_all ;;
  0) exit 0 ;;
  *) echo -e "${RED} Menu entry error...${STD}" && sleep 1 ;;
  esac
}

function do_menu() {
  while true; do
    show_menus
    read_options
  done
}

if [[ "$*" ]]; then
  while getopts "efsgaumhx" opt; do
    case $opt in
    e)
      echo "🔥🔥🔥 Setting Emulator Environment Variables"
      emulator_config_set
      shift
      ;;
    f)
      echo "🔥🔥🔥 Setting Firebase Config Variables"
      firebase_config_set
      shift
      ;;
    s)
      display_emulator_firebase_config
      echo "Whooohoooo 🎉🎉🎉"
      shift
      ;;
    g)
      echo "Generating localhost .env..."
      firebase_development
      env_generator
      echo
      print_development_env
      shift
      ;;
    u)
      echo "🔥🔥🔥 Firebase config unset all"
      firebase_config_unset_all
      shift
      ;;
    a)
      echo "🔥🔥🔥 Firebase/Environment set and config all"
      firebase_config_unset_all
      emulator_config_set
      firebase_config_set
      display_emulator_firebase_config
      echo
      print_development_env
      echo "Whooohoooo 🎉🎉🎉"
      shift
      ;;
    x)
      export_file
      shift
      ;;
    m)
      do_menu
      shift
      ;;
    h)
      usage
      exit 0
      ;;
    \?) ;;
    esac
  done
else
  usage
  exit 0
fi

trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT
