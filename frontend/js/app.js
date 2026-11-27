// URL base da API: usa o mesmo computador pela rede local no celular
const URL_API = window.location.port === '8000'
  ? `${window.location.protocol}//${window.location.hostname}:3000/api`
  : '/api'

// Estado do aplicativo
let usuarioAtual = null
let iconeSelecionado = '📌'
let notificacoesAbertas = false
let registroSonoEditando = null
let registroEnergiaEditando = null
let historicoSono = []
let historicoEnergia = []
let imagensPerfilCarregando = 0
let intervaloSugestoes = null
let sugestoesCarregando = false
let proximaSugestaoEm = 120
let sessaoPerfil = 0
let perfilAlteradoLocalmente = false
let fotosPerfilPendentes = { foto_perfil: null, banner_perfil: null }
let filtroTarefas = 'todas'
let configuracoes = {
  tema: 'claro',
  idioma: 'pt-BR',
  fonteMaior: false,
  altoContraste: false,
  reduzirMovimento: false
}

const traducoes = {
  'pt-BR': {
    navInicio: 'Início', navGraficos: 'Gráficos', navLembretes: 'Lembretes', navPerfil: 'Perfil', navConfiguracoes: 'Configurações', voltar: 'Voltar',
    preferencias: 'Preferências', configuracoesTitulo: 'Configurações', configuracoesDescricao: 'Personalize o DailyMind do seu jeito. As escolhas ficam salvas neste dispositivo.',
    aparencia: 'Aparência', aparenciaDescricao: 'Escolha como o DailyMind aparece para você.', tema: 'Tema', temaClaro: 'Claro', temaEscuro: 'Escuro',
    idiomaTitulo: 'Idioma', idiomaDescricao: 'Altere os textos principais da interface.', idioma: 'Idioma',
    acessibilidadeTitulo: 'Acessibilidade', acessibilidadeDescricao: 'Ajustes para deixar a experiência mais confortável.', fonteMaior: 'Fonte maior', fonteMaiorDescricao: 'Aumenta o tamanho dos textos.',
    altoContraste: 'Alto contraste', altoContrasteDescricao: 'Reforça a leitura de textos e bordas.', reduzirMovimento: 'Reduzir movimento', reduzirMovimentoDescricao: 'Diminui transições e animações.', salvoConfiguracoes: 'Preferências salvas.',
    tagline: 'Cuide da sua mente, um dia de cada vez', bomDia: 'Bom dia,', atualizar: 'Atualizar →', entrar: 'Entrar', criarConta: 'Criar Conta', email: 'E-mail', senha: 'Senha', nomeCompleto: 'Nome completo', idadeOpcional: 'Idade (opcional)', ocupacaoOpcional: 'Ocupação (opcional)', criarMinhaConta: 'Criar minha conta', naoTemConta: 'Não tem conta?', jaTemConta: 'Já tem conta?',
    comoVoceEsta: 'Como você está hoje?', humorHoje: 'Humor de hoje', sono: 'Sono', energia: 'Energia', editar: 'Editar', registrar: 'Toque para registrar', lembretesHoje: 'Lembretes de hoje', novo: '+ Novo', sugestoes: '💡 Sugestões para você', sugestoesDescricao: 'Ideias pequenas para cuidar de você no seu ritmo.', atualizarAgora: 'Atualizar agora', atualizarSugestoes: 'Atualizar sugestões', atualizando: 'Atualizando...', proximaEm: 'Próxima em', graficosTitulo: '📊 Seus Gráficos', humor30: 'Humor nos últimos 30 dias', sono30: 'Sono nos últimos 30 dias', energia30: 'Energia nos últimos 30 dias', todosLembretes: '⏰ Todos os Lembretes', nenhumLembrete: 'Nenhum lembrete criado',
    erroGraficos: 'Não foi possível carregar os gráficos agora.',
    meuPerfil: '👤 Meu Perfil', perfilDescricao: 'Suas informações ficam salvas na sua conta.', salvarAlteracoes: 'Salvar alterações', sair: 'Sair da conta', biografia: 'Biografia', ate280: 'Até 280 caracteres', fechar: 'Fechar', confirmar: 'Confirmar', cancelar: 'Cancelar', qualidadePercebida: 'Qualidade percebida', nivelEnergia: 'Nível de energia', horasSono: 'Horas de sono', novoLembrete: 'Novo Lembrete', titulo: 'Título', objetoDeixado: 'Objeto deixado (opcional)', horarioDeixado: 'Que horas deixou? (opcional)', icone: 'Ícone', criarLembrete: 'Criar lembrete',
    nenhumaNotificacao: 'Nenhuma notificação pendente.', notificacoes: 'Notificações', voltarDashboard: 'Voltar', objeto: 'Objeto', horario: 'Horário', lembretePendente: 'Lembrete pendente', tudoEmDia: 'Tudo em dia. Nenhuma notificação pendente.', removerLembrete: 'Remover este lembrete?',
    ritmoDescanso: 'Ritmo de descanso', historicoSono: 'Histórico de sono', ajustarRegistro: 'Ajuste qualquer registro quando precisar.', disposicaoDiaria: 'Disposição diária', historicoEnergia: 'Histórico de energia', verEvolucao: 'Veja a evolução e altere o que foi anotado.', qualidade: 'Qualidade', nenhumSono: 'Nenhum registro de sono ainda.', nenhumaEnergia: 'Nenhum registro de energia ainda.', paraVoce: 'Para você', carregarSugestoes: 'Registre seu humor para ver sugestões', erroSugestoes: 'Não foi possível carregar sugestões agora.', unidadeHoras: ' horas', anos: 'anos', bemVindo: 'Bem-vindo', contaCriada: 'Conta criada com sucesso!', humorAtualizado: 'Humor atualizado', erroHumor: 'Não foi possível registrar seu humor.', sonoAtualizado: 'Registro de sono atualizado!', sonoRegistrado: 'Sono registrado!', energiaAtualizada: 'Registro de energia atualizado!', energiaRegistrada: 'Energia registrada!', lembreteCriado: 'Lembrete criado!', lembreteRemovido: 'Lembrete removido', salvando: 'Salvando...',
    carregando: 'Carregando registros...', semLembretes: 'Nenhum lembrete ainda', naoFoiPossivel: 'Não foi possível carregar as notificações.', erroSessao: 'Sua sessão expirou. Entre novamente para editar o perfil.', salvoAgora: 'Salvo agora', prontoSalvar: 'Pronto para salvar', imagemGrande: 'Cada imagem deve ter no máximo 900 KB.', aguardeImagem: 'Aguarde a imagem terminar de carregar.', naoSalvo: 'Não salvo', semRegistros: 'Nenhum registro de sono ainda.', registradoHoje: 'Registrado hoje', aindaNaoRegistrado: 'Ainda não registrado', sincronizado: 'Sincronizado', alterarBanner: 'Alterar banner', alterarFoto: 'Alterar foto', humorCheckin: 'Um check-in rápido para se escutar.', humorMuda: 'Seu registro pode mudar ao longo do dia.'
  },
  en: {
    navInicio: 'Home', navGraficos: 'Charts', navLembretes: 'Reminders', navPerfil: 'Profile', navConfiguracoes: 'Settings', voltar: 'Back',
    preferencias: 'Preferences', configuracoesTitulo: 'Settings', configuracoesDescricao: 'Personalize DailyMind your way. These choices are saved on this device.',
    aparencia: 'Appearance', aparenciaDescricao: 'Choose how DailyMind looks for you.', tema: 'Theme', temaClaro: 'Light', temaEscuro: 'Dark',
    idiomaTitulo: 'Language', idiomaDescricao: 'Change the main interface language.', idioma: 'Language',
    acessibilidadeTitulo: 'Accessibility', acessibilidadeDescricao: 'Adjust the experience for more comfort.', fonteMaior: 'Larger text', fonteMaiorDescricao: 'Increase text size.',
    altoContraste: 'High contrast', altoContrasteDescricao: 'Strengthen text and border contrast.', reduzirMovimento: 'Reduce motion', reduzirMovimentoDescricao: 'Reduce transitions and animations.', salvoConfiguracoes: 'Preferences saved.',
    tagline: 'Care for your mind, one day at a time', bomDia: 'Good morning,', atualizar: 'Update →', entrar: 'Sign in', criarConta: 'Create account', email: 'Email', senha: 'Password', nomeCompleto: 'Full name', idadeOpcional: 'Age (optional)', ocupacaoOpcional: 'Occupation (optional)', criarMinhaConta: 'Create my account', naoTemConta: 'Do not have an account?', jaTemConta: 'Already have an account?',
    comoVoceEsta: 'How are you feeling today?', humorHoje: 'Today\'s mood', sono: 'Sleep', energia: 'Energy', editar: 'Edit', registrar: 'Tap to record', lembretesHoje: 'Today\'s reminders', novo: '+ New', sugestoes: '💡 Suggestions for you', sugestoesDescricao: 'Small ideas to care for yourself at your own pace.', atualizarAgora: 'Refresh now', atualizarSugestoes: 'Refresh suggestions', atualizando: 'Refreshing...', proximaEm: 'Next in', graficosTitulo: '📊 Your charts', humor30: 'Mood in the last 30 days', sono30: 'Sleep in the last 30 days', energia30: 'Energy in the last 30 days', todosLembretes: '⏰ All reminders', nenhumLembrete: 'No reminders created',
    erroGraficos: 'Charts could not be loaded right now.',
    meuPerfil: '👤 My profile', perfilDescricao: 'Your information is saved to your account.', salvarAlteracoes: 'Save changes', sair: 'Sign out', biografia: 'Bio', ate280: 'Up to 280 characters', fechar: 'Close', confirmar: 'Confirm', cancelar: 'Cancel', qualidadePercebida: 'Perceived quality', nivelEnergia: 'Energy level', horasSono: 'Sleep hours', novoLembrete: 'New reminder', titulo: 'Title', objetoDeixado: 'Object left (optional)', horarioDeixado: 'What time did you leave it? (optional)', icone: 'Icon', criarLembrete: 'Create reminder',
    nenhumaNotificacao: 'No pending notifications.', notificacoes: 'Notifications', voltarDashboard: 'Back', objeto: 'Object', horario: 'Time', lembretePendente: 'Pending reminder', tudoEmDia: 'All clear. No pending notifications.', removerLembrete: 'Remove this reminder?',
    ritmoDescanso: 'Rest rhythm', historicoSono: 'Sleep history', ajustarRegistro: 'Adjust any record whenever you need.', disposicaoDiaria: 'Daily energy', historicoEnergia: 'Energy history', verEvolucao: 'See your progress and update past entries.', qualidade: 'Quality', nenhumSono: 'No sleep records yet.', nenhumaEnergia: 'No energy records yet.', paraVoce: 'For you', carregarSugestoes: 'Record your mood to see suggestions', erroSugestoes: 'Suggestions could not be loaded.', unidadeHoras: ' hours', anos: 'years', bemVindo: 'Welcome', contaCriada: 'Account created successfully!', humorAtualizado: 'Mood updated', erroHumor: 'Your mood could not be saved.', sonoAtualizado: 'Sleep record updated!', sonoRegistrado: 'Sleep recorded!', energiaAtualizada: 'Energy record updated!', energiaRegistrada: 'Energy recorded!', lembreteCriado: 'Reminder created!', lembreteRemovido: 'Reminder removed', salvando: 'Saving...', carregando: 'Loading records...', semLembretes: 'No reminders yet', naoFoiPossivel: 'Notifications could not be loaded.', erroSessao: 'Your session expired. Sign in again to edit your profile.', salvoAgora: 'Saved now', prontoSalvar: 'Ready to save', imagemGrande: 'Each image must be at most 900 KB.', aguardeImagem: 'Wait for the image to finish loading.', naoSalvo: 'Not saved', semRegistros: 'No sleep records yet.', registradoHoje: 'Recorded today', aindaNaoRegistrado: 'Not recorded yet', sincronizado: 'Synced', alterarBanner: 'Change banner', alterarFoto: 'Change photo', humorCheckin: 'A quick check-in to listen to yourself.', humorMuda: 'Your record can change throughout the day.'
  },
  es: {
    navInicio: 'Inicio', navGraficos: 'Gráficos', navLembretes: 'Recordatorios', navPerfil: 'Perfil', navConfiguracoes: 'Configuración', voltar: 'Volver',
    preferencias: 'Preferencias', configuracoesTitulo: 'Configuración', configuracoesDescricao: 'Personaliza DailyMind. Estas opciones se guardan en este dispositivo.',
    aparencia: 'Apariencia', aparenciaDescricao: 'Elige cómo se muestra DailyMind.', tema: 'Tema', temaClaro: 'Claro', temaEscuro: 'Oscuro',
    idiomaTitulo: 'Idioma', idiomaDescricao: 'Cambia el idioma principal de la interfaz.', idioma: 'Idioma',
    acessibilidadeTitulo: 'Accesibilidad', acessibilidadeDescricao: 'Ajustes para una experiencia más cómoda.', fonteMaior: 'Texto más grande', fonteMaiorDescricao: 'Aumenta el tamaño del texto.',
    altoContraste: 'Alto contraste', altoContrasteDescricao: 'Refuerza el contraste de textos y bordes.', reduzirMovimento: 'Reducir movimiento', reduzirMovimentoDescricao: 'Reduce transiciones y animaciones.', salvoConfiguracoes: 'Preferencias guardadas.',
    tagline: 'Cuida tu mente, un día a la vez', bomDia: 'Buenos días,', atualizar: 'Actualizar →', entrar: 'Entrar', criarConta: 'Crear cuenta', email: 'Correo electrónico', senha: 'Contraseña', nomeCompleto: 'Nombre completo', idadeOpcional: 'Edad (opcional)', ocupacaoOpcional: 'Ocupación (opcional)', criarMinhaConta: 'Crear mi cuenta', naoTemConta: '¿No tienes una cuenta?', jaTemConta: '¿Ya tienes una cuenta?',
    comoVoceEsta: '¿Cómo te sientes hoy?', humorHoje: 'Estado de ánimo de hoy', sono: 'Sueño', energia: 'Energía', editar: 'Editar', registrar: 'Toca para registrar', lembretesHoje: 'Recordatorios de hoy', novo: '+ Nuevo', sugestoes: '💡 Sugerencias para ti', sugestoesDescricao: 'Ideas pequeñas para cuidarte a tu ritmo.', atualizarAgora: 'Actualizar ahora', atualizarSugestoes: 'Actualizar sugerencias', atualizando: 'Actualizando...', proximaEm: 'Siguiente en', graficosTitulo: '📊 Tus gráficos', humor30: 'Ánimo en los últimos 30 días', sono30: 'Sueño en los últimos 30 días', energia30: 'Energía en los últimos 30 días', todosLembretes: '⏰ Todos los recordatorios', nenhumLembrete: 'No hay recordatorios creados',
    erroGraficos: 'No se pudieron cargar los gráficos ahora.',
    meuPerfil: '👤 Mi perfil', perfilDescricao: 'Tu información se guarda en tu cuenta.', salvarAlteracoes: 'Guardar cambios', sair: 'Cerrar sesión', biografia: 'Biografía', ate280: 'Hasta 280 caracteres', fechar: 'Cerrar', confirmar: 'Confirmar', cancelar: 'Cancelar', qualidadePercebida: 'Calidad percibida', nivelEnergia: 'Nivel de energía', horasSono: 'Horas de sueño', novoLembrete: 'Nuevo recordatorio', titulo: 'Título', objetoDeixado: 'Objeto dejado (opcional)', horarioDeixado: '¿A qué hora lo dejaste? (opcional)', icone: 'Icono', criarLembrete: 'Crear recordatorio',
    nenhumaNotificacao: 'No hay notificaciones pendientes.', notificacoes: 'Notificaciones', voltarDashboard: 'Volver', objeto: 'Objeto', horario: 'Horario', lembretePendente: 'Recordatorio pendiente', tudoEmDia: 'Todo al día. No hay notificaciones pendientes.', removerLembrete: '¿Eliminar este recordatorio?',
    ritmoDescanso: 'Ritmo de descanso', historicoSono: 'Historial de sueño', ajustarRegistro: 'Ajusta cualquier registro cuando lo necesites.', disposicaoDiaria: 'Disposición diaria', historicoEnergia: 'Historial de energía', verEvolucao: 'Mira tu evolución y actualiza tus registros.', qualidade: 'Calidad', nenhumSono: 'Aún no hay registros de sueño.', nenhumaEnergia: 'Aún no hay registros de energía.', paraVoce: 'Para ti', carregarSugestoes: 'Registra tu ánimo para ver sugerencias', erroSugestoes: 'No se pudieron cargar las sugerencias.', unidadeHoras: ' horas', anos: 'años', bemVindo: 'Bienvenido', contaCriada: '¡Cuenta creada!', humorAtualizado: 'Ánimo actualizado', erroHumor: 'No se pudo guardar tu ánimo.', sonoAtualizado: '¡Registro de sueño actualizado!', sonoRegistrado: '¡Sueño registrado!', energiaAtualizada: '¡Registro de energia actualizado!', energiaRegistrada: '¡Energía registrada!', lembreteCriado: '¡Recordatorio creado!', lembreteRemovido: 'Recordatorio eliminado', salvando: 'Guardando...', carregando: 'Cargando registros...', semLembretes: 'Aún no hay recordatorios', naoFoiPossivel: 'No se pudieron cargar las notificaciones.', erroSessao: 'Tu sesión expiró. Entra de nuevo para editar tu perfil.', salvoAgora: 'Guardado ahora', prontoSalvar: 'Listo para guardar', imagemGrande: 'Cada imagen debe pesar como máximo 900 KB.', aguardeImagem: 'Espera a que la imagen termine de cargar.', naoSalvo: 'No guardado', semRegistros: 'Aún no hay registros de sueño.', registradoHoje: 'Registrado hoy', aindaNaoRegistrado: 'Aún no registrado', sincronizado: 'Sincronizado', alterarBanner: 'Cambiar banner', alterarFoto: 'Cambiar foto', humorCheckin: 'Un check-in rápido para escucharte.', humorMuda: 'Tu registro puede cambiar durante el día.'
  }
}

