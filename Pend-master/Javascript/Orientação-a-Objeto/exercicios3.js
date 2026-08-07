class Produto {
    nome;
    preço;
    estoque;

    constructor(nome, preço, estoque) {
        this.nome = nome;
        this.preço = preço;
        this.estoque = estoque;
    }

    vender(quantidade) {
        if (this.estoque >= quantidade) {
            this.estoque -= quantidade;
            console.log(`Venda realizada para ${quantidade} unidades de ${this.nome}.`);
        } else {
            console.log(`Estoque insuficiente para vender ${quantidade} unidades de ${this.nome}.`);
        }
    }
    repor(quantidade) {
        this.estoque += quantidade;
        console.log(`Reposição realizada para ${quantidade} unidades de ${this.nome}.`);
    }
    alterarpreco(novoPreco) {
        this.preço = novoPreco;
        console.log(`O preço do produto ${this.nome} foi alterado para R$${this.preço.toFixed(2)}.`);
    }
}
const produto1 = new Produto("Camiseta", 49.90, 100);
console.log("Produto 1:");
console.log("Nome:", produto1.nome);
console.log("Preço:", produto1.preço);
console.log("Estoque:", produto1.estoque);
console.log("--------------------------------");
const produto2 = new Produto("Calça Jeans", 99.90, 50);
console.log("Produto 2:");
console.log("Nome:", produto2.nome);
console.log("Preço:", produto2.preço);
console.log("Estoque:", produto2.estoque);
console.log("--------------------------------");
const produto3 = new Produto("Tênis", 149.90, 30);
console.log("Produto 3:");
console.log("Nome:", produto3.nome);
console.log("Preço:", produto3.preço);
console.log("Estoque:", produto3.estoque);
console.log("--------------------------------");

produto1.vender(20);
produto1.repor(10);
produto1.alterarpreco(59.90);