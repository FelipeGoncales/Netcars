
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


// Abrir modal veículos
if ($(window).width() >= 768) {

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
}

// Mudar perfil quando usuário estiver logado

$(document).ready(function() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (dadosUser) {
        $('#nomeUsuario').text(dadosUser.nome_completo) 
        
        const tipoUser = dadosUser.tipo_usuario;

        if (tipoUser === 3) {
            $('#aDivEntrar').attr('href', 'cliente-perfil.html')
        } else if (tipoUser === 2) {
            $('#aDivEntrar').attr('href', 'vendedor-perfil.html')
        } else if (tipoUser === 1) {
            $('#aDivEntrar').attr('href', 'administrador-perfil.html')
        }

    } else { 
        // Abrir e fechar modal login

        const closeModalLogin = $("#closeModalLogin");
        const modalLogin = $('#modal-login');

        modalLogin.css('display', 'flex');

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
    }
})