const traducoesComplementares = {
  'pt-BR': {
    documentTitulo: 'DailyMind - Cuide da sua mente', heroTitulo: 'Seu espaço leve para perceber o que você precisa.', heroDescricao: 'Acompanhe humor, sono, energia e lembretes com uma rotina mais gentil, clara e útil para o seu dia.',
    humor: 'Humor', humorFeatureDescricao: 'Registre como você está em poucos segundos.', sonoFeatureDescricao: 'Veja seu descanso e o impacto no seu ritmo.', energiaFeatureDescricao: 'Monitore o nível de disposição ao longo do dia.',
    recupereRitmo: 'Recupere seu ritmo', combustivelHoje: 'Seu combustível de hoje', perfilPadrao: 'Seu perfil, do seu jeito', nomeObrigatorio: 'Informe o nome para salvar o perfil.', campoMuitoLongo: 'Um ou mais campos ultrapassam o limite de caracteres.', erroImagem: 'Não foi possível concluir esta ação.',
    saudacao: 'Olá,', roleUsuario: 'Usuário', metricRegistrosNumero: '+1.200', carregandoImagem: 'Carregando imagem...', sonoResumo: 'de sono', energiaResumo: 'de energia',
    metricRegistros: 'registros', metricDias: '7 dias', metricAcompanhamento: 'de acompanhamento', metricAcolhimento: 'focado em acolhimento',
    idadePlaceholder: 'Idade', ocupacaoPlaceholder: 'Ex: Estudante', abrirNotificacoes: 'Abrir notificações', fecharNotificacoes: 'Fechar notificações',
    painelAdmin: 'Painel Admin', painel: 'Painel', areaAdministrativa: 'Área administrativa', distribuicaoHumor: 'Distribuição de humor', cadastrosPorMes: 'Cadastros por mês',
    relatorios: 'Relatórios', relatoriosDescricao: 'Engajamento e uso em um intervalo de datas.', filtrar: 'Filtrar', exportarCsv: 'Exportar CSV',
    buscarPlaceholder: 'Buscar por nome ou e-mail', buscar: 'Buscar', colunaNome: 'Nome', colunaEmail: 'E-mail', colunaPerfil: 'Perfil', colunaStatus: 'Status', colunaAcoes: 'Ações',
    nome: 'Nome', bannerPerfil: 'Banner do perfil', biografiaPlaceholder: 'Conte um pouco sobre você...', perfilSalvo: 'Perfil salvo', perfilSalvoDescricao: 'Suas alterações foram confirmadas e já estão na sua conta.', entendi: 'Entendi',
    checkinEmocional: 'Check-in emocional', semRespostaCerta: 'Não existe resposta certa. Escolha o que mais combina com agora.', sonoDescricaoModal: 'Conte como foi sua noite, sem cobrança.', energiaDescricaoModal: 'Registre sua disposição real para o dia.',
    noLimite: 'No limite', cheioEnergia: 'Cheio de energia', lembreteTituloPlaceholder: 'Ex: Beber água', lembreteObjetoPlaceholder: 'Ex: Chaves, celular',
    humorPergunta: 'Como você está?', humorEscolha: 'Escolha uma opção para registrar seu momento.', usuarioPadrao: 'Usuário', manifestDescricao: 'Registro diário de humor, sono, energia, lembretes e autocuidado.',
    cadastrosAtivos: 'cadastros ativos', registros30Dias: 'registros em 30 dias', mediaSono: 'Média de sono', ultimos30Dias: 'últimos 30 dias', mediaGeral: 'média geral',
    usuarios: 'Usuários', usuariosNovos: 'Usuários novos', registrosHumor: 'Registros de humor', engajamento: 'Engajamento', atividadeRecente: 'Atividade recente', semRegistrosIntervalo: 'Nenhum registro no intervalo informado.',
    erroCarregarUsuarios: 'Não foi possível carregar os usuários.', adminRole: 'Admin', ativo: 'Ativo', inativo: 'Inativo', desativar: 'Desativar', ativar: 'Ativar', excluir: 'Excluir',
    statusAtualizado: 'Status atualizado.', erroAtualizarStatus: 'Não foi possível atualizar o status.', confirmarExclusaoUsuario: 'Deseja realmente excluir este usuário?', usuarioRemovido: 'Usuário removido.', erroExcluirUsuario: 'Não foi possível excluir o usuário.',
    csvIndicador: 'indicador', csvValor: 'valor', csvUsuariosNovos: 'usuarios_novos', csvRegistrosHumor: 'registros_humor', csvEngajamentoTotal: 'engajamento_total', csvNomeArquivo: 'relatorio_dailymind.csv',
    semHumorGrafico: 'Nenhum registro de humor salvo ainda.', semSonoGrafico: 'Nenhum registro de sono salvo ainda.', semEnergiaGrafico: 'Nenhum registro de energia salvo ainda.',
    erroSalvarPerfil: 'Não foi possível salvar o perfil.', acaoFalhou: 'Não foi possível concluir a ação', conexaoFalhou: 'Não foi possível conectar ao DailyMind.',
    offlinePendente: 'Registro salvo neste dispositivo. Enviaremos quando houver conexão.',
    nomeTamanho: 'Nome deve ter entre 3 e 100 caracteres.', nomeTamanhoArtigo: 'O nome deve ter entre 3 e 100 caracteres.', emailInvalido: 'E-mail inválido.', senhaTamanho: 'A senha deve ter entre 8 e 128 caracteres.',
    idadeIntervalo: 'A idade deve estar entre 1 e 150 anos.', ocupacaoTamanho: 'A ocupação pode ter no máximo 100 caracteres.', bioTamanho: 'A biografia pode ter no máximo 280 caracteres.', emailCadastrado: 'E-mail já cadastrado.',
    emailSenhaObrigatorios: 'E-mail e senha são obrigatórios.', credenciaisInvalidas: 'E-mail ou senha incorretos.', contaDesativada: 'Esta conta está desativada.', loginSucesso: 'Login realizado com sucesso!', sessaoEncerrada: 'Sessão encerrada.',
    usuarioNaoEncontrado: 'Usuário não encontrado.', idUsuarioObrigatorio: 'ID do usuário é obrigatório.', perfilAtualizado: 'Perfil atualizado!', autenticacaoNecessaria: 'Autenticação necessária.', sessaoInvalida: 'Sessão inválida ou expirada.',
    acessoNegado: 'Você não tem acesso a estes dados.', idUsuarioInvalido: 'ID de usuário inválido.', schemaStatus: 'O schema atual não permite alterar perfil ou status de contas.', naoPodeDesativarPropriaConta: 'Você não pode desativar sua própria conta de administrador.',
    semCampoValidoStatus: 'Informe ao menos um campo válido para atualizar o status.', statusUsuarioAtualizado: 'Status do usuário atualizado.', naoPodeExcluirPropriaConta: 'Você não pode excluir sua própria conta.', usuarioRemovidoSucesso: 'Usuário removido com sucesso.',
    humorObrigatorio: 'Usuário e humor são obrigatórios.', humorInvalido: 'Humor inválido.', humorRegistrado: 'Humor registrado!', registroHumorNaoEncontrado: 'Registro de humor não encontrado.', humorRemovido: 'Humor removido!',
    sonoObrigatorio: 'Usuário e horas de sono são obrigatórios.', horasSonoIntervalo: 'Horas de sono devem ser entre 0 e 24.', qualidadeIntervalo: 'Qualidade deve ser entre 1 e 5.', registroSonoNaoEncontrado: 'Registro de sono não encontrado.', sonoRemovido: 'Sono removido!',
    energiaObrigatorio: 'Usuário e nível de energia são obrigatórios.', nivelEnergiaIntervalo: 'Nível de energia deve ser entre 1 e 10.', registroEnergiaNaoEncontrado: 'Registro de energia não encontrado.', energiaRemovida: 'Energia removida!',
    tituloLembreteTamanho: 'O título deve ter entre 1 e 150 caracteres.', iconeInvalido: 'Ícone inválido.', descricaoTipoTexto: 'A descrição deve ser um texto.', descricaoTamanho: 'A descrição deve ter no máximo 1000 caracteres.',
    informeCampoAtualizar: 'Informe ao menos um campo para atualizar.', lembreteNaoEncontrado: 'Lembrete não encontrado.', lembreteAtualizado: 'Lembrete atualizado!', lembreteConcluido: 'Lembrete concluído!', lembreteReaberto: 'Lembrete reaberto!', usuarioObrigatorio: 'Usuário obrigatório.',
    tituloTamanho200: 'O título deve ter entre 1 e 200 caracteres.', usuarioTituloDatasObrigatorios: 'Usuário, título, data de início e data de fim são obrigatórios.', dataTerminoPosterior: 'A data de término deve ser posterior à data de início.',
    metaCriada: 'Meta criada com sucesso!', metaNaoEncontrada: 'Meta não encontrada.', metaAtualizada: 'Meta atualizada com sucesso!', progressoIntervalo: 'Progresso deve ser um número entre 0 e 100.', progressoAtualizado: 'Progresso atualizado com sucesso!',
    metaConcluida: 'Meta concluída!', metaRemovida: 'Meta removida com sucesso!', tarefaObrigatorio: 'Usuário e título são obrigatórios.', tarefaCriada: 'Tarefa criada com sucesso!', tarefaNaoEncontrada: 'Tarefa não encontrada.',
    tarefaConcluida: 'Tarefa concluída!', tarefaReaberta: 'Tarefa reaberta!', tarefaAtualizada: 'Tarefa atualizada com sucesso!', tarefaRemovida: 'Tarefa removida com sucesso!'
  },
  en: {
    documentTitulo: 'DailyMind - Care for your mind', heroTitulo: 'A gentle space to notice what you need.', heroDescricao: 'Track mood, sleep, energy and reminders with a gentler, clearer routine that helps your day.',
    humor: 'Mood', humorFeatureDescricao: 'Record how you feel in seconds.', sonoFeatureDescricao: 'See your rest and how it affects your rhythm.', energiaFeatureDescricao: 'Track your energy levels throughout the day.',
    recupereRitmo: 'Get back into your rhythm', combustivelHoje: 'Today’s fuel', perfilPadrao: 'Your profile, your way', nomeObrigatorio: 'Enter a name to save the profile.', campoMuitoLongo: 'One or more fields exceed the character limit.', erroImagem: 'This action could not be completed.',
    saudacao: 'Hello,', roleUsuario: 'User', metricRegistrosNumero: '+1,200', carregandoImagem: 'Loading image...', sonoResumo: 'of sleep', energiaResumo: 'of energy',
    metricRegistros: 'records', metricDias: '7 days', metricAcompanhamento: 'of tracking', metricAcolhimento: 'focused on care',
    idadePlaceholder: 'Age', ocupacaoPlaceholder: 'E.g.: Student', abrirNotificacoes: 'Open notifications', fecharNotificacoes: 'Close notifications',
    painelAdmin: 'Admin panel', painel: 'Panel', areaAdministrativa: 'Administrative area', distribuicaoHumor: 'Mood distribution', cadastrosPorMes: 'Sign-ups by month',
    relatorios: 'Reports', relatoriosDescricao: 'Engagement and usage over a date range.', filtrar: 'Filter', exportarCsv: 'Export CSV',
    buscarPlaceholder: 'Search by name or email', buscar: 'Search', colunaNome: 'Name', colunaEmail: 'Email', colunaPerfil: 'Profile', colunaStatus: 'Status', colunaAcoes: 'Actions',
    nome: 'Name', bannerPerfil: 'Profile banner', biografiaPlaceholder: 'Tell us a little about yourself...', perfilSalvo: 'Profile saved', perfilSalvoDescricao: 'Your changes were confirmed and are now in your account.', entendi: 'Got it',
    checkinEmocional: 'Emotional check-in', semRespostaCerta: 'There is no right answer. Choose what feels most like now.', sonoDescricaoModal: 'Tell us how your night went, without pressure.', energiaDescricaoModal: 'Record how energetic you really feel today.',
    noLimite: 'Running low', cheioEnergia: 'Full of energy', lembreteTituloPlaceholder: 'E.g.: Drink water', lembreteObjetoPlaceholder: 'E.g.: Keys, phone',
    humorPergunta: 'How are you?', humorEscolha: 'Choose an option to record this moment.', usuarioPadrao: 'User', manifestDescricao: 'Daily log of mood, sleep, energy, reminders and self-care.',
    cadastrosAtivos: 'active accounts', registros30Dias: 'records in 30 days', mediaSono: 'Average sleep', ultimos30Dias: 'last 30 days', mediaGeral: 'overall average',
    usuarios: 'Users', usuariosNovos: 'New users', registrosHumor: 'Mood records', engajamento: 'Engagement', atividadeRecente: 'Recent activity', semRegistrosIntervalo: 'No records in the selected period.',
    erroCarregarUsuarios: 'Users could not be loaded.', adminRole: 'Admin', ativo: 'Active', inativo: 'Inactive', desativar: 'Deactivate', ativar: 'Activate', excluir: 'Delete',
    statusAtualizado: 'Status updated.', erroAtualizarStatus: 'The status could not be updated.', confirmarExclusaoUsuario: 'Do you really want to delete this user?', usuarioRemovido: 'User removed.', erroExcluirUsuario: 'The user could not be deleted.',
    csvIndicador: 'metric', csvValor: 'value', csvUsuariosNovos: 'new_users', csvRegistrosHumor: 'mood_records', csvEngajamentoTotal: 'engagement_total', csvNomeArquivo: 'dailymind_report.csv',
    semHumorGrafico: 'No mood records saved yet.', semSonoGrafico: 'No sleep records saved yet.', semEnergiaGrafico: 'No energy records saved yet.',
    erroSalvarPerfil: 'The profile could not be saved.', acaoFalhou: 'The action could not be completed', conexaoFalhou: 'Could not connect to DailyMind.',
    offlinePendente: 'Saved on this device. We will send it when you are back online.',
    nomeTamanho: 'Name must be between 3 and 100 characters.', nomeTamanhoArtigo: 'Name must be between 3 and 100 characters.', emailInvalido: 'Invalid email.', senhaTamanho: 'Password must be between 8 and 128 characters.',
    idadeIntervalo: 'Age must be between 1 and 150.', ocupacaoTamanho: 'Occupation can have at most 100 characters.', bioTamanho: 'Bio can have at most 280 characters.', emailCadastrado: 'Email already registered.',
    emailSenhaObrigatorios: 'Email and password are required.', credenciaisInvalidas: 'Incorrect email or password.', contaDesativada: 'This account is deactivated.', loginSucesso: 'Signed in successfully!', sessaoEncerrada: 'Session closed.',
    usuarioNaoEncontrado: 'User not found.', idUsuarioObrigatorio: 'User ID is required.', perfilAtualizado: 'Profile updated!', autenticacaoNecessaria: 'Authentication required.', sessaoInvalida: 'Session invalid or expired.',
    acessoNegado: 'You do not have access to this data.', idUsuarioInvalido: 'Invalid user ID.', schemaStatus: 'The current schema does not allow changing account profiles or statuses.', naoPodeDesativarPropriaConta: 'You cannot deactivate your own admin account.',
    semCampoValidoStatus: 'Provide at least one valid field to update the status.', statusUsuarioAtualizado: 'User status updated.', naoPodeExcluirPropriaConta: 'You cannot delete your own account.', usuarioRemovidoSucesso: 'User removed successfully.',
    humorObrigatorio: 'User and mood are required.', humorInvalido: 'Invalid mood.', humorRegistrado: 'Mood recorded!', registroHumorNaoEncontrado: 'Mood record not found.', humorRemovido: 'Mood removed!',
    sonoObrigatorio: 'User and sleep hours are required.', horasSonoIntervalo: 'Sleep hours must be between 0 and 24.', qualidadeIntervalo: 'Quality must be between 1 and 5.', registroSonoNaoEncontrado: 'Sleep record not found.', sonoRemovido: 'Sleep record removed!',
    energiaObrigatorio: 'User and energy level are required.', nivelEnergiaIntervalo: 'Energy level must be between 1 and 10.', registroEnergiaNaoEncontrado: 'Energy record not found.', energiaRemovida: 'Energy record removed!',
    tituloLembreteTamanho: 'Title must be between 1 and 150 characters.', iconeInvalido: 'Invalid icon.', descricaoTipoTexto: 'Description must be text.', descricaoTamanho: 'Description can have at most 1000 characters.',
    informeCampoAtualizar: 'Provide at least one field to update.', lembreteNaoEncontrado: 'Reminder not found.', lembreteAtualizado: 'Reminder updated!', lembreteConcluido: 'Reminder completed!', lembreteReaberto: 'Reminder reopened!', usuarioObrigatorio: 'User is required.',
    tituloTamanho200: 'Title must be between 1 and 200 characters.', usuarioTituloDatasObrigatorios: 'User, title, start date and end date are required.', dataTerminoPosterior: 'The end date must be after the start date.',
    metaCriada: 'Goal created successfully!', metaNaoEncontrada: 'Goal not found.', metaAtualizada: 'Goal updated successfully!', progressoIntervalo: 'Progress must be a number between 0 and 100.', progressoAtualizado: 'Progress updated successfully!',
    metaConcluida: 'Goal completed!', metaRemovida: 'Goal removed successfully!', tarefaObrigatorio: 'User and title are required.', tarefaCriada: 'Task created successfully!', tarefaNaoEncontrada: 'Task not found.',
    tarefaConcluida: 'Task completed!', tarefaReaberta: 'Task reopened!', tarefaAtualizada: 'Task updated successfully!', tarefaRemovida: 'Task removed successfully!'
  },
  es: {
    documentTitulo: 'DailyMind - Cuida tu mente', heroTitulo: 'Un espacio ligero para descubrir lo que necesitas.', heroDescricao: 'Registra tu ánimo, sueño, energía y recordatorios con una rutina más amable, clara y útil para tu día.',
    humor: 'Ánimo', humorFeatureDescricao: 'Registra cómo te sientes en segundos.', sonoFeatureDescricao: 'Observa tu descanso y su impacto en tu ritmo.', energiaFeatureDescricao: 'Controla tu nivel de energía durante el día.',
    recupereRitmo: 'Recupera tu ritmo', combustivelHoje: 'Tu energía de hoy', perfilPadrao: 'Tu perfil, a tu manera', nomeObrigatorio: 'Introduce un nombre para guardar el perfil.', campoMuitoLongo: 'Uno o más campos superan el límite de caracteres.', erroImagem: 'No se pudo completar esta acción.',
    saudacao: 'Hola,', roleUsuario: 'Usuario', metricRegistrosNumero: '+1.200', carregandoImagem: 'Cargando imagen...', sonoResumo: 'de sueño', energiaResumo: 'de energía',
    metricRegistros: 'registros', metricDias: '7 días', metricAcompanhamento: 'de seguimiento', metricAcolhimento: 'centrado en el cuidado',
    idadePlaceholder: 'Edad', ocupacaoPlaceholder: 'Ej.: Estudiante', abrirNotificacoes: 'Abrir notificaciones', fecharNotificacoes: 'Cerrar notificaciones',
    painelAdmin: 'Panel de administración', painel: 'Panel', areaAdministrativa: 'Área administrativa', distribuicaoHumor: 'Distribución del ánimo', cadastrosPorMes: 'Registros por mes',
    relatorios: 'Informes', relatoriosDescricao: 'Compromiso y uso en un rango de fechas.', filtrar: 'Filtrar', exportarCsv: 'Exportar CSV',
    buscarPlaceholder: 'Buscar por nombre o correo electrónico', buscar: 'Buscar', colunaNome: 'Nombre', colunaEmail: 'Correo electrónico', colunaPerfil: 'Perfil', colunaStatus: 'Estado', colunaAcoes: 'Acciones',
    nome: 'Nombre', bannerPerfil: 'Banner del perfil', biografiaPlaceholder: 'Cuéntanos algo sobre ti...', perfilSalvo: 'Perfil guardado', perfilSalvoDescricao: 'Tus cambios se confirmaron y ya están en tu cuenta.', entendi: 'Entendido',
    checkinEmocional: 'Registro emocional', semRespostaCerta: 'No hay una respuesta correcta. Elige lo que encaje mejor ahora.', sonoDescricaoModal: 'Cuéntanos cómo fue tu noche, sin presión.', energiaDescricaoModal: 'Registra cómo de energía te sientes hoy.',
    noLimite: 'Al límite', cheioEnergia: 'Con energía', lembreteTituloPlaceholder: 'Ej.: Beber agua', lembreteObjetoPlaceholder: 'Ej.: Llaves, teléfono',
    humorPergunta: '¿Cómo estás?', humorEscolha: 'Elige una opción para registrar tu momento.', usuarioPadrao: 'Usuario', manifestDescricao: 'Registro diario de ánimo, sueño, energía, recordatorios y autocuidado.',
    cadastrosAtivos: 'cuentas activas', registros30Dias: 'registros en 30 días', mediaSono: 'Promedio de sueño', ultimos30Dias: 'últimos 30 días', mediaGeral: 'promedio general',
    usuarios: 'Usuarios', usuariosNovos: 'Usuarios nuevos', registrosHumor: 'Registros de ánimo', engajamento: 'Compromiso', atividadeRecente: 'Actividad reciente', semRegistrosIntervalo: 'No hay registros en el período indicado.',
    erroCarregarUsuarios: 'No se pudieron cargar los usuarios.', adminRole: 'Administrador', ativo: 'Activo', inativo: 'Inactivo', desativar: 'Desactivar', ativar: 'Activar', excluir: 'Eliminar',
    statusAtualizado: 'Estado actualizado.', erroAtualizarStatus: 'No se pudo actualizar el estado.', confirmarExclusaoUsuario: '¿Seguro que quieres eliminar este usuario?', usuarioRemovido: 'Usuario eliminado.', erroExcluirUsuario: 'No se pudo eliminar el usuario.',
    csvIndicador: 'indicador', csvValor: 'valor', csvUsuariosNovos: 'usuarios_nuevos', csvRegistrosHumor: 'registros_animo', csvEngajamentoTotal: 'compromiso_total', csvNomeArquivo: 'informe_dailymind.csv',
    semHumorGrafico: 'Aún no hay registros de ánimo.', semSonoGrafico: 'Aún no hay registros de sueño.', semEnergiaGrafico: 'Aún no hay registros de energía.',
    erroSalvarPerfil: 'No se pudo guardar el perfil.', acaoFalhou: 'No se pudo completar la acción', conexaoFalhou: 'No se pudo conectar con DailyMind.',
    offlinePendente: 'Guardado en este dispositivo. Lo enviaremos cuando haya conexión.',
    nomeTamanho: 'El nombre debe tener entre 3 y 100 caracteres.', nomeTamanhoArtigo: 'El nombre debe tener entre 3 y 100 caracteres.', emailInvalido: 'Correo electrónico no válido.', senhaTamanho: 'La contraseña debe tener entre 8 y 128 caracteres.',
    idadeIntervalo: 'La edad debe estar entre 1 y 150 años.', ocupacaoTamanho: 'La ocupación puede tener como máximo 100 caracteres.', bioTamanho: 'La biografía puede tener como máximo 280 caracteres.', emailCadastrado: 'El correo electrónico ya está registrado.',
    emailSenhaObrigatorios: 'El correo electrónico y la contraseña son obligatorios.', credenciaisInvalidas: 'Correo electrónico o contraseña incorrectos.', contaDesativada: 'Esta cuenta está desactivada.', loginSucesso: '¡Sesión iniciada correctamente!', sessaoEncerrada: 'Sesión cerrada.',
    usuarioNaoEncontrado: 'Usuario no encontrado.', idUsuarioObrigatorio: 'El ID del usuario es obligatorio.', perfilAtualizado: '¡Perfil actualizado!', autenticacaoNecessaria: 'Se requiere autenticación.', sessaoInvalida: 'Sesión no válida o caducada.',
    acessoNegado: 'No tienes acceso a estos datos.', idUsuarioInvalido: 'ID de usuario no válido.', schemaStatus: 'El esquema actual no permite cambiar perfiles ni estados de cuentas.', naoPodeDesativarPropriaConta: 'No puedes desactivar tu propia cuenta de administrador.',
    semCampoValidoStatus: 'Indica al menos un campo válido para actualizar el estado.', statusUsuarioAtualizado: 'Estado del usuario actualizado.', naoPodeExcluirPropriaConta: 'No puedes eliminar tu propia cuenta.', usuarioRemovidoSucesso: 'Usuario eliminado correctamente.',
    humorObrigatorio: 'El usuario y el ánimo son obligatorios.', humorInvalido: 'Ánimo no válido.', humorRegistrado: '¡Ánimo registrado!', registroHumorNaoEncontrado: 'No se encontró el registro de ánimo.', humorRemovido: '¡Ánimo eliminado!',
    sonoObrigatorio: 'El usuario y las horas de sueño son obligatorios.', horasSonoIntervalo: 'Las horas de sueño deben estar entre 0 y 24.', qualidadeIntervalo: 'La calidad debe estar entre 1 y 5.', registroSonoNaoEncontrado: 'No se encontró el registro de sueño.', sonoRemovido: '¡Registro de sueño eliminado!',
    energiaObrigatorio: 'El usuario y el nivel de energía son obligatorios.', nivelEnergiaIntervalo: 'El nivel de energía debe estar entre 1 y 10.', registroEnergiaNaoEncontrado: 'No se encontró el registro de energía.', energiaRemovida: '¡Registro de energía eliminado!',
    tituloLembreteTamanho: 'El título debe tener entre 1 y 150 caracteres.', iconeInvalido: 'Icono no válido.', descricaoTipoTexto: 'La descripción debe ser un texto.', descricaoTamanho: 'La descripción puede tener como máximo 1000 caracteres.',
    informeCampoAtualizar: 'Indica al menos un campo para actualizar.', lembreteNaoEncontrado: 'No se encontró el recordatorio.', lembreteAtualizado: '¡Recordatorio actualizado!', lembreteConcluido: '¡Recordatorio completado!', lembreteReaberto: '¡Recordatorio reabierto!', usuarioObrigatorio: 'El usuario es obligatorio.',
    tituloTamanho200: 'El título debe tener entre 1 y 200 caracteres.', usuarioTituloDatasObrigatorios: 'El usuario, el título, la fecha de inicio y la fecha de fin son obligatorios.', dataTerminoPosterior: 'La fecha de fin debe ser posterior a la fecha de inicio.',
    metaCriada: '¡Meta creada correctamente!', metaNaoEncontrada: 'No se encontró la meta.', metaAtualizada: '¡Meta actualizada correctamente!', progressoIntervalo: 'El progreso debe ser un número entre 0 y 100.', progressoAtualizado: '¡Progreso actualizado correctamente!',
    metaConcluida: '¡Meta completada!', metaRemovida: '¡Meta eliminada correctamente!', tarefaObrigatorio: 'El usuario y el título son obligatorios.', tarefaCriada: '¡Tarea creada correctamente!', tarefaNaoEncontrada: 'No se encontró la tarea.',
    tarefaConcluida: '¡Tarea completada!', tarefaReaberta: '¡Tarea reabierta!', tarefaAtualizada: '¡Tarea actualizada correctamente!', tarefaRemovida: '¡Tarea eliminada correctamente!'
  }
}

