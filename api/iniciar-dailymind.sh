#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Iniciando o DailyMind..."

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Erro: instale Node.js 22 ou superior e npm antes de iniciar o DailyMind." >&2
  exit 1
fi

node configurarAmbiente.js

PORTA="$(sed -n 's/^PORT=//p' .env | tail -n 1 | tr -d '\r')"
PORTA="${PORTA:-3000}"

echo "Variáveis de ambiente carregadas; a chave não será exibida."
echo "Quando o servidor estiver pronto, abra http://localhost:${PORTA} no navegador."
echo "Para parar o servidor, pressione Ctrl+C neste terminal."
echo

exec npm run dev