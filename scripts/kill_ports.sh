#!/usr/bin/env bash

PS3='Please enter the 🔥 emulator/application and port you want killed 🤮 => '
options="$(lsof -PiTCP -sTCP:LISTEN | awk '{print $9}' | sed -n '1!p')"
RED='\033[0;31m'
NC='\033[0m'

select port in $options; do
  echo "Selected character:$port"
  echo "Selected number:$REPLY"
  var2="$(echo "$port" | cut -f2 -d:)"
  echo -e "🔪 🤮 💥killing ${RED}port $var2 ${NC}!"
  echo "$(lsof -ti tcp:"$var2" | xargs kill)"
  echo "Whoohooo 💥 💣 💥"
  exit 0
done
