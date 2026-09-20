@echo off
cd /d "%~dp0"

if not exist .env (
  copy .env.sample .env >nul
)

start notepad .env
