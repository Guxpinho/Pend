const listaProdutos = [];

const nome = document.querySelector("#nome");
const preco = document.querySelector("#preco");
const categoria = document.querySelector("#categoria");
const desconto = document.querySelector("#desconto");
const botaoCadastrar = document.querySelector("#btn");
const resultado = document.querySelector("#resultado");

class Produto {
    constructor(nome, preco, categoria, desconto) {
        this.nome = nome;
        this.preco = Number(preco);       
        this.categoria = categoria;
        this.desconto = Number(desconto);   
    }

    aplicarDesconto() {
        return this.preco - (this.preco * (this.desconto / 100));
    }
}

// Função para atualizar a exibição de todos os produtos na tela
function renderizarProdutos() {
    resultado.innerHTML = ""; 

    listaProdutos.forEach((produto, index) => {
        const precoComDesconto = produto.aplicarDesconto();

        resultado.innerHTML += `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <p><strong>Nome:</strong> ${produto.nome}</p>
                <p><strong>Preço Original:</strong> R$${produto.preco.toFixed(2)}</p>
                <p>Preço com Desconto: R$${precoComDesconto.toFixed(2)}</p>
                <p>Categoria: ${produto.categoria}</p>
                <p><strong>Desconto:</strong> ${produto.desconto}%</p>
                <button onclick="removerProduto(${index})">Excluir</button>
            </div>
        `;
    });
}


window.removerProduto = function(index) {
    const produtoRemovido = listaProdutos[index];
    listaProdutos.splice(index, 1); 
    console.log(`O produto ${produtoRemovido.nome} foi excluído.`);
    renderizarProdutos(); 
};

botaoCadastrar.addEventListener("click", function(event) {
    event.preventDefault(); 

    const produto = new Produto(nome.value, preco.value, categoria.value, desconto.value);
    
    listaProdutos.push(produto);
    renderizarProdutos();

  
    document.querySelector("#form-cadastro").reset();
});