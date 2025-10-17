// Aguarda o carregamento completo da página
document.addEventListener("DOMContentLoaded", function () {
  const btnCriar = document.querySelector(".btn-criar");

  btnCriar.addEventListener("click", function () {
    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const tipo = document.getElementById("tipo").value;

    // Verifica se todos os campos foram preenchidos
    if (!nome || !sobrenome || !email || !senha || !tipo) {
      alert("Por favor, preencha todos os campos para continuar.");
      return;
    }

    // Verifica se o email e valido
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    // Verficação do tamanho minimo da senha (6 digitos)
    if (senha.length < 6) {
      alert("A senha deve ter no minimo 6 caracteres.");
      return;
    }

    // Mensagem após cadastro do usuário
    alert(`Conta criada com sucesso! Bem-vindo(a), ${nome}!`);

    // Direciona o usuário conforme o escolhido no select
    if (tipo === "gestor") {
      window.location.href = "./gestor.html";
    } else if (tipo === "aluno") {
      window.location.href = "./aluno.html";
    } else {
      alert("Selecione um tipo de usuário válido.");
    }
  });
});
