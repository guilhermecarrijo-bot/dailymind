const { Router } = require('express')
const { cadastrarUsuario, loginUsuario, atualizarPerfil } = require('../controladores/usuarioControlador')
const { registrarHumor, listarHumor, obterHumorHoje } = require('../controladores/humorControlador')
const { registrarSono, listarSono, obterSonoHoje } = require('../controladores/sonoControlador')
const { registrarEnergia, listarEnergia, obterEnergiaHoje } = require('../controladores/energiaControlador')
const { criarLembrete, listarLembretes, alternarLembrete, removerLembrete, contarPendentes } = require('../controladores/lembreteControlador')
const { obterSugestoes, listarTodasSugestoes } = require('../controladores/sugestaoControlador')

const rotas = Router()

// Usuários
rotas.post('/usuarios/cadastro', cadastrarUsuario)
rotas.post('/usuarios/login', loginUsuario)
rotas.put('/usuarios/perfil', atualizarPerfil)

// Humor
rotas.post('/humor', registrarHumor)
rotas.get('/humor/:usuario_id', listarHumor)
rotas.get('/humor/:usuario_id/hoje', obterHumorHoje)

// Sono
rotas.post('/sono', registrarSono)
rotas.get('/sono/:usuario_id', listarSono)
rotas.get('/sono/:usuario_id/hoje', obterSonoHoje)

// Energia
rotas.post('/energia', registrarEnergia)
rotas.get('/energia/:usuario_id', listarEnergia)
rotas.get('/energia/:usuario_id/hoje', obterEnergiaHoje)

// Lembretes
rotas.post('/lembretes', criarLembrete)
rotas.get('/lembretes/:usuario_id', listarLembretes)
rotas.put('/lembretes/:id/toggle', alternarLembrete)
rotas.delete('/lembretes/:id', removerLembrete)
rotas.get('/lembretes/:usuario_id/pendentes', contarPendentes)

// Sugestões
rotas.get('/sugestoes/:usuario_id', obterSugestoes)
rotas.get('/sugestoes', listarTodasSugestoes)

module.exports = rotas
