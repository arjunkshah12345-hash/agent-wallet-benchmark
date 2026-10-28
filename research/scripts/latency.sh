#!/bin/bash
# usage: latency.sh targets.tsv N out.tsv   (targets: vendor<TAB>kind<TAB>method<TAB>url)
N=$2; OUT=$3; : > "$OUT"
while IFS=$'\t' read -r vendor kind method url; do
  [ -z "$vendor" ] && continue
  for i in $(seq 1 $N); do
    if [ "$method" = "MCP" ]; then
      r=$(curl -s -o /dev/null -m 20 -A 'curl/8.7.1' -X POST -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
        --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"o11bench","version":"1"}}}' \
        -w '%{http_code}\t%{time_connect}\t%{time_starttransfer}\t%{time_total}\t%{size_download}' "$url")
    else
      r=$(curl -sL -o /dev/null -m 20 -A 'curl/8.7.1' -w '%{http_code}\t%{time_connect}\t%{time_starttransfer}\t%{time_total}\t%{size_download}' "$url")
    fi
    printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$vendor" "$kind" "$url" "$i" "$r" >> "$OUT"
    sleep 0.3
  done
done < "$1"
