// Lógica para não permitir que um tipo de usuário acesse o perfil de outros

$(document).ready(function() {
    $.ajax({
        url: `${BASE_URL}/obter_tipo_usuario`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: function(response) {
            const tipoUser = response.tipo_usuario;

            if (tipoUser === 1) {
                window.location.href = 'administrador-perfil.html';
            }
            if (tipoUser === 2) {
                window.location.href = 'vendedor-perfil.html';
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

// Função Alert Message

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

// Exibir mensagem de reserva
$(document).ready(function() {
    const mensagemLocalStorage = localStorage.getItem('msgReserva');

    if (mensagemLocalStorage) {
        alertMessage(mensagemLocalStorage, 'success');
        localStorage.removeItem('msgReserva')
    };
})

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
        $('#financiamento').css('display', 'none')
        $('#historico-compras').css('display', 'none');
        $('#parcelas').css('display' , 'none')
        $('#ajuda').css('display' , 'none')
        $('#modal-comprar').css('display', 'none')

        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    })
    $("#link_reservas").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'flex');
        $('#financiamento').css('display', 'none')
        $('#historico-compras').css('display', 'none');
        $('#parcelas').css('display' , 'none')
        $('#ajuda').css('display' , 'none')
        $('#modal-comprar').css('display', 'none')

        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    })
    
    $("#link_hCompras").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('#financiamento').css('display', 'none')
        $('#historico-compras').css('display', 'flex');
        $('#parcelas').css('display' , 'none')
        $('#ajuda').css('display' , 'none')
        $('#modal-comprar').css('display', 'none')

        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    })
    $("#link_financiamento").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('#historico-compras').css('display', 'none');
        $('#financiamento').css('display', 'flex')
        $('#parcelas').css('display' , 'none')
        $('#ajuda').css('display' , 'none')
        $('#modal-comprar').css('display', 'none')

        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    })

    $("#link_ajuda").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('#historico-compras').css('display', 'none');
        $('#financiamento').css('display', 'none')
        $('#parcelas').css('display' , 'none')
        $('#ajuda').css('display' , 'flex')
        $('#modal-comprar').css('display', 'none')

        if ($(window).width() <= 660) {
            fecharBarraLateral();
        }
    })

    $("#link_parcelas").on("click", function() {
        $('#financiamento').css('display', 'none')
        $('#parcelas').css('display' , 'flex')
    })

    $("#link_parcelas2").on("click", function() {
        $('#financiamento').css('display', 'none')
        $('#parcelas').css('display' , 'flex')
    })

    $("#voltar_parcela").on("click", function(){
        $('#financiamento').css('display', 'flex')
        $('#parcelas').css('display' , 'none')
    })

    $("#pagarParcela").on("click", function(){
        $('#modal-comprar').css("display", "flex")
        $('#overlay-bg').css('display', 'flex');
    })
    $("#close-modal").on("click", function(){
        $('#modal-comprar').css("display", "none")
    })
});

$(document).ready(function() {
    $("#link_parcelas3").on("click", function() {
        // Defina o ID que você deseja passar para a URL
        var id = 46; // Aqui você pode definir dinamicamente, se necessário.

        // Redireciona para a página com o ID como parâmetro na URL
        window.location.href = "anuncio-carro.html?id=" + id;
    });
});

 // Fechar modal ao clicar no X
 $('.btn-fechar-financiamento').click(function() {
    // Fechar os modais
    $('#modal-comprar').css('display', 'none');
    $('#overlay-bg').css('display', 'none');
})

$('.voltar-modal-compra').click(function() {
    // Fechando os modais e abrindo o de compra
    $('#modal-comprar').css('display', 'flex');
    $('#modal-pix').css('display', 'none');
    $('#modal-financiamento').css('display', 'none');

    // Formatando o input de entrada e o select
    $('#input-entrada').val(formatarValor(0));
    $('#select-parcelas').val(1);
    $('#p-valor-total').text('~');
})

