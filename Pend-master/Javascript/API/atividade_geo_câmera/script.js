let nome = document.querySelector("#nome");
let email = document.querySelector("#email");
let cpf = document.querySelector("#cpf");
let checkinBtn = document.querySelector("#checkin-btn");
let checkinResult = document.querySelector("#checkin-result");

const video = document.querySelector('#camera');
const canvas = document.querySelector('#canvas');
const botao = document.querySelector('#botao');
const foto = document.querySelector('#foto');

// Máscara para CPF
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

// Ação do botão principal para iniciar o check-in, carregar a câmera e a geolocalização
checkinBtn.addEventListener('click', function() {
    if(!nome.value || !email.value || !cpf.value) {
        alert("Por favor, preencha todos os campos antes de continuar!");
        return;
    }

    // Mostra a tela de resultado/check-in
    checkinResult.style.display = "block";

    // Ativa a Câmera
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (error) {
            console.log("Erro ao acessar a câmera: ", error);
            alert("Não foi possível acessar a câmera. Verifique as permissões.");
        });

    // Pega a Geolocalização
    navigator.geolocation.getCurrentPosition(
        function (position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let acc = position.coords.accuracy;
            
            document.querySelector("#location").innerText = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)} (Precisão: ${acc.toFixed(1)}m)`;
        },
        function (error){
            console.log("Não foi possível obter a localização: ", error);
            const imgElement = document.getElementById("erro-imagem");
            imgElement.src = "img/loca.jpg"; 
            imgElement.style.display = "block";
            document.querySelector("#location").innerText = "Erro ao obter localização.";
        }
    );
});

// Ação do botão de tirar foto usando o Canvas
botao.addEventListener('click', function () {
    if (!video.srcObject) {
        alert("A câmera precisa estar ativa para tirar a foto!");
        return;
    }

    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;

    const contexto = canvas.getContext('2d');

    contexto.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );
    
    // Joga a imagem capturada para a tag <img>
    foto.src = canvas.toDataURL('image/png');
    alert("Foto capturada com sucesso!");
});