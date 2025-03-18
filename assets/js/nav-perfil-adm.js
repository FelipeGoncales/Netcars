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
            $(a).removeClass('selecionado');
        } else {
            $(a).addClass('selecionado');
        }
    });
}

// Função para exibir relatório de movimentação
function exibirRelatorioMovimentacao() {
    $('#minha-conta').css('display', 'none');
    $('#relatorios').css('display', 'flex');
    
    // Destacar o item de movimentação no submenu
    $('.sub-relatorio').removeClass('destaque');
    $('#movimentacao').addClass('destaque');
}

$(document).ready(function() {
    $("#link_minhaConta").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'flex');
        $('#relatorios').css('display', 'none');
        $('.submenu-relatorios').slideUp(); // Fecha o submenu se estiver aberto

        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    });

    $("#link_relatorios").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        // Alternar a exibição do submenu
        $(".submenu-relatorios").slideDown();
        
        // Exibir a página de movimentação automaticamente
        exibirRelatorioMovimentacao();

        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    });

    // Ação ao clicar nos itens do submenu
    $(".sub-relatorio").on("click", function() {
        // Remover destaque de todos e adicionar ao clicado
        $('.sub-relatorio').removeClass('destaque');
        $(this).addClass('destaque');
        
        $('#minha-conta').css('display', 'none');
        $('#relatorios').css('display', 'flex');
    });
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

// Baixar PDF de carros
$('#pdf-carros').click(() => {
    $.ajax({
        method: 'GET',
        url: 'http://192.168.1.122:5000/relatorio/carros',
        xhrFields: {
            responseType: 'blob'
          },
          success: function(response) {
            const url = window.URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'relatorio_carros.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          },
          error: function(error) {
            console.error('Erro ao baixar PDF:', error);
          }
    });
});

// Baixar PDF de motos
$('#pdf-motos').click(() => {
    $.ajax({
        method: 'GET',
        url: 'http://192.168.1.122:5000/relatorio/motos',
        xhrFields: {
            responseType: 'blob'
          },
          success: function(response) {
            const url = window.URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'relatorio_motos.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          },
          error: function(response) {
            alertMessage(response.responseJSON.error, 'error');
          }
    });
});

// Baixar PDF de usuarios
$('#pdf-clientes').click(() => {
    $.ajax({
        method: 'GET',
        url: 'http://192.168.1.122:5000/relatorio/usuarios',
        xhrFields: {
            responseType: 'blob'
          },
          success: function(response) {
            const url = window.URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'relatorio_usuarios.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          },
          error: function(response) {
            alertMessage(response.responseJSON.error, 'error');
          }
    });
});