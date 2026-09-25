const form = document.getElementById('formPerguntas');
const resultado = document.getElementById('resultado');
const textoResultado = document.getElementById('textoResultado');
const quizFields = form ? Array.from(form.querySelectorAll('.field')) : [];
let quizStep = 0;

const AI_CONFIG = { enabled: true, endpoint: '/api/validate' };

function hasGeminiKey() { return true; }

const prideFlags = [
    {
        name: 'Progress Pride',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
        meaning: 'Representa a comunidade LGBTQIA+ com inclusão e visibilidade.'
    },
    {
        name: 'Pride Community',
        image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
        meaning: 'Celebrando liberdade, pertencimento e expressão individual.'
    },
    {
        name: 'LGBTQIA+ Love',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
        meaning: 'Foco em amor e respeito entre pessoas com identidades diversas.'
    }
];

const travelGay = [
    {
        city: 'Barcelona',
        country: 'Espanha',
        vibe: 'Muito LGBTQIA+ friendly',
        score: '98%',
        image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=80'
    },
    {
        city: 'Amsterdam',
        country: 'Holanda',
        vibe: 'Diversão, liberdade e vida noturna',
        score: '96%',
        image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80'
    },
    {
        city: 'São Paulo',
        country: 'Brasil',
        vibe: 'Cidade com forte cultura queer e eventos inclusivos',
        score: '94%',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80'
    }
];

const communityResources = [
    {
        title: 'LGBTQIA+',
        description: 'Conheça conceitos, identidades e histórias da comunidade.',
        url: 'https://pt.wikipedia.org/wiki/LGBT'
    },
    {
        title: 'Direitos e cidadania',
        description: 'Informação geral para buscar apoio e conhecer seus direitos.',
        url: 'https://www.gov.br/mdh/pt-br/assuntos/direitos-para-todos'
    },
    {
        title: 'Apoio e acolhimento',
        description: 'Procure organizações locais e redes de apoio confiáveis.',
        url: 'https://www.todxs.org/'
    }
];

function renderCard(containerId, items, template) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(template).join('');
}

