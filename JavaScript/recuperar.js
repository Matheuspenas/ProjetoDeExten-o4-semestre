document
  .getElementById("recuperarForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    if (email) {
      alert(
        "Um email foi enviado para " +
          email +
          " com instruções para redefinição de senha."
      );
    } else {
      alert("Por favor, insira uma email válido");
    }
  });