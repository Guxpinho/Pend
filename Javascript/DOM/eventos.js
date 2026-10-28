let botao = document.querySelector("#botao");
let texto = document.querySelector(".texto");

botao.addEventListener("click", function() {
    texto.textContent = "Botão alterado após o clique!";
});

let input = document.querySelector("#nome");
let resultado = document.querySelector("#resultado");

input.addEventListener("input", function() {
    resultado.textContent = input.value;
});

