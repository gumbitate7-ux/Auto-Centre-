#!/usr/bin/env bash
# Packages the Shopify theme folders into dist/homeward-theme.zip for
# Online Store → Themes → Add theme → Upload zip file.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -f dist/homeward-theme.zip
mkdir -p dist
zip -rq -X dist/homeward-theme.zip assets config layout locales sections snippets templates
echo "Built dist/homeward-theme.zip ($(du -h dist/homeward-theme.zip | cut -f1))"
