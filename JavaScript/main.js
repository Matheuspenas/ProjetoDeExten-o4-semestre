// Aguarda o carregamento completo da página
document.addEventListener("DOMContentLoaded", function () {
  const btnLogin = document.querySelector(".btn-login");

  btnLogin.addEventListener("click", function () {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const tipo = document.getElementById("tipo").value;

    // Verifica se todos os campos foram preenchidos
    if (!email || !senha || !tipo) {
      alert("Por favor, preencha todos os campos para continuar.");
      return;
    }

    // Verifica se p email e valido
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    // Verficação do tamanho minimo da senha (6 digitos)
    if (senha.length < 6) {
      alert("A senha deve ter no minimo 6 caracteres.");
      return;
    }

    // Redirecionamento conforme tipo de usuário
    switch (tipo) {
      case "gestor":
        window.location.href = "./gestor.html";
        break;
      case "aluno":
        window.location.href = "./aluno.html";
        break;
      case "analista":
        window.location.href = "./analista.html";
        break;
      default:
        alert("Selecione um tipo de usuário válido.");
    }
  });
});
