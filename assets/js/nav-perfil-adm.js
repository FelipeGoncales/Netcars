// Lógica para não permitir que um tipo de usuário acesse o perfil de outros

const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

const tipoUser = dadosUser.tipo_usuario;

if (tipoUser === 2) {
    window.location.href = 'vendedor-perfil.html';
}
if (tipoUser === 3) {
    window.location.href = 'cliente-perfil.html';
}

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

const mensagemCadVeic = localStorage.getItem('msgCadVeic');

if (mensagemCadVeic) {
    alertMessage(mensagemCadVeic, 'success');
    localStorage.removeItem('msgCadVeic')
};

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
        $('#relatorios').css('display', 'none');
        
        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    })
    $("#link_relatorios").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#relatorios').css('display', 'flex');
        
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

// Exibir pdf carros
$('#pdf-carros').click(() => {
    window.open('http://127.0.0.1:5000/relatorio/carros', '_blank');
  });

// Exibir pdf motos
$('#pdf-motos').click(() => {
    window.open('http://127.0.0.1:5000/relatorio/motos', '_blank');
  });

// Exibir PDF de usuarios
$('#pdf-clientes').click(() => {
    window.open('http://127.0.0.1:5000/relatorio/usuarios', '_blank');
  });