Object.keys(traducoesComplementares).forEach(idioma => {
  Object.assign(traducoes[idioma], traducoesComplementares[idioma])
})

const traducoesHumor = {
  'pt-BR': {
    '😊': { nome: 'Feliz', descricao: 'Tem algo bom brilhando por aí. Aproveite no seu ritmo.' }, '😔': { nome: 'Triste', descricao: 'Tudo bem desacelerar e acolher o que você está sentindo.' }, '😰': { nome: 'Ansioso', descricao: 'Vamos por partes. Um respiro pequeno também é progresso.' }, '😫': { nome: 'Cansado', descricao: 'Seu corpo está pedindo cuidado. Faça o próximo passo possível.' }, '😤': { nome: 'Irritado', descricao: 'Você pode dar espaço para esse sentimento sem se cobrar.' }, '😐': { nome: 'Neutro', descricao: 'Um momento estável também merece ser percebido.' }
  },
  en: {
    '😊': { nome: 'Happy', descricao: 'Something good is shining through. Enjoy it at your pace.' }, '😔': { nome: 'Sad', descricao: 'It is okay to slow down and welcome what you feel.' }, '😰': { nome: 'Anxious', descricao: 'One step at a time. A small breath is progress too.' }, '😫': { nome: 'Tired', descricao: 'Your body is asking for care. Take the next possible step.' }, '😤': { nome: 'Irritated', descricao: 'You can make room for this feeling without judging yourself.' }, '😐': { nome: 'Neutral', descricao: 'A steady moment is worth noticing too.' }
  },
  es: {
    '😊': { nome: 'Feliz', descricao: 'Hay algo bueno brillando. Disfrútalo a tu ritmo.' }, '😔': { nome: 'Triste', descricao: 'Está bien bajar el ritmo y acoger lo que sientes.' }, '😰': { nome: 'Ansioso', descricao: 'Un paso a la vez. Un pequeño respiro también es progreso.' }, '😫': { nome: 'Cansado', descricao: 'Tu cuerpo pide cuidado. Da el siguiente paso posible.' }, '😤': { nome: 'Irritado', descricao: 'Puedes dar espacio a este sentimiento sin juzgarte.' }, '😐': { nome: 'Neutro', descricao: 'Un momento estable también merece ser observado.' }
  }
}

