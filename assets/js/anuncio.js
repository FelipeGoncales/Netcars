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
function aplicarFiltroMarca(div) {
    localStorage.setItem('tipo-veiculo', TIPO_VEIC);

    // Pegamos o id do elemento clicado
    const marca = $(div).attr("marca");

    // Salvamos no localStorage para usar na próxima página
    localStorage.setItem("filtro-marca", marca);

    // Redireciona para a página de veículos
    window.location.href = "veiculos.html";
}

// Adicionando o evento aos elementos
$(document).ready(function () {
    $(`.a-marcas-${TIPO_VEIC}`).click(function (e) {
        aplicarFiltroMarca(this);
    });

    $('#logo-img').click(function () {
        aplicarFiltroMarca(this);
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
            580: { items: 2 },
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
    if (valor < 0) {
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

    // Caso exista dadosUser
    if (dadosUser) {
        await obterTipoUser();

        if (tipoUser === 2 || tipoUser === 1) {
            // Função para mudar o botão para do adm
            $('#div-button-vendedor').css('display', 'flex');
            $('#div-button-cliente').css('display', 'none');
            $('#div-button-vendido-cliente').css('display', 'none');
            $('#div-button-vendido-adm').css('display', 'none');
            $('#div-button-cancelar-reserva').css('display', 'none');

            // Função para mudar a mensagem para o adm
            $('#mensagem-user').css('display', 'none');
            $('#mensagem-adm').css('display', 'flex');
            $('#mensagem-vendido-cliente').css('display', 'none');
            $('#mensagem-vendido-adm').css('display', 'none');
            $('#mensagem-reserva').css('display', 'none');

            $('#div-icons-actions').css('display', 'flex');
            
            // Retorna
            return;
        }
    }

    // Função para mudar o botão para cancelar reserva
    $('#div-button-vendedor').css('display', 'none');
    $('#div-button-cliente').css('display', 'flex');
    $('#div-button-vendido-cliente').css('display', 'none');
    $('#div-button-vendido-adm').css('display', 'none');
    $('#div-button-cancelar-reserva').css('display', 'none');

    // Função para mudar a frase que aparece caso seja o cliente que reservou
    $('#mensagem-user').css('display', 'flex');
    $('#mensagem-adm').css('display', 'none');
    $('#mensagem-vendido-cliente').css('display', 'none');
    $('#mensagem-vendido-adm').css('display', 'none');
    $('#mensagem-reserva').css('display', 'none');

    $('#div-icons-actions').css('display', 'none');
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

// Adidiona formatação ao input de preço
$(document).ready(async function () {
    formatarPreco($('#valor-servico'));
    formatarPreco($('#valor-editar-servico'));
})

// Modal Manutenção
function modalManutencao() {
    // Se o modal estiver aberto
    if ($('.modal-manu').css('display') === 'flex') {
        $('.modal-manu').css('display', 'none');
        $('#overlay-bg').css('display', 'none');
    } else { // Já se estiver fechado
        $('.modal-manu').css('display', 'flex');
        $('#overlay-bg').css('display', 'flex');
    }
}

// Ao clicar no ícone de X do modal de manutenção
$('#fecharModalManu').click(function () {
    // Fechar modal de manutenção
    modalManutencao();
    // Reabre o display da div de carregamento
    $('.bg-carregamento-manu').css('display', 'flex');
})

// Ao clicar no botão de manutenção
$('#addManutencao').click(async function () {
    // Carrega as manutenções
    await carregarManutencao();

    // Abrir modal de manutenção
    modalManutencao();
})

// Função para habilitar ou desabilitar as setas do modal de manutenção
function desabilitarSetas() {
    // Caso naõ tenha nenhuma manutenção
    if (!LISTA_MANUTENCOES) {
        // Desativa ambas as setas
        $('#manutencao-prox').addClass('disabled').prop('disabled', true);
        $('#manutencao-voltar').addClass('disabled').prop('disabled', true);
        return;
    }

    // Obtém a quantidade de manutenções
    let lenLista = LISTA_MANUTENCOES.length;

    // Desabilita a seta de avançar
    if (INDEX_MANUTENCAO >= lenLista) {
        $('#manutencao-prox').addClass('disabled').prop('disabled', true);
    } else {
        $('#manutencao-prox').removeClass('disabled').prop('disabled', false);
    }

    // Desabilita a seta de voltar
    if (INDEX_MANUTENCAO <= 0) {
        $('#manutencao-voltar').addClass('disabled').prop('disabled', true);
    } else {
        $('#manutencao-voltar').removeClass('disabled').prop('disabled', false);
    }
}

// Botão de voltar
$('#manutencao-voltar').click(function () {
    // Caso a seta estiver desabilitada, retorna
    if ($(this).hasClass('disabled')) {
        return;
    }

    // Aumenta um no index de manutenção
    if (INDEX_MANUTENCAO <= 0) {
        return;
    }

    // Diminui um no index da manutenção
    INDEX_MANUTENCAO--;

    // Carrega a manutenção anterior
    inserirDadosManutencao();
})

// Botão de próximo
$('#manutencao-prox').click(function () {
    // Caso a seta estiver desabilitada, retorna
    if ($(this).hasClass('disabled')) {
        return;
    }

    // Aumenta um no index de manutenção
    if (INDEX_MANUTENCAO >= LISTA_MANUTENCOES.length) {
        return;
    }

    // Aumenta um no index da manutenção
    INDEX_MANUTENCAO++;

    // Carrega a próxima manutenção
    inserirDadosManutencao();
})

// Cria a lista de manutenções
var LISTA_MANUTENCOES;
var INDEX_MANUTENCAO;
var TODOS_SERVICOS = [];

// Função para inserir os dados da manutenção dependendo do index
async function inserirDadosManutencao(id_manu) {
    // Caso exista id_manutenção, ele busca o index da manutenção para carregar
    if (id_manu) {
        for (let idx in LISTA_MANUTENCOES) {
            /* Compara o id da manutenção com os fornecidos pela lista 
               para ter certeza que irá abrir o mesmo que foi editado */
            if (LISTA_MANUTENCOES[idx].id_manutencao == id_manu) {
                // Caso for igual, atribui o index da manutenção a variável global INDEX_MANUTENCAO
                INDEX_MANUTENCAO = idx;
            }
        }
    }

    // Verifica se o index é 1 maior que a última manutenção
    if (INDEX_MANUTENCAO == LISTA_MANUTENCOES.length) {
        // Desabilita os botões de add serviço e cancelar
        $('#add-servico').prop('disabled', true);
        $('#cancelar-manu').prop('disabled', true);

        // Limpa os inputs
        $('#titleManutencao').text('Adicionar manutenção');
        $('#input-date').val('');
        $('#input-obs').val('');
        $('#valor-total-manu').text(formatarValor(0));
        $('#input-id-manutencao').val('');
        $('#tbody-servicos').empty();

        // Desabilita ou habilita as setas
        desabilitarSetas();

        // Retorna
        return;
    }

    // Pega a manutenção mais recente da lista
    const manutencao = LISTA_MANUTENCOES[INDEX_MANUTENCAO];

    // Formatando a data para inserir no input
    const dataOriginal = manutencao.data_manutencao;

    // Formata a data
    const dataFormatada = new Date(dataOriginal).toISOString().split('T')[0];

    // Separa dia, mês e ano com .split() usando o '-' como parâmetro para cortar
    const [ano, mes, dia] = dataFormatada.split('-');

    // Formatando a data para exibição no título
    const dataFormatadaBr = `${dia}/${mes}/${ano}`;

    // Altera o texto para a data da manutenção
    $('#titleManutencao').text(`Manutenção ${dataFormatadaBr}`);

    // Inserindo a data formatada no input type date
    $('#input-date').val(dataFormatada);

    // Adicionando a observação ao input
    $('#input-obs').val(manutencao.observacao);

    // Inserindo o preço formatado no p
    $('#valor-total-manu').text(formatarValor(manutencao.valor_total));

    // Insere o ID da manutenção no input hidden
    $('#input-id-manutencao').val(manutencao.id_manutencao);

    // Reabilita o botão de manutenção
    $('#add-servico').prop('disabled', false);

    // Reabilita o botão de cancelar manutenção
    $('#cancelar-manu').prop('disabled', false).css('transition', '0.3s');

    // Adiciona os serviços
    await obterServicosManutencao(manutencao.id_manutencao);

    // Desabilita ou habilita as setas
    desabilitarSetas();
}

async function carregarManutencao() {
    // Obtém o item do local storage
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    // Verifica se existe os dados do usuário
    if (!dadosUser) {
        return;
    }

    // Desabilita os botões de add serviço e cancelar
    $('#add-servico').prop('disabled', true);
    $('#cancelar-manu').prop('disabled', true);

    // Limpa os inputs
    $('#titleManutencao').text('');
    $('#input-date').val('');
    $('#input-obs').val('');
    $('#valor-total-manu').text(formatarValor(0));
    $('#input-id-manutencao').val('');
    $('#tbody-servicos').empty();

    // Acessa a função de obter os dados da manutenção veículo
    try {
        // Verifica qual o tipo de veículo
        let id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;

        $.ajax({
            url: `${BASE_URL}/manutencao_veic/${id_veic}/${TIPO_VEIC}`,
            headers: {
                "Authorization": "Bearer " + dadosUser.token
            },
            success: await async function (response) {
                // Salva as manutenções na lista
                LISTA_MANUTENCOES = response.manutencao;

                // Verifica se o index da manutenção está salvo no local storage
                if (localStorage.getItem('idManutencao')) {
                    // Substitui o index pelo index salvo no local storage
                    let id_manutencao = localStorage.getItem('idManutencao');

                    // Remove o item do local storage
                    localStorage.removeItem('idManutencao');

                    // Insere os dados da manutenção
                    inserirDadosManutencao(id_manutencao);
                } else {
                    // Caso não exista, pega a última manutenção
                    INDEX_MANUTENCAO = LISTA_MANUTENCOES.length - 1;

                    // Insere os dados da manutenção
                    inserirDadosManutencao();
                }
            },
            error: function (response) {
                // Altera o texto para adicionar manutenção
                $('#titleManutencao').text('Adicionar manutenção');
            }
        })
    } finally {
        // Desabilita as setas
        desabilitarSetas();

        // Inserindo um pequeno delay para carregar tudo corretamente
        setTimeout(() => $('.bg-carregamento-manu').css('display', 'none'), 200)

    }
}

// Obter serviços da manutenção
function obterServicosManutencao(id_manu) {    // Obtém o item do local storage
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    // Verifica se existe os dados do usuário
    if (!dadosUser) {
        return;
    }

    // Obter os serviços da manutenção
    $.ajax({
        url: `${BASE_URL}/manutencao_servicos/${id_manu}`,
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        success: function (response) {
            // Limpa os elementos da tabela antes de adicionar novos
            $('#tbody-servicos').empty();

            // Armazena os serviços em uma variável
            const servicos = response.servicos;

            if (!servicos.length) {
                return;
            }

            for (index in servicos) {
                // Cria um elemento <tr> para agrupar as colunas
                const $tr = $('<tr>');

                if (index % 2 === 0) {
                    $tr.addClass('tipo2');
                } else {
                    $tr.addClass('tipo1');
                }

                // Cria os tds que irão conter as informações
                const $tdIcon = $('<td>');
                const $icone = $('<i>')
                    .addClass('fa-solid fa-pen-to-square editarServico')
                    .attr('id_servico', servicos[index].id_servicos)
                    .css('cursor', 'pointer');

                $tdIcon.append($icone);

                const $tdDescricao = $('<td>').text(servicos[index].descricao).addClass('descricao-td');
                const $tdValor = $('<td>').text(formatarValor(servicos[index].valor)).addClass('valor-td');

                $tr.append($tdIcon)
                    .append($tdDescricao)
                    .append($tdValor)

                $('#tbody-servicos').append($tr);
            }
        },
        error: function () {
            return;
        }
    })
}

// Salvar Manutenção
$('#salvar-manu').click(function () {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = 'login.html';
    }

    // Verifica se existe o id da manutenção
    const id_manutencao = $('#input-id-manutencao').val();

    // Caso não exista, cria uma manutneção
    if (!id_manutencao) {
        console.log('n tem manutencao')
        let envia = {
            "id_veic": TIPO_VEIC == 'carro' ? id_carro : id_moto,
            "tipo_veic": TIPO_VEIC,
            "data": $('#input-date').val(),
            "observacao": $('#input-obs').val()
        }

        $.ajax({
            method: "POST",
            url: `${BASE_URL}/manutencao`,
            contentType: 'application/json',
            data: JSON.stringify(envia),
            headers: {
                "Authorization": "Bearer " + dadosUser.token
            },
            success: function (response) {
                // Exibe mensagem de sucesso
                alertMessage(response.success, 'success');

                // Salva o index no local storage
                localStorage.setItem('idManutencao', response.id_manutencao);

                // Recarrega o modal de manutenção
                carregarManutencao();
            },
            error: function (response) {
                // Exibe mensagem de erro
                alertMessage(response.responseJSON.error, 'error');
            }
        })
        // Retorna para não continuar a função
        return;
    }

    // Caso exista, atualiza a manutenção existente
    let envia = {
        "tipo_veic": TIPO_VEIC,
        "data": $('#input-date').val(),
        "observacao": $('#input-obs').val(),
        "id_manutencao": id_manutencao
    }

    // Verifica se é carro ou moto
    const id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;

    $.ajax({
        method: "PUT",
        url: `${BASE_URL}/manutencao/${id_veic}`,
        contentType: 'application/json',
        data: JSON.stringify(envia),
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        success: function (response) {
            alertMessage(response.success, 'success');

            // Salva o index no local storage
            localStorage.setItem('idManutencao', LISTA_MANUTENCOES[INDEX_MANUTENCAO].id_manutencao);

            // Recarrega o modal de manutenção
            carregarManutencao();
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
})

// Ao clicar no botão de cancelar manutenção
$('#cancelar-manu').click(function () {
    Swal.fire({
        title: "Deseja cancelar essa manutenção?",
        icon: "warning",
        text: "Os dados dessa manutenção nunca mais ficarão disponíveis.",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Obtém os dados do usuário
            const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

            // Caso não tenha, redireciona para login
            if (!dadosUser) {
                window.location.href = 'login.html';
            }

            // Verifica se existe o id da manutenção
            const id_manutencao = $('#input-id-manutencao').val();

            // Caso não exista id manutenção
            if (!id_manutencao) {
                window.location.href = 'login.html';
                return;
            }

            // Acessa a rota ajax
            $.ajax({
                method: "DELETE",
                url: `${BASE_URL}/manutencao/${id_manutencao}`,
                headers: {
                    "Authorization": "Bearer " + dadosUser.token
                },
                success: function (response) {
                    // Recarrega as manutenções
                    carregarManutencao();
                    // Exibe a mensagem de sucesso
                    alertMessage(response.success, 'success');
                },
                error: function (response) {
                    alertMessage(response.responseJSON.error, 'error');
                }
            })
        }
    })
})

// Abrir add serviço
$('#add-servico').click(function () {
    $('.modal-manu').css('display', 'none');
    $('#formAddServico').css('display', 'flex');
})

// Fechar add serviço
$('#fecharModalAddServico').click(function () {
    $('.modal-manu').css('display', 'flex');
    $('#formAddServico').css('display', 'none');
})

// Enviar form de add serviço
$('#formAddServico').on('submit', function (e) {
    e.preventDefault();

    // Obtém dados user
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = "login.html";
    }

    const data = new FormData(this);

    let envia = {
        "descricao": data.get('descricao-servico'),
        "valor": desformatarPreco(data.get('valor-servico')),
        "id_manutencao": $('#input-id-manutencao').val()
    }

    $.ajax({
        method: "POST",
        url: `${BASE_URL}/servicos`,
        data: JSON.stringify(envia),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        success: function (response) {
            // Exibe o modal de manutenção
            $('#formAddServico').css('display', 'none');
            $('.modal-manu').css('display', 'flex');

            // Limpa os inputs
            $('#descricao-servico').val('');
            $('#valor-servico').val('');

            // Salva o id da manutenção no local storage
            localStorage.setItem('idManutencao', LISTA_MANUTENCOES[INDEX_MANUTENCAO].id_manutencao);

            // Recarregando a página
            carregarManutencao();
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
})

// Abre o modal de editar
$(document).on('click', '.editarServico', function () {
    const id_servico = $(this).attr('id_servico');

    if (!id_servico) {
        window.location.reload();
        return;
    }

    // Obtém dados user
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = "login.html";
        return;
    }

    $.ajax({
        url: `${BASE_URL}/servicos/${id_servico}`,
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        success: function (response) {
            // Fecha o modal de manutenção e abre o de editar
            $('.modal-manu').css('display', 'none');
            $('#formEditarServico').css('display', 'flex');

            // Obtém a resposta
            const servico = response.servico;

            // Carrega os valores no modal de editar
            $('#id-editar-servico').val(servico.id_servicos);
            $('#descricao-editar-servico').val(servico.descricao);
            $('#valor-editar-servico').val(formatarValor(servico.valor));
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
});

// Fecha o modal de editar
$('#fecharModalEditarServico').click(function () {
    $('.modal-manu').css('display', 'flex');
    $('#formEditarServico').css('display', 'none');
})

$('#fecharModalEditarServico').click(function () {
    $('.modal-manu').css('display', 'flex');
    $('#formEditarServico').css('display', 'none');
})

// Função para inicializar o carregamento de serviços quando a página carrega
$(document).ready(function() {
    // Carrega todos os serviços disponíveis para o select
    carregarTodosServicos();

    $(document).on('change', '#select-servico', function() {
        atualizarValorServico();
    });
});

// Função para carregar todos os serviços do banco para o select
function carregarTodosServicos() {
    // Obtém o item do local storage
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    // Verifica se existe os dados do usuário
    if (!dadosUser) {
        alertMessage("Usuário não autenticado. Redirecionando para o login...", "error");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Acessa a função de obter todos os serviços cadastrados
    try {
        $.ajax({
            url: `${BASE_URL}/servicos`, // Endpoint para obter todos os serviços cadastrados
            headers: {
                "Authorization": "Bearer " + dadosUser.token
            },
            success: function(response) {
                // Salva todos os serviços na lista global
                TODOS_SERVICOS = response.servicos;

                // Preenche o select com as opções
                preencherSelectServicos();
            }
        });
    } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        alertMessage("Erro ao carregar serviços.", 'error');
    }
}

// Função para preencher o select com os serviços disponíveis
function preencherSelectServicos() {
    // Verifica se o elemento existe
    if ($('#select-servico').length === 0) {
        console.warn("Elemento select-servico não encontrado");
        return;
    }
    
    // Limpa o select exceto a primeira opção
    $('#select-servico').find('option:not(:first)').remove();
    
    // Adiciona cada serviço como uma opção no select
    TODOS_SERVICOS.forEach(servico => {
        const $option = $('<option>')
            .val(servico.id_servicos)
            .text(servico.descricao)
            .attr('data-valor', servico.valor);
            
        $('#select-servico').append($option);
    });
}

// Função para atualizar o valor do serviço quando um serviço é selecionado
function atualizarValorServico() {
    const servicoId = $('#select-servico').val();
    
    if (!servicoId) {
        $('#valor-servico').val('R$ 0,00');
        return;
    }
    
    // Encontra o serviço selecionado
    const servicoSelecionado = TODOS_SERVICOS.find(s => s.id_servicos == servicoId);
    
    if (servicoSelecionado) {
        // Atualiza o campo de valor
        $('#valor-servico').val(formatarValor(servicoSelecionado.valor));
    }
}

// Modificação da função de envio do formulário de adicionar serviço
// Substitui o handler existente
$('#formAddServico').off('submit').on('submit', function(e) {
    e.preventDefault();

    // Obtém dados user
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = "login.html";
        return;
    }

    const servicoId = $('#select-servico').val();
    
    if (!servicoId) {
        alertMessage('Selecione um serviço', 'error');
        return;
    }
    
    // Encontra o serviço selecionado
    const servicoSelecionado = TODOS_SERVICOS.find(s => s.id_servicos == servicoId);
    
    if (!servicoSelecionado) {
        alertMessage('Serviço não encontrado', 'error');
        return;
    }

    let envia = {
        "descricao": servicoSelecionado.descricao,
        "valor": servicoSelecionado.valor,
        "id_manutencao": $('#input-id-manutencao').val(),
        "id_servico": servicoId  // Adicionando o ID do serviço selecionado
    };

    $.ajax({
        method: "POST",
        url: `${BASE_URL}/servicos`,
        data: JSON.stringify(envia),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        success: function(response) {
            // Exibe o modal de manutenção
            $('#formAddServico').css('display', 'none');
            $('.modal-manu').css('display', 'flex');

            // Limpa o select e o valor
            $('#select-servico').val('');
            $('#valor-servico').val('R$ 0,00');

            // Salva o id da manutenção no local storage
            localStorage.setItem('idManutencao', LISTA_MANUTENCOES[INDEX_MANUTENCAO].id_manutencao);

            // Recarregando a página
            carregarManutencao();
            
            // Exibe mensagem de sucesso
            alertMessage(response.success || "Serviço adicionado com sucesso", 'success');
        },
        error: function(response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    });
});

// "Excluir" (inativar) serviço da manutenção
$('#excluir-servico').click(function () {
    Swal.fire({
        title: "Deseja excluir esse serviço?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Obtém dados user
            const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

            if (!dadosUser) {
                window.location.href = "login.html";
            }

            let id_servico_editar = $('#id-editar-servico').val();

            $.ajax({
                method: "DELETE",
                url: `${BASE_URL}/servicos/${id_servico_editar}`,
                headers: {
                    "Authorization": "Bearer " + dadosUser.token
                },
                success: function (response) {
                    // Exibe o modal de manutenção
                    $('.modal-manu').css('display', 'flex');
                    $('#formEditarServico').css('display', 'none');

                    // Salva o id da manutenção no local storage
                    localStorage.setItem('idManutencao', LISTA_MANUTENCOES[INDEX_MANUTENCAO].id_manutencao);

                    // Recarregando a página
                    carregarManutencao();
                },
                error: function (response) {
                    alertMessage(response.responseJSON.error, 'error');
                }
            })
        }
    })
})

/*
    RESERVA
*/


// Reservar moto

$('#reservar-btn').click(function () {
    // Busca os dados do usuário
    const dadosUser = localStorage.getItem('dadosUser');

    // Verificar se existe dadosUser no local storage
    if (!dadosUser) {
        // Limpa o local storage
        localStorage.clear();

        // Caso não, define uma mensagem e redireciona para login
        localStorage.setItem('mensagem', JSON.stringify({
            'success': 'Faça login para concluir sua reserva!'
        }))

        // Verifica o tipo do veículo
        if (TIPO_VEIC == 'carro') {
            // Salva o id do carro no local storage
            localStorage.setItem('id_carro_salvo', id_carro);
        } else {
            // Salva o id da moto no local storage
            localStorage.setItem('id_moto_salva', id_moto);
        }

        // e redireciona para login
        window.location.href = "login.html";
        return;
    }

    // Busca o token
    const token = JSON.parse(dadosUser).token;

    // Verificar se existe dadosUser no local storage
    if (!token) {
        // Limpa o local storage
        localStorage.clear();

        // Caso não, define uma mensagem
        localStorage.setItem('mensagem', JSON.stringify({
            'success': 'Faça login para concluir sua reserva!'
        }))

        // Verifica o tipo do veículo
        if (TIPO_VEIC == 'carro') {
            // Salva o id do carro no local storage
            localStorage.setItem('id_carro_salvo', id_carro);
        } else {
            // Salva o id da moto no local storage
            localStorage.setItem('id_moto_salva', id_moto);
        }

        // e redireciona para login
        window.location.href = "login.html";
        return;
    }

    // Verifica se as informações do cliente estão completas
    $.ajax({
        url: `${BASE_URL}/verificar_cadastro`,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function() {
            // Caso de certo
            Swal.fire({
                title: "Deseja reservar esse veículo?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#0bd979",
                cancelButtonColor: "#f71445",
                confirmButtonText: "Confirmar"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Declara a variável
                    let envia;
        
                    // Salva as informações
                    if (TIPO_VEIC == 'carro') {
                        envia = {
                            "id_veiculo": id_carro,
                            "tipo_veiculo": "carro"
                        }
                    } else {
                        envia = {
                            "id_veiculo": id_moto,
                            "tipo_veiculo": "moto"
                        }
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
        },
        error: function(response) {
            // Define uma mensagem para o cliente
            localStorage.setItem('msgReserva', 'Finalize seu cadastro para prosseguir com a reserva!');

            // Verifica o tipo do veículo
            if (TIPO_VEIC == 'carro') {
                // Salva o id do carro no local storage
                localStorage.setItem('id_carro_salvo', id_carro);
            } else {
                // Salva o id da moto no local storage
                localStorage.setItem('id_moto_salva', id_moto);
            }

            // Redireciona para login
            window.location.href = 'cliente-perfil.html';
            // Retorna
            return;
        }
    });
})

/* 
    COMPRAR (GERAR VENDA)
*/

// Adicionando evento de abrir modais no botão
$(document).ready(function () {

    // Ao clicar no botão de comprar já
    $('.comprar-btn').on('click', function () {
        // Obtém os dados do usuário
        let dadosUser = localStorage.getItem('dadosUser');

        // Caso não tenha dados do usuário
        if (!dadosUser) {
            // Limpa o local storage
            localStorage.clear();

            // Define uma mensagem para o cliente
            localStorage.setItem('mensagem', JSON.stringify({
                'success': 'Faça login para completar sua compra!'
            }))

            // Verifica o tipo do veículo
            if (TIPO_VEIC == 'carro') {
                // Salva o id do carro no local storage
                localStorage.setItem('id_carro_salvo', id_carro);
            } else {
                // Salva o id da moto no local storage
                localStorage.setItem('id_moto_salva', id_moto);
            }

            // Redireciona para login
            window.location.href = 'login.html';
            // Retorna
            return;
        }

        // Busca o token no local storage
        let token = JSON.parse(dadosUser).token;

        // Caso não tenha token, retorna
        if (!token) {
            // Limpa o local storage
            localStorage.clear();

            // Define uma mensagem para o cliente
            localStorage.setItem('mensagem', JSON.stringify({
                'success': 'Faça login para completar sua compra!'
            }))

            // Verifica o tipo do veículo
            if (TIPO_VEIC == 'carro') {
                // Salva o id do carro no local storage
                localStorage.setItem('id_carro_salvo', id_carro);
            } else {
                // Salva o id da moto no local storage
                localStorage.setItem('id_moto_salva', id_moto);
            }

            // Redireciona para login
            window.location.href = 'login.html';
            // Retorna
            return;
        }

        // Verifica se as informações do cliente estão completas
        $.ajax({
            url: `${BASE_URL}/verificar_cadastro`,
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function() {
                // Caso tenha, abre os modais
                $('#modal-comprar').css('display', 'flex');
                $('#overlay-bg').css('display', 'flex');
            },
            error: function(response) {
                // Define uma mensagem para o cliente
                localStorage.setItem('msgReserva', 'Finalize seu cadastro para prosseguir com a compra!');
                
                // Verifica o tipo do veículo
                if (TIPO_VEIC == 'carro') {
                    // Salva o id do carro no local storage
                    localStorage.setItem('id_carro_salvo', id_carro);
                } else {
                    // Salva o id da moto no local storage
                    localStorage.setItem('id_moto_salva', id_moto);
                }

                // Redireciona para login
                window.location.href = 'cliente-perfil.html';
                // Retorna
                return;
            }
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
        $('#modal-financiamento').css('display', 'none');
        $('#modal-parcelas').css('display', 'flex');
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

    // Confirmar compra via pix
    $('#confirmar-compra-pix').click(function() {
        Swal.fire({
            title: "Deseja confirmar a compra desse veículo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0bd979",
            cancelButtonColor: "#f71445",
            confirmButtonText: "Confirmar"
        }).then((result) => {
            // Botém o tipo do veículo e o id_veic
            let tipo_veic_numerico = TIPO_VEIC == 'carro' ? 1 : 2;
            let id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;

            $.ajax({
                method: 'POST',
                url: `${BASE_URL}/compra/a_vista`,
                data: JSON.stringify({
                    "tipo_veic": tipo_veic_numerico,
                    "id_veic": id_veic
                }),
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                },
                success: function(response) {
                    // Define uma mensagme para ser exibida na página de perfil
                    localStorage.setItem("msgReserva", response.success);
                    // Redireciona para a página de perfil
                    window.location.href = "cliente-perfil.html";
                    return;
                },
                error: function(response) {
                    alertMessage(response.responseJSON.error, 'error');
                }
            })
        })
    })

    // Confirmar financiamento
    $('#confirmar-financiamento').click(function() {
        Swal.fire({
            title: "Deseja confirmar o financiamento desse veículo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0bd979",
            cancelButtonColor: "#f71445",
            confirmButtonText: "Confirmar"
        }).then((result) => {
             // Botém o tipo do veículo e o id_veic
             let tipo_veic_numerico = TIPO_VEIC == 'carro' ? 1 : 2;
             let id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;
             let entrada = parseFloat(desformatarPreco($('#input-entrada').val()).toFixed(2));
             let qnt_parcelas = extrairNumeros($('#select-parcelas').val());

             let envia = {
                "id_veiculo": parseInt(id_veic),
                "tipo_veiculo": parseInt(tipo_veic_numerico),
                "entrada": entrada,
                "qnt_parcelas": parseInt(qnt_parcelas)
            }

            console.log(envia)
 
             $.ajax({
                 method: 'POST',
                 url: `${BASE_URL}/financiamento`,
                 data: JSON.stringify(envia),
                 contentType: "application/json",
                 headers: {
                     "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                 },
                 success: function (response) {
                     // Define uma mensagme para ser exibida na página de perfil
                     localStorage.setItem("msgReserva", response.success);
                     // Redireciona para a página de perfil
                     window.location.href = "cliente-perfil.html";
                     return;
                 },
                 error: function (response) {
                     alertMessage(response.responseJSON.error, 'error');
                 }
             })
        })
    })

    // Abre o modal para financiamento
    $('#btn-financiamento').on('click', function () {
        $('#modal-comprar').css('display', 'none');
        $('#modal-financiamento').css('display', 'flex');
        
        // Calcular parcelas
        calcularParcelas();
    })
});

// Função para calcular obter o valor das parcelas da API
function calcularParcelas() {
    // Botém o tipo do veículo e o id_veic
    let tipo_veic_numerico = TIPO_VEIC == 'carro' ? 1 : 2;
    let id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;

    // Caso exista a option de zero parcelas
    if ($('#option-zero-parcelas')) {
        // Remove a option de zero parcelas caso exista
        $('#option-zero-parcelas').remove();

        // Reabilita o select de parcelas
        $('#select-parcelas').prop('disabled', false);
    }

    // Obtém a entrada e parcelas
    let entrada = desformatarPreco($('#input-entrada').val()).toFixed(2);

    let qnt_parcelas = parseInt($('#select-parcelas').val()); 

    // Obtém o valor do financiamento e parcelas
    $.ajax({
        url: `${BASE_URL}/financiamento/${id_veic}/${tipo_veic_numerico}/${qnt_parcelas}/${entrada}`,
        success: function(response) {
            if (desformatarPreco($('#input-entrada').val()) >= response.preco_venda) {
                // Formata o valor da entrada como o preco de venda total
                $('#input-entrada').val(formatarValor(response.preco_venda))

                // Define o texto como o preco venda
                $('#p-valor-total').text(formatarValor(response.preco_venda));

                // Cria a option com valor 0
                const option = $('<option value="0" id="option-zero-parcelas">0x</option>');

                // Da append na option e a seleciona
                $('#select-parcelas').append(option).val(0).prop('disabled', true);

                return;
            }

            // Formatar valor total
            $('#p-valor-total').text(formatarValor(response.valor_total));

            const lista_parcelas = response.lista_parcelas;

            // Limpa a tabela antes de adicionar os itens
            $('#tbody-parcelas').empty();

            for (let index in lista_parcelas) {
                // Cria um elemento <tr> para agrupar as colunas
                const $tr = $('<tr>');

                if (index % 2 === 0) {
                    $tr.addClass('tipo1');
                } else {
                    $tr.addClass('tipo2');
                }

                // Formata a data
                const dataSeparada = lista_parcelas[index].data.split('-');
                const dataFormatada = dataSeparada.reverse().join('/');
                
                // Cria os tds que irão conter as informações
                const $tdNum = $('<td>').html(index);
                const $tdValor = $('<td>').html(formatarValor(lista_parcelas[index].valor));
                const $tdData = $('<td>').html(dataFormatada);

                $tr.append($tdNum)
                    .append($tdValor)
                    .append($tdData);

                $('#tbody-parcelas').append($tr);
            }
        },
        error: function(response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
}

// Adicionar formatações ao input e select
$(document).ready(function() {
    // Insere o valor R$0,00 no input
    $('#input-entrada').val(formatarValor(0));
    
    // Adiciona a formatar ao input quando ele for alterado
    formatarPreco($('#input-entrada'));

    // Define a quantidade mínima e máxima das parcelas
    let parcelaMin = 1;
    let parcelaMax = 60;

    // Cria o loop for
    for (let i = parcelaMin; i < parcelaMax + 1; i++) {
        // Cria a option
        const optionParcela = $(`<option value="${i}">${i}x</option>`);
        // Adiciona a option as parcelas
        $('#select-parcelas').append(optionParcela);
    }

    // Calcular o valor total ao mudar o valor da entrada
    $('#input-entrada').on('input', function() {
        calcularParcelas();
    })

    // Calcular o valor total ao trocar a quantidade de parcelas
    $('#select-parcelas').on('change', function() {
        calcularParcelas();
    })
})