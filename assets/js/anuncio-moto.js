// Função de exibir a mensagem para evitar repetir código
function alertMessage(text, type) {
    $('#divAlertMessage').empty().css('display', 'flex');
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

// Declarando variável global
var tipoUser;

// Obter tipo de usuário
function obterTipoUser() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        return;
    }

    const token = dadosUser.token;

    if (!token) {
        localStorage.removeItem('dadosUser');
        localStorage.setItem('mensagem', JSON.stringify({
            "error": "Sessão não iniciada."
        }))
        window.location.href = 'login.html';
    }

    return $.ajax({
        url: `${BASE_URL}/obter_tipo_usuario`,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            tipoUser = response.tipo_usuario;
            return;
        },
        error: function (response) {
            localStorage.removeItem('dadosUser');
            localStorage.setItem('mensagem', JSON.stringify({
                "error": response.responseJSON.error
            }))
            return window.location.href = "login.html";
        }
    })
}

// Dicionário com a URL da foto da logo das marcas de moto

const logo_motos = {
    "Aprilia": "assets/img/logo-moto/aprilla.png",
    "Benelli": "assets/img/logo-moto/benelli.png",
    "BMW": "assets/img/logo-moto/bmw.png",
    "Bultaco": "assets/img/logo-moto/bultaco.png",
    "Cagiva": "assets/img/logo-moto/cagiva.png",
    "CFMoto": "assets/img/logo-moto/cfmoto.png",
    "Ducati": "assets/img/logo-moto/ducati.png",
    "Haojue": "assets/img/logo-moto/haojue.png",
    "Harley-Davidson": "assets/img/logo-moto/harley_davidson.jpg",
    "Honda": "assets/img/logo-moto/honda.png",
    "Husqvarna": "assets/img/logo-moto/husqvarna.png",
    "Indian Motorcycle": "assets/img/logo-moto/indian-motorcycles.png",
    "Kawasaki": "assets/img/logo-moto/kawasaki.png",
    "KTM": "assets/img/logo-moto/ktm.png",
    "Kymco": "assets/img/logo-moto/kymco.png",
    "MV Agusta": "assets/img/logo-moto/mv-agusta.png",
    "Royal Enfield": "assets/img/logo-moto/royal-enfield.png",
    "Suzuki": "assets/img/logo-moto/suzuki.svg",
    "Triumph": "assets/img/logo-moto/triumph.png",
    "Yamaha": "assets/img/logo-moto/yamaha.png",
    "Zero Motorcycles": "assets/img/logo-moto/zero-motorcycles.png"
}

// Função para funcionar filtro de categorias
$(document).ready(function () {
    $(".div-modelos a").on("click", function (e) {
        e.preventDefault(); // Previne o comportamento padrão do link

        // Pega a categoria da moto
        const categoria = $(this).attr("categoria");
        const tipo = $(this).attr("tipo-veiculo");

        // Salva no localStorage
        localStorage.setItem("tipo-veiculo", tipo);
        localStorage.setItem("filtro-categoria", categoria);

        // Redireciona para a página de veículos
        window.location.href = "veiculos.html";
    });
});

function aplicarFiltroMarca(e, div) {
    e.preventDefault(); // Previne o comportamento padrão do link

    localStorage.setItem('tipo-veiculo', 'moto');

    // Pegamos o id do elemento clicado
    const marca = $(div).attr("marca");

    // Salvamos no localStorage para usar na próxima página
    localStorage.setItem("filtro-marca", marca);

    // Redireciona para a página de veículos
    window.location.href = "veiculos.html";
}

// Adicionando o evento aos elementos
$(document).ready(function () {
    $(".a-marcas-moto").click(function (e) {
        aplicarFiltroMarca(e, this);
    });

    $('#logo-img').click(function(e) {
        aplicarFiltroMarca(e, this);
    })
});

// Função para inicializar o carrossel
function carregarOwlCarrossel() {
    var owl = $("#div-owl-carousel");

    // Destroi o carrossel existente para evitar duplicações
    if (owl.hasClass('owl-loaded')) {
        owl.trigger('destroy.owl.carousel');
        owl.removeClass('owl-loaded');
        owl.find('.owl-stage-outer').children().unwrap();
    }

    // Inicializa o carrossel
    owl.owlCarousel({
        loop: false,
        nav: false,
        margin: 10,
        responsive: {
            0: { items: 1 },
            560: { items: 2 },
            1240: { item: 3 }
        }
    });

    // Configura os botões de navegação
    $("#nextSlide").on("click", function () {
        owl.trigger("next.owl.carousel");
    });

    $("#prevSlide").on("click", function () {
        owl.trigger("prev.owl.carousel");
    });
}