const traducoesSugestoes = {
  'Continue assim!': {
    en: ['Keep going!', 'It is great that you are feeling well. Enjoy your day at your own pace.'],
    es: ['¡Sigue así!', 'Qué bueno que te sientas bien. Disfruta el día a tu ritmo.']
  },
  'Compartilhe sua alegria': {
    en: ['Share your joy', 'Call a friend or family member and share this good energy.'],
    es: ['Comparte tu alegría', 'Llama a una persona querida y comparte esa buena energía.']
  },
  'Tomar um chá quente': {
    en: ['Have a warm tea', 'Chamomile or lemon balm tea can bring comfort right now.'],
    es: ['Toma un té caliente', 'Un té de manzanilla puede darte un poco de calma y consuelo.']
  },
  'Ouvir música relaxante': {
    en: ['Listen to relaxing music', 'Choose a gentle playlist and let the music slow things down.'],
    es: ['Escucha música relajante', 'Elige una lista tranquila y deja que la música te ayude a bajar el ritmo.']
  },
  'Meditar por cinco minutos': {
    en: ['Meditate for five minutes', 'Close your eyes, breathe deeply and notice your breathing.'],
    es: ['Medita durante cinco minutos', 'Cierra los ojos, respira profundo y observa tu respiración.']
  },
  'Meditar por 5 minutos': {
    en: ['Meditate for five minutes', 'Close your eyes, breathe deeply and focus on your breathing for five minutes.'],
    es: ['Medita durante cinco minutos', 'Cierra los ojos, respira profundo y céntrate en tu respiración durante cinco minutos.']
  },
  'Praticar respiração 4-7-8': {
    en: ['Try 4-7-8 breathing', 'Inhale for 4 seconds, hold for 7 and exhale for 8.'],
    es: ['Practica la respiración 4-7-8', 'Inhala 4 segundos, mantén 7 y exhale 8.']
  },
  'Fazer uma pausa': {
    en: ['Take a break', 'Get some fresh air or take a short walk.'],
    es: ['Haz una pausa', 'Respira aire fresco o da un paseo corto.']
  },
  'Alongar o corpo': {
    en: ['Stretch your body', 'Try a few simple stretches to relax your muscles.'],
    es: ['Estira el cuerpo', 'Haz algunos estiramientos sencillos para relajar los músculos.']
  },
  'Escrever seus sentimentos': {
    en: ['Write about your feelings', 'Writing can help you organize your thoughts.'],
    es: ['Escribe lo que sientes', 'Escribir puede ayudarte a ordenar tus pensamientos.']
  },
  'Tomar um banho relaxante': {
    en: ['Take a relaxing shower', 'A warm shower can help calm your mind and body.'],
    es: ['Date una ducha relajante', 'Una ducha tibia puede ayudar a calmar tu mente y tu cuerpo.']
  },
  'Planejar o restante do dia': {
    en: ['Plan the rest of your day', 'Organize your next activities into small, possible steps.'],
    es: ['Planifica el resto del día', 'Organiza tus próximas actividades en pasos pequeños y posibles.']
  },
  'Planejar o resto do dia': {
    en: ['Plan the rest of your day', 'Organize your next activities into small, possible steps.'],
    es: ['Planifica el resto del día', 'Organiza tus próximas actividades en pasos pequeños y posibles.']
  },
  'Beber água': {
    en: ['Drink water', 'Staying hydrated supports your body throughout the day.'],
    es: ['Bebe agua', 'Mantenerte hidratado ayuda al funcionamiento de tu cuerpo.']
  },
  'Guardar um momento bom': {
    en: ['Save a good moment', 'Write down one simple thing that made your day better.'],
    es: ['Guarda un buen momento', 'Anota algo sencillo que haya mejorado tu día.']
  },
  'Fazer algo que dá prazer': {
    en: ['Do something enjoyable', 'Set aside a few minutes for an activity you like.'],
    es: ['Haz algo que disfrutes', 'Reserva unos minutos para una actividad que te guste.']
  },
  'Mandar uma mensagem simples': {
    en: ['Send a simple message', 'Write to someone you trust and say how you are feeling.'],
    es: ['Envía un mensaje sencillo', 'Escribe a alguien de confianza y cuéntale cómo te sientes.']
  },
  'Escolher um cuidado possível': {
    en: ['Choose one possible kindness', 'Pick one small, gentle thing you can do for yourself now.'],
    es: ['Elige un cuidado posible', 'Escoge algo pequeño y amable que puedas hacer por ti ahora.']
  },
  'Reduzir os estímulos por alguns minutos': {
    en: ['Reduce stimuli for a few minutes', 'If you can, choose a quieter place or more comfortable lighting.'],
    es: ['Reduce los estímulos unos minutos', 'Si puedes, elige un lugar más silencioso o una luz más cómoda.']
  },
  'Escolher um ponto de conforto': {
    en: ['Choose a comfort point', 'Adjust one thing around you to make this moment more manageable.'],
    es: ['Elige un punto de confort', 'Ajusta algo a tu alrededor para que este momento sea más llevadero.']
  },
  'Usar um apoio sensorial conhecido': {
    en: ['Use a familiar sensory support', 'If you know something helps, try that resource at your own pace.'],
    es: ['Usa un apoyo sensorial conocido', 'Si sabes que algo ayuda, prueba ese recurso a tu ritmo.']
  },
  'Dividir o próximo passo': {
    en: ['Break down the next step', 'Choose one small action for now. The rest can wait.'],
    es: ['Divide el siguiente paso', 'Elige una acción pequeña para ahora. Lo demás puede esperar.']
  },
  'Escolher uma tarefa essencial': {
    en: ['Choose one essential task', 'Set one possible priority and leave the rest for later.'],
    es: ['Elige una tarea esencial', 'Define una prioridad posible y deja lo demás para después.']
  },
  'Descansar sem culpa': {
    en: ['Rest without guilt', 'Take a real break, even if it is only for a few minutes.'],
    es: ['Descansa sin culpa', 'Haz una pausa real, aunque solo sean unos minutos.']
  },
  'Afastar-se do estímulo': {
    en: ['Step away from the stimulus', 'If you can, change rooms for a few minutes before deciding what to do.'],
    es: ['Aléjate del estímulo', 'Si puedes, cambia de ambiente unos minutos antes de decidir qué hacer.']
  },
  'Escrever o que precisa mudar': {
    en: ['Write what needs to change', 'Put down what bothered you and choose only the next step.'],
    es: ['Escribe lo que debe cambiar', 'Anota lo que te molestó y elige solo el siguiente paso.']
  },
  'Escolher uma prioridade pequena': {
    en: ['Choose a small priority', 'Pick a short task to give the rest of your day some direction.'],
    es: ['Elige una prioridad pequeña', 'Escoge una tarea breve para orientar el resto del día.']
  },
  'Observar como seu corpo está': {
    en: ['Notice how your body feels', 'Observe your breathing, tension and energy without needing to change anything.'],
    es: ['Observa cómo está tu cuerpo', 'Nota tu respiración, tensión y energía sin tener que cambiar nada.']
  }
}

const mensagensApi = {
  'Nome deve ter entre 3 e 100 caracteres.': 'nomeTamanho',
  'O nome deve ter entre 3 e 100 caracteres.': 'nomeTamanhoArtigo',
  'E-mail inválido.': 'emailInvalido',
  'A senha deve ter entre 8 e 128 caracteres.': 'senhaTamanho',
  'A idade deve estar entre 1 e 150 anos.': 'idadeIntervalo',
  'A ocupação pode ter no máximo 100 caracteres.': 'ocupacaoTamanho',
  'A biografia pode ter no máximo 280 caracteres.': 'bioTamanho',
  'E-mail já cadastrado.': 'emailCadastrado',
  'E-mail e senha são obrigatórios.': 'emailSenhaObrigatorios',
  'E-mail ou senha incorretos.': 'credenciaisInvalidas',
  'Esta conta está desativada.': 'contaDesativada',
  'Esta conta foi desativada.': 'contaDesativada',
  'Conta criada com sucesso!': 'contaCriada',
  'Login realizado com sucesso!': 'loginSucesso',
  'Sessão encerrada.': 'sessaoEncerrada',
  'Usuário não encontrado.': 'usuarioNaoEncontrado',
  'ID do usuário é obrigatório.': 'idUsuarioObrigatorio',
  'Perfil atualizado!': 'perfilAtualizado',
  'Autenticação necessária.': 'autenticacaoNecessaria',
  'Sessão inválida ou expirada.': 'sessaoInvalida',
  'Você não tem acesso a estes dados.': 'acessoNegado',
  'ID de usuário inválido.': 'idUsuarioInvalido',
  'O schema atual não permite alterar perfil ou status de contas.': 'schemaStatus',
  'Você não pode desativar sua própria conta de administrador.': 'naoPodeDesativarPropriaConta',
  'Informe ao menos um campo válido para atualizar o status.': 'semCampoValidoStatus',
  'Status do usuário atualizado.': 'statusUsuarioAtualizado',
  'Você não pode excluir sua própria conta.': 'naoPodeExcluirPropriaConta',
  'Usuário removido com sucesso.': 'usuarioRemovidoSucesso',
  'Usuário e humor são obrigatórios.': 'humorObrigatorio',
  'Humor inválido.': 'humorInvalido',
  'Humor atualizado!': 'humorAtualizado',
  'Humor registrado!': 'humorRegistrado',
  'Registro de humor não encontrado.': 'registroHumorNaoEncontrado',
  'Humor removido!': 'humorRemovido',
  'Usuário e horas de sono são obrigatórios.': 'sonoObrigatorio',
  'Horas de sono devem ser entre 0 e 24.': 'horasSonoIntervalo',
  'Qualidade deve ser entre 1 e 5.': 'qualidadeIntervalo',
  'Sono atualizado!': 'sonoAtualizado',
  'Sono registrado!': 'sonoRegistrado',
  'Registro de sono não encontrado.': 'registroSonoNaoEncontrado',
  'Sono removido!': 'sonoRemovido',
  'Usuário e nível de energia são obrigatórios.': 'energiaObrigatorio',
  'Nível de energia deve ser entre 1 e 10.': 'nivelEnergiaIntervalo',
  'Energia atualizada!': 'energiaAtualizada',
  'Energia registrada!': 'energiaRegistrada',
  'Registro de energia não encontrado.': 'registroEnergiaNaoEncontrado',
  'Energia removida!': 'energiaRemovida',
  'O título deve ter entre 1 e 150 caracteres.': 'tituloLembreteTamanho',
  'Ícone inválido.': 'iconeInvalido',
  'A descrição deve ser um texto.': 'descricaoTipoTexto',
  'A descrição deve ter no máximo 1000 caracteres.': 'descricaoTamanho',
  'Informe ao menos um campo para atualizar.': 'informeCampoAtualizar',
  'Lembrete não encontrado.': 'lembreteNaoEncontrado',
  'Lembrete criado!': 'lembreteCriado',
  'Lembrete atualizado!': 'lembreteAtualizado',
  'Lembrete concluído!': 'lembreteConcluido',
  'Lembrete reaberto!': 'lembreteReaberto',
  'Lembrete removido!': 'lembreteRemovido',
  'Usuário obrigatório.': 'usuarioObrigatorio',
  'O título deve ter entre 1 e 200 caracteres.': 'tituloTamanho200',
  'Usuário e título são obrigatórios.': 'tarefaObrigatorio',
  'Usuário, título, data de início e data de fim são obrigatórios.': 'usuarioTituloDatasObrigatorios',
  'A data de término deve ser posterior à data de início.': 'dataTerminoPosterior',
  'Meta criada com sucesso!': 'metaCriada',
  'Meta não encontrada.': 'metaNaoEncontrada',
  'Meta atualizada com sucesso!': 'metaAtualizada',
  'Progresso deve ser um número entre 0 e 100.': 'progressoIntervalo',
  'Progresso atualizado com sucesso!': 'progressoAtualizado',
  'Meta concluída!': 'metaConcluida',
  'Meta removida com sucesso!': 'metaRemovida',
  'Tarefa criada com sucesso!': 'tarefaCriada',
  'Tarefa não encontrada.': 'tarefaNaoEncontrada',
  'Tarefa concluída!': 'tarefaConcluida',
  'Tarefa reaberta!': 'tarefaReaberta',
  'Tarefa reaberida!': 'tarefaReaberta',
  'Tarefa atualizada com sucesso!': 'tarefaAtualizada',
  'Tarefa removida com sucesso!': 'tarefaRemovida',
  'Registro salvo neste dispositivo. Enviaremos quando houver conexão.': 'offlinePendente',
  'Saved on this device. We will send it when you are back online.': 'offlinePendente',
  'Guardado en este dispositivo. Lo enviaremos cuando haya conexión.': 'offlinePendente'
}

function traduzirMensagemApi(mensagem, falha = false) {
  if (!mensagem) return mensagem
  const chave = mensagensApi[mensagem]
  if (chave) return t(chave)
  return falha && configuracoes.idioma !== 'pt-BR' ? t('acaoFalhou') : mensagem
}

function t(chave, fallback = chave) {
  const idioma = traducoes[configuracoes.idioma] || traducoes['pt-BR']
  return idioma[chave] || traducoes['pt-BR'][chave] || fallback
}

function traduzirSugestao(sugestao) {
  const traducao = traducoesSugestoes[sugestao.titulo]?.[configuracoes.idioma]
  return traducao ? { titulo: traducao[0], descricao: traducao[1] } : { titulo: sugestao.titulo, descricao: sugestao.descricao }
}

// ==================== UTILITÁRIOS ====================

function exibirToast(mensagem, tipo = 'sucesso') {
  const toast = document.getElementById('toast')
  toast.textContent = mensagem
  toast.className = `fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 z-50 ${tipo === 'sucesso' ? 'bg-mint-500' : 'bg-red-500'}`
  toast.classList.remove('hidden')
  setTimeout(() => toast.classList.add('hidden'), 3000)
}

function escaparHtml(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caractere])
}

async function api(metodo, endpoint, dados = null) {
  const opcoes = {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  }
  if (dados) opcoes.body = JSON.stringify(dados)
  try {
    const resposta = await fetch(`${URL_API}${endpoint}`, opcoes)
    const texto = await resposta.text()
    let resultado = {}
    try {
      resultado = texto ? JSON.parse(texto) : {}
    } catch (erro) {
      resultado = {}
    }
    if (!resposta.ok) {
      if (resposta.status === 401 && usuarioAtual && !['/usuarios/login', '/usuarios/cadastro', '/usuarios/sessao', '/usuarios/logout'].includes(endpoint)) {
        limparSessaoLocal()
        exibirToast(t('erroSessao'), 'erro')
      }
      return { sucesso: false, status: resposta.status, mensagem: traduzirMensagemApi(resultado.mensagem, true) || `${t('acaoFalhou')} (${resposta.status}).` }
    }
    return resultado.mensagem
      ? { ...resultado, mensagem: traduzirMensagemApi(resultado.mensagem, resultado.sucesso === false) }
      : resultado
  } catch (erro) {
    return { sucesso: false, mensagem: t('conexaoFalhou') }
  }
}

