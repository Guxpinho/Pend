document.getElementById("conteudo").innerHTML = "<p> Olá, mundo DOM! </p>";

document.getElementById("mensagem").textContent = 'Texto simples, sem html.';

document.getElementById("foto").setAttribute("src", "https://i.pinimg.com/1200x/81/59/e0/8159e00bf1b72ec93bce8e002d9edc72.jpg");

let url = document.getElementById("link").getAttribute("href");
console.log(url);

document.getElementById("caixa").style.backgroundColor = "pink";

document.getElementById("alerta").classList.add("destaque");