// Abrir modal de parcelas
$('#visualizar-parcelas').click(function() {
    if (!$(this).hasClass('disabled')) {
        $('#modal-financiamento').css('display', 'none');
        $('#modal-parcelas').css('display', 'flex');
    }
})

// Voltar para financiamento
$('.voltar-modal-financiamento').click(function() {
    $('#modal-financiamento').css('display', 'flex');
    $('#modal-parcelas').css('display', 'none');
})

// Abre o modal de gerar o qr code do pix
$('#btn-pix').on('click', function () {
    // Exibe o modal de pix
    $('#modal-comprar').css('display', 'none');
    $('#modal-pix').css('display', 'flex');

    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    // Caso não encontre os dados do usuário
    if (!dadosUser) {
        // Limpa o local storage
        localStorage.clear();
        // Recarrega a página
        window.location.reload();
        return;
    }

    // Insere o email do cliente
    $('#email-cliente-compra').text(dadosUser.email);

    // Botém o tipo do veículo e o id_veic
    let tipo_veic_numerico = TIPO_VEIC == 'carro' ? 1 : 2;
    let id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;

    $.ajax({
        method: 'POST',
        url: `${BASE_URL}/gerar_pix`,
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        contentType: 'application/json',
        xhrFields: {
            responseType: 'blob' // <- diz ao XHR para devolver um Blob
        },
        data: JSON.stringify({
            'tipo_veic': tipo_veic_numerico, 
            'id_veic': id_veic
        }),
        success: function(response) {
            // Cria a URL utilizando a resposta BLOB obtida da API
            const url_qrcode = URL.createObjectURL(response);

            // Substitui o background da div img-qrcode colocando a imagem do qr code
            $('#img-qrcode').css({
                'background-image': `url(${url_qrcode})`,
                'background-color': "transparent"
            });
        }, 
        error: function (response) {  
            // Exibe a mensagem de erro
            alertMessage(response.responseJSON.error, 'error');

            // Recarrega a página 2 seg depois do erro
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    })
})

// Abre o modal para financiamento
$('#btn-financiamento').on('click', function () {
    $('#modal-comprar').css('display', 'none');
    $('#modal-financiamento').css('display', 'flex');
})

// Fechar barra lateral
function fecharBarraLateral() {
    barraLateral.css('animation', 'fecharBarraLateral 0.7s');
    overlayBg.css('animation', 'sumirOverlay 0.7s');

    setTimeout(() => {
        barraLateral.css('display', 'none');
        overlayBg.css('display', 'none');
    }, 699);
}


// Função para obter sigla dos estados
function obterSiglaEstado(estadoVeiculo) {
    return new Promise((resolve, reject) => {
        $.getJSON('https://servicodados.ibge.gov.br/api/v1/localidades/estados', function(estados) {
            for (let estado of estados) {
                if (estado.nome === estadoVeiculo) {
                    resolve(estado.sigla);
                    return;
                }
            }
            resolve(false);
        }).fail(reject);
    });
}

// Função para formatar os valores
function formatarValor(valor) {
    // Ignora se estiver vazio
    if (!valor) {
        $(this).val('');
        return;
    }
    
    // Converte o valor para float
    const valorFloat = parseFloat(valor);
    
    // Separa parte inteira e decimal
    const parteInteira = Math.floor(valorFloat).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = (Math.round((valorFloat - Math.floor(valorFloat)) * 100))
                          .toString()
                          .padStart(2, '0');
    
    const precoFormatado = 'R$ ' + parteInteira + ',' + parteDecimal;
    
    return precoFormatado;
}

// Função para gerar o card
async function gerarCard(listaVeic, divAppend, tipoVeiculo) {
    for (veiculo of listaVeic) {
        // Cria a div card
        const divCard = $("<div></div>").addClass("card");

        const img = $("<div></div>")
                    .css({
                        "background-image": `url(${veiculo.imagens[0]})`,
                        "background-position": "center",
                        "background-repeat": "no-repeat",
                        "background-size": "cover",
                        "height": "225px"
                    })
    
        // Cria a div de itens do card
        const divItensCard = $("<div></div>").addClass("itens-card");

        // Modelo
        const spanModelo = $(`<span></span>`)
            .text(veiculo.modelo)
            .css({
                'color': 'var(--roxo)',
                'font-size': '1.5rem'
            });

        // Título do veículo
        const h3Title = $("<h3></h3>")
            .append(`${veiculo.marca} `)
            .append(spanModelo)
            .css({
                'text-transform': 'uppercase',
                'font-size': '1.5rem'
            }) // Inserir nome do carro
    
        // Descrição do veículo
        const pDesc = $("<p></p>").text(veiculo.versao); // Inserir versão do carro
    
        // Container das informações adicionais
        const containerInfoCard = $("<div></div>").addClass("container-info-card");
    
        // Ano do veículo
        const iconCalendar = $("<i></i>").addClass("fa-solid fa-calendar-days");
        const pYear = $("<p></p>").text(veiculo.ano_modelo); // Ano veículo

        let siglaEstado = await obterSiglaEstado(veiculo.estado);
            
        // Localização
        const iconLocation = $("<i></i>").addClass("fa-solid fa-location-dot");
        const pLocation = $("<p></p>").text(`${veiculo.cidade} (${siglaEstado})`); // Cidade

        // Monta a div infoCard com ícones e textos
        containerInfoCard.append(iconCalendar, pYear, iconLocation, pLocation);
    
        // Preço do veículo

        let valor = formatarValor(veiculo.preco_venda);
        const h3Price = $("<h3></h3>").text(valor); // Valor
        
        // Url para abrir a página de anúncio
        let urlAnuncio;

        if (tipoVeiculo === "carro") {
            urlAnuncio = "anuncio-carro.html";
        } else {
            urlAnuncio = "anuncio-moto.html";
        }

        // Botão para ver detalhes
        const buttonDetalhes = $("<a></a>")
            .attr("href", `${urlAnuncio}?id=${veiculo.id}`) // Url para anúncio veículos passando id pela url
            .text("Ver detalhes")
            .addClass("ver-detalhes");
    
        // Adiciona todos os itens na div itens-card
        divItensCard.append(h3Title, pDesc, containerInfoCard, h3Price, buttonDetalhes);
    
        // Junta a imagem e os itens ao card
        divCard.append(img, divItensCard);
    
        // Insere o card no container desejado na página
        divAppend.append(divCard);
    }
}

// Buscar reservas
function buscarReservas() {
    $.ajax({
        url: `${BASE_URL}/buscar_reservas`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: async function (response) {
            listaVeicCarro = response.carros;

            listaVeicMotos = response.motos;
        
            const $divReservas = $('#div-reservas');

            if (!listaVeicCarro.length && !listaVeicMotos.length) {
                const divPai = $('<div></div>').addClass('div-pai');
                const icon = $('<i></i>').addClass('fa-solid fa-thumbs-down icon');
                const btnBuscar = $('<a></a>').attr('href', 'veiculos.html').addClass('buscar-btn').html(`Buscar veículos <i class="fa-solid fa-magnifying-glass"></i>`)
                const msg = ($('<p></p>').addClass('nada-encontrado').text('Você ainda não possui nenhuma reserva.'));

                divPai.append(icon, msg, btnBuscar);
                $divReservas.append(divPai);
                return;
            }

            if (listaVeicCarro.length) {
                await gerarCard(listaVeicCarro, $divReservas, "carro");
            }

            if (listaVeicMotos.length) {
                await gerarCard(listaVeicMotos, $divReservas, "moto");
            }
        },
        error: function (response) {
            alert(response.responseJSON.error);
        }
    })
}

$(document).ready(() =>{
    buscarReservas()
});