// ==================== AUTENTICAÇÃO ====================

function mostrarLogin() {
  document.getElementById('form-login').classList.remove('hidden')
  document.getElementById('form-cadastro').classList.add('hidden')
}

function mostrarCadastro() {
  document.getElementById('form-login').classList.add('hidden')
  document.getElementById('form-cadastro').classList.remove('hidden')
}

// Login
document.getElementById('form-login').querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('login-email').value.trim()
  const senha = document.getElementById('login-senha').value

  const resultado = await api('POST', '/usuarios/login', { email, senha })

  if (resultado.sucesso) {
    sessaoPerfil += 1
    usuarioAtual = resultado.usuario
    exibirToast(`${t('bemVindo')}, ${usuarioAtual.nome}! 🧠`)
    entrarApp()
  } else {
    exibirToast(resultado.mensagem, 'erro')
  }
})

// Cadastro
document.getElementById('form-cadastro').querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const nome = document.getElementById('cadastro-nome').value.trim()
  const email = document.getElementById('cadastro-email').value.trim()
  const senha = document.getElementById('cadastro-senha').value
  const idade = document.getElementById('cadastro-idade').value
  const ocupacao = document.getElementById('cadastro-ocupacao').value.trim()

  const dados = { nome, email, senha }
  if (idade) dados.idade = parseInt(idade)
  if (ocupacao) dados.ocupacao = ocupacao

  const resultado = await api('POST', '/usuarios/cadastro', dados)

  if (resultado.sucesso) {
    sessaoPerfil += 1
    usuarioAtual = resultado.usuario
    exibirToast(`${t('contaCriada')} 🎉`)
    entrarApp()
  } else {
    exibirToast(resultado.mensagem, 'erro')
  }
})

function limparSessaoLocal() {
  sessaoPerfil += 1
  usuarioAtual = null
  perfilAlteradoLocalmente = false
  imagensPerfilCarregando = 0
  limparImagensPerfil()
  pararAtualizacaoSugestoes()
  fecharNotificacoes()
  const navAdmin = document.getElementById('nav-admin')
  if (navAdmin) navAdmin.classList.add('hidden')
  ;['tela-dashboard', 'tela-graficos', 'tela-lembretes', 'tela-perfil', 'tela-configuracoes', 'tela-admin'].forEach((id) => {
    const elemento = document.getElementById(id)
    if (elemento) elemento.classList.add('hidden')
  })
  document.getElementById('tela-auth').classList.remove('hidden')
  document.getElementById('form-login').querySelector('form').reset()
  mostrarLogin()
}

async function fazerLogout() {
  await api('POST', '/usuarios/logout')
  limparSessaoLocal()
}

function atualizarInterfaceAdmin() {
  const navAdmin = document.getElementById('nav-admin')
  if (!navAdmin) return
  navAdmin.classList.toggle('hidden', !(usuarioAtual && usuarioAtual.role === 'admin'))
}

function entrarApp() {
  document.getElementById('tela-auth').classList.add('hidden')
  document.getElementById('tela-dashboard').classList.remove('hidden')
  document.getElementById('nome-usuario').textContent = usuarioAtual.nome
  document.getElementById('inicial-usuario').textContent = usuarioAtual.nome.charAt(0).toUpperCase()
  atualizarInterfaceAdmin()
  atualizarPreviaPerfil()
  iniciarAtualizacaoSugestoes()
  carregarPerfil()
  carregarDados()
}

// ==================== NAVEGAÇÃO ====================

function mostrarTela(tela) {
  const telas = ['dashboard', 'graficos', 'lembretes', 'perfil', 'configuracoes', 'admin']
  telas.forEach((nome) => {
    const elemento = document.getElementById(`tela-${nome}`)
    if (elemento) elemento.classList.add('hidden')
  })

  const alvo = document.getElementById(`tela-${tela}`)
  if (alvo) alvo.classList.remove('hidden')

  if (tela === 'graficos') carregarGraficos()
  if (tela === 'lembretes') carregarTodosLembretes()
  if (tela === 'perfil') carregarPerfil()
  if (tela === 'configuracoes') carregarConfiguracoesTela()
  if (tela === 'admin') carregarPainelAdmin()
}

function mostrarPerfil() {
  mostrarTela('perfil')
}

const adminState = {
  pagina: 1,
  limite: 8,
  pesquisa: '',
  inicio: '',
  fim: ''
}

function formatarNumero(valor) {
  return Number(valor || 0).toLocaleString(configuracoes.idioma)
}

function formatarMes(mes) {
  const texto = String(mes || '')
  if (!/^\d{4}-\d{2}$/.test(texto)) return texto
  return new Date(`${texto}-01T12:00:00`).toLocaleDateString(configuracoes.idioma, { month: 'short', year: '2-digit' })
}

async function carregarPainelAdmin() {
  if (!usuarioAtual || usuarioAtual.role !== 'admin') {
    mostrarTela('dashboard')
    return
  }

  try {
    const [metricas, relatorios] = await Promise.all([
      api('GET', '/admin/dashboard/metricas'),
      api('GET', '/admin/relatorios')
    ])

    if (metricas.sucesso && metricas.dados) {
      const container = document.getElementById('admin-metricas')
      const dados = metricas.dados
      container.innerHTML = `
        <div class="admin-metric-card">
          <span class="label">${t('usuarios')}</span>
          <span class="valor">${formatarNumero(dados.usuarios)}</span>
          <span class="subvalor">${t('cadastrosAtivos')}</span>
        </div>
        <div class="admin-metric-card">
          <span class="label">${t('humor')}</span>
          <span class="valor">${formatarNumero(dados.humor_30_dias)}</span>
          <span class="subvalor">${t('registros30Dias')}</span>
        </div>
        <div class="admin-metric-card">
          <span class="label">${t('mediaSono')}</span>
          <span class="valor">${Number(dados.media_sono || 0).toFixed(1)}h</span>
          <span class="subvalor">${t('ultimos30Dias')}</span>
        </div>
        <div class="admin-metric-card">
          <span class="label">${t('energia')}</span>
          <span class="valor">${Number(dados.media_energia || 0).toFixed(1)}/10</span>
          <span class="subvalor">${t('mediaGeral')}</span>
        </div>
      `
    }

    if (relatorios.sucesso && relatorios.dados) {
      document.getElementById('admin-data-inicio').value = relatorios.dados.periodo.inicio
      document.getElementById('admin-data-fim').value = relatorios.dados.periodo.fim
      renderizarRelatoriosAdmin(relatorios.dados)
    }

    await carregarUsuariosAdmin()
    renderizarGraficosAdmin(relatorios.sucesso ? relatorios.dados : null)
  } catch (erro) {
    console.error('Erro ao carregar painel admin:', erro)
  }
}

