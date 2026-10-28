const inputemail = document.querySelector('#email');
const inputSenha = document.querySelector('#senha');
const botaoValidar = document.querySelector('#validar');
const texto = document.querySelector('#mensagem');
const foto = document.querySelector('#foto');
const endereco = document.querySelector('#endereco');
const nome = document.querySelector("#nome");
const tel = document.querySelector("#telef");
const msgSenha = document.querySelector("#msgSenha");
const toggleSenha = document.querySelector("#toggleSenha");
const strengthFill = document.querySelector("#strengthFill");

// =========================
// MÁSCARA DE TELEFONE
// =========================
tel.addEventListener('input', function () {
    let v = tel.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length <= 2) {
        tel.value = v.length ? '(' + v : '';
    } else if (v.length <= 7) {
        tel.value = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    } else {
        tel.value = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
    }
});

// =========================
// MOSTRAR / OCULTAR SENHA
// =========================
toggleSenha.addEventListener('click', function () {
    const visivel = inputSenha.type === 'text';
    inputSenha.type = visivel ? 'password' : 'text';
    toggleSenha.style.color = visivel ? '#999' : '#e50914';
});

// =========================
// VALIDAÇÃO DE SENHA
// =========================
inputSenha.addEventListener("input", function () {
    let senhaValue = inputSenha.value;

    const temMaiuscula = /[A-Z]/.test(senhaValue);

    if (!senhaValue) {
        strengthFill.style.width = '0%';
        msgSenha.textContent = '';
        inputSenha.style.borderColor = '';
        return;
    }

    if (!senhaValue.includes("@") || !senhaValue.includes(".")) {
        strengthFill.style.width = '20%';
        strengthFill.style.background = '#e50914';
        msgSenha.textContent = "A senha deve conter '@' e '.'.";
        msgSenha.style.color = "red";
        inputSenha.style.borderColor = "red";
        return;
    }

    if (!temMaiuscula) {
        strengthFill.style.width = '40%';
        strengthFill.style.background = '#f0a500';
        msgSenha.textContent = "A senha deve conter letra maiúscula.";
        msgSenha.style.color = "orange";
        inputSenha.style.borderColor = "orange";
        return;
    }

    if (senhaValue.length < 6) {
        strengthFill.style.width = '40%';
        strengthFill.style.background = '#f0a500';
        msgSenha.textContent = "Mínimo 6 caracteres.";
        msgSenha.style.color = "red";
        inputSenha.style.borderColor = "red";
        return;
    }

    if (senhaValue.length < 10) {
        strengthFill.style.width = '65%';
        strengthFill.style.background = '#f0a500';
        msgSenha.textContent = "Senha média.";
        msgSenha.style.color = "orange";
        inputSenha.style.borderColor = "orange";
        return;
    }

    strengthFill.style.width = '100%';
    strengthFill.style.background = '#22a55e';
    msgSenha.textContent = "Senha forte!";
    msgSenha.style.color = "green";
    inputSenha.style.borderColor = "green";
});

// =========================
// FUNÇÃO PRINCIPAL
// =========================
const validarDados = (e) => {
    e.preventDefault();

    const email = inputemail.value.trim();
    const senha = inputSenha.value.trim();
    const telefoneValor = tel.value.trim();
    const nomeValor = nome.value.trim();
    const enderecoValor = endereco.value.trim();

    texto.textContent = "";

    // CAMPOS VAZIOS
    if (!email || !senha || !telefoneValor || !nomeValor || !enderecoValor) {
        texto.textContent = "Preencha todos os campos.";
        texto.style.color = "red";
        return;
    }

    // VALIDAÇÃO DE TELEFONE
    const telefoneLimpo = telefoneValor.replace(/\D/g, "");

    if (telefoneLimpo.length < 11) {
        tel.style.borderColor = "red";
        texto.textContent = "O telefone deve ter 11 números.";
        texto.style.color = "red";
        return;
    } else {
        tel.style.borderColor = "green";
    }

    // VALIDAÇÃO DE ENDEREÇO
    if (!enderecoValor.toLowerCase().includes("rua")) {
        endereco.style.borderColor = "red";
        texto.textContent = "O endereço deve conter 'Rua'.";
        texto.style.color = "red";
        return;
    } else {
        endereco.style.borderColor = "green";
    }

    // VALIDAÇÃO DE EMAIL
    if (!email.includes("@") || !email.includes(".com")) {
        inputemail.style.borderColor = "red";
        texto.textContent = "Email inválido. Deve conter '@' e '.com'.";
        texto.style.color = "red";
        return;
    } else {
        inputemail.style.borderColor = "green";
    }

    // VALIDAÇÃO DE SENHA
    if (!senha.includes("@") || !senha.includes(".") || !/[A-Z]/.test(senha) || senha.length < 6) {
        inputSenha.style.borderColor = "red";
        texto.textContent = "Senha inválida. Verifique os requisitos.";
        texto.style.color = "red";
        return;
    }

    // SUCESSO
    texto.textContent = `Bem-vindo, ${nomeValor}!`;
    texto.style.color = "green";

    foto.setAttribute(
        "src",
        "https://i.pinimg.com/736x/0e/7d/d6/0e7dd60d29d86114ee1808baef1b8bb1.jpg"
    );
};

// =========================
// EVENTOS
// =========================
botaoValidar.addEventListener('click', validarDados);

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') validarDados(e);
});

// LIMPAR BORDAS AO REDIGITAR
[inputemail, endereco, nome, tel].forEach(function (campo) {
    campo.addEventListener('input', function () {
        campo.style.borderColor = '';
        texto.textContent = '';
    });
});

// =========================
// IBGE — ESTADOS E CIDADES
// =========================
$(function () {

    $.getJSON('https://servicodados.ibge.gov.br/api/v1/localidades/estados/', function (uf) {

        let options = '<option value="" selected disabled>– Selecione seu estado –</option>';

        uf.sort((a, b) => a.nome.localeCompare(b.nome));

        for (let i = 0; i < uf.length; i++) {
            options += `<option data-id="${uf[i].id}" value="${uf[i].nome}">${uf[i].nome}</option>`;
        }

        $("select[name='uf']").html(options);
    });

    $("select[name='uf']").change(function () {
        const ufId = $(this).find("option:selected").attr('data-id');

        $("select[name='city']").html('<option value="" disabled selected>Carregando...</option>');

        if (ufId) {
            $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`, function (city) {

                let options = '<option value="" disabled selected>– Selecione sua cidade –</option>';

                for (let i = 0; i < city.length; i++) {
                    options += `<option value="${city[i].nome}">${city[i].nome}</option>`;
                }

                $("select[name='city']").html(options);
            });
        }
    });

});x