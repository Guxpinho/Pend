class Turma{
    constructor() {
        this.alunos = [];
    }

    adicionarAluno(aluno) {
        this.alunos.push(aluno);
    }

    exibirTela() {

        const resultado = document.querySelector("#resultado");
        resultado.innerHTML = "";

        this.alunos.forEach(aluno => {

            resultado.innerHTML += `
            <div> 
                <p>Nome: ${aluno.nome}</p>
                <p>Idade: ${aluno.idade}</p>
                <p>Curso: ${aluno.curso}</p>
                <p>Matrícula: ${aluno.matricula}</p>
            </div>
            <hr>
            `;
        });
    }
}
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
    
    }


const turma = new Turma();
const nome = document.querySelector("#nome");
const idade = document.querySelector("#idade");
const curso = document.querySelector("#curso");
const matricula = document.querySelector("#matricula");
const botaoCadastrar = document.querySelector("#btn");
// const resultado = document.querySelector("#resultado");

botaoCadastrar.addEventListener("click", function() {

    const aluno = new Aluno(nome.value, idade.value, curso.value, matricula.value);

    turma.adicionarAluno(aluno);
    turma.exibirTela();
 
});


// aluno1.estudar();
// aluno1.apresentar();
// aluno1.exibirNaTela();