function renderizarGraficosAdmin(dados) {
  if (!dados) return

  const humorCanvas = document.getElementById('grafico-admin-humor')
  const usuariosCanvas = document.getElementById('grafico-admin-usuarios')

  if (!humorCanvas || !usuariosCanvas || typeof Chart === 'undefined') return

  const humorDistribuicao = (dados.distribuicao_humor || []).map(item => ({
    label: item.emoji,
    value: Number(item.total || 0)
  }))

  const usuariosMes = (dados.usuarios_por_mes || []).map(item => ({
    label: formatarMes(item.mes),
    value: Number(item.total || 0)
  }))

  if (window.graficoAdminHumor) window.graficoAdminHumor.destroy()
  if (window.graficoAdminUsuarios) window.graficoAdminUsuarios.destroy()

  window.graficoAdminHumor = new Chart(humorCanvas, {
    type: 'doughnut',
    data: {
      labels: humorDistribuicao.map(item => item.label),
      datasets: [{
        data: humorDistribuicao.map(item => item.value),
        backgroundColor: ['#34d399', '#a78bfa', '#fbbf24', '#f97316', '#f87171', '#60a5fa']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  })

  window.graficoAdminUsuarios = new Chart(usuariosCanvas, {
    type: 'bar',
    data: {
      labels: usuariosMes.map(item => item.label),
      datasets: [{
        label: t('usuarios'),
        data: usuariosMes.map(item => item.value),
        borderRadius: 8,
        backgroundColor: '#8b5cf6'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  })
}

function renderizarRelatoriosAdmin(dados) {
  const container = document.getElementById('admin-relatorios')
  if (!container || !dados) return

  const linhas = (dados.engajamento_diario || []).slice(0, 7).map(item => `
    <div class="flex items-center justify-between border-b border-gray-200 py-2">
      <span class="font-medium text-gray-700">${formatarData(item.dia)}</span>
      <span class="text-sm text-gray-500">${formatarNumero(item.total || 0)} ${t('metricRegistros')}</span>
    </div>
  `).join('')

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="rounded-xl bg-violet-50 p-3">
        <p class="text-xs uppercase tracking-wider text-violet-700 font-bold">${t('usuariosNovos')}</p>
        <p class="text-2xl font-black text-violet-900 mt-1">${formatarNumero(dados.usuarios_novos)}</p>
      </div>
      <div class="rounded-xl bg-mint-50 p-3">
        <p class="text-xs uppercase tracking-wider text-mint-700 font-bold">${t('registrosHumor')}</p>
        <p class="text-2xl font-black text-mint-900 mt-1">${formatarNumero(dados.registros_humor)}</p>
      </div>
      <div class="rounded-xl bg-orange-50 p-3">
        <p class="text-xs uppercase tracking-wider text-orange-700 font-bold">${t('engajamento')}</p>
        <p class="text-2xl font-black text-orange-900 mt-1">${formatarNumero((dados.engajamento_diario || []).reduce((total, item) => total + Number(item.total || 0), 0))}</p>
      </div>
    </div>
    <div class="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
      <h3 class="font-bold text-gray-800 mb-3">${t('atividadeRecente')}</h3>
      ${linhas || `<p class="text-sm text-gray-500">${t('semRegistrosIntervalo')}</p>`}
    </div>
  `
}

async function carregarUsuariosAdmin() {
  const pesquisa = encodeURIComponent(adminState.pesquisa)
  const inicio = adminState.inicio ? `&inicio=${encodeURIComponent(adminState.inicio)}` : ''
  const fim = adminState.fim ? `&fim=${encodeURIComponent(adminState.fim)}` : ''
  const resultado = await api('GET', `/admin/usuarios?page=${adminState.pagina}&limit=${adminState.limite}&search=${pesquisa}${inicio}${fim}`)
  const tabela = document.getElementById('admin-usuarios-tabela')
  const paginacao = document.getElementById('admin-paginacao')

  if (!resultado.sucesso || !Array.isArray(resultado.dados)) {
    tabela.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-gray-500">${t('erroCarregarUsuarios')}</td></tr>`
    return
  }

  tabela.innerHTML = resultado.dados.map((usuario) => `
    <tr class="border-t border-gray-100">
      <td class="px-4 py-3 font-medium text-gray-800">${escaparHtml(usuario.nome)}</td>
      <td class="px-4 py-3 text-gray-600">${escaparHtml(usuario.email)}</td>
      <td class="px-4 py-3"><span class="rounded-full px-2 py-1 text-xs font-semibold ${usuario.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700'}">${usuario.role === 'admin' ? t('adminRole') : t('roleUsuario')}</span></td>
      <td class="px-4 py-3"><span class="rounded-full px-2 py-1 text-xs font-semibold ${usuario.ativo ? 'bg-mint-100 text-mint-700' : 'bg-red-100 text-red-700'}">${usuario.ativo ? t('ativo') : t('inativo')}</span></td>
      <td class="px-4 py-3">
        <div class="flex gap-2">
          <button type="button" data-usuario-id="${usuario.id}" data-usuario-ativo="${usuario.ativo ? 0 : 1}" class="toggle-usuario btn-status rounded-lg px-2 py-1 text-xs font-semibold bg-gray-900 text-white">${usuario.ativo ? t('desativar') : t('ativar')}</button>
          <button type="button" data-usuario-id="${usuario.id}" class="delete-usuario rounded-lg px-2 py-1 text-xs font-semibold bg-red-100 text-red-700">${t('excluir')}</button>
        </div>
      </td>
    </tr>
  `).join('')

  paginacao.innerHTML = Array.from({ length: Math.max(1, Math.ceil(resultado.total / resultado.limite)) }, (_, indice) => {
    const pagina = indice + 1
    return `<button type="button" data-pagina="${pagina}" class="rounded-lg px-3 py-1.5 text-sm font-semibold ${adminState.pagina === pagina ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}">${pagina}</button>`
  }).join('')

  paginacao.querySelectorAll('button[data-pagina]').forEach(botao => {
    botao.addEventListener('click', () => {
      adminState.pagina = Number(botao.dataset.pagina)
      carregarUsuariosAdmin()
    })
  })

  document.querySelectorAll('.toggle-usuario').forEach(botao => {
    botao.addEventListener('click', async () => {
      const id = Number(botao.dataset.usuarioId)
      const ativo = Number(botao.dataset.usuarioAtivo) === 1
      const resposta = await api('PUT', `/admin/usuarios/${id}/status`, { ativo })
      if (resposta.sucesso) {
        exibirToast(resposta.mensagem || t('statusAtualizado'))
        carregarPainelAdmin()
      } else {
        exibirToast(resposta.mensagem || t('erroAtualizarStatus'), 'erro')
      }
    })
  })

  document.querySelectorAll('.delete-usuario').forEach(botao => {
    botao.addEventListener('click', async () => {
      const id = Number(botao.dataset.usuarioId)
      if (!confirm(t('confirmarExclusaoUsuario'))) return
      const resposta = await api('DELETE', `/admin/usuarios/${id}`)
      if (resposta.sucesso) {
        exibirToast(resposta.mensagem || t('usuarioRemovido'))
        carregarPainelAdmin()
      } else {
        exibirToast(resposta.mensagem || t('erroExcluirUsuario'), 'erro')
      }
    })
  })
}

async function aplicarFiltroAdmin() {
  adminState.inicio = document.getElementById('admin-data-inicio').value
  adminState.fim = document.getElementById('admin-data-fim').value
  adminState.pagina = 1

  const resultado = await api('GET', `/admin/relatorios?inicio=${encodeURIComponent(adminState.inicio)}&fim=${encodeURIComponent(adminState.fim)}`)
  if (resultado.sucesso && resultado.dados) {
    renderizarRelatoriosAdmin(resultado.dados)
    renderizarGraficosAdmin(resultado.dados)
  }
}

function exportarRelatorioCsv() {
  const tabela = document.getElementById('admin-relatorios')
  if (!tabela) return

  const linhas = [
    `${t('csvIndicador')},${t('csvValor')}`,
    `${t('csvUsuariosNovos')},${tabela.dataset.usuariosNovos || 0}`,
    `${t('csvRegistrosHumor')},${tabela.dataset.registrosHumor || 0}`,
    `${t('csvEngajamentoTotal')},${tabela.dataset.engajamentoTotal || 0}`
  ]

  const blob = new Blob([linhas.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = t('csvNomeArquivo')
  link.click()
  URL.revokeObjectURL(url)
}

function lerConfiguracoes() {
  let resultado = { ...configuracoes }
  try {
    const salvas = JSON.parse(localStorage.getItem('dailymind_configuracoes') || '{}')
    resultado = { ...resultado, ...salvas }
  } catch (erro) {}
  if (!traducoes[resultado.idioma]) resultado.idioma = configuracoes.idioma
  try {
    const url = new URL(window.location.href)
    const idiomaUrl = url.searchParams.get('lang')
    if (traducoes[idiomaUrl]) {
      resultado.idioma = idiomaUrl
      localStorage.setItem('dailymind_configuracoes', JSON.stringify(resultado))
      url.searchParams.delete('lang')
      window.history.replaceState({}, '', url)
    }
  } catch (erro) {}
  return resultado
}

let manifestOriginal = null
let urlManifestTraduzido = null

// O manifesto traduzido é servido por uma URL blob:, e URLs relativas dentro dele
// seriam resolvidas contra essa URL blob: (inválida). Por isso, todos os caminhos
// são convertidos em URLs absolutas com base na URL do manifesto original.
function absolutizarUrlsManifest(manifest, urlBase) {
  const absoluta = caminho => (typeof caminho === 'string' ? new URL(caminho, urlBase).href : caminho)
  return {
    ...manifest,
    id: absoluta(manifest.id),
    start_url: absoluta(manifest.start_url),
    scope: absoluta(manifest.scope),
    icons: Array.isArray(manifest.icons)
      ? manifest.icons.map(icone => ({ ...icone, src: absoluta(icone.src) }))
      : manifest.icons
  }
}

async function atualizarManifestIdioma() {
  const link = document.querySelector('link[rel="manifest"]')
  if (!link) return
  if (!manifestOriginal) {
    try {
      const urlManifest = link.href
      const resposta = await fetch(urlManifest)
      if (!resposta.ok) return
      manifestOriginal = absolutizarUrlsManifest(await resposta.json(), urlManifest)
    } catch (_) {
      return
    }
  }
  const manifest = {
    ...manifestOriginal,
    lang: configuracoes.idioma,
    name: t('documentTitulo'),
    description: t('manifestDescricao')
  }
  const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' })
  const url = URL.createObjectURL(blob)
  link.href = url
  if (urlManifestTraduzido) URL.revokeObjectURL(urlManifestTraduzido)
  urlManifestTraduzido = url
}

function traduzirInterface() {
  document.querySelectorAll('[data-i18n]').forEach(elemento => {
    const texto = t(elemento.dataset.i18n, elemento.textContent)
    if (texto) elemento.textContent = texto
  })
  document.querySelectorAll('[data-i18n-aria]').forEach(elemento => {
    const texto = t(elemento.dataset.i18nAria, elemento.getAttribute('aria-label') || '')
    if (texto) elemento.setAttribute('aria-label', texto)
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach(elemento => {
    const texto = t(elemento.dataset.i18nPlaceholder, elemento.placeholder)
    if (texto) elemento.placeholder = texto
  })
  document.querySelectorAll('[data-i18n-title]').forEach(elemento => {
    const texto = t(elemento.dataset.i18nTitle, elemento.title)
    if (texto) elemento.title = texto
  })
  document.querySelectorAll('.mood-option').forEach(botao => {
    const traducao = traducoesHumor[configuracoes.idioma]?.[botao.dataset.humor]
    if (traducao) {
      botao.querySelector('span:last-child').textContent = traducao.nome
      botao.setAttribute('aria-label', traducao.nome)
    }
  })
  const modalSono = document.getElementById('modal-sono')
  if (modalSono && !modalSono.classList.contains('hidden')) {
    document.getElementById('modal-sono-titulo').textContent = registroSonoEditando
      ? `${t('editar')} ${t('sono').toLowerCase()}`
      : t('horasSono')
    document.getElementById('btn-salvar-sono').textContent = registroSonoEditando ? t('salvarAlteracoes') : t('confirmar')
  }
  const modalEnergia = document.getElementById('modal-energia')
  if (modalEnergia && !modalEnergia.classList.contains('hidden')) {
    document.getElementById('modal-energia-titulo').textContent = registroEnergiaEditando
      ? `${t('editar')} ${t('energia').toLowerCase()}`
      : t('nivelEnergia')
    document.getElementById('btn-salvar-energia').textContent = registroEnergiaEditando ? t('salvarAlteracoes') : t('confirmar')
  }
  document.documentElement.lang = configuracoes.idioma
  document.title = t('documentTitulo')
  atualizarManifestIdioma()
}

function aplicarConfiguracoes() {
  document.body.dataset.tema = configuracoes.tema
  document.body.classList.toggle('fonte-grande', configuracoes.fonteMaior)
  document.body.classList.toggle('alto-contraste', configuracoes.altoContraste)
  document.body.classList.toggle('reduzir-movimento', configuracoes.reduzirMovimento)
  traduzirInterface()

  if (typeof Chart !== 'undefined') {
    Chart.defaults.color = configuracoes.tema === 'escuro' ? '#d1d5db' : '#526c6e'
    Chart.defaults.borderColor = configuracoes.tema === 'escuro' ? '#374151' : '#e5e7eb'
  }
}

function atualizarConteudoDinamico() {
  if (!usuarioAtual) return
  carregarSugestoes()
  carregarHistoricoBemEstar()
  api('GET', `/humor/${usuarioAtual.id}/hoje`).then(resultado => {
    if (resultado.dado) atualizarVisualHumor(resultado.dado.emoji)
  })
  if (!document.getElementById('tela-graficos').classList.contains('hidden')) carregarGraficos()
  if (!document.getElementById('tela-lembretes').classList.contains('hidden')) carregarTodosLembretes()
  if (!document.getElementById('tela-perfil').classList.contains('hidden')) atualizarPreviaPerfil()
  if (!document.getElementById('tela-admin').classList.contains('hidden')) carregarPainelAdmin()
  if (notificacoesAbertas) carregarNotificacoes()
}

function atualizarContadorSugestoes() {
  const contador = document.getElementById('sugestoes-contador')
  if (!contador) return
  const minutos = Math.floor(proximaSugestaoEm / 60)
  const segundos = String(proximaSugestaoEm % 60).padStart(2, '0')
  contador.textContent = `${minutos}:${segundos}`
  contador.setAttribute('aria-label', `${t('proximaEm')} ${minutos}:${segundos}`)
}

function iniciarAtualizacaoSugestoes() {
  pararAtualizacaoSugestoes()
  proximaSugestaoEm = 120
  atualizarContadorSugestoes()
  intervaloSugestoes = setInterval(() => {
    proximaSugestaoEm -= 1
    if (proximaSugestaoEm <= 0) {
      proximaSugestaoEm = 120
      carregarSugestoes(true)
    }
    atualizarContadorSugestoes()
  }, 1000)
}

function pararAtualizacaoSugestoes() {
  if (intervaloSugestoes) clearInterval(intervaloSugestoes)
  intervaloSugestoes = null
}

function salvarConfiguracoes() {
  localStorage.setItem('dailymind_configuracoes', JSON.stringify(configuracoes))
  aplicarConfiguracoes()
  atualizarConteudoDinamico()
  const status = document.getElementById('configuracoes-status')
  if (status) {
    status.textContent = t('salvoConfiguracoes')
    setTimeout(() => { status.textContent = '' }, 2500)
  }
}

function carregarConfiguracoesTela() {
  document.getElementById('seletor-tema').value = configuracoes.tema
  document.getElementById('seletor-idioma').value = configuracoes.idioma
  document.getElementById('opcao-fonte-maior').checked = configuracoes.fonteMaior
  document.getElementById('opcao-alto-contraste').checked = configuracoes.altoContraste
  document.getElementById('opcao-reduzir-movimento').checked = configuracoes.reduzirMovimento
}

document.getElementById('seletor-tema').addEventListener('change', (evento) => {
  configuracoes.tema = evento.target.value === 'escuro' ? 'escuro' : 'claro'
  salvarConfiguracoes()
})

document.getElementById('seletor-idioma').addEventListener('change', (evento) => {
  configuracoes.idioma = traducoes[evento.target.value] ? evento.target.value : 'pt-BR'
  salvarConfiguracoes()
})

document.getElementById('opcao-fonte-maior').addEventListener('change', (evento) => {
  configuracoes.fonteMaior = evento.target.checked
  salvarConfiguracoes()
})

document.getElementById('opcao-alto-contraste').addEventListener('change', (evento) => {
  configuracoes.altoContraste = evento.target.checked
  salvarConfiguracoes()
})

document.getElementById('opcao-reduzir-movimento').addEventListener('change', (evento) => {
  configuracoes.reduzirMovimento = evento.target.checked
  salvarConfiguracoes()
})

document.getElementById('btn-atualizar-sugestoes').addEventListener('click', () => {
  proximaSugestaoEm = 120
  atualizarContadorSugestoes()
  carregarSugestoes(true)
})

document.getElementById('btn-admin-filtrar').addEventListener('click', aplicarFiltroAdmin)
document.getElementById('btn-exportar-csv').addEventListener('click', exportarRelatorioCsv)
document.getElementById('btn-admin-busca').addEventListener('click', () => {
  adminState.pagina = 1
  adminState.pesquisa = document.getElementById('admin-busca-usuarios').value.trim()
  carregarUsuariosAdmin()
})
document.getElementById('admin-busca-usuarios').addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    adminState.pagina = 1
    adminState.pesquisa = document.getElementById('admin-busca-usuarios').value.trim()
    carregarUsuariosAdmin()
  }
})

// ==================== MODAIS ====================

function abrirModalHumor() {
  const emojiAtual = document.getElementById('humor-atual').textContent
  document.querySelectorAll('.mood-option').forEach(botao => {
    botao.classList.toggle('selected', botao.dataset.humor === emojiAtual)
  })
  document.getElementById('modal-humor').classList.remove('hidden')
}

function abrirModalSono(registro = null) {
  registroSonoEditando = registro
  const titulo = document.getElementById('modal-sono-titulo')
  const botao = document.getElementById('btn-salvar-sono')
  const horas = registro ? registro.horas_sono : document.getElementById('input-sono').value
  const qualidade = registro ? registro.qualidade : document.getElementById('input-qualidade-sono').value
  document.getElementById('input-sono').value = horas
  document.getElementById('sono-valor').textContent = horas
  document.getElementById('input-qualidade-sono').value = qualidade
  document.getElementById('qualidade-sono-valor').textContent = `${qualidade}/5`
  titulo.textContent = registro ? `${t('editar')} ${t('sono').toLowerCase()}` : t('horasSono')
  botao.textContent = registro ? t('salvarAlteracoes') : t('confirmar')
  document.getElementById('modal-sono').classList.remove('hidden')
}

function abrirModalEnergia(registro = null) {
  registroEnergiaEditando = registro
  const titulo = document.getElementById('modal-energia-titulo')
  const botao = document.getElementById('btn-salvar-energia')
  const nivel = registro ? registro.nivel_energia : document.getElementById('input-energia').value
  document.getElementById('input-energia').value = nivel
  document.getElementById('energia-valor').textContent = nivel
  titulo.textContent = registro ? `${t('editar')} ${t('energia').toLowerCase()}` : t('nivelEnergia')
  botao.textContent = registro ? t('salvarAlteracoes') : t('confirmar')
  document.getElementById('modal-energia').classList.remove('hidden')
}

function abrirModalLembrete() {
  document.getElementById('modal-lembrete').classList.remove('hidden')
}

function fecharModal(id) {
  document.getElementById(id).classList.add('hidden')
}

// ==================== HUMOR ====================

const classesHumor = {
  '😊': 'mood-feliz',
  '😔': 'mood-triste',
  '😰': 'mood-ansioso',
  '😫': 'mood-cansado',
  '😤': 'mood-irritado',
  '😐': 'mood-neutro'
}

function informacaoHumor(emoji) {
  const traducao = traducoesHumor[configuracoes.idioma] || traducoesHumor['pt-BR']
  return traducao[emoji] || traducao['😐']
}

function atualizarVisualHumor(emoji, registrado = true) {
  const informacao = informacaoHumor(emoji)
  const card = document.getElementById('card-humor')
  card.className = `mood-card ${classesHumor[emoji] || classesHumor['😐']} bg-white p-6 rounded-2xl shadow-md border cursor-pointer hover:shadow-lg transition`
  document.getElementById('humor-atual').textContent = emoji
  document.getElementById('humor-texto').textContent = registrado ? informacao.nome : t('humorPergunta')
  document.getElementById('humor-descricao').textContent = registrado
    ? informacao.descricao
    : t('humorEscolha')
  document.getElementById('humor-status').textContent = registrado ? t('registradoHoje') : t('aindaNaoRegistrado')
  document.querySelectorAll('.mood-option').forEach(botao => {
    botao.classList.toggle('selected', registrado && botao.dataset.humor === emoji)
  })
}

async function registrarHumor(emoji) {
  const resultado = await api('POST', '/humor', { usuario_id: usuarioAtual.id, emoji })
  if (resultado.sucesso) {
    atualizarVisualHumor(emoji)
    exibirToast(`${t('humorAtualizado')}: ${informacaoHumor(emoji).nome}!`)
    fecharModal('modal-humor')
    carregarSugestoes()
    carregarHistoricoBemEstar()
    carregarGraficos()
  } else {
    exibirToast(resultado.mensagem || t('erroHumor'), 'erro')
  }
}

// ==================== SONO ====================

function atualizarBarraSono(horas) {
  const valor = Math.min(Math.max((horas / 12) * 100, 0), 100)
  const barra = document.getElementById('sono-bar')
  if (barra) barra.style.width = `${valor}%`
}

function atualizarBarraEnergia(nivel) {
  const valor = Math.min(Math.max((nivel / 10) * 100, 0), 100)
  const barra = document.getElementById('energia-bar')
  if (barra) barra.style.width = `${valor}%`
}

document.getElementById('input-sono').addEventListener('input', (e) => {
  document.getElementById('sono-valor').textContent = e.target.value
  atualizarBarraSono(parseFloat(e.target.value))
})

document.getElementById('input-qualidade-sono').addEventListener('input', (e) => {
  document.getElementById('qualidade-sono-valor').textContent = `${e.target.value}/5`
})

async function registrarSono() {
  const horas = parseFloat(document.getElementById('input-sono').value)
  const qualidade = parseInt(document.getElementById('input-qualidade-sono').value)
  const editando = Boolean(registroSonoEditando)
  const endpoint = editando ? `/sono/${registroSonoEditando.id}` : '/sono'
  const resultado = await api(editando ? 'PUT' : 'POST', endpoint, {
    usuario_id: usuarioAtual.id,
    horas_sono: horas,
    qualidade
  })
  if (resultado.sucesso) {
    exibirToast(`${editando ? t('sonoAtualizado') : t('sonoRegistrado')} 😴`)
    fecharModal('modal-sono')
    registroSonoEditando = null
    document.getElementById('sono-texto').textContent = `${horas}h ${t('sonoResumo')}`
    atualizarBarraSono(horas)
    carregarHistoricoBemEstar()
    carregarGraficos()
  } else {
    exibirToast(resultado.mensagem || t('naoSalvo'), 'erro')
  }
}

// ==================== ENERGIA ====================

document.getElementById('input-energia').addEventListener('input', (e) => {
  document.getElementById('energia-valor').textContent = e.target.value
  atualizarBarraEnergia(parseInt(e.target.value))
})

async function registrarEnergia() {
  const nivel = parseInt(document.getElementById('input-energia').value)
  const editando = Boolean(registroEnergiaEditando)
  const endpoint = editando ? `/energia/${registroEnergiaEditando.id}` : '/energia'
  const resultado = await api(editando ? 'PUT' : 'POST', endpoint, {
    usuario_id: usuarioAtual.id,
    nivel_energia: nivel
  })
  if (resultado.sucesso) {
    exibirToast(`${editando ? t('energiaAtualizada') : t('energiaRegistrada')} ⚡`)
    fecharModal('modal-energia')
    registroEnergiaEditando = null
    document.getElementById('energia-texto').textContent = `${nivel}/10 ${t('energiaResumo')}`
    atualizarBarraEnergia(nivel)
    carregarHistoricoBemEstar()
    carregarGraficos()
  } else {
    exibirToast(resultado.mensagem || t('naoSalvo'), 'erro')
  }
}

// ==================== LEMBRETES ====================

function selecionarIcone(icone) {
  iconeSelecionado = icone
  document.querySelectorAll('.icone-btn').forEach(btn => {
    btn.classList.remove('border-mint-500', 'bg-mint-50')
    btn.classList.add('border-gray-200')
  })
  event.target.classList.remove('border-gray-200')
  event.target.classList.add('border-mint-500', 'bg-mint-50')
}

document.getElementById('form-lembrete').addEventListener('submit', async (e) => {
  e.preventDefault()
  const titulo = document.getElementById('lembrete-titulo').value.trim()
  const objeto_deixado = document.getElementById('lembrete-objeto').value.trim()
  const hora_deixado = document.getElementById('lembrete-hora').value

  const resultado = await api('POST', '/lembretes', {
    usuario_id: usuarioAtual.id,
    titulo,
    icone: iconeSelecionado,
    objeto_deixado: objeto_deixado || null,
    hora_deixado: hora_deixado || null
  })

  if (resultado.sucesso) {
    exibirToast(`${t('lembreteCriado')} ⏰`)
    fecharModal('modal-lembrete')
    document.getElementById('lembrete-titulo').value = ''
    document.getElementById('lembrete-objeto').value = ''
    document.getElementById('lembrete-hora').value = ''
    carregarLembretes()
    atualizarBadge()
  }
})

async function carregarLembretes() {
  const resultado = await api('GET', `/lembretes/${usuarioAtual.id}`)
  const container = document.getElementById('lista-lembretes')

  if (!resultado.sucesso || !Array.isArray(resultado.dados) || resultado.dados.length === 0) {
    container.innerHTML = `<p class="text-gray-400 text-center py-4">${t('semLembretes')}</p>`
    return
  }

  container.innerHTML = resultado.dados.map(l => `
    <div class="flex items-center gap-3 p-3 rounded-xl ${l.concluido ? 'bg-gray-50 opacity-60' : 'bg-mint-50'}">
      <button onclick="alternarLembrete(${l.id})" class="w-6 h-6 rounded-full border-2 ${l.concluido ? 'bg-mint-500 border-mint-500' : 'border-mint-400'} flex items-center justify-center flex-shrink-0">
        ${l.concluido ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
      </button>
      <span class="text-xl flex-shrink-0">${escaparHtml(l.icone)}</span>
      <div class="flex-1 min-w-0">
        <span class="${l.concluido ? 'line-through text-gray-400' : 'text-gray-700'} block">${escaparHtml(l.titulo)}</span>
        ${l.objeto_deixado ? `<span class="text-xs text-gray-500">📦 ${t('objeto')}: ${escaparHtml(l.objeto_deixado)}</span>` : ''}
        ${l.hora_deixado ? `<span class="text-xs text-gray-500">⏰ ${t('horario')}: ${escaparHtml(l.hora_deixado)}</span>` : ''}
      </div>
      <button onclick="removerLembrete(${l.id})" class="text-gray-400 hover:text-red-500 transition flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  `).join('')
}

async function carregarTodosLembretes() {
  const resultado = await api('GET', `/lembretes/${usuarioAtual.id}`)
  const container = document.getElementById('lista-lembretes-tela')

  if (!resultado.sucesso || !Array.isArray(resultado.dados) || resultado.dados.length === 0) {
    container.innerHTML = `<p class="text-gray-400 text-center py-8">${t('nenhumLembrete')}</p>`
    return
  }

  container.innerHTML = resultado.dados.map(l => `
    <div class="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="flex items-center gap-3">
        <button onclick="alternarLembrete(${l.id})" class="w-6 h-6 rounded-full border-2 ${l.concluido ? 'bg-mint-500 border-mint-500' : 'border-mint-400'} flex items-center justify-center flex-shrink-0">
          ${l.concluido ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
        </button>
        <span class="text-2xl flex-shrink-0">${escaparHtml(l.icone)}</span>
      </div>
      <div class="flex-1 min-w-0">
        <span class="${l.concluido ? 'line-through text-gray-400' : 'text-gray-700'} font-medium block">${escaparHtml(l.titulo)}</span>
        ${l.objeto_deixado ? `<span class="text-sm text-gray-600 mt-1 block">📦 ${t('objeto')}: <strong>${escaparHtml(l.objeto_deixado)}</strong></span>` : ''}
        ${l.hora_deixado ? `<span class="text-sm text-gray-600 block">⏰ ${t('horario')}: <strong>${escaparHtml(l.hora_deixado)}</strong></span>` : ''}
      </div>
      <button onclick="removerLembrete(${l.id})" class="text-gray-400 hover:text-red-500 transition p-2 flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    </div>
  `).join('')
}

async function alternarLembrete(id) {
  const resultado = await api('PUT', `/lembretes/${id}/toggle`)
  if (!resultado.sucesso) {
    exibirToast(resultado.mensagem || t('acaoFalhou'), 'erro')
    return
  }
  carregarLembretes()
  carregarTodosLembretes()
  atualizarBadge()
}

async function removerLembrete(id) {
  if (confirm(t('removerLembrete'))) {
    const resultado = await api('DELETE', `/lembretes/${id}`)
    if (!resultado.sucesso) {
      exibirToast(resultado.mensagem || t('acaoFalhou'), 'erro')
      return
    }
    exibirToast(t('lembreteRemovido'))
    carregarLembretes()
    carregarTodosLembretes()
    atualizarBadge()
  }
}

async function atualizarBadge() {
  if (!usuarioAtual) return
  const resultado = await api('GET', `/lembretes/${usuarioAtual.id}/pendentes`)
  const badge = document.getElementById('badge-notificacoes')
  if (!resultado.sucesso) return
  if (resultado.total > 0) {
    badge.textContent = resultado.total
    badge.classList.remove('hidden')
  } else {
    badge.classList.add('hidden')
  }
  if (notificacoesAbertas) carregarNotificacoes()
}

async function carregarNotificacoes() {
  if (!usuarioAtual) return
  const lista = document.getElementById('lista-notificacoes')
  const resultado = await api('GET', `/lembretes/${usuarioAtual.id}`)
  if (!resultado.sucesso) {
    lista.innerHTML = `<p class="text-sm text-red-500 py-3">${t('naoFoiPossivel')}</p>`
    return
  }

  const pendentes = resultado.dados.filter(lembrete => !lembrete.concluido)
  if (pendentes.length === 0) {
    lista.innerHTML = `<p class="text-sm text-gray-400 py-3">${t('tudoEmDia')}</p>`
    return
  }

  lista.innerHTML = pendentes.map(lembrete => `
    <button type="button" onclick="abrirLembretesAPartirDaNotificacao()" class="notification-item">
      <span class="text-xl">${escaparHtml(lembrete.icone || '📌')}</span>
      <span class="min-w-0 text-left">
        <strong class="block truncate text-gray-700">${escaparHtml(lembrete.titulo)}</strong>
        <small class="block text-gray-500">${lembrete.hora_deixado ? `${t('horario')}: ${escaparHtml(lembrete.hora_deixado)}` : t('lembretePendente')}</small>
      </span>
    </button>
  `).join('')
}

function alternarNotificacoes() {
  notificacoesAbertas = !notificacoesAbertas
  const painel = document.getElementById('painel-notificacoes')
  const botao = document.getElementById('btn-notificacoes')
  painel.classList.toggle('hidden', !notificacoesAbertas)
  botao.setAttribute('aria-expanded', String(notificacoesAbertas))
  if (notificacoesAbertas) carregarNotificacoes()
}

function fecharNotificacoes() {
  notificacoesAbertas = false
  document.getElementById('painel-notificacoes').classList.add('hidden')
  document.getElementById('btn-notificacoes').setAttribute('aria-expanded', 'false')
}

function abrirLembretesAPartirDaNotificacao() {
  fecharNotificacoes()
  mostrarTela('lembretes')
}

document.getElementById('btn-notificacoes').addEventListener('click', alternarNotificacoes)
document.addEventListener('click', (evento) => {
  const painel = document.getElementById('painel-notificacoes')
  const botao = document.getElementById('btn-notificacoes')
  if (notificacoesAbertas && !painel.contains(evento.target) && !botao.contains(evento.target)) fecharNotificacoes()
})

// ==================== SUGESTÕES ====================

async function carregarSugestoes(renovar = false) {
  if (!usuarioAtual || sugestoesCarregando) return
  sugestoesCarregando = true
  const container = document.getElementById('lista-sugestoes')
  const botao = document.getElementById('btn-atualizar-sugestoes')
  botao.disabled = true
  botao.setAttribute('aria-busy', 'true')
  botao.classList.add('is-loading')
  if (renovar) container.classList.add('is-refreshing')

  try {
    const resultado = await api('GET', `/sugestoes/${usuarioAtual.id}`)

    if (!resultado.sucesso || !Array.isArray(resultado.dados)) {
      container.innerHTML = `<p class="text-gray-400 text-center py-4 col-span-3">${t('erroSugestoes')}</p>`
      return
    }

    if (resultado.dados.length === 0) {
      container.innerHTML = `<p class="text-gray-400 text-center py-4 col-span-3">${t('carregarSugestoes')}</p>`
      return
    }

    container.innerHTML = resultado.dados.map(s => {
      const sugestao = traduzirSugestao(s)
      return `
      <div class="suggestion-card bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-start justify-between gap-3">
          <div class="suggestion-icon">${s.icone}</div>
          <span class="text-xs font-bold uppercase tracking-wider text-mint-600">${t('paraVoce')}</span>
        </div>
        <h4 class="font-semibold text-gray-800 mt-3">${sugestao.titulo}</h4>
        <p class="text-sm text-gray-600 mt-1 leading-relaxed">${sugestao.descricao}</p>
      </div>
    `
    }).join('')
  } finally {
    sugestoesCarregando = false
    botao.disabled = false
    botao.setAttribute('aria-busy', 'false')
    botao.classList.remove('is-loading')
    container.classList.remove('is-refreshing')
  }
}

// ==================== GRÁFICOS ====================

let graficoHumor = null
let graficoSono = null
let graficoEnergia = null

function resetarCanvasVazio(idCanvas, mensagem) {
  const canvas = document.getElementById(idCanvas)
  if (!canvas) return
  const area = canvas.parentElement
  const vazio = area.querySelector('.chart-empty')
  if (vazio) vazio.remove()
  canvas.style.display = 'block'
  canvas.dataset.empty = 'false'

  const placeholder = document.createElement('div')
  placeholder.className = 'chart-empty'
  placeholder.textContent = mensagem
  area.appendChild(placeholder)
  canvas.style.display = 'none'
  canvas.dataset.empty = 'true'
}

function limparEstadoGraficoVazio(idCanvas) {
  const canvas = document.getElementById(idCanvas)
  if (!canvas) return
  const area = canvas.parentElement
  const placeholder = area.querySelector('.chart-empty')
  if (placeholder) placeholder.remove()
  canvas.style.display = 'block'
  canvas.dataset.empty = 'false'
}

function formatarData(data) {
  return new Date(`${data}T12:00:00`).toLocaleDateString(configuracoes.idioma, {
    day: '2-digit',
    month: 'short'
  })
}

function editarSonoHistorico(id) {
  const registro = historicoSono.find(item => item.id === id)
  if (registro) abrirModalSono(registro)
}

function editarEnergiaHistorico(id) {
  const registro = historicoEnergia.find(item => item.id === id)
  if (registro) abrirModalEnergia(registro)
}

function renderizarHistoricoBemEstar() {
  const listaSono = document.getElementById('historico-sono')
  const listaEnergia = document.getElementById('historico-energia')

  listaSono.innerHTML = historicoSono.length
    ? historicoSono.slice(0, 5).map(registro => `
      <div class="flex items-center justify-between gap-3 bg-white/80 border border-violet-100 rounded-xl px-3 py-3">
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-xl">🌙</span>
          <div class="min-w-0">
            <p class="font-semibold text-gray-700">${registro.horas_sono}h ${t('sonoResumo')}</p>
            <p class="text-xs text-gray-400">${formatarData(registro.data_registro)} · ${t('qualidade')} ${registro.qualidade}/5</p>
          </div>
        </div>
        <button type="button" onclick="editarSonoHistorico(${registro.id})" class="shrink-0 text-xs font-bold text-violet-600 hover:text-violet-800 px-2 py-1 rounded-lg hover:bg-violet-50">${t('editar')}</button>
      </div>
    `).join('')
    : `<p class="text-sm text-gray-400 py-2">${t('nenhumSono')}</p>`

  listaEnergia.innerHTML = historicoEnergia.length
    ? historicoEnergia.slice(0, 5).map(registro => `
      <div class="flex items-center justify-between gap-3 bg-white/80 border border-orange-100 rounded-xl px-3 py-3">
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-xl">⚡</span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-3">
              <p class="font-semibold text-gray-700">${registro.nivel_energia}/10</p>
              <span class="text-xs text-gray-400">${formatarData(registro.data_registro)}</span>
            </div>
            <div class="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden mt-1.5"><div class="h-full bg-orange-400 rounded-full" style="width: ${registro.nivel_energia * 10}%"></div></div>
          </div>
        </div>
        <button type="button" onclick="editarEnergiaHistorico(${registro.id})" class="shrink-0 text-xs font-bold text-orange-600 hover:text-orange-800 px-2 py-1 rounded-lg hover:bg-orange-50">${t('editar')}</button>
      </div>
    `).join('')
    : `<p class="text-sm text-gray-400 py-2">${t('nenhumaEnergia')}</p>`
}

async function carregarHistoricoBemEstar() {
  const [sono, energia] = await Promise.all([
    api('GET', `/sono/${usuarioAtual.id}`),
    api('GET', `/energia/${usuarioAtual.id}`)
  ])
  historicoSono = sono.dados || []
  historicoEnergia = energia.dados || []
  renderizarHistoricoBemEstar()
}

async function carregarGraficos() {
  if (!usuarioAtual) return
  const usuarioId = usuarioAtual.id
  const [dadosHumor, dadosSono, dadosEnergia] = await Promise.all([
    api('GET', `/humor/${usuarioId}`),
    api('GET', `/sono/${usuarioId}`),
    api('GET', `/energia/${usuarioId}`)
  ])
  if (!usuarioAtual || usuarioAtual.id !== usuarioId) return
  if (![dadosHumor, dadosSono, dadosEnergia].every(resultado => resultado.sucesso && Array.isArray(resultado.dados))) {
    exibirToast(t('erroGraficos'), 'erro')
    return
  }

  const humorVazio = !Array.isArray(dadosHumor.dados) || dadosHumor.dados.length === 0
  const sonoVazio = !Array.isArray(dadosSono.dados) || dadosSono.dados.length === 0
  const energiaVazia = !Array.isArray(dadosEnergia.dados) || dadosEnergia.dados.length === 0

  if (graficoHumor) { graficoHumor.destroy(); graficoHumor = null }
  if (graficoSono) { graficoSono.destroy(); graficoSono = null }
  if (graficoEnergia) { graficoEnergia.destroy(); graficoEnergia = null }

  limparEstadoGraficoVazio('grafico-humor')
  limparEstadoGraficoVazio('grafico-sono')
  limparEstadoGraficoVazio('grafico-energia')

  if (humorVazio) resetarCanvasVazio('grafico-humor', t('semHumorGrafico'))
  if (sonoVazio) resetarCanvasVazio('grafico-sono', t('semSonoGrafico'))
  if (energiaVazia) resetarCanvasVazio('grafico-energia', t('semEnergiaGrafico'))

  if (humorVazio && sonoVazio && energiaVazia) return

  const isEscuro = configuracoes.tema === 'escuro'
  const paleta = {
    texto: isEscuro ? '#e5e7eb' : '#526c6e',
    grid: isEscuro ? 'rgba(148, 163, 184, 0.18)' : 'rgba(148, 163, 184, 0.24)',
    tooltipBg: isEscuro ? '#0f172a' : '#ffffff',
    tooltipBorder: isEscuro ? 'rgba(148, 163, 184, 0.35)' : 'rgba(148, 163, 184, 0.2)',
    tooltipTexto: isEscuro ? '#f8fafc' : '#1f2937'
  }

  const opcoesBase = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700, easing: 'easeOutQuart' },
    interaction: { mode: 'nearest', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: paleta.tooltipBg,
        titleColor: paleta.tooltipTexto,
        bodyColor: paleta.tooltipTexto,
        borderColor: paleta.tooltipBorder,
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        cornerRadius: 10
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        border: { display: false },
        ticks: { color: paleta.texto, font: { weight: '600', size: 11 } }
      },
      y: {
        grid: { color: paleta.grid, drawBorder: false },
        border: { display: false },
        ticks: { color: paleta.texto, font: { weight: '600', size: 11 } }
      }
    }
  }

  const mapaEmoji = { '😊': 5, '😔': 2, '😰': 3, '😫': 2, '😤': 1, '😐': 3 }

  if (!humorVazio) {
    const labelsHumor = dadosHumor.dados.map(d => formatarData(d.data_registro)).reverse()
    const valoresHumor = dadosHumor.dados.map(d => mapaEmoji[d.emoji] || 3).reverse()
    graficoHumor = new Chart(document.getElementById('grafico-humor'), {
      type: 'line',
      data: {
        labels: labelsHumor,
        datasets: [{
          label: t('humor'),
          data: valoresHumor,
          borderColor: '#34d399',
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#ecfdf5',
          pointBorderWidth: 2,
          backgroundColor: 'rgba(52, 211, 153, 0.18)',
          fill: true,
          tension: 0.38
        }]
      },
      options: {
        ...opcoesBase,
        scales: {
          ...opcoesBase.scales,
          y: {
            ...opcoesBase.scales.y,
            min: 0,
            max: 6,
            ticks: { ...opcoesBase.scales.y.ticks, stepSize: 1 }
          }
        }
      }
    })
  }

  if (!sonoVazio) {
    const labelsSono = dadosSono.dados.map(d => formatarData(d.data_registro)).reverse()
    const valoresSono = dadosSono.dados.map(d => d.horas_sono).reverse()
    graficoSono = new Chart(document.getElementById('grafico-sono'), {
      type: 'bar',
      data: {
        labels: labelsSono,
        datasets: [{
          label: t('horasSono'),
          data: valoresSono,
          backgroundColor: ['#a78bfa', '#8b5cf6', '#7c3aed', '#a78bfa', '#c4b5fd', '#8b5cf6'],
          borderRadius: 10,
          borderSkipped: false,
          borderColor: 'rgba(139, 92, 246, 0.7)',
          borderWidth: 1.5
        }]
      },
      options: {
        ...opcoesBase,
        scales: {
          ...opcoesBase.scales,
          y: {
            ...opcoesBase.scales.y,
            min: 0,
            max: 12,
            ticks: { ...opcoesBase.scales.y.ticks, stepSize: 2 }
          }
        }
      }
    })
  }

  if (!energiaVazia) {
    const labelsEnergia = dadosEnergia.dados.map(d => formatarData(d.data_registro)).reverse()
    const valoresEnergia = dadosEnergia.dados.map(d => d.nivel_energia).reverse()
    graficoEnergia = new Chart(document.getElementById('grafico-energia'), {
      type: 'line',
      data: {
        labels: labelsEnergia,
        datasets: [{
          label: t('energia'),
          data: valoresEnergia,
          borderColor: '#fb923c',
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#f97316',
          pointBorderColor: '#fff7ed',
          pointBorderWidth: 2,
          backgroundColor: 'rgba(251, 146, 60, 0.18)',
          fill: true,
          tension: 0.34
        }]
      },
      options: {
        ...opcoesBase,
        scales: {
          ...opcoesBase.scales,
          y: {
            ...opcoesBase.scales.y,
            min: 0,
            max: 10,
            ticks: { ...opcoesBase.scales.y.ticks, stepSize: 2 }
          }
        }
      }
    })
  }
}

// ==================== PERFIL ====================

async function carregarPerfil() {
  if (perfilAlteradoLocalmente) return
  const idSessao = sessaoPerfil
  const usuarioId = usuarioAtual.id
  const resultado = await api('GET', `/usuarios/${usuarioId}`)
  if (idSessao !== sessaoPerfil || !usuarioAtual || usuarioAtual.id !== usuarioId) return
  if (!resultado.sucesso || !resultado.usuario) {
    exibirToast(t('erroSessao'), 'erro')
    fazerLogout()
    return
  }

  usuarioAtual = resultado.usuario

  document.getElementById('perfil-nome').value = usuarioAtual.nome || ''
  document.getElementById('perfil-email').value = usuarioAtual.email || ''
  document.getElementById('perfil-idade').value = usuarioAtual.idade || ''
  document.getElementById('perfil-ocupacao').value = usuarioAtual.ocupacao || ''
  document.getElementById('perfil-bio').value = usuarioAtual.bio || ''
  atualizarPreviaPerfil()
}

function atualizarPreviaPerfil() {
  const nome = document.getElementById('perfil-nome').value.trim() || t('usuarioPadrao')
  const idade = document.getElementById('perfil-idade').value
  const ocupacao = document.getElementById('perfil-ocupacao').value.trim()
  const bio = document.getElementById('perfil-bio').value.trim()
  const avatar = document.getElementById('perfil-avatar-preview')
  const banner = document.getElementById('perfil-banner-preview')
  const bannerImagem = document.getElementById('perfil-banner-imagem')

  document.getElementById('perfil-nome-preview').textContent = nome
  document.getElementById('perfil-idade-preview').textContent = idade ? `${idade} ${t('anos')}` : t('perfilPadrao')
  document.getElementById('perfil-ocupacao-preview').textContent = ocupacao || 'DailyMind'
  document.getElementById('perfil-bio-preview').textContent = bio
  document.getElementById('perfil-bio-contador').textContent = `${bio.length}/280`
  const fotoPerfilExibida = fotosPerfilPendentes.foto_perfil || usuarioAtual.foto_perfil
  if (fotoPerfilExibida) {
    avatar.textContent = ''
    avatar.style.backgroundImage = `url(${fotoPerfilExibida})`
    avatar.classList.add('has-image')
  } else {
    avatar.textContent = nome.charAt(0).toUpperCase()
    avatar.style.backgroundImage = ''
    avatar.classList.remove('has-image')
  }

  const botaoPerfil = document.getElementById('btn-perfil')
  botaoPerfil.style.backgroundImage = usuarioAtual.foto_perfil
    ? `url(${usuarioAtual.foto_perfil})`
    : ''
  botaoPerfil.style.backgroundPosition = 'center'
  botaoPerfil.style.backgroundSize = 'cover'

  const bannerPerfilExibido = fotosPerfilPendentes.banner_perfil || usuarioAtual.banner_perfil
  if (bannerPerfilExibido) {
    bannerImagem.src = bannerPerfilExibido
    bannerImagem.hidden = false
    banner.classList.add('has-image')
  } else {
    bannerImagem.removeAttribute('src')
    bannerImagem.hidden = true
    banner.classList.remove('has-image')
  }
}

function limparImagensPerfil() {
  fotosPerfilPendentes = { foto_perfil: null, banner_perfil: null }
  const avatar = document.getElementById('perfil-avatar-preview')
  const banner = document.getElementById('perfil-banner-preview')
  const botaoPerfil = document.getElementById('btn-perfil')
  if (avatar) {
    avatar.style.backgroundImage = ''
    avatar.classList.remove('has-image')
  }
  if (banner) {
    banner.classList.remove('has-image')
    const bannerImagem = document.getElementById('perfil-banner-imagem')
    if (bannerImagem) {
      bannerImagem.removeAttribute('src')
      bannerImagem.hidden = true
    }
  }
  if (botaoPerfil) botaoPerfil.style.backgroundImage = ''
  document.getElementById('perfil-foto').value = ''
  document.getElementById('perfil-banner').value = ''
}

function prepararImagemPerfil(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onerror = reject
    leitor.onload = () => {
      const imagem = new Image()
      imagem.onerror = reject
      imagem.onload = () => {
        const larguraMaxima = 2400
        const alturaMaxima = 1350
        const escala = Math.min(1, larguraMaxima / imagem.naturalWidth, alturaMaxima / imagem.naturalHeight)
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(imagem.naturalWidth * escala))
        canvas.height = Math.max(1, Math.round(imagem.naturalHeight * escala))
        canvas.getContext('2d').drawImage(imagem, 0, 0, canvas.width, canvas.height)

        let resultado = canvas.toDataURL('image/jpeg', 0.88)
        if (resultado.length > 5000000) resultado = canvas.toDataURL('image/jpeg', 0.78)
        if (resultado.length > 5000000) resultado = canvas.toDataURL('image/jpeg', 0.68)
        resolve(resultado)
      }
      imagem.src = leitor.result
    }
    leitor.readAsDataURL(arquivo)
  })
}

