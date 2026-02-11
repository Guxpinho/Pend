console.log("Olá, JavaScript!");


let primeiro = 7;
let segundo = 5;
let terceiro = 3;

console.log("média de primeiro, segundo e terceiro:", (primeiro + segundo + terceiro) / 3); //Média
console.log("resto da divisão de primeiro por terceiro:", primeiro % terceiro); // Resto da divisão

console.log("Soma:", primeiro + segundo);          // Adição
console.log("Subtração:", primeiro - segundo);       // Subtração
console.log("Multiplicação:", primeiro * segundo);  // Multiplicação 
console.log("Divisão:", primeiro / segundo);        // Divisão
console.log("Exponenciação:", primeiro ** segundo); // Exponenciação
let contador = 5;
contador++;
console.log("Incremento:", contador);   // Incremento
contador--;
console.log("Decremento:", contador);   // Decremento

let x = 10;
let y = '10'

console.log(x == y);          // Igualdade
console.log(x === y);         // Estrita Igualdade
console.log(x != y);          // Desigualdade
console.log(x !== y);         // Estrita Desigualdade
//----------------------------------04/02/26--------------------------------------------------//

let idade = 18;

if (idade >= 18) {
    console.log("Maior de idade");
} else {
    console.log("Menor de idade");
}
//--------------------------------------------------------------------------------------------------//
let n1 = 8;
let n2 = 10;
if (n1 > n2) {
    console.log("n1 é maior que n2");
} else if (n1 < n2) {
    console.log("n1 é menor que n2");
} else {
    console.log("n1 é igual a n2");
}

let idade2 = 20;
let temcarteiradeidentidade = true;
if (idade2 >= 18 && temcarteiradeidentidade) {
    console.log("Pode entrar na festa");
}
let chovendo = false;
let guardaChuva = true;
console.log("Levar guarda-chuva?", chovendo || guardaChuva); // Ou lógico

let ligado = false;
console.log("O aparelho está ligado?", !ligado); // Negação

let aluno = {
    nome: "Ana",
    idade: 22,
    curso: "Engenharia",
    nota: 9.5,
    nota2: 6
};
let aluno2 = {
    nome: "Bruno",
    idade: 20,
    curso: "Medicina",
    nota: 6,
    nota2: 4
};
let media = (aluno.nota + aluno.nota2) / 2;
let media2 = (aluno2.nota + aluno2.nota2) / 2;
if (media >= 7) {
    console.log(aluno.nome + " está aprovado com média:", media);
} else {
    console.log(aluno.nome + " está reprovado com média:", media);
}
if (media2 >= 7) {
    console.log(aluno2.nome + " está aprovado com média:", media2);
} else {
    console.log(aluno2.nome + " está reprovado com média:", media2);
}

let login = true;
let token = false;
console.log(login || token); // Ou lógico
