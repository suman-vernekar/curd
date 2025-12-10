@echo off
echo Recipe Management System - Setup Script
echo ======================================

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Node.js is already installed.
    node --version
) else (
    echo Node.js is not installed.
    echo Please download and install Node.js from https://nodejs.org/
    echo After installation, please run this script again.
    pause
    exit /b
)

echo.
echo Checking if MongoDB is installed...
mongod --version >nul 2>&1
if %errorlevel% == 0 (
    echo MongoDB is already installed.
    mongod --version
) else (
    echo MongoDB is not installed.
    echo Please download and install MongoDB from https://www.mongodb.com/try/download/community
    echo After installation, please run this script again.
    pause
    exit /b
)

echo.
echo Installing project dependencies...
npm install

echo.
echo Setup completed!
echo To start the application, run: npm start
echo Then open your browser to http://localhost:3000
pause