async function carregarImagemPerfil(input, campo) {
  const arquivo = input.files[0]
  if (!arquivo) return
  if (!arquivo.type.startsWith('image/')) {
    input.value = ''
    exibirToast(t('erroImagem'), 'erro')
    return
  }

  const idSessao = sessaoPerfil
  const usuarioId = usuarioAtual?.id
  imagensPerfilCarregando += 1
  atualizarStatusPerfil(t('carregandoImagem'), 'saving')
  try {
    const imagemProcessada = await prepararImagemPerfil(arquivo)
    imagensPerfilCarregando -= 1
    if (idSessao !== sessaoPerfil || !usuarioAtual || usuarioAtual.id !== usuarioId) return
    fotosPerfilPendentes[campo] = imagemProcessada
    perfilAlteradoLocalmente = true
    atualizarPreviaPerfil()
    if (!imagensPerfilCarregando) atualizarStatusPerfil(t('prontoSalvar'))
  } catch (erro) {
    imagensPerfilCarregando -= 1
    if (idSessao !== sessaoPerfil) return
    atualizarStatusPerfil(t('erroImagem'), 'error')
    exibirToast(t('erroImagem'), 'erro')
  }
}

function atualizarStatusPerfil(texto, estado = '') {
  const status = document.getElementById('perfil-status')
  status.textContent = texto
  status.className = `profile-save-status ${estado}`
}

