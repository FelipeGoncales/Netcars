// Rota para cadastrar clientes

$("#formCadastroUsuario").on("submit", function(e) {
    e.preventDefault();

    let dados = new FormData(this);

    let envia = {
        nome_completo: dados.get("nome_completo"),
        email: dados.get("email"),
        senha_hash: dados.get("senha_hash"),
        tipo_usuario: 3
    }

    envia = JSON.stringify(envia);

    $.ajax({
        method: "post",
        url: "http://192.168.1.126:5000/user",
        data: envia,
        contentType: "application/json",
        success: function() {
            window.location.href = 'index.html';
        },
        error: function(response) {
            $("#mensagemError").text(response.responseJSON.message).css('display', 'block')
        }
    })
})

// Rota para fazer login

$("#formLoginUsuario").on('submit', function(e) {
    e.preventDefault();

    let dados = new FormData(this);

    let envia = {
        email: dados.get('email'),
        senha_hash: dados.get('senha_hash')
    }

    envia = JSON.stringify(envia);

    $.ajax({
        method: "post",
        url: "http://192.168.1.126:5000/login",
        data: envia,
        contentType: "application/json",
        success: function() {
            window.location.href = 'index.html';
        },
        error: function(response) {
            console.log(response)
            $("#mensagemError").text(response.responseJSON.message).css('display', 'block')
        }
    })
})