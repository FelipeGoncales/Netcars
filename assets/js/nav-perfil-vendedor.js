
let isValidCPF_CNPJ = false; 

// Fazer o nav funcionar
$(document).ready(function() {
    $('#conteudo').load('com-Vendedor/minha-conta.html');

    $("#link_minhaConta").on("click", function() {
        $('#conteudo').load('com-Vendedor/minha-conta.html');
    })
    $("#link_anuncios").on("click", function() {
        $('#conteudo').load('com-Vendedor/anuncios.html');
    })
});
