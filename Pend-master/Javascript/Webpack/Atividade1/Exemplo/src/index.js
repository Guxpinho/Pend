import { mensagem } from './mensagem.js';
import { saudacao } from './saudacao.js';

console.log(mensagem());

const inputNome = document.querySelector('.nome');

inputNome.addEventListener('input', () => {
  const nome = inputNome.value.trim();

  if (nome) {
    console.log(saudacao(nome));
  }
});