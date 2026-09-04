navigator.mediaDevices.getUserMedia({
    video: true, audio: true
})
.then(function (stream) {
    const video = document.querySelector('#camera');
    video.srcObject = stream;
})
.catch(function (error) {
    console.log("Erro ao acessar a câmera: ", error);
    
})