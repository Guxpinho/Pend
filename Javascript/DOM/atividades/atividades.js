// ----------------------------
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

// Criar elemento dinamicamente
let nome = document.querySelector("#nome");
let listarNome = document.querySelector("#listarNome");
let nomeListado = document.querySelector("#nomeListado");

// Desafio HARD
let nomeHARD = document.querySelector("#nomehard");
let addnomeHARD = document.querySelector("#addnomeHARD");
let p_nomeHARD = document.querySelector("#p_nomehard");

// Validação de email
let email = document.querySelector("#email");
let validarEmail = document.querySelector("#validarEmail");
let p_email = document.querySelector("#p_email");

//validção da senha
let senha = document.querySelector("#senha");


// ----------------------------
// Mudar cor do texto
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


// ----------------------------
// Listar nomes
listarNome.addEventListener("click", function() {

    if (nome.value.trim() === "") {
        alert("Por favor, insira um nome antes de listar.");
        return;
    }

    let li = document.createElement("li");
    li.textContent = nome.value;
    nomeListado.appendChild(li);

    nome.value = "";

    // Remover item ao clicar
    li.addEventListener("click", function() {
        let confirmar = confirm("Deseja remover este nome da lista?");
        if (confirmar) {
            nomeListado.removeChild(li);
        }
    });
});


// ----------------------------
// Desafio HARD — validação de nome
addnomeHARD.addEventListener("click", function() {

    if (nomeHARD.value.trim() === "") {
        p_nomeHARD.style.color = "red";
        p_nomeHARD.textContent = "Esse campo é obrigatório para enviar";
        return;
    }

    p_nomeHARD.style.color = "green";
    p_nomeHARD.textContent = "Nome enviado com sucesso!";
});


// ----------------------------
// Validação de email
validarEmail.addEventListener("click", function() {

    let emailValue = email.value.trim();

    if (emailValue.includes("@") && emailValue.includes(".")) {
        p_email.textContent = "Email válido!";
        p_email.style.color = "green";
    } else {
        p_email.textContent = "Email inválido.";
        p_email.style.color = "red";
    }
});

let msgSenha = document.querySelector("#msgSenha");

senha.addEventListener("input", function() {
    let senhaValue = senha.value;

    if (senhaValue.length < 6) {
        senha.style.borderColor = "red";
        msgSenha.textContent = "A senha deve conter pelo menos 6 caracteres.";
        msgSenha.style.color = "red";
    } else {
        senha.style.borderColor = "red";
        msgSenha.textContent = "senha melhorou!";
    } 
    if (senhaValue.length >= 8) {
        senha.style.borderColor = "green";
        msgSenha.textContent = "Senha válida!";
        msgSenha.style.color = "green";
    }
});