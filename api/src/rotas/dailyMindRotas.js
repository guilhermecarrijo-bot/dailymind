const { Router } = require('express')
const { cadastrarUsuario, loginUsuario, consultarPerfil, atualizarPerfil } = require('../controladores/usuarioControlador')
const { registrarHumor, listarHumor, obterHumorHoje, editarHumor, removerHumor } = require('../controladores/humorControlador')
const { registrarSono, listarSono, obterSonoHoje, editarSono, removerSono } = require('../controladores/sonoControlador')
const { registrarEnergia, listarEnergia, obterEnergiaHoje, editarEnergia, removerEnergia } = require('../controladores/energiaControlador')
const { criarTarefa, listarTarefas, consultarTarefa, editarTarefa, alternarTarefa, removerTarefa, contarPendentes } = require('../controladores/tarefaControlador')
const { criarMeta, listarMetas, consultarMeta, editarMeta, alternarMeta, removerMeta } = require('../controladores/metaControlador')

const rotas = Router()

// Usuários
rotas.post('/usuarios/cadastro', cadastrarUsuario)
rotas.post('/usuarios/login', loginUsuario)
rotas.get('/usuarios/:id_usuario', consultarPerfil)
rotas.put('/usuarios/perfil', atualizarPerfil)

// Humor
rotas.post('/humor', registrarHumor)
rotas.get('/humor/:id_usuario', listarHumor)
rotas.get('/humor/:id_usuario/hoje', obterHumorHoje)
rotas.put('/humor/:id', editarHumor)
rotas.delete('/humor/:id', removerHumor)

// Sono
rotas.post('/sono', registrarSono)
rotas.get('/sono/:id_usuario', listarSono)
rotas.get('/sono/:id_usuario/hoje', obterSonoHoje)
rotas.put('/sono/:id', editarSono)
rotas.delete('/sono/:id', removerSono)

// Energia
rotas.post('/energia', registrarEnergia)
rotas.get('/energia/:id_usuario', listarEnergia)
rotas.get('/energia/:id_usuario/hoje', obterEnergiaHoje)
rotas.put('/energia/:id', editarEnergia)
rotas.delete('/energia/:id', removerEnergia)

// Tarefas
rotas.post('/tarefas', criarTarefa)
rotas.get('/tarefas/:id_usuario', listarTarefas)
rotas.get('/tarefas/:id_usuario/pendentes', contarPendentes)
rotas.get('/tarefas/:id_usuario/:id', consultarTarefa)
rotas.put('/tarefas/:id', editarTarefa)
rotas.put('/tarefas/:id/toggle', alternarTarefa)
rotas.delete('/tarefas/:id', removerTarefa)

// Metas
rotas.post('/metas', criarMeta)
rotas.get('/metas/:id_usuario', listarMetas)
rotas.get('/metas/:id_usuario/:id', consultarMeta)
rotas.put('/metas/:id', editarMeta)
rotas.put('/metas/:id/toggle', alternarMeta)
rotas.delete('/metas/:id', removerMeta)

module.exports = rotas
