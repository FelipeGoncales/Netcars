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

// Função de aplicar filtro
function aplicarFiltroMarca(e, div) {
    e.preventDefault(); // Previne o comportamento padrão do link

    localStorage.setItem('tipo-veiculo', 'carro');

    // Pegamos o id do elemento clicado
    const marca = $(div).attr("marca");

    // Salvamos no localStorage para usar na próxima página
    localStorage.setItem("filtro-marca", marca);

    // Redireciona para a página de veículos
    window.location.href = "veiculos.html";
}

// Adicionando o evento aos elementos
$(document).ready(function () {
    $(".a-marcas-carro").click(function (e) {
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

        if (spanMirror.length) {
            $(this).css('display', 'none');
            spanMirror.text($(this).val()).css('display', 'flex');
        }
    });

    // Função especial para o input de licenciado (Sim ou Não)
    const selectLicenciado = $('#select-licenciado');
    const spanMirror = $(`#mirror-select-licenciado`);

    selectLicenciado.css('display', 'none');
    let valorLicenciado;

    if (selectLicenciado.val() === '1') {
        valorLicenciado = 'Sim';
    } else {
        valorLicenciado = 'Não';
    }

    spanMirror.text(valorLicenciado).css('display', 'flex');

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