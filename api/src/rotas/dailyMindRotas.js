const { Router } = require('express')
const { cadastrarUsuario, loginUsuario, atualizarPerfil } = require('../controladores/usuarioControlador')
const { registrarHumor, listarHumor, obterHumorHoje } = require('../controladores/humorControlador')
const { registrarSono, listarSono, obterSonoHoje } = require('../controladores/sonoControlador')
const { registrarEnergia, listarEnergia, obterEnergiaHoje } = require('../controladores/energiaControlador')
const { criarTarefa, listarTarefas, alternarTarefa, removerTarefa, contarPendentes } = require('../controladores/tarefaControlador')
const { criarMeta, listarMetas, alternarMeta, removerMeta } = require('../controladores/metaControlador')

const rotas = Router()

// Usuários
rotas.post('/usuarios/cadastro', cadastrarUsuario)
rotas.post('/usuarios/login', loginUsuario)
rotas.put('/usuarios/perfil', atualizarPerfil)

// Humor
rotas.post('/humor', registrarHumor)
rotas.get('/humor/:id_usuario', listarHumor)
rotas.get('/humor/:id_usuario/hoje', obterHumorHoje)

// Sono
rotas.post('/sono', registrarSono)
rotas.get('/sono/:id_usuario', listarSono)
rotas.get('/sono/:id_usuario/hoje', obterSonoHoje)

// Energia
rotas.post('/energia', registrarEnergia)
rotas.get('/energia/:id_usuario', listarEnergia)
rotas.get('/energia/:id_usuario/hoje', obterEnergiaHoje)

// Tarefas
rotas.post('/tarefas', criarTarefa)
rotas.get('/tarefas/:id_usuario', listarTarefas)
rotas.put('/tarefas/:id/toggle', alternarTarefa)
rotas.delete('/tarefas/:id', removerTarefa)
rotas.get('/tarefas/:id_usuario/pendentes', contarPendentes)

// Metas
rotas.post('/metas', criarMeta)
rotas.get('/metas/:id_usuario', listarMetas)
rotas.put('/metas/:id/toggle', alternarMeta)
rotas.delete('/metas/:id', removerMeta)

module.exports = rotas
