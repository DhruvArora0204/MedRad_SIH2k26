@echo off
setlocal
title RxM Ecosystem and RADIS AI Launcher

echo ======================================================================
echo  Starting RxM Ecosystem and RADIS AI Workstation
echo ======================================================================
echo.

set "ROOT_DIR=%~dp0"

echo [1/4] Launching Frontend (Vite on http://localhost:5173)...
start "1 - Frontend (Vite)" cmd /k "cd /d "%ROOT_DIR%frontend" && npm run dev"

echo [2/4] Launching RADIS AI Backend (FastAPI on http://localhost:8000)...
start "2 - RADIS AI Backend" cmd /k "cd /d "%ROOT_DIR%RADIS_2" && python scripts/run_demo_server.py"

echo [3/4] Launching Hardhat Blockchain Node (Port 8545)...
start "3 - Hardhat Local Node" cmd /k "cd /d "%ROOT_DIR%medishare\Medishare-localhost\backend" && npx hardhat node"

echo.
echo Waiting 4 seconds for Hardhat Node to initialize before contract deployment...
timeout /t 4 /nobreak >nul

echo [4/4] Deploying Smart Contract and Starting MediShare Backend (Port 5000)...
start "4 - MediShare Backend" cmd /k "cd /d "%ROOT_DIR%medishare\Medishare-localhost\backend" && npx hardhat run scripts/deploy.js --network localhost && npm run start"

echo.
echo ======================================================================
echo  All 4 services are starting in their dedicated terminal windows:
echo.
echo   1. Frontend App:       http://localhost:5173
echo   2. RADIS AI API:       http://localhost:8000
echo   3. MediShare Express:  http://localhost:5000
echo   4. Hardhat Local Node: http://127.0.0.1:8545
echo ======================================================================
echo.
pause
