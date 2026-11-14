#!/usr/bin/env bash
# Private snapshot: includes access-bearing session data. Never put it in GitHub.
set -euo pipefail
[[ "$EUID" == 0 ]] || { echo 'Run with sudo.' >&2; exit 2; }
test -f /var/lib/singularity/control.sqlite
test -d /opt/singularity
umask 077
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
work="$(mktemp -d /var/tmp/singularity-backup.XXXXXX)"
trap 'rm -rf -- "$work"' EXIT
sqlite3 /var/lib/singularity/control.sqlite ".backup '$work/control.sqlite'"
[[ "$(sqlite3 "$work/control.sqlite" 'PRAGMA integrity_check;')" == ok ]]
tar -czf "$work/app.tar.gz" -C /opt/singularity .
cp /etc/singularity.env /etc/systemd/system/singularity.service "$work/"
cp /etc/caddy/Caddyfile "$work/Caddyfile"
(cd "$work" && sha256sum control.sqlite app.tar.gz singularity.env singularity.service Caddyfile > SHA256SUMS)
install -d -m 700 /var/backups/singularity
target="/var/backups/singularity/singularity-$stamp.tar.gz"
tar -czf "$target" -C "$work" .
chmod 600 "$target"
sha256sum "$target"
echo 'Download this private archive and verify it before deleting the VM.'
