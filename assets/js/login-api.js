// URL API

var BASE_URL = "http://192.168.0.5:5000";

// Funções para auxiliar no funcionamento dos inputs

$('.div-input').each(function() {
    const $input = $(this).find('input');
    const $label = $(this).find('label');

    $input.on('input', function() {
        if ($input.val().trim() !== "") {
            $label.addClass('active');
        } else {
            $label.removeClass('active');
        }
    });
});

$(document).ready(function() {
    $('.div-input').each(function() {
    const $input = $(this).find('input');
    const $label = $(this).find('label');

    if ($input.val().trim() !== "") {
        $label.addClass('active');
    } else {
        $label.removeClass('active');
    }
});
});

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
}

// Função para exibir mensagem (se existir) logo ao abrir a página
$(document).ready(() => {
    const mensagem = JSON.parse(localStorage.getItem('mensagem'));
    
    if (mensagem) {
        try {
            if (mensagem.error) {
                alertMessage(mensagem.error, 'error');
            }
            if (mensagem.success) {
                alertMessage(mensagem.success, 'success');
            }
        }
        finally {
            localStorage.removeItem('mensagem');
        }
    }
})

// Função para mostrar senha quando clicar no olho
function mostrarSenha(eyeIcon, input) {  
    $(eyeIcon).click(function() {
        if ($(input).attr('type') === 'password') {
            $(eyeIcon).removeClass('fa-eye').addClass('fa-eye-slash') // Trocando o ícone do olho
            $(input).attr('type', 'text') // Trocando o tipo de input
        } else {
            $(eyeIcon).removeClass('fa-eye-slash').addClass('fa-eye') // Trocando o ícone do olho 
            $(input).attr('type', 'password') // Trocando o tipo de input
        }
    })
}

mostrarSenha('#mostrarSenha', '#input-senha');
mostrarSenha('#mostrarSenhaNova', '#senha-nova');
mostrarSenha('#mostrarRepetirSenhaNova', '#repetir-senha-nova');


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
        url: `${BASE_URL}/cadastro`, // URL da API na Web
        data: envia,
        contentType: "application/json",
        success: function (response) {
            let dados = {
                id_usuario: response.dados.id_usuario,
                email: response.dados.email,
                nome_completo: response.dados.nome_completo,
                tipo_usuario: response.dados.tipo_usuario,
                token: response.dados.token
            }
            localStorage.setItem('dadosUser', JSON.stringify(dados));

            // Verifica se o usuário tinha clicado em reservar carro antes de fazer login
            const id_carro_salvo = localStorage.getItem('id_carro_salvo');

            // Caso encontre
            if (id_carro_salvo) {
                // Remove o item do local storage
                localStorage.removeItem('id_carro_salvo');
                // Redireciona para a página do anúncio
                window.location.href = `anuncio-carro.html?id=${id_carro_salvo}`;
                return;
            }

            // Verifica se o usuário tinha clicado em reservar carro antes de fazer login
            const id_moto_salva = localStorage.getItem('id_moto_salva');
            
            // Caso encontre
            if (id_moto_salva) {
                // Remove o item do local storage
                localStorage.removeItem('id_moto_salva');
                // Redireciona para a página do anúncio
                window.location.href = `anuncio-moto.html?id=${id_moto_salva}`;
                return;
            }

            // Redireciona para home
            window.location.href = 'index.html';
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
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
        url: `${BASE_URL}/login`, // URL da API na Web
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
                tipo_usuario: response.dados.tipo_usuario,
                token: response.dados.token
            }
            localStorage.setItem('dadosUser', JSON.stringify(dados));

            // Verifica se o usuário tinha clicado em reservar carro antes de fazer login
            const id_carro_salvo = localStorage.getItem('id_carro_salvo');

            // Caso encontre
            if (id_carro_salvo) {
                // Remove o item do local storage
                localStorage.removeItem('id_carro_salvo');
                // Redireciona para a página do anúncio
                window.location.href = `anuncio-carro.html?id=${id_carro_salvo}`;
                return;
            }

            // Verifica se o usuário tinha clicado em reservar carro antes de fazer login
            const id_moto_salva = localStorage.getItem('id_moto_salva');

            // Caso encontre
            if (id_moto_salva) {
                // Remove o item do local storage
                localStorage.removeItem('id_moto_salva');
                // Redireciona para a página do anúncio
                window.location.href = `anuncio-moto.html?id=${id_moto_salva}`;
                return;
            }

            // Redireciona para a home
            window.location.href = "index.html";
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
})
