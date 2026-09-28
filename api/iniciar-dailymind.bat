@echo off
setlocal
cd /d "%~dp0"
echo Iniciando o DailyMind...
echo Quando o servidor estiver pronto, abra http://localhost:3000 no navegador.
echo Para parar o servidor, pressione Ctrl+C nesta janela.
echo.
call npm run dev
echo.
echo O servidor foi encerrado.
pause