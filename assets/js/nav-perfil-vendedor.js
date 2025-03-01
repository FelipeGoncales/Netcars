// Lógica para não permitir que um tipo de usuário acesse o perfil de outros

const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

const tipoUser = dadosUser.tipo_usuario;

if (tipoUser === 1) {
    window.location.href = 'administrador-perfil.html';
}
if (tipoUser === 3) {
    window.location.href = 'cliente-perfil.html';
}

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
    })
    $("#link_anuncios").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#anuncios').css('display', 'flex');
    })
});
