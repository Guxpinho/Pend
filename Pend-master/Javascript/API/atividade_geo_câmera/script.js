let nome = document.querySelector("#nome");
let email = document.querySelector("#email");
let cpf = document.querySelector("#cpf");
let checkinBtn = document.querySelector("#checkin-btn");
let checkinResult = document.querySelector("#checkin-result");
const video = document.querySelector('#camera');
const canvas = document.querySelector('#canvas');
const botao = document.querySelector('#botao');
const foto = document.querySelector('#foto');

botao.addEventListener('click', function () {

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    const contexto = canvas.getContext('2d');

    contexto.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );
    foto.src = canvas.toDataURL('image/png');
});
// Máscara corrigida para CPF (até 11 dígitos com pontuação completa)
cpf.addEventListener('input', function () {
    let v = cpf.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    
    if (v.length > 9) {
        cpf.value = v.slice(0, 3) + '.' + v.slice(3, 6) + '.' + v.slice(6, 9) + '-' + v.slice(9);
    } else if (v.length > 6) {
        cpf.value = v.slice(0, 3) + '.' + v.slice(3, 6) + '.' + v.slice(6);
    } else if (v.length > 3) {
        cpf.value = v.slice(0, 3) + '.' + v.slice(3);
    } else {
        cpf.value = v;
    }
});

// Ação do botão principal para iniciar a experiência
checkinBtn.addEventListener('click', function() {
    if(!nome.value || !email.value || !cpf.value) {
        alert("Por favor, preencha todos os campos antes de continuar!");
        return;
    }

    // Mostra a tela de check-in
    checkinResult.style.display = "block";

    // Ativa a Câmera
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            const video = document.querySelector('#camera');
            video.srcObject = stream;
        })
        .catch(function (error) {
            console.log("Erro ao acessar a câmera: ", error);
        });

    // Pega a Geolocalização
    navigator.geolocation.getCurrentPosition(
        function (position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let acc = position.coords.accuracy;
            
            console.log("latitude:", lat);
            console.log("longitude:", lon);
            console.log("precisão:", acc);

            document.querySelector("#location").innerText = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)} (Precisão: ${acc.toFixed(1)}m)`;
        },
        function (error){
            console.log("não foi possivel obter a localização: ", error);
            const imgElement = document.getElementById("erro-imagem");
            imgElement.src = "img/loca.jpg"; 
            imgElement.style.display = "block";
            document.querySelector("#location").innerText = "Erro ao obter localização.";
        }
    );
});

// Funcionalidade extra: Botão para capturar a foto da câmera
document.querySelector("#capture-btn").addEventListener('click', function() {
    const video = document.querySelector('#camera');
    const canvas = document.querySelector('#photo');
    const fotoCapturada = document.querySelector('#foto-capturada');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    let dataUrl = canvas.toDataURL('img/png');
    fotoCapturada.src = dataUrl;
    fotoCapturada.style.display = 'block';
    
    alert("Foto capturada com sucesso!");
});