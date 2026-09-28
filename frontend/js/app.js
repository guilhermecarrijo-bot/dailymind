// URL base da API
const URL_API = window.location.port === '8000' ? 'http://localhost:3000/api' : '/api'

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
    aparencia: 'Aparência', aparenciaDescricao: 'Escolha como o DailyMind aparece para você.', tema: 'Tema', temaClaro: 'Claro', temaPreto: 'Preto',
    idiomaTitulo: 'Idioma', idiomaDescricao: 'Altere os textos principais da interface.', idioma: 'Idioma',
    acessibilidadeTitulo: 'Acessibilidade', acessibilidadeDescricao: 'Ajustes para deixar a experiência mais confortável.', fonteMaior: 'Fonte maior', fonteMaiorDescricao: 'Aumenta o tamanho dos textos.',
    altoContraste: 'Alto contraste', altoContrasteDescricao: 'Reforça a leitura de textos e bordas.', reduzirMovimento: 'Reduzir movimento', reduzirMovimentoDescricao: 'Diminui transições e animações.', salvoConfiguracoes: 'Preferências salvas.',
    tagline: 'Cuide da sua mente, um dia de cada vez', bomDia: 'Bom dia,', atualizar: 'Atualizar →', entrar: 'Entrar', criarConta: 'Criar Conta', email: 'E-mail', senha: 'Senha', nomeCompleto: 'Nome completo', idadeOpcional: 'Idade (opcional)', ocupacaoOpcional: 'Ocupação (opcional)', criarMinhaConta: 'Criar minha conta', naoTemConta: 'Não tem conta?', jaTemConta: 'Já tem conta?',
    comoVoceEsta: 'Como você está hoje?', humorHoje: 'Humor de hoje', sono: 'Sono', energia: 'Energia', editar: 'Editar', registrar: 'Toque para registrar', lembretesHoje: 'Lembretes de hoje', novo: '+ Novo', sugestoes: 'Sugestões para você', sugestoesDescricao: 'Ideias pequenas para cuidar de você no seu ritmo.', atualizarAgora: 'Atualizar agora', atualizarSugestoes: 'Atualizar sugestões', atualizando: 'Atualizando...', proximaEm: 'Próxima em', graficosTitulo: 'Seus Gráficos', humor30: 'Humor nos últimos 30 dias', sono30: 'Sono nos últimos 30 dias', energia30: 'Energia nos últimos 30 dias', todosLembretes: 'Todos os Lembretes', nenhumLembrete: 'Nenhum lembrete criado',
    meuPerfil: 'Meu Perfil', perfilDescricao: 'Suas informações ficam salvas na sua conta.', salvarAlteracoes: 'Salvar alterações', sair: 'Sair da conta', biografia: 'Biografia', ate280: 'Até 280 caracteres', fechar: 'Fechar', confirmar: 'Confirmar', cancelar: 'Cancelar', qualidadePercebida: 'Qualidade percebida', nivelEnergia: 'Nível de energia', horasSono: 'Horas de sono', novoLembrete: 'Novo Lembrete', titulo: 'Título', objetoDeixado: 'Objeto deixado (opcional)', horarioDeixado: 'Que horas deixou? (opcional)', icone: 'Ícone', criarLembrete: 'Criar lembrete',
    nenhumaNotificacao: 'Nenhuma notificação pendente.', notificacoes: 'Notificações', voltarDashboard: 'Voltar', objeto: 'Objeto', horario: 'Horário', lembretePendente: 'Lembrete pendente', tudoEmDia: 'Tudo em dia. Nenhuma notificação pendente.', removerLembrete: 'Remover este lembrete?',
    ritmoDescanso: 'Ritmo de descanso', historicoSono: 'Histórico de sono', ajustarRegistro: 'Ajuste qualquer registro quando precisar.', disposicaoDiaria: 'Disposição diária', historicoEnergia: 'Histórico de energia', verEvolucao: 'Veja a evolução e altere o que foi anotado.', qualidade: 'Qualidade', nenhumSono: 'Nenhum registro de sono ainda.', nenhumaEnergia: 'Nenhum registro de energia ainda.', paraVoce: 'Para você', carregarSugestoes: 'Registre seu humor para ver sugestões', erroSugestoes: 'Não foi possível carregar sugestões agora.', unidadeHoras: 'horas', anos: 'anos', bemVindo: 'Bem-vindo', contaCriada: 'Conta criada com sucesso!', humorAtualizado: 'Humor atualizado', erroHumor: 'Não foi possível registrar seu humor.', sonoAtualizado: 'Registro de sono atualizado!', sonoRegistrado: 'Sono registrado!', energiaAtualizada: 'Registro de energia atualizado!', energiaRegistrada: 'Energia registrada!', lembreteCriado: 'Lembrete criado!', lembreteRemovido: 'Lembrete removido', salvando: 'Salvando...',
    carregando: 'Carregando registros...', semLembretes: 'Nenhum lembrete ainda', naoFoiPossivel: 'Não foi possível carregar as notificações.', erroSessao: 'Sua sessão expirou. Entre novamente para editar o perfil.', salvoAgora: 'Salvo agora', prontoSalvar: 'Pronto para salvar', imagemGrande: 'Cada imagem deve ter no máximo 900 KB.', aguardeImagem: 'Aguarde a imagem terminar de carregar.', naoSalvo: 'Não salvo', semRegistros: 'Nenhum registro de sono ainda.', registradoHoje: 'Registrado hoje', aindaNaoRegistrado: 'Ainda não registrado', sincronizado: 'Sincronizado', alterarBanner: 'Alterar banner', alterarFoto: 'Alterar foto', humorCheckin: 'Um check-in rápido para se escutar.', humorMuda: 'Seu registro pode mudar ao longo do dia.'
  },
  en: {
    navInicio: 'Home', navGraficos: 'Charts', navLembretes: 'Reminders', navPerfil: 'Profile', navConfiguracoes: 'Settings', voltar: 'Back',
    preferencias: 'Preferences', configuracoesTitulo: 'Settings', configuracoesDescricao: 'Personalize DailyMind your way. These choices are saved on this device.',
    aparencia: 'Appearance', aparenciaDescricao: 'Choose how DailyMind looks for you.', tema: 'Theme', temaClaro: 'Light', temaPreto: 'Black',
    idiomaTitulo: 'Language', idiomaDescricao: 'Change the main interface language.', idioma: 'Language',
    acessibilidadeTitulo: 'Accessibility', acessibilidadeDescricao: 'Adjust the experience for more comfort.', fonteMaior: 'Larger text', fonteMaiorDescricao: 'Increase text size.',
    altoContraste: 'High contrast', altoContrasteDescricao: 'Strengthen text and border contrast.', reduzirMovimento: 'Reduce motion', reduzirMovimentoDescricao: 'Reduce transitions and animations.', salvoConfiguracoes: 'Preferences saved.',
    tagline: 'Care for your mind, one day at a time', bomDia: 'Good morning,', atualizar: 'Update →', entrar: 'Sign in', criarConta: 'Create account', email: 'Email', senha: 'Password', nomeCompleto: 'Full name', idadeOpcional: 'Age (optional)', ocupacaoOpcional: 'Occupation (optional)', criarMinhaConta: 'Create my account', naoTemConta: 'Do not have an account?', jaTemConta: 'Already have an account?',
    comoVoceEsta: 'How are you feeling today?', humorHoje: "Today's mood", sono: 'Sleep', energia: 'Energy', editar: 'Edit', registrar: 'Tap to record', lembretesHoje: "Today's reminders", novo: '+ New', sugestoes: 'Suggestions for you', sugestoesDescricao: 'Small ideas to care for yourself at your own pace.', atualizarAgora: 'Refresh now', atualizarSugestoes: 'Refresh suggestions', atualizando: 'Refreshing...', proximaEm: 'Next in', graficosTitulo: 'Your charts', humor30: 'Mood in the last 30 days', sono30: 'Sleep in the last 30 days', energia30: 'Energy in the last 30 days', todosLembretes: 'All reminders', nenhumLembrete: 'No reminders created',
    meuPerfil: 'My profile', perfilDescricao: 'Your information is saved to your account.', salvarAlteracoes: 'Save changes', sair: 'Sign out', biografia: 'Bio', ate280: 'Up to 280 characters', fechar: 'Close', confirmar: 'Confirm', cancelar: 'Cancel', qualidadePercebida: 'Perceived quality', nivelEnergia: 'Energy level', horasSono: 'Sleep hours', novoLembrete: 'New reminder', titulo: 'Title', objetoDeixado: 'Object left (optional)', horarioDeixado: 'What time did you leave it? (optional)', icone: 'Icon', criarLembrete: 'Create reminder',
    nenhumaNotificacao: 'No pending notifications.', notificacoes: 'Notifications', voltarDashboard: 'Back', objeto: 'Object', horario: 'Time', lembretePendente: 'Pending reminder', tudoEmDia: 'All clear. No pending notifications.', removerLembrete: 'Remove this reminder?',
    ritmoDescanso: 'Rest rhythm', historicoSono: 'Sleep history', ajustarRegistro: 'Adjust any record whenever you need.', disposicaoDiaria: 'Daily energy', historicoEnergia: 'Energy history', verEvolucao: 'See your progress and update past entries.', qualidade: 'Quality', nenhumSono: 'No sleep records yet.', nenhumaEnergia: 'No energy records yet.', paraVoce: 'For you', carregarSugestoes: 'Record your mood to see suggestions', erroSugestoes: 'Suggestions could not be loaded.', unidadeHoras: 'hours', anos: 'years', bemVindo: 'Welcome', contaCriada: 'Account created successfully!', humorAtualizado: 'Mood updated', erroHumor: 'Your mood could not be saved.', sonoAtualizado: 'Sleep record updated!', sonoRegistrado: 'Sleep recorded!', energiaAtualizada: 'Energy record updated!', energiaRegistrada: 'Energy recorded!', lembreteCriado: 'Reminder created!', lembreteRemovido: 'Reminder removed', salvando: 'Saving...', carregando: 'Loading records...', semLembretes: 'No reminders yet', naoFoiPossivel: 'Notifications could not be loaded.', erroSessao: 'Your session expired. Sign in again to edit your profile.', salvoAgora: 'Saved now', prontoSalvar: 'Ready to save', imagemGrande: 'Each image must be at most 900 KB.', aguardeImagem: 'Wait for the image to finish loading.', naoSalvo: 'Not saved', semRegistros: 'No sleep records yet.', registradoHoje: 'Recorded today', aindaNaoRegistrado: 'Not recorded yet', sincronizado: 'Synced', alterarBanner: 'Change banner', alterarFoto: 'Change photo', humorCheckin: 'A quick check-in to listen to yourself.', humorMuda: 'Your record can change throughout the day.'
  },
  es: {
    navInicio: 'Inicio', navGraficos: 'Gráficos', navLembretes: 'Recordatorios', navPerfil: 'Perfil', navConfiguracoes: 'Configuración', voltar: 'Volver',
    preferencias: 'Preferencias', configuracoesTitulo: 'Configuración', configuracoesDescricao: 'Personaliza DailyMind. Estas opciones se guardan en este dispositivo.',
    aparencia: 'Apariencia', aparenciaDescricao: 'Elige cómo se muestra DailyMind.', tema: 'Tema', temaClaro: 'Claro', temaPreto: 'Negro',
    idiomaTitulo: 'Idioma', idiomaDescricao: 'Cambia el idioma principal de la interfaz.', idioma: 'Idioma',
    acessibilidadeTitulo: 'Accesibilidad', acessibilidadeDescricao: 'Ajustes para una experiencia más cómoda.', fonteMaior: 'Texto más grande', fonteMaiorDescricao: 'Aumenta el tamaño del texto.',
    altoContraste: 'Alto contraste', altoContrasteDescricao: 'Refuerza el contraste de textos y bordes.', reduzirMovimento: 'Reducir movimiento', reduzirMovimentoDescricao: 'Reduce transiciones y animaciones.', salvoConfiguracoes: 'Preferencias guardadas.',
    tagline: 'Cuida tu mente, un día a la vez', bomDia: 'Buenos días,', atualizar: 'Actualizar →', entrar: 'Entrar', criarConta: 'Crear cuenta', email: 'Correo electrónico', senha: 'Contraseña', nomeCompleto: 'Nombre completo', idadeOpcional: 'Edad (opcional)', ocupacaoOpcional: 'Ocupación (opcional)', criarMinhaConta: 'Crear mi cuenta', naoTemConta: '¿No tienes una cuenta?', jaTemConta: '¿Ya tienes una cuenta?',
    comoVoceEsta: '¿Cómo te sientes hoy?', humorHoje: 'Estado de ánimo de hoy', sono: 'Sueño', energia: 'Energía', editar: 'Editar', registrar: 'Toca para registrar', lembretesHoje: 'Recordatorios de hoy', novo: '+ Nuevo', sugestoes: 'Sugerencias para ti', sugestoesDescricao: 'Ideas pequeñas para cuidarte a tu ritmo.', atualizarAgora: 'Actualizar ahora', atualizarSugestoes: 'Actualizar sugerencias', atualizando: 'Actualizando...', proximaEm: 'Siguiente en', graficosTitulo: 'Tus gráficos', humor30: 'Ánimo en los últimos 30 días', sono30: 'Sueño en los últimos 30 días', energia30: 'Energía en los últimos 30 días', todosLembretes: 'Todos los recordatorios', nenhumLembrete: 'No hay recordatorios creados',
    meuPerfil: 'Mi perfil', perfilDescricao: 'Tu información se guarda en tu cuenta.', salvarAlteracoes: 'Guardar cambios', sair: 'Cerrar sesión', biografia: 'Biografía', ate280: 'Hasta 280 caracteres', fechar: 'Cerrar', confirmar: 'Confirmar', cancelar: 'Cancelar', qualidadePercebida: 'Calidad percibida', nivelEnergia: 'Nivel de energía', horasSono: 'Horas de sueño', novoLembrete: 'Nuevo recordatorio', titulo: 'Título', objetoDeixado: 'Objeto dejado (opcional)', horarioDeixado: '¿A qué hora lo dejaste? (opcional)', icone: 'Icono', criarLembrete: 'Crear recordatorio',
    nenhumaNotificacao: 'No hay notificaciones pendientes.', notificacoes: 'Notificaciones', voltarDashboard: 'Volver', objeto: 'Objeto', horario: 'Horario', lembretePendente: 'Recordatorio pendiente', tudoEmDia: 'Todo al día. No hay notificaciones pendientes.', removerLembrete: '¿Eliminar este recordatorio?',
    ritmoDescanso: 'Ritmo de descanso', historicoSono: 'Historial de sueño', ajustarRegistro: 'Ajusta cualquier registro cuando lo necesites.', disposicaoDiaria: 'Disposición diaria', historicoEnergia: 'Historial de energía', verEvolucao: 'Mira tu evolución y actualiza tus registros.', qualidade: 'Calidad', nenhumSono: 'Aún no hay registros de sueño.', nenhumaEnergia: 'Aún no hay registros de energía.', paraVoce: 'Para ti', carregarSugestoes: 'Registra tu ánimo para ver sugerencias', erroSugestoes: 'No se pudieron cargar las sugerencias.', unidadeHoras: 'horas', anos: 'años', bemVindo: 'Bienvenido', contaCriada: '¡Cuenta creada!', humorAtualizado: 'Ánimo actualizado', erroHumor: 'No se pudo guardar tu ánimo.', sonoAtualizado: '¡Registro de sueño actualizado!', sonoRegistrado: '¡Sueño registrado!', energiaAtualizada: '¡Registro de energía actualizado!', energiaRegistrada: '¡Energía registrada!', lembreteCriado: '¡Recordatorio creado!', lembreteRemovido: 'Recordatorio eliminado', salvando: 'Guardando...', carregando: 'Cargando registros...', semLembretes: 'Aún no hay recordatorios', naoFoiPossivel: 'No se pudieron cargar las notificaciones.', erroSessao: 'Tu sesión expiró. Entra de nuevo para editar tu perfil.', salvoAgora: 'Guardado ahora', prontoSalvar: 'Listo para guardar', imagemGrande: 'Cada imagen debe pesar como máximo 900 KB.', aguardeImagem: 'Espera a que la imagen termine de cargar.', naoSalvo: 'No guardado', semRegistros: 'Aún no hay registros de sueño.', registradoHoje: 'Registrado hoy', aindaNaoRegistrado: 'Aún no registrado', sincronizado: 'Sincronizado', alterarBanner: 'Cambiar banner', alterarFoto: 'Cambiar foto', humorCheckin: 'Un check-in rápido para escucharte.', humorMuda: 'Tu registro puede cambiar durante el día.'
  }
}

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
  'Praticar respiração 4-7-8': {
    en: ['Try 4-7-8 breathing', 'Inhale for 4 seconds, hold for 7 and exhale for 8.'],
    es: ['Practica la respiración 4-7-8', 'Inhala 4 segundos, mantén 7 y exhala 8.']
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
      return { sucesso: false, mensagem: resultado.mensagem || `Não foi possível concluir a ação (${resposta.status}).` }
    }
    return resultado
  } catch (erro) {
    return { sucesso: false, mensagem: 'Não foi possível conectar ao DailyMind.' }
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

async function fazerLogout() {
  await api('POST', '/usuarios/logout')
  sessaoPerfil += 1
  usuarioAtual = null
  perfilAlteradoLocalmente = false
  imagensPerfilCarregando = 0
  limparImagensPerfil()
  pararAtualizacaoSugestoes()
  fecharNotificacoes()
  ;['tela-dashboard', 'tela-graficos', 'tela-lembretes', 'tela-perfil', 'tela-configuracoes'].forEach((id) => {
    document.getElementById(id).classList.add('hidden')
  })
  document.getElementById('tela-auth').classList.remove('hidden')
  document.getElementById('form-login').querySelector('form').reset()
  mostrarLogin()
}

function entrarApp() {
  document.getElementById('tela-auth').classList.add('hidden')
  document.getElementById('tela-dashboard').classList.remove('hidden')
  document.getElementById('nome-usuario').textContent = usuarioAtual.nome
  document.getElementById('inicial-usuario').textContent = usuarioAtual.nome.charAt(0).toUpperCase()
  atualizarPreviaPerfil()
  iniciarAtualizacaoSugestoes()
  carregarPerfil()
  carregarDados()
}

// ==================== NAVEGAÇÃO ====================

function mostrarTela(tela) {
  document.getElementById('tela-dashboard').classList.add('hidden')
  document.getElementById('tela-graficos').classList.add('hidden')
  document.getElementById('tela-lembretes').classList.add('hidden')
  document.getElementById('tela-perfil').classList.add('hidden')
  document.getElementById('tela-configuracoes').classList.add('hidden')
  document.getElementById(`tela-${tela}`).classList.remove('hidden')

  if (tela === 'graficos') carregarGraficos()
  if (tela === 'lembretes') carregarTodosLembretes()
  if (tela === 'perfil') carregarPerfil()
  if (tela === 'configuracoes') carregarConfiguracoesTela()
}

function mostrarPerfil() {
  mostrarTela('perfil')
}

function lerConfiguracoes() {
  try {
    const salvas = JSON.parse(localStorage.getItem('dailymind_configuracoes') || '{}')
    return { ...configuracoes, ...salvas }
  } catch (erro) {
    return { ...configuracoes }
  }
}

function traduzirInterface() {
  const idioma = traducoes[configuracoes.idioma] || traducoes['pt-BR']
  document.querySelectorAll('[data-i18n]').forEach(elemento => {
    const texto = idioma[elemento.dataset.i18n]
    if (texto) elemento.textContent = texto
  })
  document.querySelectorAll('[data-i18n-aria]').forEach(elemento => {
    const texto = idioma[elemento.dataset.i18nAria]
    if (texto) elemento.setAttribute('aria-label', texto)
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach(elemento => {
    const texto = idioma[elemento.dataset.i18nPlaceholder]
    if (texto) elemento.placeholder = texto
  })
  document.querySelectorAll('[data-i18n-title]').forEach(elemento => {
    const texto = idioma[elemento.dataset.i18nTitle]
    if (texto) elemento.title = texto
  })
  document.querySelectorAll('.mood-option').forEach(botao => {
    const traducao = traducoesHumor[configuracoes.idioma]?.[botao.dataset.humor]
    if (traducao) botao.querySelector('span:last-child').textContent = traducao.nome
  })
  document.documentElement.lang = configuracoes.idioma
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
    const idioma = traducoes[configuracoes.idioma] || traducoes['pt-BR']
    status.textContent = idioma.salvoConfiguracoes
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

const informacoesHumor = {
  '😊': { nome: 'Feliz', descricao: 'Tem algo bom brilhando por aí. Aproveite no seu ritmo.', classe: 'mood-feliz' },
  '😔': { nome: 'Triste', descricao: 'Tudo bem desacelerar e acolher o que você está sentindo.', classe: 'mood-triste' },
  '😰': { nome: 'Ansioso', descricao: 'Vamos por partes. Um respiro pequeno também é progresso.', classe: 'mood-ansioso' },
  '😫': { nome: 'Cansado', descricao: 'Seu corpo está pedindo cuidado. Faça o próximo passo possível.', classe: 'mood-cansado' },
  '😤': { nome: 'Irritado', descricao: 'Você pode dar espaço para esse sentimento sem se cobrar.', classe: 'mood-irritado' },
  '😐': { nome: 'Neutro', descricao: 'Um momento estável também merece ser percebido.', classe: 'mood-neutro' }
}

function atualizarVisualHumor(emoji, registrado = true) {
  const informacaoBase = informacoesHumor[emoji] || informacoesHumor['😐']
  const informacao = { ...informacaoBase, ...(traducoesHumor[configuracoes.idioma]?.[emoji] || {}) }
  const card = document.getElementById('card-humor')
  card.className = `mood-card ${informacao.classe} bg-white p-6 rounded-2xl shadow-md border cursor-pointer hover:shadow-lg transition`
  document.getElementById('humor-atual').textContent = emoji
  document.getElementById('humor-texto').textContent = registrado ? informacao.nome : 'Como você está?'
  document.getElementById('humor-descricao').textContent = registrado
    ? informacao.descricao
    : 'Escolha uma opção para registrar seu momento.'
  document.getElementById('humor-status').textContent = registrado ? t('registradoHoje') : t('aindaNaoRegistrado')
  document.querySelectorAll('.mood-option').forEach(botao => {
    botao.classList.toggle('selected', registrado && botao.dataset.humor === emoji)
  })
}

async function registrarHumor(emoji) {
  const resultado = await api('POST', '/humor', { usuario_id: usuarioAtual.id, emoji })
  if (resultado.sucesso) {
    atualizarVisualHumor(emoji)
    exibirToast(`${t('humorAtualizado')}: ${(traducoesHumor[configuracoes.idioma]?.[emoji] || informacoesHumor[emoji]).nome}!`)
    fecharModal('modal-humor')
    carregarSugestoes()
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
    document.getElementById('sono-texto').textContent = `${horas}h de sono`
    atualizarBarraSono(horas)
    carregarHistoricoBemEstar()
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
    document.getElementById('energia-texto').textContent = `${nivel}/10 de energia`
    atualizarBarraEnergia(nivel)
    carregarHistoricoBemEstar()
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
      <span class="text-xl flex-shrink-0">${l.icone}</span>
      <div class="flex-1 min-w-0">
        <span class="${l.concluido ? 'line-through text-gray-400' : 'text-gray-700'} block">${l.titulo}</span>
        ${l.objeto_deixado ? `<span class="text-xs text-gray-500">📦 ${t('objeto')}: ${l.objeto_deixado}</span>` : ''}
        ${l.hora_deixado ? `<span class="text-xs text-gray-500">⏰ ${t('horario')}: ${l.hora_deixado}</span>` : ''}
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
        <span class="text-2xl flex-shrink-0">${l.icone}</span>
      </div>
      <div class="flex-1 min-w-0">
        <span class="${l.concluido ? 'line-through text-gray-400' : 'text-gray-700'} font-medium block">${l.titulo}</span>
        ${l.objeto_deixado ? `<span class="text-sm text-gray-600 mt-1 block">📦 ${t('objeto')}: <strong>${l.objeto_deixado}</strong></span>` : ''}
        ${l.hora_deixado ? `<span class="text-sm text-gray-600 block">⏰ ${t('horario')}: <strong>${l.hora_deixado}</strong></span>` : ''}
      </div>
      <button onclick="removerLembrete(${l.id})" class="text-gray-400 hover:text-red-500 transition p-2 flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    </div>
  `).join('')
}

async function alternarLembrete(id) {
  await api('PUT', `/lembretes/${id}/toggle`)
  carregarLembretes()
  carregarTodosLembretes()
  atualizarBadge()
}

async function removerLembrete(id) {
  if (confirm(t('removerLembrete'))) {
    await api('DELETE', `/lembretes/${id}`)
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
      <span class="text-xl">${lembrete.icone || '📌'}</span>
      <span class="min-w-0 text-left">
        <strong class="block truncate text-gray-700">${lembrete.titulo}</strong>
        <small class="block text-gray-500">${lembrete.hora_deixado ? `${t('horario')}: ${lembrete.hora_deixado}` : t('lembretePendente')}</small>
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
            <p class="font-semibold text-gray-700">${registro.horas_sono}h ${t('sono').toLowerCase()}</p>
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
  const dadosHumor = await api('GET', `/humor/${usuarioAtual.id}`)
  const dadosSono = await api('GET', `/sono/${usuarioAtual.id}`)
  const dadosEnergia = await api('GET', `/energia/${usuarioAtual.id}`)

  // Mapear emojis para números
  const mapaEmoji = { '😊': 5, '😔': 2, '😰': 3, '😫': 2, '😤': 1, '😐': 3 }

  // Gráfico de Humor
  const labelsHumor = dadosHumor.dados.map(d => d.data_registro).reverse()
  const valoresHumor = dadosHumor.dados.map(d => mapaEmoji[d.emoji] || 3).reverse()

  if (graficoHumor) graficoHumor.destroy()
  graficoHumor = new Chart(document.getElementById('grafico-humor'), {
    type: 'line',
    data: {
      labels: labelsHumor,
      datasets: [{
        label: t('humorHoje'),
        data: valoresHumor,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 6, ticks: { stepSize: 1 } }
      },
      plugins: { legend: { display: false } }
    }
  })

  // Gráfico de Sono
  const labelsSono = dadosSono.dados.map(d => d.data_registro).reverse()
  const valoresSono = dadosSono.dados.map(d => d.horas_sono).reverse()

  if (graficoSono) graficoSono.destroy()
  graficoSono = new Chart(document.getElementById('grafico-sono'), {
    type: 'bar',
    data: {
      labels: labelsSono,
      datasets: [{
        label: t('horasSono'),
        data: valoresSono,
        backgroundColor: '#a855f7',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 12 }
      },
      plugins: { legend: { display: false } }
    }
  })

  const labelsEnergia = dadosEnergia.dados.map(d => d.data_registro).reverse()
  const valoresEnergia = dadosEnergia.dados.map(d => d.nivel_energia).reverse()

  if (graficoEnergia) graficoEnergia.destroy()
  graficoEnergia = new Chart(document.getElementById('grafico-energia'), {
    type: 'line',
    data: {
      labels: labelsEnergia,
      datasets: [{
        label: t('energia'),
        data: valoresEnergia,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.12)',
        fill: true,
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 10, ticks: { stepSize: 2 } }
      },
      plugins: { legend: { display: false } }
    }
  })
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
  const nome = document.getElementById('perfil-nome').value.trim() || 'Usuário'
  const idade = document.getElementById('perfil-idade').value
  const ocupacao = document.getElementById('perfil-ocupacao').value.trim()
  const bio = document.getElementById('perfil-bio').value.trim()
  const avatar = document.getElementById('perfil-avatar-preview')
  const banner = document.getElementById('perfil-banner-preview')
  const bannerImagem = document.getElementById('perfil-banner-imagem')

  document.getElementById('perfil-nome-preview').textContent = nome
  document.getElementById('perfil-idade-preview').textContent = idade ? `${idade} ${t('anos')}` : t('perfilDescricao')
  document.getElementById('perfil-ocupacao-preview').textContent = ocupacao || 'DailyMind'
  document.getElementById('perfil-bio-preview').textContent = bio
  document.getElementById('perfil-bio-contador').textContent = `${bio.length}/280`
  avatar.textContent = nome.charAt(0).toUpperCase()

  if (usuarioAtual.foto_perfil) {
    avatar.style.backgroundImage = `url(${usuarioAtual.foto_perfil})`
    avatar.classList.add('has-image')
  } else {
    avatar.style.backgroundImage = ''
    avatar.classList.remove('has-image')
  }

  const botaoPerfil = document.getElementById('btn-perfil')
  botaoPerfil.style.backgroundImage = usuarioAtual.foto_perfil
    ? `url(${usuarioAtual.foto_perfil})`
    : ''
  botaoPerfil.style.backgroundPosition = 'center'
  botaoPerfil.style.backgroundSize = 'cover'

  if (usuarioAtual.banner_perfil) {
    bannerImagem.src = usuarioAtual.banner_perfil
    bannerImagem.hidden = false
    banner.classList.add('has-image')
  } else {
    bannerImagem.removeAttribute('src')
    bannerImagem.hidden = true
    banner.classList.remove('has-image')
  }
}

function limparImagensPerfil() {
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
    exibirToast(t('naoFoiPossivel'), 'erro')
    return
  }

  const idSessao = sessaoPerfil
  const usuarioId = usuarioAtual?.id
  imagensPerfilCarregando += 1
  atualizarStatusPerfil(`${t('carregando')}...`, 'saving')
  try {
    const imagemProcessada = await prepararImagemPerfil(arquivo)
    imagensPerfilCarregando -= 1
    if (idSessao !== sessaoPerfil || !usuarioAtual || usuarioAtual.id !== usuarioId) return
    usuarioAtual[campo] = imagemProcessada
    perfilAlteradoLocalmente = true
    atualizarPreviaPerfil()
    if (!imagensPerfilCarregando) atualizarStatusPerfil(t('prontoSalvar'))
  } catch (erro) {
    imagensPerfilCarregando -= 1
    if (idSessao !== sessaoPerfil) return
    atualizarStatusPerfil(t('naoFoiPossivel'), 'error')
    exibirToast(t('naoFoiPossivel'), 'erro')
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
    exibirToast(`${t('nomeCompleto')}: ${t('salvarAlteracoes').toLowerCase()}.`, 'erro')
    return
  }

  if (imagensPerfilCarregando) {
    exibirToast(t('aguardeImagem'), 'erro')
    return
  }

  if (nome.length > 100 || ocupacao.length > 100 || bio.length > 280) {
    exibirToast(t('ate280'), 'erro')
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
      foto_perfil: usuarioAtual.foto_perfil || null,
      banner_perfil: usuarioAtual.banner_perfil || null
    })

    if (resultado.sucesso) {
      usuarioAtual = resultado.usuario
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
      exibirToast(resultado.mensagem || 'Não foi possível salvar o perfil.', 'erro')
    }
  } catch (erro) {
    atualizarStatusPerfil(t('naoSalvo'), 'error')
    exibirToast(t('naoFoiPossivel'), 'erro')
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
    document.getElementById('sono-texto').textContent = `${sono.dado.horas_sono}h ${t('sono').toLowerCase()}`
    document.getElementById('input-sono').value = sono.dado.horas_sono
    document.getElementById('sono-valor').textContent = sono.dado.horas_sono
    atualizarBarraSono(sono.dado.horas_sono)
  }

  if (energia.dado) {
    document.getElementById('energia-texto').textContent = `${energia.dado.nivel_energia}/10 ${t('energia').toLowerCase()}`
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
