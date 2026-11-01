@echo off
echo Installing npm packages...
call npm install
if %errorlevel% equ 0 (
    echo Packages installed successfully!
) else (
    echo Package installation failed with error code %errorlevel%
)
pause