// Aguarda o carregamento completo da página
document.addEventListener("DOMContentLoaded", function () {
  const btnLogin = document.querySelector(".btn-login");

  btnLogin.addEventListener("click", function () {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const tipo = document.getElementById("tipo").value;

    // Validação básica
    if (!email || !senha || !tipo) {
      alert("Por favor, preencha todos os campos para continuar.");
      return;
    }

    // Verficação do tamanho minimo da senha (6 digitos)
    if (senha.length < 6) {
      alert("A senha deve ter no minimo 6 caracteres.");
      return;
    }

    // Direciona o usuário conforme o escolhido no selct
    if (tipo === "gestor") {
      window.location.href = "./gestor.html";
    } else if (tipo === "aluno") {
      window.location.href = "./aluno.html";
    } else {
      alert("Selecione um tipo de usuário válido.");
    }
  });
});
