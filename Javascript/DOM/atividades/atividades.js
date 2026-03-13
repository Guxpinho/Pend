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
// criar um elemento dinamicamente
let nome = document.querySelector("#nome");
let ListarNome = document.querySelector("#listarNome");
let nomeListado = document.querySelector("#nomeListado");
let remove = document.querySelector("#remover");
// desafio hard
let nomeHARD = document.querySelector("#nomehard");
let addnomeHARD = document.querySelector("#addnomeHARD");
let p_nomeHARD = document.querySelector("#p_nomehard");


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


ListarNome.onclick = function() {
       if (nome.value === "") {
            alert("Por favor, insira um nome antes de listar.");
            return;
        }
        let li = document.createElement("li");// Criar um elemento <li>
        li.textContent = nome.value;// Definir o texto do <li> como o valor do campo de texto
        nomeListado.appendChild(li);   // Adicionar o <li> à lista
        nome.value = ""; // Limpar o campo de texto após adicionar o nome à lista   
        li.addEventListener("click", function() {
        let confimar = confirm("Deseja realmente limpar a lista?");
        if (confimar) {
            nomeListado.removeChild(li); // Limpar a lista
        } // Remover o <li> da lista quando clicado
        });
    };

addnomeHARD.onclick = function() {

    if (nomeHARD.value.trim() === "") {
        p_nomeHARD.style.color = "red";
        p_nomeHARD.textContent = "Esse campo é obrigatório para enviar";
        return; 
    }
}