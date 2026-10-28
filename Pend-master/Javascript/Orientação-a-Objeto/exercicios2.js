// Exercício 2 - Classes e Objetos
class Aluno {
    nome;
    idade;
    curso;
    matricula;
    //metodos
    constructor(nome, idade, curso, matricula) {
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.matricula = matricula;
    }

    estudar() {
        console.log(`${this.nome} está estudando o curso de ${this.curso}.`);
    }
    aprender() {
        console.log(`${this.nome} de ${this.idade} anos está aprendendo o conteúdo do curso de ${this.curso} entrando esse ano com a matrícula ${this.matricula}.`);
    }
    apresentar() {
        console.log(`Olá, meu nome é ${this.nome}, tenho ${this.idade} anos e estou matriculado no curso de ${this.curso} com a matrícula ${this.matricula}.`);
    }
}
console.log("Exercício 2 - Classes e Objetos");
console.log("--------------------------------");
console.log("Criando objetos Aluno:");
console.log("--------------------------------");
console.log("Aluno 1:");
console.log("Nome:", "Gustavo");
console.log("Idade:", 18);
console.log("Curso:", "Engenharia de Software");
console.log("Matrícula:", "123456");
console.log("--------------------------------");
console.log("Aluno 2:");
console.log("Nome:", "Henrique");
console.log("Idade:", 18);
console.log("Curso:", "Engenharia de Software");
console.log("Matrícula:", "654321");
console.log("--------------------------------");
console.log("Aluno 3:");
console.log("Nome:", "Victor");
console.log("Idade:", 18);
console.log("Curso:", "Engenharia de Software");
console.log("Matrícula:", "987654");
console.log("--------------------------------");
const aluno1 = new Aluno("Gustavo", 18, "Engenharia de Software", "123456");
const aluno2 = new Aluno("Henrique", 18, "Engenharia de Software", "654321");
const aluno3 = new Aluno("Victor", 18, "Engenharia de Software", "987654");

aluno1.estudar();
aluno1.aprender();
aluno1.apresentar();
aluno2.estudar();
aluno2.aprender();
aluno2.apresentar();
aluno3.estudar();
aluno3.aprender();
aluno3.apresentar();