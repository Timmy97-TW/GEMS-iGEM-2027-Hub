#!/bin/sh
# Rebuilds data/season.js from the System site and keeps the last good copy if anything fails.
#   tools/sync.sh                    reads the live System site
#   tools/sync.sh path/to/data.js    reads a local copy
set -eu
cd "$(dirname "$0")/.."
src="${1:-https://timmy97-tw.github.io/GEMS-iGEM-SYSTEM/assets/data.js}"
tmp="$(mktemp)"
trap 'rm -f "$tmp" "$tmp.src"' EXIT
case "$src" in
  http*) curl -fsSL --retry 3 "$src" -o "$tmp.src"; src="$tmp.src" ;;
esac
if command -v node >/dev/null 2>&1; then
  node tools/sync-season.js "$src" > "$tmp"
else
  # macOS without node
  /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tools/sync-season.js -- "$src" > "$tmp"
fi
grep -q '^const SEASON = {' "$tmp" || { echo "sync: the result is not a season file; data/season.js left as it was" >&2; exit 1; }
cp "$tmp" data/season.js
echo "sync: data/season.js rebuilt ($(grep -c '"n":"' data/season.js) lines with a name)"
