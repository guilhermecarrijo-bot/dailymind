#!/bin/bash
cd /home/ifmt-aluno/Documentos/dailymind/api
rm -f db/dailymind.db

# Inicia o servidor em background
nohup node -e "
const app = require('./src/app');
const PORTA = 3000;
require('./iniciarBanco');
app.listen(PORTA, () => {
  console.log('Servidor rodando na porta ' + PORTA);
  console.log('Acesse: http://localhost:' + PORTA);
});
" > /tmp/dailymind.log 2>&1 &

echo "Servidor iniciado com PID: $!"
echo "Logs em: /tmp/dailymind.log"
sleep 2
cat /tmp/dailymind.log
