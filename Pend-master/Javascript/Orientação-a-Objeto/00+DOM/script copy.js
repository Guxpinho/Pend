
const nome = document.querySelector("#nome");
const idade = document.querySelector("#idade");
const curso = document.querySelector("#curso");
const matricula = document.querySelector("#matricula");
const botaoCadastrar = document.querySelector("#btn");
const resultado = document.querySelector("#resultado");

botaoCadastrar.addEventListener("click", function() {
 const aluno = new Aluno(nome.value, idade.value, curso.value, matricula.value);

 aluno.estudar();
 aluno.exibirNaTela();
});

class Aluno {
    constructor(nome, idade, curso, matricula) {
        this.nome = nome;        
        this.curso = curso;
        this.matricula = matricula;
        this.idade = idade;
    }

    estudar() {
        console.log(`${this.nome} está estudando....`);
    }

    apresentar() {
        console.log(`${this.nome} está fazendo uma ótima apresentação!`);
    }
    exibirNaTela() {
        const resultado = document.querySelector("#resultado");

        resultado.innerHTML = `
            <p>Nome: ${this.nome}</p>
            <p>Idade: ${this.idade}</p>
            <p>Curso: ${this.curso}</p>
            <p>Matrícula: ${this.matricula}</p>
        `;
    }
    }
const aluno1 = new Aluno("João", 20, "Engenharia", "12345");

aluno1.estudar();
aluno1.apresentar();
aluno1.exibirNaTela();

