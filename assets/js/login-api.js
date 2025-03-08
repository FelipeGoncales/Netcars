// Função de exibir a mensagem para evitar repetir código
function alertMessage(text, type) {
    $('#divAlertMessage').css('display', 'flex')

    let bgColor = type === 'success' ? '#0bd979' : '#f71445';

    $('<p>')
        .addClass('alertMessage')
        .text(text)
        .css('background-color', bgColor)
        .appendTo('#divAlertMessage')
        .hide()
        .fadeIn(400)
        .delay(3500)
        .fadeOut(400);

        // Limpar o local storage para evitar que a mensagem de novo ao recarregar a página
        localStorage.clear();
}

// Função para exibir mensagem (se existir) logo ao abrir a página
const mensagem = JSON.parse(localStorage.getItem('mensagem'));

if (mensagem) {
    if (mensagem.error) {
        alertMessage(mensagem.error, 'error');
    }
    if (mensagem.success) {
        alertMessage(mensagem.success, 'success');
    }
}

// Função para mostrar senha quando clicar no olho

$('#mostrarSenha').click(function() {
    if ($('#input-senha').attr('type') === 'password') {
        $('#mostrarSenha').removeClass('fa-eye').addClass('fa-eye-slash') // Trocando o ícone do olho
        $('#input-senha').attr('type', 'text') // Trocando o tipo de input
    } else {
        $('#mostrarSenha').removeClass('fa-eye-slash').addClass('fa-eye') // Trocando o ícone do olho 
        $('#input-senha').attr('type', 'password') // Trocando o tipo de input
    }
})


// Rota para cadastrar clientes

$("#formCadastroUsuario").on("submit", function (e) {
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
        url: "http://192.168.1.7:5000/cadastro", // URL da API na Web
        data: envia,
        contentType: "application/json",
        success: function (response) {
            let dados = {
                id_usuario: response.dados.id_usuario,
                email: response.dados.email,
                nome_completo: response.dados.nome_completo,
                tipo_usuario: response.dados.tipo_usuario
            }
            localStorage.setItem('dadosUser', JSON.stringify(dados));
            window.location.href = 'index.html';
        },
        error: function (response) {
            $("#mensagemError").text(response.responseJSON.error).css('display', 'block')
        }
    })
})

// Rota para fazer login

$("#formLoginUsuario").on('submit', function (e) {
    e.preventDefault();

    let dados = new FormData(this);

    let envia = {
        email: dados.get('email'),
        senha_hash: dados.get('senha_hash')
    }

    envia = JSON.stringify(envia);

    $.ajax({
        method: "post",
        url: "http://192.168.1.7:5000/login", // URL da API na Web
        data: envia,
        contentType: "application/json",
        success: function (response) {
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
        error: function (response) {
            console.log(response)
            $("#mensagemError").text(response.responseJSON.error).css('display', 'block')
        }
    })
})
