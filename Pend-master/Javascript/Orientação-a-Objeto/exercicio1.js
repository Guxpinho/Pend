// Objeto: pessoa
class Pessoa {
    //Atributos:
    nome;
    idade;
    sexo;
    estilo;
    carro;
    acessorios;
    cpf;
    amigos;
    nacionalidade;
    redeSociais;
    tipoSanguineo;
    fobias;
    idioma;

    //Construtor:
    constructor(nome, idade, sexo, estilo, carro, acessorios, cpf, amigos, nacionalidade, redeSociais, tipoSanguineo, fobias, idioma) {
        this.nome = nome;
        this.idade = idade;
        this.sexo = sexo;
        this.estilo = estilo;
        this.carro = carro;
        this.acessorios = acessorios;
        this.cpf = cpf;
        this.amigos = amigos;
        this.nacionalidade = nacionalidade;
        this.redeSociais = redeSociais;
        this.tipoSanguineo = tipoSanguineo;
        this.fobias = fobias;
        this.idioma = idioma;
    }

    //Métodos:
    jogarVideoGame() {
        console.log(`${this.nome} está jogando video game.`);
    }
    comer() {
        console.log(`${this.nome} está comendo.`);
    }
    sairRole() {
        console.log(`${this.nome} está saindo para o role com um estilo ${this.estilo}, com o carro, ${this.carro}, e levando os amigos, ${this.amigos.join(", ")}.`);
    }
    postarfoto() {
        console.log(`${this.nome} está postando uma foto com seus amigos, ${this.amigos.join(", ")}, nas redes sociais, ${this.redeSociais.join(", ")}, usando ${this.acessorios.join(", ")}'.`);
    }

}


const pessoa1 = new Pessoa("Gustavo",  18, "Masculino", "streetware", "civic", ["relógio", "corrente de ouro", "pulseira"], "123.456.789-00", ["Henrique", "fagner", "victor", "manzano", "Lucas", "amelie"], "Brasileiro", ["Instagram", "Tiktok"], "O-", ["Barata", "altura"], ["Português", "Inglês"]);

const pessoa2 = new Pessoa("Henrique",  18, "Masculino", "streetware", "civic", ["relógio", "escapulário", "pulseira"], "123.456.789-00", ["Gustavo", "fagner", "victor", "manzano", "Caua", "Gabi"], "Brasileiro", ["Instagram", "Tiktok"], "A+", ["Galinha", "altura"], ["Português", "Inglês"]);

pessoa1.jogarVideoGame();
pessoa1.comer();
pessoa1.sairRole();
pessoa1.postarfoto();

pessoa2.jogarVideoGame();
pessoa2.comer();
pessoa2.sairRole();
pessoa2.postarfoto();

