@echo off
setlocal
cd /d "%~dp0"
echo Iniciando o DailyMind...
node configurarAmbiente.js
if errorlevel 1 (
	echo Falha ao preparar o arquivo .env. Verifique Node.js e api\.env.example.
	pause
	exit /b 1
)
set "PORTA=3000"
for /f "tokens=1,* delims==" %%A in ('findstr /B /C:"PORT=" ".env"') do set "PORTA=%%B"
echo Variaveis de ambiente carregadas; a chave nao sera exibida.
echo Quando o servidor estiver pronto, abra http://localhost:%PORTA% no navegador.
echo Para parar o servidor, pressione Ctrl+C nesta janela.
echo.
call npm run dev
echo.
echo O servidor foi encerrado.
pause