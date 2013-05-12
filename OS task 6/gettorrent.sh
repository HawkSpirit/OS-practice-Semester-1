#!/bin/bash

find_and_click() {
	XY=$(convert temp/Xvfb_screen0 -alpha off -fill white +opaque 'rgb(210,19,23)' -alpha on txt: | grep 210,19,23,1 | head -n 1 | sed -n 's/^\([0-9]*\),\([0-9]*\).*$/\1 \2/p')
	xdotool mousemove $XY click 1
	xdotool click 1
}

echo "Please wait, it may take 2 minutes..."

while read line ; do
	IFS=" "
	set -- $line
	LOGIN=$1
	PASSWORD=$2
done < secret.txt 

mkdir temp
killall Xvfb 2> /dev/null
sleep 5
Xvfb :32 -screen 0 1024x768x24 -fbdir temp &
XVFB_PID=$!
sleep 5
export DISPLAY=:32.0
luakit &
LUA_PID=$!
sleep 5
xdotool selectwindow &
sleep 5
xdotool type ":o http://lostfilm.tv"
xdotool key KP_Enter
sleep 30
xdotool type "gi"
xdotool key Tab
xdotool type $LOGIN
xdotool key Tab
xdotool type $PASSWORD
xdotool key KP_Enter
sleep 30
xdotool key Right
xdotool key Right
xdotool key Right
find_and_click
sleep 10
find_and_click
sleep 10
xdotool key KP_Enter
sleep 10
kill $LUA_PID
kill $XVFB_PID
sleep 5
rmdir temp
