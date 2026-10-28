let agora = new Date();
console.log(agora);

console.log("---funções nativas---");

function mostrarDataHora() {
    let dataHoraAtual = new Date();

    console.log("dia ", dataHoraAtual.getDate());
    console.log("mês ", dataHoraAtual.getMonth() + 1);
    console.log("ano ", dataHoraAtual.getFullYear());
    console.log("hora ", dataHoraAtual.getHours());
    console.log("minutos ", dataHoraAtual.getMinutes());
    console.log("segundos ", dataHoraAtual.getSeconds());

    let d = dataHoraAtual.getDate();
    let m = dataHoraAtual.getMonth() + 1;
    let a = dataHoraAtual.getFullYear();
    let h = dataHoraAtual.getHours();
    let min = dataHoraAtual.getMinutes();
    let s = dataHoraAtual.getSeconds();

    console.log(`desafio: ${h}:${min}:${s} ${d}/${m}/${a}`);
}

mostrarDataHora();

console.log(Math.PI);

function calcularOperacoes(numero) {
    console.log("raiz quadrada: ", Math.sqrt(numero));
    console.log("arredondado: ", Math.round(numero));
    console.log("arredondado para cima: ", Math.ceil(numero));
    console.log("arredondado para baixo: ", Math.floor(numero));
    console.log("valor absoluto: ", Math.abs(numero));
    console.log("quadrado: ", Math.pow(numero, 2));
}

calcularOperacoes(7.8);

function analisaTexto(texto) {
    console.log("tamanho do texto: ", texto.length);
    console.log("letra maiúscula: ", texto.toUpperCase());
    console.log("letra minúscula: ", texto.toLowerCase());
}

analisaTexto("Javascript");

function verificaTexto(frase) {
    console.log(frase.includes("JavaScript"));
}

verificaTexto("Eu estudo JavaScript");

function eEssaaAqui(nome, curso) {
    return "aluno: " + nome + " - curso: " + curso;
}
console.log(eEssaaAqui("Gustavo", "JavaScript"));