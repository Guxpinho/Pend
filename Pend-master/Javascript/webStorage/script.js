const nome = document.querySelector("#nome");
const botaosalvar = document.querySelector("#salvar")
const botaoRecuperar = document.querySelector("#recuperar");
const botaoExcluir = document.querySelector("#excluir");

const resultado = document.querySelector("#resultado");

botaosalvar.addEventListener("click", function() {

    localStorage.setItem("nome", nome.value);

    resultado.textContent = "nome salvo com sucesso!";
});

botaoRecuperar.addEventListener("click", function() {
    const nomeRecuperado = localStorage.getItem("nome");

    resultado.textContent = `Nome armazenado/recuperado: ${nomeRecuperado}`;
});

botaoExcluir.addEventListener("click", function() {
    localStorage.removeItem("nome");

    resultado.textContent = "Nome excluído com sucesso!";
});