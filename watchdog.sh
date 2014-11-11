#!/bin/bash
#watchdog.sh

while true
do
    if ps ax | grep node | grep -v grep > /dev/null
    then
        sleep 1
    else
        sudo nohup nodejs init.js &
    fi
    sleep 15
done