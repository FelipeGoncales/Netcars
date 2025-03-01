let isValidCPF_CNPJ = false; 

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
    })
    $("#link_reservas").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'flex');
        $('#historico-compras').css('display', 'none');
    })
    $("#link_hCompras").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('#historico-compras').css('display', 'flex');
    })
});