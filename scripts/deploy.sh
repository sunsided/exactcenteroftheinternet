#!/usr/bin/env bash
# Sync the prerendered sites to their GCS buckets.
#
#   ./scripts/deploy.sh                 # both sites
#   ./scripts/deploy.sh exact           # just one
#   DRY_RUN=1 ./scripts/deploy.sh       # show what would change
#
# Buckets are named after the hostname so GCS can serve them via
# CNAME c.storage.googleapis.com (see README.md for the one-time setup).
set -euo pipefail

declare -A BUCKETS=(
	[exact]="${EXACT_BUCKET:-exactcenteroftheinternet.com}"
	[approximate]="${APPROXIMATE_BUCKET:-approximatecenteroftheinternet.com}"
)

sites=("$@")
[[ ${#sites[@]} -eq 0 ]] && sites=(exact approximate)

dry_run=()
[[ -n "${DRY_RUN:-}" ]] && dry_run=(--dry-run)

cd "$(dirname "$0")/.."

for site in "${sites[@]}"; do
	bucket="${BUCKETS[$site]:?unknown site: $site}"
	dir="build/$site"
	[[ -d "$dir" ]] || { echo "missing $dir, run yarn build first" >&2; exit 1; }

	echo "==> $site -> gs://$bucket"

	# Content types are inferred from the extension (.htm -> text/html). Short cache so edits
	# show up quickly; Cloudflare sits in front anyway.
	gcloud storage rsync "$dir" "gs://$bucket" "${dry_run[@]}" \
		--recursive --delete-unmatched-destination-objects \
		--cache-control='public, max-age=300'
done
