// Lógica para não permitir que um tipo de usuário acesse o perfil de outros

const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

const tipoUser = dadosUser.tipo_usuario;

if (tipoUser === 1) {
    window.location.href = 'administrador-perfil.html';
}
if (tipoUser === 2) {
    window.location.href = 'vendedor-perfil.html';
}

// Aparecer mensagem caso cadastrar veículo dê certo

const mensagemCadVeic = localStorage.getItem('msgCadVeic');

if (mensagemCadVeic) {
    alertMessage(mensagemCadVeic, 'success');
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

// Trocar a visibilidade das divs dentro do main
$(document).ready(function() {
    $("#link_minhaConta").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'flex');
        $('#reservas').css('display', 'none');
        $('#historico-compras').css('display', 'none');

        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    })
    $("#link_reservas").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'flex');
        $('#historico-compras').css('display', 'none');

        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    })
    $("#link_hCompras").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('#historico-compras').css('display', 'flex');

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