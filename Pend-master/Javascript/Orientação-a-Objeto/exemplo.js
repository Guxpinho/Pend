// classe ao modelo inicial do carro
class Carro {

    // Atributos do carro
    marca;
    modelo;
    ano;
    cor;

    // Construtor da classe
    constructor(marca, modelo, ano, cor) {
        // Inicializando os atributos do carro
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.cor = cor;
    }
    // Método para ligar o carro
    ligar() {
        console.log("O carro está ligado.");
    }
    // Método para acelerar o carro
    acelerar() {
        console.log("O carro está acelerando.");
    }

    frear() {
        console.log(`${this.modelo} freando.`);
    }
}
// Criando um objeto carro1 a partir da classe Carro
const carro1 = new Carro("Volkswagen", "Gol", 2022, "Branco");
console.log("carro1:", carro1);

const carro2 = new Carro("Toyota", "Corolla", 2025, "Preto");
console.log("carro2:", carro2);

console.log("--------------------------------");
console.log("Atributos do carro1:");
console.log("Marca:", carro1.marca);
console.log("Modelo:", carro1.modelo);
console.log("Ano:", carro1.ano);
console.log("Cor:", carro1.cor);
console.log("--------------------------------");

console.log("--------------------------------");
console.log("Atributos do carro2:");
console.log("Marca:", carro2.marca);
console.log("Modelo:", carro2.modelo);
console.log("Ano:", carro2.ano);
console.log("Cor:", carro2.cor);
console.log("--------------------------------");

// Chamando os métodos do carro1
carro1.ligar();
carro1.acelerar();
carro1.frear();
carro2.ligar();
carro2.acelerar();
carro2.frear();

