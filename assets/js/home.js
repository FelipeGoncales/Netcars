// Função para trocar pesquisa entre carro e moto

const tipoVeicMoto = $("#veiculo-moto");
const tipoVeicCarro = $("#veiculo-carro")
const divInputPesquisarMoto = $('#div-input-pesquisar-moto');
const divInputPesquisarCarro = $('#div-input-pesquisar-carro');

function mudarVeiculoSelecionado(veic1, veic2, div1, div2) {
    if (veic1.hasClass('veiculo-nao-selecionado')) {
        veic1.removeClass("veiculo-nao-selecionado").addClass('veiculo-selecionado');
        div1.css('display', 'flex')
        div2.css('display', 'none')
        veic2.removeClass('veiculo-selecionado').addClass('veiculo-nao-selecionado')
    }
}

tipoVeicMoto.click(() => {
    mudarVeiculoSelecionado(tipoVeicMoto, tipoVeicCarro, divInputPesquisarMoto, divInputPesquisarCarro);
});

tipoVeicCarro.click(() => {
    mudarVeiculoSelecionado(tipoVeicCarro, tipoVeicMoto, divInputPesquisarCarro, divInputPesquisarMoto);
});

// Abrir modal veículos

const itemNavVeiculos = $('#nav-veiculos');
const modalNavVeiculos = $('#modal-nav-veiculos');

function abrirModalVeiculos(div) {
    div.on('mouseenter', () => {
        modalNavVeiculos.css('display', 'flex');
    }).on('mouseleave', () => {
        modalNavVeiculos.css('display', 'none');
    })
}

abrirModalVeiculos(itemNavVeiculos);
abrirModalVeiculos(modalNavVeiculos);

// Abrir e fechar modal login

const closeModalLogin = $("#closeModalLogin");
const modalLogin = $('#modal-login')

closeModalLogin.click(() => {
    const displayModal = modalLogin.css('display');

    if (displayModal === 'flex') {
        modalLogin.css('display', 'none');
    }
});

const divEntrar = $('#divEntrar');

divEntrar.click(() => {
    const displayModal = modalLogin.css('display');

    if (displayModal === 'flex') {
        modalLogin.css('display', 'none');
    }

    if (displayModal === 'none') {
        modalLogin.css('display', 'flex');
    }
});

// Abrir e fechar barra lateral

const sanduiche = $("#sanduicheHeader");
const barraLateral = $('#barra-lateral');
const overlayBg = $('#overlay-bg');
const closeBarraLateral = $('#fecharBarraLateral');

sanduiche.click(() => {
    barraLateral.css({
        'animation': 'abrirBarraLateral 0.5s',
        'display': 'flex'
    });
    overlayBg.css({
        'animation': 'aparecerOverlay 0.5s',
        'display': 'flex'
    });
});

closeBarraLateral.click(() => {
    barraLateral.css('animation', 'fecharBarraLateral 0.5s');
    overlayBg.css('animation', 'sumirOverlay 0.5s');

    setTimeout(() => {
        barraLateral.css('display', 'none');
        overlayBg.css('display', 'none');
    }, 499);
});