// Função para pegar as informações do input e passar para o parágrafo

async function carregarInputs() {
    // Passar o valor dos inputs para os mirrors
    await $('input, select').each(function () {
        const id = $(this).attr('id');
        const spanMirror = $(`#mirror-${id}`);

        $(this).css('display', 'none');
        spanMirror.text($(this).val()).css('display', 'flex');
    });

    // Lógica para mostrar as barras do ano e traço da cidade
    $('#barra-ano-mirror').css('display', 'flex');
    $('#barra-ano-select').css('display', 'none');

    $('#dash-cidade-mirror').css('display', 'flex');
    $('#dash-cidade-select').css('display', 'none');
}

// Evento de input para formatação em tempo real

function formatarPreco(input) {
    $(input).on('input', function () {
        // 1. Limpeza do Input: Remove caracteres não numéricos
        let valor = $(this).val().replace(/[^\d]/g, '');

        // Ignora se estiver vazio
        if (!valor) {
            $(this).val('');
            return;
        }

        // 2. Separação Parte Decimal/Inteira (considera o valor como centavos)
        const centavos = parseInt(valor, 10);
        const reais = Math.floor(centavos / 100);
        const centavosFinal = centavos % 100;

        // Converte para strings para formatação
        let parteInteira = reais.toString();
        const parteDecimal = centavosFinal.toString().padStart(2, '0');

        // 3. Formatação da Parte Inteira
        // Adiciona pontos a cada 3 dígitos
        if (parteInteira.length > 3) {
            parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        // 4. Montagem Final: Combina tudo no padrão R$ X.XXX,XX
        const precoFormatado = 'R$ ' + parteInteira + ',' + parteDecimal;

        // Atualiza o valor do campo
        $(this).val(precoFormatado);
    })

    $(input).on('blur', function () {
        let valor = $(this).val();

        // Ignora se campo estiver vazio
        if (!valor) return;

        // Se o valor não estiver corretamente formatado, aplica a formatação
        if (!valor.startsWith('R$')) {
            $(this).trigger('input');
        }
    })
}

// Desformatar preço
function desformatarPreco(valorFormatado) {
    // Remove "R$", espaços e pontos, troca vírgula por ponto
    let valorLimpo = valorFormatado
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    // Aredonda o valor para duas casas decimais
    return parseFloat(valorLimpo);
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

const anoMin = 1950;
const anoMax = new Date().getFullYear();
const anoModelo = $('#select-ano-modelo');
const anoFabricacao = $('#select-ano-fabricacao');

function addAnoInput(input) {
    for (let ano = anoMax; ano >= anoMin; ano--) {
        const option = $(`<option value="${ano}">${ano}</option>`);
        input.append(option);
    }
}
// Adicionado options aos inputs
addAnoInput(anoModelo);

// Função para que ano de fabricação possa ser apenas 1 ano maior que ano modelo

// Função para adicionar options ano modelo
function addOptionsAnoFab(inputMod, inputFab) {
    let anoMin = parseInt(inputMod.val());

    if (!anoMin) {
        $(inputFab).empty().prop('disabled', true);
        $(`label[for="${$(inputFab).attr('id')}"]`).removeClass('active');
        return;
    }

    $(inputFab)
        .empty()
        .prop('disabled', false);

    let anoSeguinte = anoMin + 1;

    if (anoSeguinte > anoMax) {
        anoSeguinte = anoMin;
    }

    for (let ano = anoMin; ano <= anoSeguinte; ano++) {
        const option = $(`<option value="${ano}">${ano}</option>`);
        inputFab.append(option);
    }
}

// Função para adicionar ano modelo ao alterar
function anoModeloInput(inputMod, inputFab) {
    $(inputMod).on('change', function () {
        addOptionsAnoFab(inputMod, inputFab);
    })
}

// Adicionar o evento change ao input ano modelo
anoModeloInput(anoModelo, anoFabricacao);

// Formatar quilometragem
function formatarQuilometragem(quilometragem) {
    const km = Number(quilometragem);
    if (isNaN(km)) {
        return "";
    }

    // Formata o número com separador de milhar
    let formatted = km.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return `${formatted} km`;
}

function formatarQuilometragemInput(input) {
    $(input).on('input', function () {
        let valorNumerico = extrairNumeros($(input).val());
        $(input).val(formatarQuilometragem(valorNumerico));
    })

    $(input).on('blur', function () {
        let valorNumerico = extrairNumeros($(input).val());
        $(input).val(formatarQuilometragem(valorNumerico));
    })
}

formatarQuilometragemInput("#input-quilometragem");

// Extrair números
function extrairNumeros(valor) {
    // Remove qualquer caractere que não seja número
    let valorNumerico = valor.replace(/[^\d]/g, '');

    return valorNumerico;
}

// Adicionando formatação de preço
formatarPreco('#input-preco-venda');

// Alterar botão
async function alterarBotao() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'))

    if (dadosUser) {
        await obterTipoUser();

        if (tipoUser === 2 || tipoUser === 1) {
            $('#div-button-vendedor').css('display', 'flex');
            $('#div-button-cliente').css('display', 'none');
            $('#div-button-cancelar-reserva').css('display', 'none');

            // Função para mudar a frase que aparece caso seja cliente ou usuário
            $('#mensagem-user').css('display', 'none');
            $('#mensagem-adm').css('display', 'flex');
            $('#mensagem-reserva').css('display', 'none');

            $('#editarAnuncio').css('display', 'flex');
        } else {
            $('#div-button-vendedor').css('display', 'none');
            $('#div-button-cliente').css('display', 'flex');
            $('#div-button-cancelar-reserva').css('display', 'none');

            // Função para mudar a frase que aparece caso seja cliente ou usuário
            $('#mensagem-user').css('display', 'flex');
            $('#mensagem-adm').css('display', 'none');
            $('#mensagem-reserva').css('display', 'none');

            $('#editarAnuncio').css('display', 'none');
        }

    } else {
        $('#div-button-vendedor').css('display', 'none');
        $('#div-button-cliente').css('display', 'flex');
        $('#div-button-cancelar-reserva').css('display', 'none');

        // Função para mudar a frase que aparece caso seja cliente ou usuário
        $('#mensagem-user').css('display', 'flex');
        $('#mensagem-adm').css('display', 'none');
        $('#mensagem-reserva').css('display', 'none');

        $('#editarAnuncio').css('display', 'none');
    }
}

// Função para carregar os estados do IBGE
function carregarEstados(select) {
    return $.getJSON("https://servicodados.ibge.gov.br/api/v1/localidades/estados", function (estados) {
        // Ordena os estados por nome
        estados.sort((a, b) => a.nome.localeCompare(b.nome));

        // Para cada estado, adiciona uma opção no select
        $.each(estados, function (index, estado) {
            select.append(`<option value="${estado.nome}" id_estado="${estado.id}">${estado.nome}</option>`);
        });
    });
}

// Função para carregar as cidades com base no estado selecionado
function carregarCidades(estadoId, select) {
    return $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`, function (cidades) {
        select.empty(); // Limpa as opções anteriores do select de cidades

        // Adiciona cada cidade como opção
        $.each(cidades, function (index, cidade) {
            select.append(`<option value="${cidade.nome}">${cidade.nome}</option>`);
        });
    });
}

// Declarando a variável id_moto fora da função para usá-la depois
let id_moto = '';

$(document).ready(async function () {
    // Obtém o select estado e de cidade
    const estadoSelect = $("#input-estado");
    const cidadeSelect = $("#input-cidade");

    // Adiciona o evento change ao select
    estadoSelect.on("change", () => {
        const estadoId = $(estadoSelect).find(':selected').attr('id_estado');

        if (!estadoId) {
            window.location.reload();
        }

        // Carrega as cidades referentes ao estado
        carregarCidades(estadoId, cidadeSelect);
    });

    // Carrega os estados assim que a página é carregada
    await carregarEstados(estadoSelect);

    // Recupera a query string da URL
    const urlFrontEnd = window.location.search;

    // Cria um objeto URLSearchParams
    const urlParams = new URLSearchParams(urlFrontEnd);

    // Obtém o valor do parâmetro 'id'
    id_moto = urlParams.get('id');

    if (!id_moto) {
        window.location.href = "veiculos.html";
    }

    const dadosUser = localStorage.getItem('dadosUser');
    const headers = {};
    if (dadosUser) {
        const token = JSON.parse(dadosUser).token;
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }
    }

    // Carregar dados do veículo
    $.ajax({
        method: "post",
        url: `${BASE_URL}/buscar-moto`, // URL da API para motos
        data: JSON.stringify({
            'id': id_moto
        }),
        headers: headers,
        contentType: "application/json",
        success: async function (response) {
            const infoVeic = response.veiculos[0];
            const divCarrossel = $('#div-owl-carousel');

            // Verifica se há pelo menos um veículo retornado
            if (!response.veiculos.length) {
                // Retorna para a página veículos
                window.location.href = "veiculos.html";
            }

            // Acessa as imagens do primeiro veículo
            const urlImagens = infoVeic.imagens;

            // Verifica se urlImagens existe e é iterável
            if (!urlImagens || !Array.isArray(urlImagens)) {
                window.location.href = "veiculos.html";
            }

            // Limpa o conteúdo atual do carrossel
            divCarrossel.empty();

            const dt = new DataTransfer(); // Cria um objeto DataTransfer

            for (const imagem of urlImagens) {

                // CSS para ficar todas as fotos do mesmo tamanho
                const divImg = $('<div></div>')
                    .css({
                        "position": "relative",
                        "min-height": "350px",
                        "min-height": "400px",
                        "overflow": "hidden"
                    })

                // Adicionando a imagem
                const img = $('<img>').attr('src', imagem).css({
                    "height": "100%",
                    "min-width": "100%",
                    "width": "auto",
                    "display": "block",
                    "position": "absolute",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translate(-50%, -50%)"
                });

                // Adicionando a imagem e o overlay à div principal
                divImg.append(img);

                // Input final placa
                await obterTipoUser();

                if (tipoUser in [1, 2]) {
                    // Criando o overlay
                    const overlay = $('<div></div>').css({
                        "cursor": "pointer",
                        "position": "absolute",
                        "top": "0",
                        "left": "0",
                        "width": "100%",
                        "height": "100%",
                        "background-color": "rgba(0, 0, 0, 0.3)", // Cor escura com transparência
                        "display": "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        "flex-direction": "column",
                        "opacity": "0",
                        "transition": "opacity 0.3s ease"
                    }).addClass('overlay-img-carrossel');

                    // Adicionando o ícone e o texto ao overlay
                    const icon = $('<i class="fa-solid fa-arrow-up-from-bracket"></i>').css({
                        "font-size": "2rem",
                        "color": "#FFF",
                        "margin-bottom": "0.5rem"
                    });
                    const text = $('<span>Editar imagens</span>').css({
                        "color": "#FFF",
                        "font-size": "1rem"
                    });

                    overlay.append(icon, text);

                    // Adicionando a imagem e o overlay à div principal
                    divImg.append(overlay);

                    // Adicionando eventos de hover para mostrar/ocultar o overlay
                    if ($(window).width() < 768) {
                        overlay.css("opacity", "1");
                    } else {
                        divImg.hover(
                            function () {
                                overlay.css("opacity", "1");
                            },
                            function () {
                                overlay.css("opacity", "0");
                            }
                        );
                    }
                }

                // Adicionando divImg ao carrossel ou ao elemento desejado
                divCarrossel.append(divImg);

                // Realiza o fetch da imagem e obtém o Blob

                const response = await fetch(imagem);
                const blob = await response.blob();

                // Extrai o nome do arquivo da URL
                const fileName = imagem.substring(imagem.lastIndexOf('/') + 1);

                // Cria um objeto File com o Blob
                const file = new File([blob], fileName, { type: blob.type });

                // Adiciona o arquivo ao DataTransfer
                dt.items.add(file);
            }

            // Atribui os arquivos ao input file
            document.getElementById('upload-imagem').files = dt.files;

            // Carregar a miniatura das imagens atuais
            carregarPreviewImg();

            // Inicializa o carrossel após adicionar os itens
            carregarOwlCarrossel();

            // Input marca
            $("#select-marca").val(infoVeic.marca);

            // Input modelo
            $("#input-modelo").val(infoVeic.modelo);

            // Seleciona o estado do select
            estadoSelect.val(infoVeic.estado);

            // Obtém o id do estado
            const estadoId = $(estadoSelect).find(':selected').attr('id_estado');

            // Caso exista estado id
            if (estadoId) {
                // Carregar cidades
                await carregarCidades(estadoId, cidadeSelect);

                // Seleciona a cidade
                cidadeSelect.val(infoVeic.cidade);
            }

            // Preencher os selects de ano modelo e ano fabricação
            $("#select-ano-modelo").val(infoVeic.ano_modelo);

            await addOptionsAnoFab($("#select-ano-modelo"), $("#select-ano-fabricacao"));

            $("#select-ano-fabricacao").val(infoVeic.ano_fabricacao);

            // Input marchas
            $('#select-marchas').val(infoVeic.marchas);

            // Input quilometragem
            $('#input-quilometragem').val(formatarQuilometragem(infoVeic.quilometragem));

            // Input tipo motor
            $('#input-tipo-motor').val(infoVeic.tipo_motor);

            // Input cor
            $('#select-cor').val(infoVeic.cor);

            // Input refrigeração
            $('#select-refrigeracao').val(infoVeic.refrigeracao);

            // Input categoria
            $('#select-categoria').val(infoVeic.categoria);

            // Input cilindrada
            $('#select-cilindrada').val(infoVeic.cilindrada);

            // Input partida
            $('#select-partida').val(infoVeic.partida);

            // Input freio
            $('#select-freio').val(infoVeic.freio_dianteiro_traseiro);

            // Input alimentacao
            $('#select-alimentacao').val(infoVeic.alimentacao);

            // Input final placa
            await obterTipoUser();

            if (tipoUser in [1, 2]) {
                $('#label-placa').text('Placa')
                $('#input-placa').val(infoVeic.placa);
            } else {
                const ultimoCaracterPlaca = infoVeic.placa.slice(-1);
                $('#input-placa').val(ultimoCaracterPlaca);
            }

            // Input preço venda
            $("#input-preco-venda").val(formatarValor(infoVeic.preco_venda));

            // Carregar foto da marca da moto
            $("#logo-img")
                .attr({
                    'src': `${logo_motos[infoVeic.marca]}`,
                    'marca': infoVeic.marca
                })
                
            carregarInputs();

            if (response.reserva == true) {
                // Função para mudar o botão para cancelar reserva
                $('#div-button-vendedor').css('display', 'none');
                $('#div-button-cliente').css('display', 'none');
                $('#div-button-cancelar-reserva').css('display', 'flex');

                // Função para mudar a frase que aparece caso seja o cliente que reservou
                $('#mensagem-user').css('display', 'none');
                $('#mensagem-adm').css('display', 'none');
                $('#mensagem-reserva').css('display', 'flex');

                $('.overlay-img-carrossel').css('display', 'none');
            } else {
                // Lógica para alterar os botões
                alterarBotao();
            }
        },
        error: function () {
            window.location.href = "veiculos.html";
        }
    });
})


// Variável global para armazenar os arquivos
let currentFiles = new DataTransfer();

function carregarPreviewImg() {
    const inputFile = document.getElementById('upload-imagem');
    const newFiles = Array.from(inputFile.files);
    currentFiles = new DataTransfer();

    // Adiciona novos arquivos ao DataTransfer
    newFiles.forEach(file => currentFiles.items.add(file));

    // Atualiza o input com os novos arquivos
    inputFile.files = currentFiles.files;

    const previewContainer = $("#preview-container");

    previewContainer.empty();

    Array.from(inputFile.files).forEach((file, index) => {
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const imgContainer = $('<div>')
                    .addClass('preview-item')
                    .css('background-image', `url(${e.target.result})`);

                const removeBtn = $('<i>')
                    .addClass('fa-solid fa-xmark remove-btn')
                    // No callback de remoção, em vez de currentFiles.items.remove(index):
                    .on('click', function () {
                        // Cria um novo DataTransfer para armazenar apenas os arquivos que você quer manter
                        let dtTemp = new DataTransfer();
                        const inputFiles = document.getElementById('upload-imagem').files;

                        // Reconstroi a lista, pulando o arquivo removido (identificado pelo index atual)
                        Array.from(inputFiles).forEach((file, i) => {
                            if (i !== index) {
                                dtTemp.items.add(file);
                            }
                        });

                        // Atualiza o input com o novo FileList
                        document.getElementById('upload-imagem').files = dtTemp.files;

                        // Atualiza o preview para refletir a nova lista de arquivos
                        carregarPreviewImg();
                    });

                imgContainer.append(removeBtn);
                previewContainer.append(imgContainer);
            };

            reader.readAsDataURL(file);
        }
    });
}

// Adicionar o evento carregar preview toda vez que input file for alterado
$("#upload-imagem").on("change", function (event) {
    carregarPreviewImg();
});

// Função de fechar modal de editar
function fecharModalEditarImagem() {
    $('#modal-editar-imagem').css('display', 'none');
    $('#overlay-bg').css('display', 'none');
}

// Função de abrir modal de editar
function abrirModalEditarImagem() {
    $('#modal-editar-imagem').css('display', 'flex');
    $('#overlay-bg').css('display', 'flex');
}

// Fechar modal editar imagem ao clicar no X
$('#closeModalEditarImagem').click(function () {
    fecharModalEditarImagem();
})

// Associando o evento de clique usando delegação de eventos
$(document).on('click', '.overlay-img-carrossel', function () {
    abrirModalEditarImagem();
});

// Editar imagens

$('#modal-editar-imagem').on('submit', function (e) {
    e.preventDefault();

    // Caso queira inspecionar os arquivos:
    const files = $('#upload-imagem')[0].files;

    // Cria um objeto FormData
    let formDataImg = new FormData();

    // Adiciona as imagens ao objeto
    for (let i = 0; i < files.length; i++) {
        formDataImg.append('imagens', files[i]);
    }

    // Requisição para editar imagens
    $.ajax({
        url: `${BASE_URL}/moto/editar_img/${id_moto}`,
        method: 'PUT',
        data: formDataImg,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        processData: false,
        contentType: false,
        success: function () {
            // Define uma mensagem de sucesso para quando recarregar a página exibir ao usuário
            localStorage.setItem('mensagemEditado', 'Imagens do veículo editadas com sucesso!');

            // Recarrega a página para que as aplicações sejam feitas
            window.location.reload();
        },
        error: function (response) {
            // Caso dê erro, exibe a mensagem
            alertMessage(response.responseJSON.error, 'error');
        }
    })
})

// Caso dê certo o editar, exibir mensagem de sucesso ao abrir a página
$(document).ready(function () {
    // Obtêm o item do local storage
    const mensagemEditado = localStorage.getItem('mensagemEditado');

    // Caso exista alguma mensagem no local storage
    if (mensagemEditado) {
        // Mensagem de sucesso
        alertMessage(mensagemEditado, 'success');
        // Remove a mensagem depois de usá-la
        localStorage.removeItem('mensagemEditado');
    }
})

// Função para validar a placa
function validarPlaca() {
    const placa = $('#input-placa').val(); // Pega o valor da placa
    const regexMercosul = /^[A-Za-z]{3}[0-9]{1}[A-Za-z]{1}[0-9]{2}$/; // Formato ABC1D23
    const regexAntigo = /^[A-Za-z]{3}[0-9]{4}$/; // Formato ABC1234

    if (!regexMercosul.test(placa) && !regexAntigo.test(placa)) {
        alertMessage("Formato de placa inválido.", 'error');
        return false; // Retorna falso se não passar na validação
    }

    return true; // Retorna verdadeiro se for válido
}

// Adicionando evento blur ao input de placa para exibir mensagem caso esteja em um formato inválido
$('#input-placa').on('blur', function () {
    validarPlaca();
})

// Cancelar reserva

$('#cancelar-reserva').click(function () {
    Swal.fire({
        title: "Você tem certeza?",
        text: "Você está prestes a cancelar a reserva desse veículo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "DELETE",
                url: `${BASE_URL}/cancelar-reserva-moto/${id_moto}`, // URL da API para motos
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                },
                contentType: "application/json",
                success: function (response) {
                    localStorage.setItem('msgReserva', response.success);
                    window.location.href = "cliente-perfil.html";
                },
                error: function (response) {
                    Swal.fire({
                        title: "Algo deu errado...",
                        text: response.responseJSON.error,
                        icon: "error"
                    })
                }
            })
        }
    })
})

// Deletar veículo

$('#deletar-veiculo').click(function () {
    Swal.fire({
        title: "Você tem certeza?",
        text: "Você está prestes a deletar os dados desse veículo para sempre.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "DELETE",
                url: `${BASE_URL}/moto/${id_moto}`,
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                },
                success: function (response) {
                    // Definir mensagem de sucesso
                    localStorage.setItem('msgCadVeic', response.success);

                    // Redirecionar para a página de perfil
                    if (response.tipo_usuario === 1) {
                        window.location.href = 'administrador-perfil.html';
                    }
                    if (response.tipo_usuario === 2) {
                        window.location.href = 'vendedor-perfil.html';
                    }
                },
                error: function (response) {
                    alertMessage(response.responseJSON.error, 'error');
                }
            })
        }
    })
})


// Reservar moto

$('#reservar-btn').click(function () {
    // Busca os dados do usuário
    const dadosUser = localStorage.getItem('dadosUser');

    // Verificar se existe dadosUser no local storage
    if (!dadosUser) {
        // Caso não, define uma mensagem e redireciona para login
        localStorage.setItem('mensagem', JSON.stringify({
            'success': 'Faça login para concluir sua reserva!'
        }))
        // e redireciona para login
        window.location.href = "login.html";
    }

    // Busca o token
    const token = JSON.parse(dadosUser).token;

    // Verificar se existe dadosUser no local storage
    if (!token) {
        // Caso não, define uma mensagem
        localStorage.setItem('mensagem', JSON.stringify({
            'success': 'Faça login para concluir sua reserva!'
        }))
        // e redireciona para login
        window.location.href = "login.html";
    }

    Swal.fire({
        title: "Deseja reservar esse veículo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {

            const envia = {
                "id_veiculo": id_moto,
                "tipo_veiculo": "moto"
            }

            $.ajax({
                method: "POST",
                url: `${BASE_URL}/reservar_veiculo`,
                contentType: 'application/json',
                data: JSON.stringify(envia),
                headers: {
                    "Authorization": "Bearer " + token
                },
                success: function (response) {
                    Swal.fire({
                        title: "Sucesso!",
                        text: response.success,
                        icon: "success",
                        confirmButtonColor: "#0bd979",
                        confirmButtonText: "Confirmar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.setItem('msgReserva', 'Veja as informações da sua reserva clicando em "Reservas".')
                            window.location.href = "cliente-perfil.html";
                        }
                    })
                },
                error: function (response) {
                    Swal.fire({
                        title: "Algo deu errado...",
                        text: response.responseJSON.error,
                        icon: "error"
                    })
                }
            })
        }
    });
})


// Variável para saber se a edição está ativa ou não
let editarOn = false;

$("#editarAnuncio").on("click", function () {
    // Verifica se os inputs não estão visíveis
    if (editarOn === false) {
        editarOn = true;

        // Alterar ícone do botão de editar para X
        $(this).removeClass('fa-pencil').addClass('fa-xmark');

        $('input').each(function () {
            const id = $(this).attr('id');
            const spanMirror = $(`#mirror-${id}`)

            $(this).css('display', 'flex').attr('disabled', false);
            spanMirror.css('display', 'none');
        })

        $("input, select").prop("disabled", false);

        $("input, select").css("display", "flex");

        // Barra (/) do ano
        $('#barra-ano-mirror').css('display', 'none');
        $('#barra-ano-select').css('display', 'flex');

        // Traço (-) da cidade
        $('#dash-cidade-mirror').css('display', 'none');
        $('#dash-cidade-select').css('display', 'flex');

        $("p.input-mirror, p.select-mirror").css("display", "none");

        // Habilita o botão de salvar alterações
        $('#salvar-alteracoes').prop('disabled', false);

        // Evita que o input de imagem seja alterado
        $('#upload-imagem').css('display', 'none').prop('disabled', false);
    } else {
        editarOn = false;

        // Alterar ícone do botão de editar para a caneta
        $(this).removeClass('fa-xmark').addClass('fa-pencil');

        $("input, select").prop("disabled", true);

        $("input, select").css("display", "none");

        // Barra (/) do ano
        $('#barra-ano-mirror').css('display', 'flex');
        $('#barra-ano-select').css('display', 'none');

        // Traço (-) da cidade
        $('#dash-cidade-mirror').css('display', 'flex');
        $('#dash-cidade-select').css('display', 'none');

        $("p.input-mirror, p.select-mirror").css("display", "flex");

        // Habilita o botão de salvar alterações
        $('#salvar-alteracoes').prop('disabled', true);

        // Carrega o ano modelo
        $('#select-ano-modelo').val($('#mirror-select-ano-modelo').text());

        // Adiciona os anos de fabricação
        addOptionsAnoFab($("#select-ano-modelo"), $("#select-ano-fabricacao"));

        // Seleciona o estado do mirror
        $('#input-estado').val($('#mirror-input-estado').text());

        // Obtém o id do estado
        const estadoId = $('#input-estado').find(':selected').attr('id_estado');

        // Caso exista estado id
        if (estadoId) {
            // Função para adicionar cidades
            async function addCidades() {
                // Carrega as cidades do estado do mirror
                await carregarCidades(estadoId, $('#input-cidade'));

                // Seleciona a cidade do mirror
                $('#input-cidade').val($('#mirror-input-cidade').text());
            }
            // Chamando a função
            addCidades();
        }

        // Voltar o valor anterior aos inputs
        $('input, select').each(function () {
            const input = $(this);
            const id = input.attr('id');
            const spanMirror = $(`#mirror-${id}`);

            input.val(spanMirror.text());
        });

        // Evita que o input de imagem seja alterado
        $('#upload-imagem').css('display', 'none').prop('disabled', false);
    }
});

