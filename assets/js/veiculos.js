// Função para trocar o filtro entre carro e moto

const divTipoCarro = $('#tipo-veic-carro');
const divTipoMoto = $('#tipo-veic-moto');
const tipoVeicBgSelecionado =  $('#tipo-veic-bg-selecionado');

divTipoCarro.click(() => {
    if (!divTipoCarro.hasClass('active')) {
        divTipoCarro.addClass('active');
        divTipoMoto.removeClass('active');
    }
    tipoVeicBgSelecionado.css('left', '0');
})

divTipoMoto.click(() => {
    if (!divTipoMoto.hasClass('active')) {
        divTipoMoto.addClass('active');
        divTipoCarro.removeClass('active');
    }
    tipoVeicBgSelecionado.css('left', '50%');
})
