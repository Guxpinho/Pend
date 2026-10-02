import { mensagem } from './mensagem.js';

const inputNome = document.getElementById('nome');
const botaoSaudar = document.getElementById('saudar');

botaoSaudar.addEventListener('click', () => {
  const nome = inputNome.value.trim();

  if (!nome) {
    console.log('Digite um nome antes de saudar.');
    return;
  }

  console.log(mensagem(nome));
});
