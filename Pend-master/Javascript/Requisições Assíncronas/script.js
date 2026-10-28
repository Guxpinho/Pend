const buscarUsuario = document.querySelector("#buscarUsuario");
const resultado = document.querySelector("#resultado");
const idUsuario = document.querySelector("#idUsuario");

//com  compo de busca
buscarUsuario.addEventListener("click", async() => {
    const id = idUsuario.value;

    if (id === "") {
        resultado.innerHTML = "Digite um ID";
        return;
    }

    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${id}`
        );

        const dados = await response.json();

        resultado.innerHTML = `
            <p>
                <strong>Nome:</strong> ${dados.name} <br>
                <strong>Email:</strong> ${dados.email} <br>
                <strong>Telefone:</strong> ${dados.address.city} <br>
                <strong>Website:</strong> ${dados.phone} <br>
                </p>
                <hr>
                `;
            
    } catch (error) {
        resultado.innerHTML = "<p>Erro ao buscar usuário: </p>";
        console.log(error);
    }
});




























// buscarUsuario.addEventListener("click", async () => {
//     try {

//         const resposta = await fetch("https://jsonplaceholder.typicode.com/users");

//         const dados = await resposta.json();

//         resultado.innerHTML = "";

//         dados.forEach(usuario => {

//             resultado.innerHTML += `
//                 <p>
//                     <strong>Nome:</strong> ${usuario.name} <br>
//                     ${usuario.email}
//                 </p>
//                 <hr>
//             `;  
//         })
//     }
//     catch (error) {
//         resultado.innerHTML = "Erro ao buscar usuário: " ;
//         console.log(error);
//     }
// });






















// buscarUsuario.addEventListener("click", () => {
//     fetch("https://jsonplaceholder.typicode.com/users")
//         .then(response => response.json())
//         .then(data => {
//             resultado.innerHTML = "";

//             data.forEach(usuario => {
//                 resultado.innerHTML += `
//                     <p>
//                         <strong>Nome:</strong> ${usuario.name} <br>
//                         ${usuario.email}
//                     </p>
//                     <hr>
//                 `;
//             });
//         })
//         .catch(error => {
//             console.error("Erro ao buscar usuário:", error);
//         });
// });