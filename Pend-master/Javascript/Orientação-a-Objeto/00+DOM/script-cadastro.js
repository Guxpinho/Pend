const listaProdutos = []; 

const nome = document.querySelector("#nome");
const preco = document.querySelector("#preco");
const categoria = document.querySelector("#categoria");
const desconto = document.querySelector("#desconto");
const botaoCadastrar = document.querySelector("#btn");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#form-cadastro");

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


function renderizarProdutos() {
    resultado.innerHTML = ""; 

    listaProdutos.forEach((produto, index) => {
        const precoComDesconto = produto.aplicarDesconto();

        resultado.innerHTML += `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <p>Nome: ${produto.nome}</p>
                <p>Preço Original: R$${produto.preco.toFixed(2)}</p>
                <p>Preço com Desconto: R$${precoComDesconto.toFixed(2)}</p>
                <p>Categoria: ${produto.categoria}</p>
                <p>Desconto: ${produto.desconto}%</p>
                <button onclick="removerProduto(${index})">Excluir</button>
            </div>
        `;
    });

    localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
}


window.removerProduto = function(index) {
    listaProdutos.splice(index, 1);
    renderizarProdutos();
};


botaoCadastrar.addEventListener("click", function(event) {
    event.preventDefault(); 

    const produto = new Produto(nome.value, preco.value, categoria.value, desconto.value);
    listaProdutos.push(produto);

    renderizarProdutos();
    formulario.reset();
});


const dadosSalvos = localStorage.getItem("listaProdutos");

if (dadosSalvos) {
    const listaRecuperada = JSON.parse(dadosSalvos);
    

    listaRecuperada.forEach(p => {
        const produto = new Produto(p.nome, p.preco, p.categoria, p.desconto);
        listaProdutos.push(produto);
    });

    renderizarProdutos();
}