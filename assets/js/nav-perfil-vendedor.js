// Lógica para não permitir que um tipo de usuário acesse o perfil de outros

$(document).ready(function() {
    $.ajax({
        url: `${BASE_URL}/obter_tipo_usuario`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: function(response) {
            const tipoUser = response.tipo_usuario;

            if (tipoUser === 1) {
                window.location.href = 'administrador-perfil.html';
            }
            if (tipoUser === 3) {
                window.location.href = 'cliente-perfil.html';
            }
        },
        error: function(response) {
            localStorage.deleteItem('dadosUser');
            localStorage.setItem('mensagem', JSON.stringify({
                "error": response.responseJSON.error
            }))
            window.location.href = "login.html";
        }
    })
})

// Aparecer mensagem caso cadastrar veículo dê certo

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

// Exibir mensagem de reserva
$(document).ready(function() {
    const mensagemLocalStorage = localStorage.getItem('msgReserva');

    if (mensagemLocalStorage) {
        alertMessage(mensagemLocalStorage, 'success');
        localStorage.removeItem('msgReserva')
    };

    const mensagemCadVeic = localStorage.getItem('msgCadVeic');

    if (mensagemCadVeic) {
        alertMessage(mensagemCadVeic, 'success');
        localStorage.removeItem('msgCadVeic')
    };
})

// Fazer o nav funcionar

// Função para trocar a borda roxa do A que for clicado
function selecionarA(clicado) {
    $('nav').find('a').each(function(_, a) {
        if (a !== clicado) {
            $(a).removeClass('selecionado')
        } else {
            $(a).addClass('selecionado')
        }
    })
}

$(document).ready(function() {
    $("#link_minhaConta").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'flex');
        $('#anuncios').css('display', 'none');

        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    })
});

// Fechar barra lateral
function fecharBarraLateral() {
    barraLateral.css('animation', 'fecharBarraLateral 0.7s');
    overlayBg.css('animation', 'sumirOverlay 0.7s');

    setTimeout(() => {
        barraLateral.css('display', 'none');
        overlayBg.css('display', 'none');
    }, 699);
}