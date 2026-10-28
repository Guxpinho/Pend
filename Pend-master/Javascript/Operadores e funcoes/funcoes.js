console.log("Atividade 4");

function saudacao() {
    console.log("Olá, JavaScript!");
}

saudacao();

// ----------------------------// 

console.log("Atividade 5");

function saudacaoComNome(nome) {
    console.log("Olá, " + nome + "!");
}

saudacaoComNome("Gustavo");

// ----------------------------

console.log("Atividade 6");

function soma(a, b) {
    return a + b;
}

let resultado = soma(5, 3);
console.log("A soma é:", resultado);

// ----------------------------

console.log("Atividade 7 - IMC");

// Entrada do usuário
let pesoUsuario = Number(prompt("Digite seu peso em kg:"));
let alturaUsuario = Number(prompt("Digite sua altura em metros:"));

function calcularIMC(peso, altura) {
    return peso / (altura * altura);
}

let resultadoIMC = calcularIMC(pesoUsuario, alturaUsuario);
console.log("Seu IMC é:", resultadoIMC.toFixed(2));

// ----------------------------
// Outro jeito (valores fixos)

let peso = 70;
let alturaPessoa = 1.75;

let imcResultado = calcularIMC(peso, alturaPessoa);
console.log("seu peso é:", peso);
console.log("sua altura é:", alturaPessoa);
console.log("Seu IMC é:", imcResultado.toFixed(2));

// ----------------------------//

console.log("Atividade 8 - Par ou Ímpar");

function numeroParOuImpar(numero) {
    if (numero % 2 === 0) {
        return "Par";
    } else {
        return "Ímpar";
    }
}

let verificacao = numeroParOuImpar(4);
console.log("O número é 4:", verificacao);

// ----------------------------
// Outro jeito com prompt

let numeroUsuario = Number(prompt("Digite um número:"));

function verificarParOuImpar(num) {
    if (num % 2 === 0) {
        return "Par";
    } else {
        return "Ímpar";
    }
}

let resultadoVerificacao = verificarParOuImpar(numeroUsuario);
console.log("O número é:", resultadoVerificacao);
 


// funcões nativas

