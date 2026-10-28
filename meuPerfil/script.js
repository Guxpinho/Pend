
const formulario = document.getElementById('meuFormulario');


formulario.addEventListener('submit', function(evento) {
    

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;

    if (nome !== '' && email !== '' && mensagem !== '') {
        alert(`Olá, ${nome}! Obrigado por entrar em contato. Seu aplicativo de e-mail será aberto agora.`);
        
    }
});
// ================================ 
// BOTÃO DE MODO ESCURO 
// ================================ 

// Seleciona o botão e o corpo inteiro da página (body)
const btnTema = document.getElementById('btn-tema');
const corpoPagina = document.body;

// Adiciona o ouvinte para o clique do mouse no botão
btnTema.addEventListener('click', function() {
    
    // O comando 'toggle' é um interruptor: liga a classe se não existir, desliga se existir
    corpoPagina.classList.toggle('dark-mode');
    
    // Muda o texto e as cores do próprio botão dependendo de qual modo está ativo
    if (corpoPagina.classList.contains('dark-mode')) {
        btnTema.textContent = '☀️ Modo Claro';
        btnTema.style.background = '#f4f4f9';
        btnTema.style.color = '#333';
    } else {
        btnTema.textContent = '🌙 Modo Escuro';
        btnTema.style.background = '#333';
        btnTema.style.color = '#fff';
    }
});