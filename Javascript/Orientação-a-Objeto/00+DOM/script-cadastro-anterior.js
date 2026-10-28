class Produto {

    constructor(nome, preco, categoria, desconto) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.desconto = desconto;
    }

    aplicarDesconto() {
        return this.preco - (this.preco * this.desconto / 100);
    }

    exibir() {

        let precoComDesconto = this.aplicarDesconto();

        return `
            <h2>Produto cadastrado</h2>

            <p>
                <strong>Nome:</strong> ${this.nome}
            </p>

            <p>
                <strong>Preço:</strong> 
                R$ ${precoComDesconto.toFixed(2)}
            </p>

            <p>
                <strong>Categoria:</strong> ${this.categoria}
            </p>

            <p>
                <strong>Desconto:</strong> ${this.desconto}%
            </p>
        `;
    }
}


const formulario = document.getElementById("formProduto");
const resultado = document.getElementById("resultado");


formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;

    const preco = Number(
        document.getElementById("preco").value
    );

    const categoria = document.getElementById("categoria").value;

    const desconto = Number(
        document.getElementById("desconto").value
    );

    

    const produto = new Produto(
        nome,
        preco,
        categoria,
        desconto
    );


    resultado.innerHTML = produto.exibir();

    localStorage.setItem("produto", JSON.stringify(produto));


    formulario.reset();

});

const dados = localStorage.getItem("produto");

if (dados) {

    const produtoSalvo = JSON.parse(dados);

    const produto = new Produto(
        produtoSalvo.nome,
        produtoSalvo.preco,
        produtoSalvo.categoria,
        produtoSalvo.desconto
    );

    resultado.innerHTML = produto.exibir();
}