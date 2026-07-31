let input = document.querySelector("#senha");
let botao = document.querySelector("#botaosenha");

botao.addEventListener("click", function() {
    if(input.type === "password") {
        input.setAttribute('type', 'text');
        botao.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        input.setAttribute("type", "password");
        botao.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
    }
});