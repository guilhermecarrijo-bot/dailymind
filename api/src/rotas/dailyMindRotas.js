const { Router } = require('express')
const { cadastrarUsuario, loginUsuario, consultarPerfil, atualizarPerfil } = require('../controladores/usuarioControlador')
const { registrarHumor, listarHumor, obterHumorHoje, editarHumor, removerHumor } = require('../controladores/humorControlador')
const { registrarSono, listarSono, obterSonoHoje, editarSono, removerSono } = require('../controladores/sonoControlador')
const { registrarEnergia, listarEnergia, obterEnergiaHoje, editarEnergia, removerEnergia } = require('../controladores/energiaControlador')
const { criarLembrete, listarLembretes, alternarLembrete, removerLembrete, contarPendentes } = require('../controladores/lembreteControlador')
const { obterSugestoes, listarTodasSugestoes } = require('../controladores/sugestaoControlador')
const {
  criarTarefa,
  listarTarefas,
  obterTarefa,
  alternarTarefa,
  atualizarTarefa,
  removerTarefa,
  contarPendentes: contarTarefasPendentes,
  obterTarefasHoje
} = require('../controladores/tarefaControlador')
const {
  criarMeta,
  listarMetas,
  obterMeta,
  atualizarMeta,
  atualizarProgresso,
  removerMeta,
  obterMetasAtivas,
  obterEstatisticas
} = require('../controladores/metaControlador')

const rotas = Router()

// Usuários
rotas.post('/usuarios/cadastro', cadastrarUsuario)
rotas.post('/usuarios/login', loginUsuario)
rotas.get('/usuarios/:id', consultarPerfil)
rotas.put('/usuarios/perfil', atualizarPerfil)

// Humor
rotas.post('/humor', registrarHumor)
rotas.get('/humor/:usuario_id', listarHumor)
rotas.get('/humor/:usuario_id/hoje', obterHumorHoje)
rotas.put('/humor/:id', editarHumor)
rotas.delete('/humor/:id', removerHumor)

// Sono
rotas.post('/sono', registrarSono)
rotas.get('/sono/:usuario_id', listarSono)
rotas.get('/sono/:usuario_id/hoje', obterSonoHoje)
rotas.put('/sono/:id', editarSono)
rotas.delete('/sono/:id', removerSono)

// Energia
rotas.post('/energia', registrarEnergia)
rotas.get('/energia/:usuario_id', listarEnergia)
rotas.get('/energia/:usuario_id/hoje', obterEnergiaHoje)
rotas.put('/energia/:id', editarEnergia)
rotas.delete('/energia/:id', removerEnergia)

// Lembretes
rotas.post('/lembretes', criarLembrete)
rotas.get('/lembretes/:usuario_id', listarLembretes)
rotas.put('/lembretes/:id/toggle', alternarLembrete)
rotas.delete('/lembretes/:id', removerLembrete)
rotas.get('/lembretes/:usuario_id/pendentes', contarPendentes)

// Tarefas (Checklist)
rotas.post('/tarefas', criarTarefa)
rotas.get('/tarefas/:usuario_id', listarTarefas)
rotas.get('/tarefas/:usuario_id/hoje', obterTarefasHoje)
rotas.get('/tarefas/:usuario_id/pendentes', contarTarefasPendentes)
rotas.get('/tarefas/:id', obterTarefa)
rotas.put('/tarefas/:id/toggle', alternarTarefa)
rotas.put('/tarefas/:id', atualizarTarefa)
rotas.delete('/tarefas/:id', removerTarefa)

// Metas (Objetivos com período definido)
rotas.post('/metas', criarMeta)
rotas.get('/metas/:usuario_id', listarMetas)
rotas.get('/metas/:usuario_id/ativas', obterMetasAtivas)
rotas.get('/metas/:usuario_id/estatisticas', obterEstatisticas)
rotas.get('/metas/:id', obterMeta)
rotas.put('/metas/:id', atualizarMeta)
rotas.put('/metas/:id/progresso', atualizarProgresso)
rotas.delete('/metas/:id', removerMeta)

// Sugestões
rotas.get('/sugestoes/:usuario_id', obterSugestoes)
rotas.get('/sugestoes', listarTodasSugestoes)

module.exports = rotas
