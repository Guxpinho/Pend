navigator.geolocation.getCurrentPosition(
    function (position) {
        console.log("latitude:", position.coords.latitude);
        console.log("longitude: ", position.coords.longitude);
        console.log("precisão:", position.coords.accuracy);
    },
    function (error){
        console.log("não foi possivel obter a localização: ", error);
    }
)