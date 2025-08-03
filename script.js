class TextEncryptor {
  constructor() {
    this.elements = {
      input: document.getElementById("text_area_entradaid"),
      output: document.getElementById("text_area_salidaid"),
      placeholder: document.getElementById("div_img_pTextoid"),
      outputContainer: document.getElementById("div_text_area_salidaid"),
      errorMessage: document.getElementById("div_pantallaid"),
      successMessage: document.getElementById("div_pantalla_copiarid"),
      encryptBtn: document.getElementById("btn_encriptarid"),
      decryptBtn: document.getElementById("btn_desencriptarid"),
      clearBtn: document.getElementById("btn_borrarid"),
      copyBtn: document.getElementById("btn_copiarid")
    }

    // Reglas de encriptación
    this.encryptionRules = {
      e: "enter",
      i: "imes",
      a: "ai",
      o: "ober",
      u: "ufat"
    }

    // Reglas de desencriptación (inversas)
    this.decryptionRules = {
      enter: "e",
      imes: "i",
      ai: "a",
      ober: "o",
      ufat: "u"
    }

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.resetUI()
    this.setupInputValidation()
  }

  setupEventListeners() {
    this.elements.encryptBtn?.addEventListener("click", () => this.handleEncrypt())
    this.elements.decryptBtn?.addEventListener("click", () => this.handleDecrypt())
    this.elements.clearBtn?.addEventListener("click", () => this.handleClear())
    this.elements.copyBtn?.addEventListener("click", () => this.handleCopy())

    this.elements.errorMessage?.addEventListener("click", () =>
      this.hideMessage("error")
    )
    this.elements.successMessage?.addEventListener("click", () =>
      this.hideMessage("success")
    )

    // Ocultar mensajes después de 3 segundos
    document.addEventListener("click", (e) => {
      if (e.target.closest(".message__close")) {
        this.hideAllMessages()
      }
    })

    // Entrada de texto en tiempo real
    this.elements.input?.addEventListener("input", () => this.validateInput())
  }

  setupInputValidation() {
    if (!this.elements.input) return

    this.elements.input.addEventListener("input", (e) => {
      let value = e.target.value

      // Eliminar caracteres no permitidos
      value = value.replace(/[^a-z\s]/g, "")

      // Actualizar valor si hubo cambios
      if (value !== e.target.value) {
        e.target.value = value
        this.showMessage("error", "Solo se permiten letras minúsculas y espacios")
      }
    })

    // Prevenir pegado de caracteres no válidos
    this.elements.input.addEventListener("paste", (e) => {
      e.preventDefault()
      const paste = (e.clipboardData || window.clipboardData).getData("text")
      const cleanPaste = paste.toLowerCase().replace(/[^a-z\s]/g, "")

      if (cleanPaste !== paste) {
        this.showMessage(
          "error",
          "Texto limpiado: solo letras minúsculas permitidas"
        )
      }

      this.elements.input.value += cleanPaste
      this.validateInput()
    })
  }

  resetUI() {
    this.hideElement(this.elements.outputContainer)
    this.showElement(this.elements.placeholder)
    this.hideAllMessages()

    if (this.elements.input) this.elements.input.value = ""
    if (this.elements.output) this.elements.output.value = ""
  }

  validateInput() {
    const text = this.elements.input?.value || ""
    const hasInvalidChars = /[^a-z\s]/.test(text)

    if (hasInvalidChars) {
      this.elements.input.classList.add("invalid")
      return false
    } else {
      this.elements.input.classList.remove("invalid")
      return true
    }
  }

  isEmptyInput() {
    return !this.elements.input?.value.trim()
  }

  encryptText(text) {
    let encrypted = text.toLowerCase()

    Object.entries(this.encryptionRules).forEach(([key, value]) => {
      encrypted = encrypted.replace(new RegExp(key, "g"), value)
    })

    return encrypted
  }

  decryptText(text) {
    let decrypted = text.toLowerCase()

    // Aplicar reglas en orden específico para evitar conflictos
    Object.entries(this.decryptionRules).forEach(([key, value]) => {
      decrypted = decrypted.replace(new RegExp(key, "g"), value)
    })

    return decrypted
  }

  handleEncrypt() {
    if (this.isEmptyInput()) {
      this.showMessage("error", "Por favor, ingresa texto para encriptar")
      return
    }

    if (!this.validateInput()) {
      this.showMessage("error", "Solo se permiten letras minúsculas y espacios")
      return
    }

    const inputText = this.elements.input.value
    const encrypted = this.encryptText(inputText)

    this.displayResult(encrypted)
    this.addToHistory("encrypt", inputText, encrypted)

    // Feedback visual
    this.animateButton(this.elements.encryptBtn)
  }

  handleDecrypt() {
    if (this.isEmptyInput()) {
      this.showMessage("error", "Por favor, ingresa texto para desencriptar")
      return
    }

    const inputText = this.elements.input.value
    const decrypted = this.decryptText(inputText)

    this.displayResult(decrypted)
    this.addToHistory("decrypt", inputText, decrypted)

    // Feedback visual
    this.animateButton(this.elements.decryptBtn)
  }

  handleClear() {
    this.resetUI()
    this.elements.input?.focus()
    this.animateButton(this.elements.clearBtn)
  }

  async handleCopy() {
    if (!this.elements.output?.value) {
      this.showMessage("error", "No hay texto para copiar")
      return
    }

    try {
      await navigator.clipboard.writeText(this.elements.output.value)
      this.showMessage("success", "¡Texto copiado correctamente!")
      this.animateButton(this.elements.copyBtn)
    } catch (error) {
      console.error("Error al copiar:", error)

      // Fallback para navegadores que no soportan clipboard API
      this.fallbackCopy(this.elements.output.value)
    }
  }

  fallbackCopy(text) {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()

    try {
      document.execCommand("copy")
      this.showMessage("success", "¡Texto copiado correctamente!")
    } catch (error) {
      this.showMessage("error", "Error al copiar. Usa Ctrl+C manualmente.")
    } finally {
      document.body.removeChild(textarea)
    }
  }

  displayResult(text) {
    if (this.elements.output) {
      this.elements.output.value = text
    }

    this.hideElement(this.elements.placeholder)
    this.showElement(this.elements.outputContainer)

    // Auto scroll al resultado en móviles
    if (window.innerWidth < 768) {
      this.elements.outputContainer?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      })
    }
  }

  showMessage(type = "error", text = "") {
    const messageElement =
      type === "success" ? this.elements.successMessage : this.elements.errorMessage

    if (messageElement) {
      // Actualizar texto si se proporciona
      if (text) {
        const textElement = messageElement.querySelector("p")
        textElement.textContent = text
      }

      this.showElement(messageElement)

      // Auto-hide después de 3 segundos
      setTimeout(() => {
        this.hideElement(messageElement)
      }, 3000)
    }
  }

  hideMessage(type) {
    const messageElement =
      type === "success" ? this.elements.successMessage : this.elements.errorMessage

    this.hideElement(messageElement)
  }

  hideAllMessages() {
    this.hideElement(this.elements.errorMessage)
    this.hideElement(this.elements.successMessage)
  }

  showElement(element) {
    if (element) {
      element.style.display = "block"
    }
  }

  hideElement(element) {
    if (element) {
      element.style.display = "none"
    }
  }

  animateButton(button) {
    if (!button) return

    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      button.style.transform = "scale(1)"
    }, 150)
  }

  addToHistory(operation, input, output) {
    const historyItem = {
      timestamp: new Date().toISOString(),
      operation,
      input,
      output
    }

    // Guardar en localStorage para persistencia
    try {
      const history = JSON.parse(localStorage.getItem("encryptor_history") || "[]")
      history.unshift(historyItem)

      // Mantener solo los últimos 10 elementos
      if (history.length > 10) {
        history.splice(10)
      }

      localStorage.setItem("encryptor_history", JSON.stringify(history))
    } catch (error) {
      console.warn("No se pudo guardar en el historial:", error)
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si todos los elementos necesarios están presentes
  const requiredElements = [
    "text_area_entradaid",
    "btn_encriptarid",
    "btn_desencriptarid"
  ]

  const missingElements = requiredElements.filter(
    (id) => !document.getElementById(id)
  )

  if (missingElements.length > 0) {
    console.error("Elementos faltantes:", missingElements)
    return
  }

  // Inicializar la aplicación
  window.textEncryptor = new TextEncryptor()
})

// Manejar errores globales
window.addEventListener("error", (e) => {
  console.error("Error en la aplicación:", e.error)
})
