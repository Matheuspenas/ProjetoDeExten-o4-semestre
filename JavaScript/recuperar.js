(function () {
  emailjs.init({
    publicKey: "d6cClnGrNJL2j-Jh3",
  });
})();

document
  .getElementById("recuperarForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const emailusuario = document.getElementById("email").value.trim();

    if (!emailusuario) {
      alert("Por favor, digite um e-mail válido.");
      return;
    }

    const linkRedefinicao = `https://seudominio.com/redefinir-senha?email=${encodeURIComponent(
      emailusuario
    )}`;

    const params = {
      emailusuario: emailusuario, // destinatário (To Email)
      email: emailusuario, // aparece no texto do e-mail
      link: linkRedefinicao, // usado dentro do corpo do e-mail
      from_name: "Central de Serviço TI",
    };

    emailjs
      .send("service_ybwlqbt", "template_ytcqvfn", params)
      .then(() => {
        alert(
          `✅ Um e-mail foi enviado para ${emailusuario} com o link de redefinição de senha.`
        );
        document.getElementById("recuperarForm").reset();
      })
      .catch((error) => {
        console.error("Erro ao enviar e-mail:", error);
        alert("❌ Ocorreu um erro ao enviar o e-mail. Tente novamente.");
      });
  });
