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
        url: "http://192.168.1.4:5000/user",
        data: envia,
        contentType: "application/json",
        success: function(response) {
            let dados = {
                id_usuario: response.dados.id_usuario,
                email: response.dados.email,
                nome_completo: response.dados.nome_completo,
                tipo_usuario: response.dados.tipo_usuario
            }
            localStorage.setItem('dadosUser', JSON.stringify(dados));
            window.location.href = 'index.html';
        },
        error: function(response) {
            $("#mensagemError").text(response.responseJSON.error).css('display', 'block')
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
        url: "http://192.168.1.4:5000/login",
        data: envia,
        contentType: "application/json",
        success: function(response) {
            let dados = {
                id_usuario: response.dados.id_usuario,
                email: response.dados.email,
                nome_completo: response.dados.nome_completo,
                data_nascimento: response.dados.data_nascimento,
                cpf_cnpj: response.dados.cpf_cnpj,
                telefone: response.dados.telefone,
                tipo_usuario: response.dados.tipo_usuario
            }
            localStorage.setItem('dadosUser', JSON.stringify(dados));
            window.location.href = 'index.html';
        },
        error: function(response) {
            console.log(response)
            $("#mensagemError").text(response.responseJSON.error).css('display', 'block')
        }
    })
})