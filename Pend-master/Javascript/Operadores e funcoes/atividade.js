function dataHora() {
    const dataAtual = new Date();

    console.log("Data e hora atual:", dataAtual);
    console.log("Minutos:", dataAtual.getMinutes());
}

dataHora();

3
function somaEMedia() {
    const a = Number(prompt("Digite o primeiro número:"));
    const b = Number(prompt("Digite o segundo número:"));

    const soma = a + b;
    const media = soma / 2;

    console.log("A soma é:", soma);
    console.log("A média é:", media);
}

somaEMedia();


function recebeNome() {
    const nome = prompt("Digite seu nome:");

    console.log("Quantidade de letras:", nome.length);
    console.log("Nome em maiúsculas:", nome.toUpperCase());
}

recebeNome();


function verificaPalavra() {
    const frase = prompt("Digite uma frase:");

    console.log("A frase contém a palavra 'HTML'?", frase.includes("HTML"));
}

verificaPalavra();
