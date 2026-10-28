document.getElementById("conteudo").innerHTML = "<p> Olá, mundo DOM! </p>";

document.getElementById("mensagem").textContent = 'Texto simples, sem html.';

document.getElementById("foto").setAttribute("src", "https://i.pinimg.com/1200x/81/59/e0/8159e00bf1b72ec93bce8e002d9edc72.jpg");

let url = document.getElementById("link").getAttribute("href");
console.log(url);

document.getElementById("caixa").style.backgroundColor = "pink";

document.getElementById("alerta").classList.add("destaque");

document.getElementById("alert").classList.remove("oculto");

let novoParagrafo = document.createElement("p");
novoParagrafo.textContent = "Este é um novo parágrafo criado com JavaScript.";
document.getElementById("container").appendChild(novoParagrafo);
let novoItem = document.createElement("li");
// Adicionar um novo item à lista;
novoItem.textContent = "Item novo";
document.getElementById("lista").appendChild(novoItem)
// Remover um elemento;
let item = document.getElementById("item1");
document.getElementById("lista").removeChild(item);