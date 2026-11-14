#!/usr/bin/env bash
# Run only on the dedicated fresh VM approved by its owner.
set -euo pipefail
domain="${1:?Usage: sudo bash deploy/bootstrap-vm.sh YOUR_HOSTNAME}"
[[ "$domain" =~ ^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?$ && "$domain" == *.* ]] || { echo 'Supply a DNS hostname without a scheme or path.' >&2; exit 2; }
[[ "$EUID" == 0 && "$(uname -m)" == x86_64 ]] || { echo 'Requires root on an x86-64 Linux VM.' >&2; exit 2; }
[[ ! -e /opt/singularity && ! -e /etc/systemd/system/singularity.service && ! -e /etc/caddy/Caddyfile ]] || { echo 'Existing app or proxy found. Inspect it and plan an update; this bootstrap will not overwrite it.' >&2; exit 2; }
source_dir="$(cd "$(dirname "$0")/.." && pwd)"
test -f "$source_dir/package-lock.json"
export DEBIAN_FRONTEND=noninteractive
apt-get update -q
apt-get install -y --no-install-recommends ca-certificates curl xz-utils caddy sqlite3
work="$(mktemp -d)"
trap 'rm -rf -- "$work"' EXIT
curl --fail --silent --show-error --location https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt --output "$work/SHASUMS256.txt"
archive="$(awk '$2 ~ /^node-v24\.[0-9]+\.[0-9]+-linux-x64\.tar\.xz$/ {print $2; exit}' "$work/SHASUMS256.txt")"
test -n "$archive"
curl --fail --silent --show-error --location "https://nodejs.org/dist/latest-v24.x/$archive" --output "$work/$archive"
(cd "$work" && awk -v wanted="$archive" '$2 == wanted' SHASUMS256.txt | sha256sum --check -)
install -d -m 755 /opt/singularity-node /opt/singularity
tar -xJf "$work/$archive" --strip-components=1 -C /opt/singularity-node
export PATH="/opt/singularity-node/bin:$PATH"
for item in package.json package-lock.json game.mjs deck.json references.json scripts web server worker drizzle; do
    cp -a "$source_dir/$item" /opt/singularity/
done
(cd /opt/singularity && npm ci --omit=dev --ignore-scripts && npm run build)
id singularity-app >/dev/null 2>&1 || useradd --system --home /var/lib/singularity --shell /usr/sbin/nologin singularity-app
install -d -o singularity-app -g singularity-app -m 750 /var/lib/singularity
cat > /etc/singularity.env <<EOF
NODE_ENV=production
HOST=127.0.0.1
PORT=8787
DATABASE_PATH=/var/lib/singularity/control.sqlite
PUBLIC_ORIGIN=https://$domain
NODE_OPTIONS=--max-old-space-size=128
EOF
chmod 600 /etc/singularity.env
cat > /etc/systemd/system/singularity.service <<'EOF'
[Unit]
Description=Singularity interactive presentation
After=network.target

[Service]
Type=simple
User=singularity-app
Group=singularity-app
WorkingDirectory=/opt/singularity
EnvironmentFile=/etc/singularity.env
ExecStart=/opt/singularity-node/bin/node server/index.mjs
Restart=on-failure
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/singularity
MemoryMax=256M
TasksMax=64
UMask=0077

[Install]
WantedBy=multi-user.target
EOF
cat > /etc/caddy/Caddyfile <<EOF
$domain {
    encode zstd gzip
    reverse_proxy 127.0.0.1:8787
    header Strict-Transport-Security "max-age=31536000"
}
EOF
caddy validate --config /etc/caddy/Caddyfile
systemctl daemon-reload
systemctl enable --now singularity
systemctl enable caddy
systemctl reload-or-restart caddy
for attempt in {1..20}; do
    if curl --fail --silent http://127.0.0.1:8787/health; then
        echo "Local app is healthy. Verify https://$domain from another device before the event."
        exit 0
    fi
    sleep 1
done
echo 'Startup failed; inspect journalctl -u singularity.' >&2
exit 1
