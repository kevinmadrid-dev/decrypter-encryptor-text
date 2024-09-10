/*Función para ocultar el div_pantalla, div_pantalla_copiarid y div_text_area_salida_img, 
para que no se muestren mientras no son necesarios*/
function ocultar_div() {
  document.getElementById("div_text_area_salidaid").style.display = "none"
  document.getElementById("div_pantallaid").style.display = "none"
  document.getElementById("div_text_area_salidaid").style.display = "none"
  document.getElementById("div_pantalla_copiarid").style.display = "none"
}

ocultar_div()

/*Función para ocultar div_pantallaid, haciendo clic en cualquier parte del main*/
function ocultar_pantalla() {
  document.getElementById("div_pantallaid").style.display = "none"
  document.getElementById("div_pantalla_copiarid").style.display = "none"
}

let div0 = document.querySelector("#div_pantallaid")
div0.onclick = ocultar_pantalla

let div1 = document.querySelector("#div_pantalla_copiarid")
div1.onclick = ocultar_pantalla

/*Función para encriptar texto, además de la validación cuando haya o no haya texto ingresado en el textarea*/
function encriptar_texto() {
  if (document.querySelector("#text_area_entradaid").value == "") {
    document.getElementById("div_pantallaid").style.display = ""
  } else {
    document.getElementById("div_img_pTextoid").style.display = "none"
    document.getElementById("div_text_area_salidaid").style.display = "block"

    let texto = document.querySelector("#text_area_entradaid").value
    let textoCifrado = texto
      .replace(/e/gi, "enter")
      .replace(/i/gi, "imes")
      .replace(/a/gi, "ai")
      .replace(/o/gi, "ober")
      .replace(/u/gi, "ufat")

    document.querySelector(".text_area_salida").value = textoCifrado
    document.querySelector("#text_area_entradaid").value
  }
}

let btn1 = document.querySelector("#btn_encriptarid")
btn1.onclick = encriptar_texto

/*Función para desencriptar texto, además de la validación cuando haya o no haya texto ingresado en el textarea*/
function desencriptar_texto() {
  if (document.querySelector("#text_area_entradaid").value == "") {
    document.getElementById("div_pantallaid").style.display = ""
  } else {
    let texto = document.querySelector("#text_area_entradaid").value
    let textoCifrado = texto
      .replace(/enter/gi, "e")
      .replace(/imes/gi, "i")
      .replace(/ai/gi, "a")
      .replace(/ober/gi, "o")
      .replace(/ufat/gi, "u")

    document.querySelector(".text_area_salida").value = textoCifrado
    document.querySelector("#text_area_entradaid").value
  }
}

let btn2 = document.querySelector("#btn_desencriptarid")
btn2.onclick = desencriptar_texto

/*Función para borrar texto, además de la validación cuando haya o no haya texto ingresado en el textarea*/
function borrar_texto() {
  if (document.querySelector("#text_area_entradaid").value == "") {
    document.getElementById("div_pantallaid").style.display = ""
  } else {
    document.getElementById("text_area_entradaid").value = ""
    document.getElementById("text_area_salidaid").value = ""

    document.getElementById("div_text_area_salidaid").style.display = "none"
    document.getElementById("div_img_pTextoid").style.display = "initial"
  }
}

let btn3 = document.querySelector("#btn_borrarid")
btn3.onclick = borrar_texto

/*Función para copiar texto del text_area_salida*/
function copiar_texto() {
  let text = document.getElementById("text_area_salidaid")

  document.getElementById("div_pantalla_copiarid").style.display = "initial"

  text.select()
  navigator.clipboard.writeText(text.value)
}

let btn4 = document.querySelector("#btn_copiarid")
btn4.onclick = copiar_texto
