#!/bin/bash
# Tüm siteyi tek komutla üretir: node build.sh (veya bash build.sh)
set -e
node generate.js
node build-blog.js
node build-pages.js
echo ""
echo "Site hazır. iller/, blog/, index.html, sitemap.xml ve zorunlu sayfalar güncellendi."
