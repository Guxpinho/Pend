# Atividade Prática 2 — IA + Autodeclaração

## O que foi alterado
- A chave da IA não fica mais exposta no JavaScript do navegador.
- O projeto ganhou um pequeno servidor Node.js (`server.js`) que faz a chamada ao Gemini.
- A IA interpreta exclusivamente uma autodeclaração voluntária escrita pela própria pessoa.
- As perguntas sobre hobbies, comportamento, aparência, política etc. não são usadas para inferir orientação.
- Foram adicionadas categorias: gay, lésbica, bissexual, pansexual, assexual, heterossexual, outro e indefinido.
- Se não houver autodeclaração explícita, o resultado permanece `indefinido`.

## Como executar
1. Instale Node.js 18 ou superior.
2. Abra o terminal nesta pasta.
3. Configure a variável `GEMINI_API_KEY` com sua chave.
4. Execute `npm start`.
5. Abra `http://localhost:3000`.

### Windows PowerShell
```powershell
$env:GEMINI_API_KEY="SUA_CHAVE_AQUI"
npm start
```

A chave deve permanecer no servidor e não deve ser colocada no `script.js`.
