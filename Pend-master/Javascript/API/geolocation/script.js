navigator.geolocation.getCurrentPosition(
    function (position) {
        console.log("latitude:", position.coords.latitude);
        console.log("longitude: ", position.coords.longitude);
        console.log("precisão:", position.coords.accuracy);
    },
    function (error){
        console.log("não foi possivel obter a localização: ", error);
        
        // Correção: remova o '#' de dentro do getElementById
        const imgElement = document.getElementById("erro-imagem");
        
        // Define o caminho da imagem de erro
        imgElement.src = "img/loca.jpg"; 
        
        // Torna a imagem visível (caso esteja oculta)
        imgElement.style.display = "block";
    }
);