// Ícones do DailyMind: substituem os emojis na exibição.
// Os dados continuam iguais no banco (os emojis de humor, lembretes e sugestões
// seguem sendo gravados e lidos como antes); aqui eles só viram imagens na tela.
(function () {
  const PASTA = 'img/icones/'

  // Emoji gravado no banco/código → nome do ícone
  const EMOJI_PARA_ICONE = {
    // Lembretes
    '💧': 'gota', '💊': 'pilula', '🧘': 'meditacao', '📚': 'livros', '🏃': 'tenis',
    '🍎': 'maca', '😴': 'dormir', '📌': 'alfinete',
    // Sugestões
    '😊': 'rosto-feliz', '📞': 'telefone', '🍵': 'xicara', '🎵': 'nota-musical', '🌬': 'vento',
    '🚶': 'pegadas', '🤸': 'alongar', '📝': 'caderno', '🚿': 'chuveiro', '📋': 'prancheta',
    '🌱': 'broto', '🎨': 'paleta', '💬': 'balao', '🫖': 'bule', '🎧': 'fones', '🪟': 'janela',
    '🧸': 'ursinho', '🪜': 'escada', '✅': 'check', '🛋': 'sofa', '🚪': 'porta', '✍': 'caneta',
    '🧭': 'bussola', '👀': 'olhos', '💡': 'lampada', '🎯': 'estrela',
    // Interface
    '🌙': 'lua', '⚡': 'raio', '☀': 'sol', '⚙': 'engrenagem', '📷': 'camera', '🌐': 'globo',
    '♿': 'acessibilidade', '📊': 'grafico', '⏰': 'despertador', '👤': 'perfil', '📦': 'caixa'
  }

  // Humor (emoji gravado) → rosto simples usado na área administrativa
  const HUMOR_PARA_ICONE = {
    '😊': 'humor-feliz', '😔': 'humor-triste', '😰': 'humor-ansioso',
    '😫': 'humor-cansado', '😤': 'humor-irritado', '😐': 'humor-neutro'
  }

  // Textos alternativos das imagens nos três idiomas da interface
  const ROTULOS = {
    'gota': ['Água', 'Water', 'Agua'],
    'pilula': ['Remédio', 'Medicine', 'Medicamento'],
    'meditacao': ['Meditação', 'Meditation', 'Meditación'],
    'livros': ['Estudos', 'Study', 'Estudio'],
    'tenis': ['Exercício', 'Exercise', 'Ejercicio'],
    'maca': ['Alimentação', 'Food', 'Alimentación'],
    'dormir': ['Descanso', 'Rest', 'Descanso'],
    'alfinete': ['Lembrete', 'Reminder', 'Recordatorio'],
    'estrela': ['Destaque', 'Highlight', 'Destacado'],
    'rosto-feliz': ['Bem-estar', 'Well-being', 'Bienestar'],
    'telefone': ['Telefone', 'Phone', 'Teléfono'],
    'xicara': ['Chá', 'Tea', 'Té'],
    'nota-musical': ['Música', 'Music', 'Música'],
    'vento': ['Respiração', 'Breathing', 'Respiración'],
    'pegadas': ['Caminhada', 'Walk', 'Caminata'],
    'alongar': ['Alongamento', 'Stretching', 'Estiramiento'],
    'caderno': ['Escrita', 'Writing', 'Escritura'],
    'chuveiro': ['Banho', 'Shower', 'Ducha'],
    'prancheta': ['Lista', 'List', 'Lista'],
    'broto': ['Natureza', 'Nature', 'Naturaleza'],
    'paleta': ['Arte', 'Art', 'Arte'],
    'balao': ['Conversa', 'Conversation', 'Conversación'],
    'bule': ['Bebida quente', 'Warm drink', 'Bebida caliente'],
    'fones': ['Áudio', 'Audio', 'Audio'],
    'janela': ['Janela', 'Window', 'Ventana'],
    'ursinho': ['Conforto', 'Comfort', 'Consuelo'],
    'escada': ['Passo a passo', 'Step by step', 'Paso a paso'],
    'check': ['Concluído', 'Done', 'Hecho'],
    'sofa': ['Pausa', 'Break', 'Pausa'],
    'porta': ['Sair um pouco', 'Step outside', 'Salir un poco'],
    'caneta': ['Anotação', 'Note', 'Nota'],
    'bussola': ['Orientação', 'Direction', 'Orientación'],
    'olhos': ['Observar', 'Notice', 'Observar'],
    'lampada': ['Ideia', 'Idea', 'Idea'],
    'lua': ['Sono', 'Sleep', 'Sueño'],
    'raio': ['Energia', 'Energy', 'Energía'],
    'sol': ['Sol', 'Sun', 'Sol'],
    'engrenagem': ['Administração', 'Administration', 'Administración'],
    'camera': ['Câmera', 'Camera', 'Cámara'],
    'globo': ['Idioma', 'Language', 'Idioma'],
    'acessibilidade': ['Acessibilidade', 'Accessibility', 'Accesibilidad'],
    'grafico': ['Gráficos', 'Charts', 'Gráficos'],
    'despertador': ['Lembretes', 'Reminders', 'Recordatorios'],
    'relogio': ['Horário', 'Time', 'Horario'],
    'perfil': ['Perfil', 'Profile', 'Perfil'],
    'caixa': ['Objeto', 'Object', 'Objeto'],
    'humor-feliz': ['Feliz', 'Happy', 'Feliz'],
    'humor-triste': ['Triste', 'Sad', 'Triste'],
    'humor-ansioso': ['Ansioso', 'Anxious', 'Ansioso'],
    'humor-cansado': ['Cansado', 'Tired', 'Cansado'],
    'humor-irritado': ['Irritado', 'Irritated', 'Irritado'],
    'humor-neutro': ['Neutro', 'Neutral', 'Neutro']
  }

  const REGEX_EMOJI = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:️|⃣|[\u{1F3FB}-\u{1F3FF}]|‍(?:\p{Extended_Pictographic}|\p{Regional_Indicator}))*️?/gu

  const idiomaAtual = () => {
    try { if (typeof configuracoes !== 'undefined' && configuracoes.idioma) return configuracoes.idioma } catch (_) {}
    return document.documentElement.lang || 'pt-BR'
  }
  const indiceIdioma = (idioma = idiomaAtual()) => (idioma === 'en' ? 1 : idioma === 'es' ? 2 : 0)

  const normalizar = valor => String(valor ?? '').replace(/[️‍]/g, '').trim()

  function nomeDoIcone(valor) {
    if (ROTULOS[valor]) return valor
    const limpo = normalizar(valor)
    return EMOJI_PARA_ICONE[limpo] || EMOJI_PARA_ICONE[valor] || 'estrela'
  }

  function rotuloDoIcone(nome) {
    return (ROTULOS[nome] || ROTULOS.estrela)[indiceIdioma()]
  }

  // HTML de uma imagem de ícone. "valor" pode ser um emoji (vindo do banco) ou o nome do ícone.
  function imagemIcone(valor, classe = 'dm-ico', decorativo = false) {
    const nome = nomeDoIcone(valor)
    return `<img src="${PASTA}${nome}.svg" alt="${rotuloDoIcone(nome)}" class="${classe}" data-icone="${nome}" width="48" height="48"${decorativo ? ' aria-hidden="true"' : ''}>`
  }

  // Rosto de humor para a administração (o Mimo não aparece nessa área)
  function imagemHumorAdmin(emoji, classe = 'admin-humor-ico') {
    const nome = HUMOR_PARA_ICONE[normalizar(emoji)] || 'humor-neutro'
    return `<img src="${PASTA}${nome}.svg" alt="${rotuloDoIcone(nome)}" class="${classe}" data-icone="${nome}" width="48" height="48" aria-hidden="true">`
  }

  // Remove emojis de um texto exibido (os textos originais não são alterados)
  function semEmoji(texto) {
    if (typeof texto !== 'string') return texto
    return texto.replace(REGEX_EMOJI, '').replace(/\s{2,}/g, ' ').trim()
  }

  // Atualiza os textos alternativos dos ícones já na página quando o idioma muda
  function atualizarRotulosIcones() {
    document.querySelectorAll('img[data-icone]').forEach(img => {
      const nome = img.dataset.icone
      if (ROTULOS[nome]) img.alt = rotuloDoIcone(nome)
    })
  }
  new MutationObserver(atualizarRotulosIcones).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })

  window.imagemIcone = imagemIcone
  window.imagemHumorAdmin = imagemHumorAdmin
  window.semEmoji = semEmoji
  window.atualizarRotulosIcones = atualizarRotulosIcones
})()
