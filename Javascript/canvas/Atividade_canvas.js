const canvas = document.querySelector("#canvas");
const contexto = canvas.getContext("2d");

// ====== SEU CÓDIGO ORIGINAL (intacto) ======
contexto.lineWidth = 10;
contexto.lineCap = "round";
contexto.lineJoin = "round";

contexto.beginPath();
contexto.arc(200, 80, 20, 0, Math.PI * 2);
contexto.stroke();

contexto.beginPath();
contexto.moveTo(200, 200);
contexto.lineTo(200, 100);
contexto.stroke();

contexto.beginPath();
contexto.moveTo(200, 200);
contexto.lineTo(150, 250);
contexto.stroke();

contexto.beginPath();
contexto.moveTo(200, 200);
contexto.lineTo(250, 250);
contexto.stroke();

contexto.beginPath();
contexto.moveTo(150, 300);
contexto.lineTo(150, 250);
contexto.stroke();

contexto.beginPath();
contexto.moveTo(250, 400);
contexto.lineTo(250, 250);
contexto.stroke();

contexto.beginPath();
contexto.moveTo(200, 100);
contexto.lineTo(150, 150);
contexto.lineTo(220, 170);
contexto.stroke();

contexto.beginPath();
contexto.moveTo(250, 150);
contexto.lineTo(200, 100);
contexto.stroke();

contexto.beginPath();
contexto.moveTo(250, 150);
contexto.lineTo(300, 100);
contexto.stroke();

// ====== PARTE ADICIONADA: bonequinho bonito e dançante ======

let tempo = 0;

// Desenha o boneco (mesma estrutura do original, só mais bonito)
function desenharBoneco(t) {
  // Configurações visuais
  contexto.lineCap = "round";
  contexto.lineJoin = "round";

  // Paleta
  const corCorpo = "#2b2b2b";     // contorno escuro suave
  const corPele = "#ffd8a8";      // cor da cabeça/mãos
  const corRoupa = "#4f8cff";     // azul do tronco
  const corCalca = "#2f3e5c";     // azul escuro das pernas
  const corBochecha = "#ff9aa2";  // bochechas rosadas

  // ---------- Cabeça ----------
  contexto.beginPath();
  contexto.fillStyle = corPele;
  contexto.strokeStyle = corCorpo;
  contexto.lineWidth = 8;
  contexto.arc(200, 80, 22, 0, Math.PI * 2);
  contexto.fill();
  contexto.stroke();

  // Cabelo (tampa em cima, sem mudar o formato redondo)
  contexto.beginPath();
  contexto.fillStyle = "#5a3825";
  contexto.arc(200, 72, 22, Math.PI, Math.PI * 2);
  contexto.fill();

  // Olhos simples e simpáticos
  contexto.beginPath();
  contexto.fillStyle = "#222";
  contexto.arc(192, 82, 3, 0, Math.PI * 2);
  contexto.arc(208, 82, 3, 0, Math.PI * 2);
  contexto.fill();

  // Brilho nos olhos
  contexto.beginPath();
  contexto.fillStyle = "#fff";
  contexto.arc(191, 81, 1, 0, Math.PI * 2);
  contexto.arc(207, 81, 1, 0, Math.PI * 2);
  contexto.fill();

  // Bochechas rosadas
  contexto.beginPath();
  contexto.fillStyle = corBochecha;
  contexto.globalAlpha = 0.6;
  contexto.arc(186, 90, 4, 0, Math.PI * 2);
  contexto.arc(214, 90, 4, 0, Math.PI * 2);
  contexto.fill();
  contexto.globalAlpha = 1;

  // Sorriso
  contexto.beginPath();
  contexto.strokeStyle = "#7a3b2e";
  contexto.lineWidth = 3;
  contexto.arc(200, 88, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  contexto.stroke();

  // ---------- Tronco ----------
  contexto.beginPath();
  contexto.strokeStyle = corRoupa;
  contexto.lineWidth = 12;
  contexto.moveTo(200, 200);
  contexto.lineTo(200, 102);
  contexto.stroke();

  // Contorno escuro do tronco pra dar profundidade
  contexto.beginPath();
  contexto.strokeStyle = corCorpo;
  contexto.lineWidth = 3;
  contexto.moveTo(206, 200);
  contexto.lineTo(206, 104);
  contexto.stroke();

  // ---------- Braços (mesmos do original, só coloridos) ----------
  // Braço esquerdo
  contexto.beginPath();
  contexto.strokeStyle = corRoupa;
  contexto.lineWidth = 10;
  contexto.moveTo(200, 100);
  contexto.lineTo(150, 150);
  contexto.lineTo(220, 170);
  contexto.stroke();

  // Braço direito
  contexto.beginPath();
  contexto.moveTo(250, 150);
  contexto.lineTo(200, 100);
  contexto.stroke();

  contexto.beginPath();
  contexto.moveTo(250, 150);
  contexto.lineTo(300, 100);
  contexto.stroke();

  // ---------- Pernas (mesmas do original, coloridas) ----------
  contexto.beginPath();
  contexto.strokeStyle = corCalca;
  contexto.lineWidth = 12;
  contexto.moveTo(200, 200);
  contexto.lineTo(150, 250);
  contexto.lineTo(150, 300);
  contexto.stroke();

  contexto.beginPath();
  contexto.moveTo(200, 200);
  contexto.lineTo(250, 250);
  contexto.lineTo(250, 400);
  contexto.stroke();

  // Contorno escuro das pernas
  contexto.beginPath();
  contexto.strokeStyle = corCorpo;
  contexto.lineWidth = 3;
  contexto.moveTo(206, 200);
  contexto.lineTo(156, 250);
  contexto.lineTo(156, 300);
  contexto.stroke();

  contexto.beginPath();
  contexto.moveTo(206, 200);
  contexto.lineTo(256, 250);
  contexto.lineTo(256, 400);
  contexto.stroke();

  // ---------- Sapatinhos ----------
  contexto.beginPath();
  contexto.fillStyle = "#1f2937";
  contexto.ellipse(150, 306, 16, 8, 0, 0, Math.PI * 2);
  contexto.fill();

  contexto.beginPath();
  contexto.ellipse(250, 406, 16, 8, 0, 0, Math.PI * 2);
  contexto.fill();
}

function animar() {
  contexto.clearRect(0, 0, canvas.width, canvas.height);

  // Fundo suave pra destacar o boneco
  contexto.fillStyle = "#f7fbff";
  contexto.fillRect(0, 0, canvas.width, canvas.height);

  contexto.save();
  contexto.translate(200, 200);

  // ---------- Dança ----------
  const giro = Math.sin(tempo) * 0.25;             // roda o corpo
  const pulinho = Math.abs(Math.sin(tempo * 2)) * 10; // sobe e desce
  const deslizeX = Math.sin(tempo * 2) * 15;       // vai e volta
  const rebolado = Math.sin(tempo * 3) * 0.08;     // quadril

  contexto.translate(deslizeX, -pulinho);
  contexto.rotate(giro + rebolado);
  contexto.translate(-200, -200);

  desenharBoneco(tempo);

  contexto.restore();

  tempo += 0.08;
  requestAnimationFrame(animar);
}

animar();