function validarSessao() {
  var email = sessionStorage.EMAIL_USUARIO;

  var b_usuario = document.getElementById("b_usuario");

  if (email != null && apelido != null) {
    b_usuario.innerHTML = apelido;
  } else {
    window.location = "../login.html";
  }
};

export function alerta(titulo, texto, icone) {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: icone,
    draggable: true,
    background: "rgb(20, 20, 20)",
    color: "#f1f1f1",
    timer: 1500,
    showConfirmButton: false
  });
}

function limparSessao() {
  sessionStorage.clear();
  window.location = "../login.html";
}

// carregamento (loading)
function aguardar() {
}

function finalizarAguardar() {

  cardErro.style.display = "none";
}

export function sumirMensagem() {
  cardErro.style.display = "none";
}

export function mostrarErro(mensagem) {
  cardErro.style.display = "flex";
  mensagem_erro.innerHTML = mensagem;
  setTimeout(() => {
    finalizarAguardar();
  }, 3000);
}