#!/usr/bin/env bash
set -Eeuo pipefail
[[ $EUID -eq 0 ]]||exit 1
CONTAINER=${CONTAINER:-owrx-8013};SRC=$(docker inspect "$CONTAINER" --format '{{range .Mounts}}{{if eq .Destination "/usr/lib/python3/dist-packages/htdocs/plugins"}}{{.Source}}{{end}}{{end}}');INIT="$SRC/receiver/init.js";cp -a "$INIT" "$INIT.backup-remove-dnx-status-$(date +%F-%H%M%S)"
python3 - "$INIT" <<'PY'
from pathlib import Path
import sys
p=Path(sys.argv[1]);t=p.read_text();a='/* DNX_STATUS_V1_RELEASE_START */';b='/* DNX_STATUS_V1_RELEASE_END */'
if a in t and b in t:x,y=t.split(a,1);_,z=y.split(b,1);p.write_text(x+z)
PY
rm -rf "$SRC/dnx_status_v1";docker restart "$CONTAINER";echo 'DNX STATUS v1 entfernt.'