document.getElementById('perfil-foto').addEventListener('change', (e) => carregarImagemPerfil(e.target, 'foto_perfil'))
document.getElementById('perfil-banner').addEventListener('change', (e) => carregarImagemPerfil(e.target, 'banner_perfil'))
function marcarPerfilAlterado() {
  perfilAlteradoLocalmente = true
  atualizarPreviaPerfil()
}
document.getElementById('perfil-nome').addEventListener('input', marcarPerfilAlterado)
document.getElementById('perfil-idade').addEventListener('input', marcarPerfilAlterado)
document.getElementById('perfil-ocupacao').addEventListener('input', marcarPerfilAlterado)
document.getElementById('perfil-bio').addEventListener('input', marcarPerfilAlterado)
document.getElementById('perfil-bio').addEventListener('input', (e) => {
  document.getElementById('perfil-bio-contador').textContent = `${e.target.value.length}/280`
})
document.getElementById('btn-logout').addEventListener('click', fazerLogout)

document.getElementById('form-perfil').addEventListener('submit', async (e) => {
  e.preventDefault()
  const nome = document.getElementById('perfil-nome').value.trim()
  const idade = document.getElementById('perfil-idade').value
  const ocupacao = document.getElementById('perfil-ocupacao').value.trim()
  const bio = document.getElementById('perfil-bio').value.trim()
  const botaoSalvar = e.submitter

  if (!nome) {
    exibirToast(t('nomeObrigatorio'), 'erro')
    return
  }

  if (imagensPerfilCarregando) {
    exibirToast(t('aguardeImagem'), 'erro')
    return
  }

  if (nome.length > 100 || ocupacao.length > 100 || bio.length > 280) {
    exibirToast(t('campoMuitoLongo'), 'erro')
    return
  }

  botaoSalvar.disabled = true
  botaoSalvar.textContent = t('salvando')
  atualizarStatusPerfil(t('salvando'), 'saving')

  try {
    const resultado = await api('PUT', '/usuarios/perfil', {
      id: usuarioAtual.id,
      nome,
      idade: idade ? parseInt(idade) : null,
      ocupacao: ocupacao || null,
      bio: bio || null,
      foto_perfil: fotosPerfilPendentes.foto_perfil || usuarioAtual.foto_perfil || null,
      banner_perfil: fotosPerfilPendentes.banner_perfil || usuarioAtual.banner_perfil || null
    })

    if (resultado.sucesso) {
      usuarioAtual = resultado.usuario
      fotosPerfilPendentes = { foto_perfil: null, banner_perfil: null }
      perfilAlteradoLocalmente = false
      document.getElementById('nome-usuario').textContent = usuarioAtual.nome
      document.getElementById('inicial-usuario').textContent = usuarioAtual.nome.charAt(0).toUpperCase()
      atualizarPreviaPerfil()
      document.getElementById('perfil-bio-contador').textContent = `${bio.length}/280`
      atualizarStatusPerfil(t('salvoAgora'))
      exibirToast(t('salvoAgora'))
      document.getElementById('modal-confirmacao-perfil').classList.remove('hidden')
    } else {
      atualizarStatusPerfil(t('naoSalvo'), 'error')
      exibirToast(resultado.mensagem || t('erroSalvarPerfil'), 'erro')
    }
  } catch (erro) {
    atualizarStatusPerfil(t('naoSalvo'), 'error')
    exibirToast(t('erroSalvarPerfil'), 'erro')
  } finally {
    botaoSalvar.disabled = false
    botaoSalvar.textContent = t('salvarAlteracoes')
  }
})

// ==================== CARREGAMENTO INICIAL ====================

async function carregarDados() {
  carregarLembretes()
  atualizarBadge()
  carregarSugestoes()
  carregarHistoricoBemEstar()

  // Carregar dados de hoje
  const [humor, sono, energia] = await Promise.all([
    api('GET', `/humor/${usuarioAtual.id}/hoje`),
    api('GET', `/sono/${usuarioAtual.id}/hoje`),
    api('GET', `/energia/${usuarioAtual.id}/hoje`)
  ])

  if (humor.dado) {
    atualizarVisualHumor(humor.dado.emoji)
  } else {
    atualizarVisualHumor('😊', false)
  }

  if (sono.dado) {
    document.getElementById('sono-texto').textContent = `${sono.dado.horas_sono}h ${t('sonoResumo')}`
    document.getElementById('input-sono').value = sono.dado.horas_sono
    document.getElementById('sono-valor').textContent = sono.dado.horas_sono
    atualizarBarraSono(sono.dado.horas_sono)
  }

  if (energia.dado) {
    document.getElementById('energia-texto').textContent = `${energia.dado.nivel_energia}/10 ${t('energiaResumo')}`
    document.getElementById('input-energia').value = energia.dado.nivel_energia
    document.getElementById('energia-valor').textContent = energia.dado.nivel_energia
    atualizarBarraEnergia(energia.dado.nivel_energia)
  }
}

// Verificar se já está logado
window.addEventListener('DOMContentLoaded', async () => {
  configuracoes = lerConfiguracoes()
  aplicarConfiguracoes()

  localStorage.removeItem('dailymind_usuario')
  const resultado = await api('GET', '/usuarios/sessao')
  if (resultado.sucesso && resultado.usuario?.id && resultado.usuario?.nome) {
    usuarioAtual = resultado.usuario
    entrarApp()
  }
})
