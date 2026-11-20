@echo off
cd /d "%~dp0"
node -e "const [a,b]=process.versions.node.split('.').map(Number); if(a<22 || (a===22 && b<12)) process.exit(1)" || (
  echo Node.js 22.12 or newer is required. Install it from https://nodejs.org/
  pause
  exit /b 1
)
if not exist node_modules call npm install
call npm run dev
pause
