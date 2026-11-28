// Ajustes de acessibilidade da interface (somente apresentação/teclado).
// Não altera dados, chamadas à API nem fluxos existentes: apenas permite usar
// por teclado os cartões clicáveis e conduz o foco para dentro e para fora dos modais.
(function () {
  // Cartões com role="button" respondem a Enter e Espaço como um botão.
  document.addEventListener('keydown', (evento) => {
    const alvo = evento.target
    if (!(alvo instanceof HTMLElement)) return
    if (alvo.getAttribute('role') !== 'button' || alvo.tagName === 'BUTTON') return
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault()
      alvo.click()
    }
  })

  const seletorFocavel = 'button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  const origemDoFoco = new WeakMap()

  // Quando um modal aparece, o foco vai para o primeiro controle dele;
  // quando é fechado, o foco volta para o elemento que o abriu.
  const observador = new MutationObserver((mudancas) => {
    mudancas.forEach(({ target: modal }) => {
      const aberto = !modal.classList.contains('hidden')
      if (aberto && !origemDoFoco.has(modal)) {
        origemDoFoco.set(modal, document.activeElement)
        const selecionado = modal.querySelector('.mood-option.selected')
        const primeiro = selecionado || modal.querySelector(seletorFocavel)
        if (primeiro) setTimeout(() => primeiro.focus({ preventScroll: true }), 30)
      } else if (!aberto && origemDoFoco.has(modal)) {
        const origem = origemDoFoco.get(modal)
        origemDoFoco.delete(modal)
        if (origem && typeof origem.focus === 'function' && document.contains(origem) && origem.offsetParent !== null) {
          origem.focus({ preventScroll: true })
        }
      }
    })
  })

  document.querySelectorAll('.dm-modal-fundo').forEach((modal) => {
    observador.observe(modal, { attributes: true, attributeFilter: ['class'] })
  })

  // Esc fecha o modal aberto, como o botão Fechar/Cancelar.
  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape') return
    const abertos = Array.from(document.querySelectorAll('.dm-modal-fundo')).filter((modal) => !modal.classList.contains('hidden'))
    const modal = abertos[abertos.length - 1]
    if (modal && typeof window.fecharModal === 'function') {
      evento.preventDefault()
      window.fecharModal(modal.id)
    }
  })
})()
