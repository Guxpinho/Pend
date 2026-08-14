
const listaProdutos = [];

const nome = document.querySelector("#nome");
const preco = document.querySelector("#preco");
const categoria = document.querySelector("#categoria");
const desconto = document.querySelector("#desconto");
const botaoCadastrar = document.querySelector("#btn");

class listaProdutos {
    constructor() {
        this.produtos = [];
    }
}
class Produto {
    constructor(nome, preco, categoria, desconto) {
        this.nome = nome;
        this.preco = Number(preco);       
        this.categoria = categoria;
        this.desconto = Number(desconto);   
    }

    aplicarDesconto() {
        const valorComDesconto = this.preco - (this.preco * (this.desconto / 100));
        console.log(`O preço do produto ${this.nome} com desconto é: R$${valorComDesconto.toFixed(2)}`);
        return valorComDesconto;
    }

    exibirNaTela() {
        const resultado = document.querySelector("#resultado");
        
    
            resultado.innerHTML = `
            <div>
                <p>Nome: ${this.nome}</p>
                <p>Preço: R$${this.preco.toFixed(2)}</p>
                <p>Categoria: ${this.categoria}</p>
                <p>Desconto: ${this.desconto}%</p>
            </div>
            `;
        }
    }


botaoCadastrar.addEventListener("click", function(event) {
    event.preventDefault(); // Evita o envio do formulário
  
    const produto = new Produto(nome.value, preco.value, categoria.value, desconto.value);
    
 
    listaProdutos.push(produto);
    produto.exibirNaTela(produto);
    produto.aplicarDesconto();
});