#!/usr/bin/env bash
set -Eeuo pipefail
[[ $EUID -eq 0 ]]||{ echo 'Bitte als root/sudo.';exit 1;}
CONTAINER=${CONTAINER:-owrx-8013}
SRC=$(docker inspect "$CONTAINER" --format '{{range .Mounts}}{{if eq .Destination "/usr/lib/python3/dist-packages/htdocs/plugins"}}{{.Source}}{{end}}{{end}}')
[[ -n $SRC ]]||{ echo 'Plugin-Bind-Mount nicht gefunden.';exit 1;}
HERE=$(cd "$(dirname "$0")"&&pwd);INIT="$SRC/receiver/init.js";STAMP=$(date +%F-%H%M%S)
cp -a "$INIT" "$INIT.backup-dnx-status-$STAMP";mkdir -p "$SRC/dnx_status_v1";cp -a "$HERE/files/dnx_status.js" "$SRC/dnx_status_v1/"
  cp -a "$HERE/files/dnx_status_toggle.js" "$SRC/dnx_status_v1/"
python3 - "$INIT" <<'PY'
from pathlib import Path
import sys
p=Path(sys.argv[1]);t=p.read_text();a='/* DNX_STATUS_V1_RELEASE_START */';b='/* DNX_STATUS_V1_RELEASE_END */'
if a in t and b in t:x,y=t.split(a,1);_,z=y.split(b,1);t=x+z
t+='''\n/* DNX_STATUS_V1_RELEASE_START */\n(function(){if(window.__dnxStatusV1Release)return;window.__dnxStatusV1Release=true;var s=document.createElement("script");s.src="/static/plugins/dnx_status_v1/dnx_status.js";document.head.appendChild(s);var t=document.createElement("script");t.src="/static/plugins/dnx_status_v1/dnx_status_toggle.js";document.head.appendChild(t)})();\n/* DNX_STATUS_V1_RELEASE_END */\n''';p.write_text(t)
PY
docker restart "$CONTAINER";echo 'DNX STATUS v1 installiert. OpenWebRX benötigt 60–90 Sekunden.'