// Coletar dados
// Função para coletar os dados atualizados do anúncio de moto
function coletarDadosAtualizados() {
    return {
        marca: $("#select-marca").val(),
        modelo: $("#input-modelo").val(),
        cidade: $("#input-cidade").val(),
        estado: $("#input-estado").val(),
        ano_modelo: $("#select-ano-modelo").val(),
        ano_fabricacao: $("#select-ano-fabricacao").val(),
        marchas: $("#select-marchas").val(),
        quilometragem: extrairNumeros($("#input-quilometragem").val()),
        tipo_motor: $("#input-tipo-motor").val(),
        cor: $("#select-cor").val(),
        refrigeracao: $("#select-refrigeracao").val(),
        categoria: $("#select-categoria").val(),
        cilindrada: $("#select-cilindrada").val(),
        partida: $("#select-partida").val(),
        freio_dianteiro_traseiro: $("#select-freio").val(),
        alimentacao: $("#select-alimentacao").val(),
        placa: $("#input-placa").val().toUpperCase(),
        preco_venda: desformatarPreco($("#input-preco-venda").val()),
        // ATIVO
        ativo: 1
    };
}

// Salvar alterações
$("#salvar-alteracoes").on("click", function (e) {
    e.preventDefault();

    let validacaoPlaca = validarPlaca();
    if (!validacaoPlaca) {
        return;
    }

    // Coleta os dados atualizados
    const dadosAtualizados = coletarDadosAtualizados();

    $.ajax({
        method: "PUT",
        url: `${BASE_URL}/moto/${id_moto}`,
        data: JSON.stringify(dadosAtualizados),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: function (response) {
            // Exibe uma mensagem de sucesso (pode usar SweetAlert2)
            Swal.fire({
                title: "Sucesso!",
                text: response.success,
                icon: "success",
                confirmButtonText: "Ok"
            });

            // Se necessário, desabilite os inputs novamente e atualize os "mirrors"
            $("input").prop("disabled", true);

            // Evita que o input de imagem seja alterado
            $('#upload-imagem').css('display', 'none').prop('disabled', false);

            // Passar o valor dos inputs pros mirrors
            carregarInputs();

            // Alterar ícone do botão de editar para a caneta
            $('#editarAnuncio').removeClass('fa-xmark').addClass('fa-pencil');

            // Desabilita o botão de salvar alterações
            $('#salvar-alteracoes').prop('disabled', true);

            // Redefinindo a variável de editar para false (Não está editando)
            editarOn = false;
        },
        error: function (response) {
            // Reabilita o botão caso dê erro
            $('#salvar-alteracoes').prop('disabled', false);

            // Exibe mensagem de erro
            Swal.fire({
                title: "Erro",
                text: response.responseJSON.error,
                icon: "error",
                confirmButtonText: "Ok"
            });
        }
    });
});