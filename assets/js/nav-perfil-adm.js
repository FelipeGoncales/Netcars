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

// Função para exibir relatório específico
function exibirRelatorio(tipo) {
    // Esconder todas as telas de relatório
    $('#minha-conta').css('display', 'none');
    $('.container-relatorios').css('display', 'none');
    
    // Mostrar apenas o relatório selecionado
    $(`#relatorio-${tipo}`).css('display', 'flex');
    
    // Destacar o item no submenu
    $('.sub-relatorio').removeClass('destaque');
    $(`#${tipo}`).addClass('destaque');
}

$(document).ready(function() {
    // Inicialmente ocultar todos os relatórios específicos
    $('.container-relatorios').hide();
    
    $("#link_minhaConta").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);
        $('#minha-conta').css('display', 'flex');
        $('.container-relatorios').css('display', 'none');
        $('.submenu-relatorios').slideUp(); // Fecha o submenu se estiver aberto
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
   
    $("#link_relatorios").on("click", function() {
        const elementoClicado = this;
        if ($(elementoClicado).hasClass('selecionado')) {
            $('#minha-conta').css('display', 'flex');
            $('.container-relatorios').css('display', 'none');
            $('.submenu-relatorios').slideUp(); // Fecha o submenu se estiver aberto
           
            const minhaConta = document.getElementById('link_minhaConta');
            selecionarA(minhaConta);
        } else {
            // Alternar a exibição do submenu
            $(".submenu-relatorios").slideDown();
                   
            // Exibir a página de movimentação automaticamente
            exibirRelatorio('movimentacao');
            selecionarA(elementoClicado);
        }
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
    
    // Ação ao clicar nos itens do submenu
    $("#movimentacao").on("click", function() {
        exibirRelatorio('movimentacao');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
    
    $("#carros").on("click", function() {
        exibirRelatorio('carros');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
    
    $("#motos").on("click", function() {
        exibirRelatorio('motos');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
    
    $("#clientes").on("click", function() {
        exibirRelatorio('clientes');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
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

// Exibir pdf carros
$('#pdf-carros').click(() => {
    window.open('http://192.168.1.122:5000/relatorio/carros', '_blank');
});

// Exibir pdf motos
$('#pdf-motos').click(() => {
    window.open('http://192.168.1.122:5000/relatorio/motos', '_blank');
});

// Exibir PDF de usuarios
$('#pdf-clientes').click(() => {
    window.open('http://192.168.1.122:5000/relatorio/usuarios', '_blank');
});

// Exibir PDF de movimentações
$('#pdf-movimentacao').click(() => {
    window.open('http://192.168.1.122:5000/relatorio/movimentacoes', '_blank');
});