function loadDiceBearAvatar() {
    const hero = document.querySelector('.hero');
    if (!hero || hero.querySelector('.result-avatar')) return;

    const nome = sessionStorage.getItem('resultadoNome') || 'visitante';
    const genero = sessionStorage.getItem('resultadoGenero') || 'outro';
    const seed = encodeURIComponent(nome.trim().toLowerCase());
    const avatar = document.createElement('img');
    const estilo = genero === 'mulher' ? 'lorelei' : genero === 'homem' ? 'avataaars' : 'open-peeps';

    avatar.className = 'result-avatar';
    avatar.alt = `Avatar de ${nome}`;
    avatar.src = `https://api.dicebear.com/9.x/${estilo}/svg?seed=${seed}&backgroundColor=ffd5e5,c4b5fd,bae6fd`;
    avatar.onerror = () => {
        if (!avatar.dataset.fallback) {
            avatar.dataset.fallback = 'true';
            avatar.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=ffd5e5,c4b5fd,bae6fd`;
            return;
        }

        avatar.remove();
    };
    hero.prepend(avatar);
}

async function loadPrideFlags() {
    try {
        const response = await fetch('https://api.github.com/repos/ericfischer/flag-emoji/contents');
        if (!response.ok) throw new Error('Erro ao obter Pride API');
        const data = await response.json();

        if (Array.isArray(data) && data.length) {
            renderCard('prideFlags', data.slice(0, 3), (item) => `
                <div class="api-card">
                    <span class="emoji">🏳️‍🌈</span>
                    <h4>${item.name || 'Pride Flag'}</h4>
                    <p>Dados vindos da API externa com resposta em JSON.</p>
                </div>
            `);
            return;
        }
    } catch (error) {
        console.warn('Pride API indisponível, usando dados locais:', error);
    }

    renderCard('prideFlags', prideFlags, (item) => `
        <div class="api-card">
            <img src="${item.image}" alt="${item.name}" class="api-image">
            <h4>${item.name}</h4>
            <p>${item.meaning}</p>
        </div>
    `);
}

async function loadTravelGay() {
    try {
        const response = await fetch('https://api.npoint.io/27f9693d8d8db3a6fd75');
        if (!response.ok) throw new Error('Travel API indisponível');
        const data = await response.json();
        const destinations = Array.isArray(data)
            ? data
            : data.destinations || data.results || data.data || [];

        if (Array.isArray(destinations) && destinations.length) {
            renderCard('travelGay', destinations.slice(0, 3), (item) => `
                <div class="api-card">
                    <h4>${item.city || item.name || 'Destino LGBTQIA+'}</h4>
                    <p>${item.country || item.location || 'Destino acolhedor'}</p>
                    <small>${item.vibe || item.description || 'Confira experiências inclusivas no local.'}</small>
                </div>
            `);
            return;
        }
    } catch (error) {
        console.warn('Travel API indisponível, usando dados locais:', error);
    }

    renderCard('travelGay', travelGay, (item) => `
        <div class="api-card">
            <img src="${item.image}" alt="${item.city}" class="api-image">
            <h4>${item.city}</h4>
            <p>${item.country}</p>
            <small>${item.vibe} • ${item.score}</small>
        </div>
    `);
}

async function loadMatchmaking() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=3');
        if (!response.ok) throw new Error('Matchmaking API indisponível');
        const data = await response.json();

        if (Array.isArray(data.results) && data.results.length) {
            renderCard('matchmaking', data.results, (person) => `
                <div class="api-card">
                    <img src="${person.picture.medium}" alt="Perfil" class="avatar">
                    <h4>${person.name.first} ${person.name.last}</h4>
                    <p>${person.location.city}, ${person.location.country}</p>
                    <small>Compatibilidade: ${Math.floor(80 + Math.random() * 20)}%</small>
                </div>
            `);
            return;
        }
    } catch (error) {
        console.warn('Matchmaking API indisponível, usando dados locais:', error);
    }

    const fallbackMatches = [
        { name: 'Mateus', city: 'São Paulo', percent: '94%' },
        { name: 'Pedro', city: 'Rio de Janeiro', percent: '91%' },
        { name: 'Luan', city: 'Curitiba', percent: '89%' }
    ];

    renderCard('matchmaking', fallbackMatches, (person) => `
        <div class="api-card">
            <span class="emoji">💘</span>
            <h4>${person.name}</h4>
            <p>${person.city}</p>
            <small>Compatibilidade: ${person.percent}</small>
        </div>
    `);
}

async function loadCommunityResources() {
    const fallback = () => renderCard('communityResources', communityResources, (item) => `
        <div class="api-card">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <a class="button button-primary" href="${item.url}" target="_blank" rel="noopener noreferrer">Saiba mais</a>
        </div>
    `);

    try {
        const response = await fetch('https://pt.wikipedia.org/api/rest_v1/page/summary/LGBT');
        if (!response.ok) throw new Error('API de informação indisponível');
        const data = await response.json();

        if (data.extract) {
            renderCard('communityResources', [{
                title: data.title || 'LGBTQIA+',
                description: data.extract,
                url: data.content_urls?.desktop?.page || 'https://pt.wikipedia.org/wiki/LGBT'
            }, ...communityResources.slice(1)], (item) => `
                <div class="api-card">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <a class="button button-primary" href="${item.url}" target="_blank" rel="noopener noreferrer">Saiba mais</a>
                </div>
            `);
            return;
        }
    } catch (error) {
        console.warn('API de informação indisponível, usando dados locais:', error);
    }

    fallback();
}

async function validarComIA({ descricao }) {
    const resposta = descricao.trim();
    if (!resposta) return { resultado: 'indefinido' };

    try {
        const response = await fetch(AI_CONFIG.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descricao: resposta })
        });

        if (!response.ok) throw new Error('API de IA indisponível');
        const data = await response.json();
        return { resultado: data.resultado || 'indefinido' };
    } catch (error) {
        console.warn('IA indisponível, usando validação local:', error);
        return { resultado: calcularResultadoLocal(resposta) };
    }
}

function calcularGeneroLocal(genero = '', descricao = '') {
    const texto = (descricao || '').toLowerCase();

    if (genero === 'homem' || /(sou\s+homem|me identifico como homem|me considero homem|sou um homem)/i.test(texto)) return 'homem';
    if (genero === 'mulher' || /(sou\s+mulher|me identifico como mulher|me considero mulher|sou uma mulher)/i.test(texto)) return 'mulher';
    if (genero === 'trans' || /(sou\s+trans|transgênero|transgenero|me identifico como trans)/i.test(texto)) return 'trans';
    if (genero === 'nao-binario' || /(sou\s+não-binário|sou nao binario|nao binario|não binário|me identifico como não-binário|me identifico como nao binario)/i.test(texto)) return 'nao-binario';
    if (genero === 'outro' || /(sou\s+outro|outro gênero|outro genero|me identifico como outro)/i.test(texto)) return 'outro';

    return 'indefinido';
}

function mostrarOrientacaoSelecionada() {
    const hero = document.querySelector('.hero');
    const orientacao = sessionStorage.getItem('resultadoScore');
    if (!hero || !orientacao || hero.querySelector('.result-confirmation')) return;

    const nomes = {
        homem: 'Homem',
        mulher: 'Mulher',
        trans: 'Trans',
        'nao-binario': 'Não-binário',
        outro: 'Outro',
        indefinido: 'Gênero não identificado'
    };
    const confirmacao = document.createElement('p');
    confirmacao.className = 'result-confirmation';
    confirmacao.textContent = `Gênero registrado: ${nomes[orientacao] || 'Não classificado'}`;
    hero.insertBefore(confirmacao, hero.querySelector('h1'));
}

function configurarQuiz() {
    if (!form || !quizFields.length) return;

    const progresso = document.createElement('div');
    progresso.className = 'quiz-progress';
    progresso.innerHTML = '<div class="quiz-progress-bar"></div>';

    const indicador = document.createElement('span');
    indicador.className = 'quiz-step-label';

    const voltar = document.createElement('button');
    voltar.type = 'button';
    voltar.className = 'button quiz-back';
    voltar.textContent = 'Voltar';

    const avancar = form.querySelector('.actions .button-primary');
    avancar.textContent = 'Próxima';

    form.prepend(indicador);
    form.prepend(progresso);
    avancar.parentElement.prepend(voltar);

    function mostrarEtapa(indice) {
        quizStep = indice;
        quizFields.forEach((field, fieldIndex) => {
            field.classList.toggle('quiz-step-hidden', fieldIndex !== quizStep);
        });

        const porcentagem = ((quizStep + 1) / quizFields.length) * 100;
        progresso.querySelector('.quiz-progress-bar').style.width = `${porcentagem}%`;
        indicador.textContent = `Pergunta ${quizStep + 1} de ${quizFields.length}`;
        voltar.hidden = quizStep === 0;
        avancar.textContent = quizStep === quizFields.length - 1 ? 'Ver resultado' : 'Próxima';
    }

    function etapaRespondida() {
        const controle = quizFields[quizStep].querySelector('input, select, textarea');
        return Boolean(controle && controle.value.trim());
    }

    voltar.addEventListener('click', () => mostrarEtapa(Math.max(quizStep - 1, 0)));

    form.addEventListener('submit', (event) => {
        if (quizStep < quizFields.length - 1) {
            event.preventDefault();

            if (!etapaRespondida()) {
                textoResultado.textContent = 'Responda esta pergunta para continuar.';
                resultado.classList.add('active');
                event.stopImmediatePropagation();
                return;
            }

            resultado.classList.remove('active');
            mostrarEtapa(quizStep + 1);
            event.stopImmediatePropagation();
        }
    }, true);

    mostrarEtapa(0);
}

configurarQuiz();

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const idade = document.getElementById('idade').value.trim();
        const genero = document.getElementById('genero').value;
        const sexualidade = document.getElementById('sexualidade')?.value || '';
        const camposParaContexto = Array.from(form.querySelectorAll('.field select, .field textarea'))
            .filter((controle) => controle.id !== 'sexualidade' && controle.id !== 'genero');
        const respostasExtras = camposParaContexto
            .map((controle) => controle.value.trim())
            .filter(Boolean);
        const contextoExtra = respostasExtras.join(' ');
        const descricao = document.getElementById('descricao').value.trim();

        if (!nome || !idade || !genero) {
            textoResultado.textContent = 'Preencha seu nome, idade e gênero antes de enviar.';
            resultado.classList.add('active');
            return;
        }

        let tipoResultado = calcularGeneroLocal(genero, descricao || contextoExtra);

        if (tipoResultado === 'indefinido' && sexualidade !== 'nao-responder') {
            textoResultado.textContent = 'Consultando a autodeclaração para confirmar o gênero...';
            resultado.classList.add('active');
            const resultadoIA = await validarComIA({ descricao: descricao || contextoExtra });
            tipoResultado = resultadoIA.resultado || calcularGeneroLocal(genero, descricao || contextoExtra);
        }

        if (tipoResultado === 'indefinido') {
            tipoResultado = genero;
        }

        sessionStorage.setItem('resultadoNome', nome);
        sessionStorage.setItem('resultadoScore', tipoResultado);
        sessionStorage.setItem('resultadoGenero', genero);

        if (['homem', 'mulher', 'trans', 'nao-binario', 'outro'].includes(tipoResultado)) {
            window.location.replace('outro.html');
            return;
        }

        window.location.replace('indefinido.html');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDiceBearAvatar();
    mostrarOrientacaoSelecionada();

    if (document.getElementById('prideFlags')) {
        loadPrideFlags();
    }

    if (document.getElementById('travelGay')) {
        loadTravelGay();
    }

    if (document.getElementById('matchmaking')) {
        loadMatchmaking();
    }

    if (document.getElementById('communityResources')) {
        loadCommunityResources();
    }

    const paginaNome = document.getElementById('usuarioNome');
    if (paginaNome) {
        paginaNome.textContent = sessionStorage.getItem('resultadoNome') || 'Você';
    }

    const paginaScore = document.getElementById('usuarioScore');
    if (paginaScore) {
        paginaScore.textContent = sessionStorage.getItem('resultadoScore') || '0';
    }
});
