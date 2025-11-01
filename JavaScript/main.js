// Aguarda o carregamento completo da página
document.addEventListener("DOMContentLoaded", function () {
  const btnLogin = document.querySelector(".btn-login");

  btnLogin.addEventListener("click", function () {
    const email = document.getElementById("email").value.trim().toLowerCase(); // Convertendo para minúsculas
    const senha = document.getElementById("senha").value.trim();

    let tipo = null;

    // Verificação de credenciais e determinação do tipo (apenas para teste)
    if (email === "gestor@universidade.com" && senha === "senha123") {
      tipo = "gestor";
    } else if (email === "aluno@universidade.com" && senha === "senha123") {
      tipo = "aluno";
    } else if (email === "analista@universidade.com" && senha === "senha123") {
      tipo = "analista";
    } else {
      alert("Email ou senha incorretos.");
      return;
    }

    // Verifica se os campos de email e senha foram preenchidos
    if (!email || !senha) {
      alert("Por favor, preencha todos os campos para continuar.");
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
        alert("O tipo de usuário não foi definido corretamente.");
    }
  });
});
