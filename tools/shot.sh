#!/bin/sh
# Screenshot one page with headless Chrome. Needs the dev server on :8090.
# PORT=8091 to target another server.
# usage: tools/shot.sh <slug> <Mode> <out.png> [width]
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --user-data-dir="${TMPDIR:-/tmp}/hods-chrome-${PORT:-8090}" --window-size="${4:-1400},2400" --virtual-time-budget=4000 \
  --screenshot="$3" "http://127.0.0.1:${PORT:-8090}/?mode=$2#/c/$1" 2>/dev/null
