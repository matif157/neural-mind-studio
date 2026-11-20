#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 22.12+ is required. Install it from https://nodejs.org/"
  exit 1
fi
node -e "const [a,b]=process.versions.node.split('.').map(Number); if(a<22 || (a===22 && b<12)) process.exit(1)" || {
  echo "Please use Node.js 22.12 or newer."
  exit 1
}
if [ ! -d node_modules ]; then npm install; fi
npm run dev
