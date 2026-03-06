// Seleção de elementos
let cor = document.querySelector(".cor");
let vermelho = document.querySelector("#vermelho");
let azul = document.querySelector("#azul");

// Mostrar e ocultar mensagem
let mensagem = document.querySelector(".mensagem");
let botaoMostrar = document.querySelector(".botaoMostrar");

// Campo de texto
let campoTexto = document.querySelector("#Texto");
let contadorCaracteres = document.querySelector("#contador");

// Contador de cliques
let botaoCliques = document.querySelector("#contadorCliques");
let contador1 = document.querySelector("#contador1");
let contadorClique = 0;

// ----------------------------
// Mudar cor
vermelho.addEventListener("click", function() {
    cor.style.color = "red";
});

azul.addEventListener("click", function() {
    cor.style.color = "blue";
});

// ----------------------------
// Mostrar / esconder mensagem
botaoMostrar.addEventListener("click", function() {
    mensagem.classList.toggle("oculto");
});

// ----------------------------
// Contador de caracteres
campoTexto.addEventListener("input", function() {
    let texto = campoTexto.value;
    contadorCaracteres.textContent = "Caracteres digitados: " + texto.length;
});

// ----------------------------
// Contador de cliques
botaoCliques.addEventListener("click", function() {
    contadorClique++;
    contador1.textContent = "Contador de Cliques: " + contadorClique;
});