const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const ROOT = __dirname;

const allowed = new Set(['homem','mulher','trans','nao-binario','outro','indefinido']);

function send(res, status, body, type='application/json') {
  res.writeHead(status, {'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store'});
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}

async function validateWithGemini(descricao) {
  if (!GEMINI_API_KEY) return { resultado: 'indefinido', ai: false };

  const prompt = `Você é um classificador de autodeclaração de gênero. Use SOMENTE a forma como a própria pessoa se identifica explicitamente no texto abaixo. Ignore experiências, aparência, nome, hobbies, comportamento, política, localização, relacionamentos e qualquer informação externa. Se não houver autodeclaração explícita de gênero, responda indefinido.\n\nCategorias permitidas: homem, mulher, trans, nao-binario, outro, indefinido.\n\nTexto voluntário:\n${descricao}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      system_instruction: {parts: [{text: 'Retorne apenas JSON válido no formato {"resultado":"..."}.'}]},
      contents: [{parts: [{text: prompt}]}],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 100,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {resultado: {type: 'STRING', enum: [...allowed]}},
          required: ['resultado']
        }
      }
    })
  });

  if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '{}';
  const parsed = JSON.parse(text.replace(/```json|```/gi, '').trim());
  const resultado = allowed.has(parsed.resultado) ? parsed.resultado : 'indefinido';
  return {resultado, ai: true};
}

function serveStatic(req, res) {
  let requested = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  if (requested === '/') requested = '/index.html';
  const filePath = path.normalize(path.join(ROOT, requested));
  if (!filePath.startsWith(ROOT)) return send(res, 403, {error: 'Acesso negado'});
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, {error: 'Arquivo não encontrado'});
    const ext = path.extname(filePath).toLowerCase();
    const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
    send(res, 200, data, types[ext] || 'application/octet-stream');
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'POST' && url.pathname === '/api/validate') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const descricao = String(parsed.descricao || '').trim().slice(0, 6000);
        if (!descricao) return send(res, 400, {error: 'Autodeclaração vazia'});
        const result = await validateWithGemini(descricao);
        send(res, 200, result);
      } catch (error) {
        console.error(error);
        send(res, 200, {resultado: 'indefinido', ai: false, message: 'IA indisponível; nenhuma inferência foi feita.'});
      }
    });
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Projeto disponível em http://localhost:${PORT}`);
  console.log(GEMINI_API_KEY ? `IA Gemini ativa (${MODEL})` : 'IA não configurada: use GEMINI_API_KEY');
});
