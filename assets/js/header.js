// URL API

// Variável Global
var BASE_URL = "http://192.168.1.126:5000";

$(document).ready(function() {
    // Buscar o nome da garagem
    $.ajax({
        url: `${BASE_URL}/obter_nome_garagem`,
        success: function (response) {
            // Insere o título da página
            let textoAntigo = $('#title-pagina').text();
            $('#title-pagina').text(`${response.primeiro_nome}${response.segundo_nome} ${textoAntigo}`);

            // Insere o primeiro e segundo nome
            $('.primeiro-nome').text(response.primeiro_nome);
            $('.segundo-nome').text(response.segundo_nome);
        }
    })

    // Obter a logo da garagem
    $.ajax({
        url: `${BASE_URL}/obter_logo`,
        success: function (response) {
            // Insere o primeiro e segundo nome
            $('.logo-garagem').attr('src', response.img_url);
            // Logo na página do navegador
            $('#link_icon_navegador').attr('href', response.img_url);
        }
    })
})

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
    barraLateral.css('animation', 'fecharBarraLateral 0.7s');
    overlayBg.css('animation', 'sumirOverlay 0.7s');

    setTimeout(() => {
        barraLateral.css('display', 'none');
        overlayBg.css('display', 'none');
    }, 660);
});


// Abrir modal veículos
if ($(window).width() >= 1150) {
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
        
        // Lógica para obter tipo do usuário

        $(document).ready(function() {
            $.ajax({
                url: `${BASE_URL}/obter_tipo_usuario`,
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                },
                success: function(response) {
                    const tipoUser = response.tipo_usuario;

                    if (tipoUser === 3) {
                        $('#aDivEntrar').attr('href', 'cliente-perfil.html')
                    } else if (tipoUser === 2) {
                        $('#aDivEntrar').attr('href', 'vendedor-perfil.html')
                    } else if (tipoUser === 1) {
                        $('#aDivEntrar').attr('href', 'administrador-perfil.html')
                    }
                },
                error: function(response) {
                    localStorage.deleteItem('dadosUser');
                    localStorage.setItem('mensagem', JSON.stringify({
                        "error": response.responseJSON.error
                    }))
                    window.location.href = "login.html";
                }
            })
        })

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

        const aDivEntrar = $('#aDivEntrar');

        aDivEntrar.click(function(e) {
            if ($(window).width() <= 768) {
                aDivEntrar.attr('href', 'login.html');
                return;
            } else {
                // Evitar o recarregamento da página
                e.preventDefault();
                
                const displayModal = modalLogin.css('display');

                if (displayModal === 'flex') {
                    modalLogin.css('display', 'none');
                }

                if (displayModal === 'none') {
                    modalLogin.css('display', 'flex');
                }
            }
        })
    }
})

// Abrir página de carro ou motos ao clicar no modal do nav

$('#pagina-veiculo-carro').click(function() {
    localStorage.setItem('tipo-veiculo', 'carro');
    window.location.href = "veiculos.html";
})

$('#pagina-veiculo-moto').click(function() {
    localStorage.setItem('tipo-veiculo', 'moto');
    window.location.href = "veiculos.html";
})

$('#footer-motos-usadas').click(function() {
    localStorage.setItem('tipo-veiculo', 'moto');
    window.location.href = "veiculos.html";
})

