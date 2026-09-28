@echo off
setlocal
cd /d "%~dp0"
echo Executando os testes de seguranca do DailyMind...
call npm test
set "TEST_EXIT=%ERRORLEVEL%"
echo.
if "%TEST_EXIT%"=="0" (
  echo Resultado: testes passaram.
) else (
  echo Resultado: houve falha. Confira a mensagem acima.
)
echo.
pause
exit /b %TEST_EXIT%