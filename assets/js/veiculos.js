// Função de exibir a mensagem para evitar repetir código
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

        // Limpar o local storage para evitar que a mensagem de novo ao recarregar a página
        localStorage.clear();
}

// Criando o dicionário do filtro
let filtroSelect = {};

let tipoVeiculo = "";

// Carregar veículos ao abrir a página
$(document).ready(() => {
    const tipoVeicLocalStorage = localStorage.getItem('tipo-veiculo');

    if (tipoVeicLocalStorage) {
        if (tipoVeicLocalStorage == "carro") {
            tipoVeiculo = "carro";
        } else if (tipoVeicLocalStorage === "moto") {
            tipoVeiculo = "moto";
        }

        localStorage.removeItem('tipo-veiculo');
    } else {
        tipoVeiculo = "carro";
    }

    buscarVeiculos();
})

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

function buscarVeiculos() {
    $.ajax({
        method: "POST",
        url: `${BASE_URL}/buscar-${tipoVeiculo}`,
        data: JSON.stringify(filtroSelect),
        contentType: "application/json",
        success: async function(response) {
            // Alterando o número da quantidade de veículos obtidos através da resposta da API
            $("#qnt-veiculos").text(response.qnt);

            // Obtendo a div para inserir os veículos
            const $divVeic = $("#div-veiculos");
            $divVeic.empty();

            // Obtém a lista de veículos
            const listaVeic = response.veiculos;

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
            
                // Título do veículo
                const h3Title = $("<h3></h3>").text(`${veiculo.marca} ${veiculo.modelo}`); // Inserir nome do carro
            
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
                $divVeic.append(divCard);
            }
        },
        error: function(response) {
            alertMessage(response.responseJSON.error, 'error');
            setTimeout(
                window.location.href = "index.html"
            , 3000)
        }
    })
}

// Lógica para funcionar o scroll
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos necessários
    const divPaiFiltro = document.querySelector('.div-pai-filtro');
    const secVeiculos = document.querySelector('.sec-veiculos'); // Utiliza a seção correta de veículos

    // Estilos originais e fixos para o filtro
    const originalStyle = {
        width: '100%',
        position: 'static',
        top: '20px'
    };
    const fixedStyle = {
        width: '430px',
        position: 'fixed',
        top: '86px'
    };
    const fixThreshold = 128.8; // Ponto de scroll a partir do qual o filtro se fixa

    function verificarScroll() {
        const scrollPosition = window.scrollY;
        const finalSecVeiculos = secVeiculos.offsetTop + secVeiculos.offsetHeight;
        const alturaFiltro = divPaiFiltro.offsetHeight;
        // Ponto onde o filtro deve parar de estar fixo
        const posicaoParada = finalSecVeiculos - alturaFiltro;

        if (scrollPosition < fixThreshold) {
            // Antes do ponto de fixação, restaura o estilo original
            Object.assign(divPaiFiltro.style, {
                width: originalStyle.width,
                position: originalStyle.position,
                top: originalStyle.top,
                left: ''
            });
        } else if (scrollPosition >= fixThreshold && scrollPosition < posicaoParada - parseFloat(fixedStyle.top)) {
            // Entre o ponto de fixação e o ponto de parada, mantém o filtro fixo
            Object.assign(divPaiFiltro.style, {
                width: fixedStyle.width,
                position: fixedStyle.position,
                top: fixedStyle.top,
                left: ''
            });
        } else {
            // Após o ponto de parada, posiciona o filtro de forma absoluta para que ele não ultrapasse a seção
            Object.assign(divPaiFiltro.style, {
                width: fixedStyle.width,
                position: 'absolute',
                top: posicaoParada + 'px',
                left: ''
            });
        }
    }

    // Eventos para atualizar o estilo conforme o scroll e redimensionamento da janela
    window.addEventListener('scroll', verificarScroll);
    window.addEventListener('resize', verificarScroll);
    verificarScroll(); // Verifica a posição inicial ao carregar
});

// add filtro visual 
function addFiltro(tipo, nome, remove, id, tipoInput, input) {
    let divFiltro = $('#filtros-aplic');
    let removerBtn = remove;

    if (!remove) {
        removerBtn = $("<i></i>").addClass("fa-solid fa-x").on("click", function() {
            // Remove o filtro de estado ao clicar no X
            $(`#${id}`).remove();
            // Remover do informação do objeto
            delete filtroSelect[tipo];
            // Descelecionar select
            
            if (tipoInput === "select") {
                input.find('option[value=""]').prop('selected', true);
            } else {
                input.val("");
            }

            // Aplicar filtros a API quando deletar
            buscarVeiculos();
        });
    }

    // Remover o filtro caso já exista
    if ($(`#${id}`)) {
        ($(`#${id}`)).remove();
    }

    // Criar a div
    let div = $("<div></div>").attr('id',id).addClass('filtro');
    div.append($('<p></p>').text(nome)).append(removerBtn);

    // Adicionar informação no objeto

    if ($(input).val()) {
        filtroSelect[tipo] = $(input).val();
    } else {
        filtroSelect[tipo] = nome;
    }

    // Adicionar o filtro a div de filtros

    divFiltro.append(div);

    $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

    // Aplicar filtros e enviar para a API
    buscarVeiculos();
}

// Função para trocar o filtro entre carro e moto

const divTipoCarro = $('#tipo-veic-carro');
const divTipoMoto = $('#tipo-veic-moto');
const tipoVeicBgSelecionado =  $('#tipo-veic-bg-selecionado');

// Lógica para mudar cor do selecionado
function alterarTipoSelecionado(tipo1, tipo2, posicao, texto, categoria1, categoria2, marca1, marca2, tipoFiltro) {
    if (!tipo1.hasClass('active')) {
        if (texto === 'Carros') {
            $('#h2-titulo').text(`Carros semi-novos e usados`)
        } else {
            $('#h2-titulo').text(`Motos semi-novas e usadas`)
        }


        tipo1.addClass('active');
        tipo2.removeClass('active');
        tipoVeicBgSelecionado.css('left', posicao);

        $("#tipo-veic").text(texto);

        // Lógica para trocar as categorias visíveis
        categoria1.css('display', 'flex');
        marca1.css('display', 'flex');
        
        categoria2.css('display', 'none');
        marca2.css('display', 'none');
    
        limparFiltros();

        tipoVeiculo = tipoFiltro;

        buscarVeiculos();
    }
}
divTipoCarro.click(() => {
   alterarTipoSelecionado(divTipoCarro, divTipoMoto, '0', 'Carros', $('#categorias-carro'), 
   $('#categorias-moto'), $('#marcas-carro'), $('#marcas-moto'), "carro"); 
})

divTipoMoto.click(() => {
    alterarTipoSelecionado(divTipoMoto, divTipoCarro, '50%', 'Motos', $('#categorias-moto'),  
    $('#categorias-carro'), $('#marcas-moto'), $('#marcas-carro'), "moto");
})

// Limpar filtros

function limparFiltros() {
    filtroSelect = {};
    $("#filtros-aplic").empty();
    $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

    buscarVeiculos();
}

$('#limpar-filtros').click(() => {
    limparFiltros();
})

// Filtro Marca
$(".itens-details li").on("click", function() {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#filtro-marca').remove();
        return;
    }
    
    $(".itens-details li").removeClass("active");
    $(this).addClass("active");
    let marca = $(this).attr('marca')
    let removerFiltro = $("<i></i>").addClass("fa-solid fa-x").on("click", function() {
        $("#filtro-marca").remove(); // Remove o filtro de estado ao clicar no X
        
        // Retirar objeto do dicionário e recontar a quantidade de filtros aplicados
        delete filtroSelect['marca'];
        $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);
    });

    addFiltro("marca", marca, null, "filtro-marca", "select", $(this));
});


// Filtro categoria

$('#select-categoria-carro').on('change', function() {
    addFiltro('categoria', $(this).val(), null, "categoria-veic", "select", $('#select-categoria-carro'));
})

// Filtro Localidade

$(document).ready(function () {
    const estadoSelect = $("#estado-select"); 
    const cidadeSelect = $("#cidade-select"); 

    // Função para carregar os estados do IBGE
    function carregarEstados(select) {
        $.getJSON("https://servicodados.ibge.gov.br/api/v1/localidades/estados", function (estados) {
            // Ordena os estados por nome
            estados.sort((a, b) => a.nome.localeCompare(b.nome));

            // Para cada estado, adiciona uma opção no select
            $.each(estados, function (index, estado) {
                select.append(`<option value="${estado.id}">${estado.nome}</option>`);
            });
        });
    }

    // Função para carregar as cidades com base no estado selecionado
    function carregarCidades(estadoId, select) {
        $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`, function (cidades) {
            select.empty(); // Limpa as opções anteriores do select de cidades

            select.append(`<option value="">Todas</option>`)

            // Adiciona cada cidade como opção
            $.each(cidades, function (index, cidade) {
                select.append(`<option value="${cidade.nome}">${cidade.nome}</option>`);
            });

            // Habilita o select de cidades e ativa o label (para animações ou estilos visuais)
            select.prop("disabled", false);
            select.prev("label").addClass("active");
        });
    }

    // Quando o select de estados mudar de valor, carrega as cidades correspondentes
    function addCidades(selectCid, selectEst) {
        const estadoId = $(selectEst).val();

        // Reinicia o select de cidades e desabilita-o temporariamente
        selectCid.empty().prop("disabled", true);
        // Remove a classe ativa do label de cidade caso o usuário mude de estado
        selectCid.prev("label").removeClass("active");

        if (estadoId) {
            carregarCidades(estadoId, selectCid);
        }
    };

    estadoSelect.on("change", () => {
        addCidades(cidadeSelect, estadoSelect);

        const estadoId = estadoSelect.val();
        let fluxoFiltro = $('#fluxo-filtro');
        let divFiltro = $('#filtros-aplic');

        if (!estadoId) {
            divFiltro.find('#estado-filtro').remove();
            fluxoFiltro.find("#estado-container").remove();
            divFiltro.find('#cidade-filtro').remove();
            fluxoFiltro.find("#cidade-container").remove();
            return;
        }

        if (!estadoId) {
            let divEstado = divFiltro.find('#estado-filtro'); // Pega o filtro do estado
            let estadoContainer = fluxoFiltro.find("#estado-container"); // Pega o container do estado
        
            divEstado.remove(); // Remove o filtro de estado
            estadoContainer.remove(); // Remove o container do estado
            cidadeSelect.empty().append('<option value="">Todas</option>').prop("disabled", true); // Reset no select de cidade
            cidadeSelect.prev("label").removeClass("active"); // Remove classe ativa do label de cidade
            return; // Para evitar que o restante do código seja executado
        }
        
        // Requisição para obter detalhes do estado
        $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}`, function(estado) {
            // Cria novos elementos usando $('<i>') e $('<a>') para evitar selecionar elementos já existentes
            let chevronRight = $("<i></i>").addClass("fa-solid fa-chevron-right");
            let estadoLink = $("<a></a>").text(estado.sigla);

            // Procura por um container específico para os dados dinâmicos; se não existir, cria um
            let estadoContainer = fluxoFiltro.find("#estado-container");
            if (!estadoContainer.length) {
                estadoContainer = $("<span></span>").attr("id", "estado-container");
                fluxoFiltro.append(estadoContainer);
            }
            
            // Criação do ícone de remover
            let removerFiltro = $("<i></i>").addClass("fa-solid fa-x").on("click", function() {
                $("#estado-filtro").remove(); // Remove o filtro de estado ao clicar no X
                $("#estado-container").remove();
                $("#estado-select").val(""); // Limpa o estado selecionado
                // Remove a classe ativa do label de cidade
                // Limpa o select de cidade
                $("#cidade-select").empty().prop("disabled", true).prev("label").removeClass("active"); 

                // Remove as cidades
                $("#filtros-aplic").find('#cidade-filtro').remove();
                $("#fluxo-filtro").find("#cidade-container").remove();

                // Limpar filtros aplicados
                delete filtroSelect["estado"];
                // Limpar filtros aplicados
                delete filtroSelect["cidade"];

                // ALterar o número de filtros aplicados exibidos
                $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);
            });

            addFiltro('estado', estado.nome, removerFiltro, 'estado-filtro', null, null);

            // Atualiza o container com os novos elementos (substituindo o estado anterior, se houver)
            estadoContainer.empty().append(chevronRight).append(estadoLink);

            // Remover a sigla de cidade caso troque o estado
            let cidadeContainer = fluxoFiltro.find("#cidade-container");
            if (cidadeContainer) {
                cidadeContainer.remove();
            }
        }); 
    });

    cidadeSelect.on("change", () => {
        const cidadeNome = cidadeSelect.val();
        let fluxoFiltro = $('#fluxo-filtro');

        let chevronRight = $("<i></i>").addClass("fa-solid fa-chevron-right");
        let cidadeLink = $("<a></a>").text(cidadeNome);

        // Procura por um container específico para os dados dinâmicos; se não existir, cria um
        let cidadeContainer = fluxoFiltro.find("#cidade-container");
        if (!cidadeContainer.length) {
            cidadeContainer = $("<span></span>").attr("id", "cidade-container");
            fluxoFiltro.append(cidadeContainer);
        }

            
        // Criação do ícone de remoção
        let removerFiltro = $("<i></i>").addClass("fa-solid fa-x").on("click", function() {
            // Remove o filtro de estado ao clicar no X
            $("#cidade-filtro").remove();

            // Remove o nome da cidade no topo da página
            $("#cidade-container").remove();

            // Desceleciona o input
            $("#cidade-select").find('option[value=""]').prop('selected', true);

            // Limpar filtros aplicados
            delete filtroSelect["cidade"];

            // ALterar o número de filtros aplicados exibidos
            $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);
        });

        addFiltro("cidade", cidadeNome, removerFiltro, "cidade-filtro", null, null);

        // Atualiza o container com os novos elementos (substituindo o estado anterior, se houver)
        cidadeContainer.empty().append(chevronRight).append(cidadeLink);
    })

    // Carrega os estados assim que a página é carregada
    carregarEstados(estadoSelect);
});

// Filtro Preço Mínimo

$("#input-preco-min").on("input", function() {
    addFiltro("preco-min", `Mín: R$${$(this).val()}`, null, "preco-min", "input", $(this));
})

// Filtro Preço Máximo

$("#input-preco-max").on("input", function() {
    addFiltro("preco-max", `Max: R$${$(this).val()}`, null, "preco-max", "input", $(this));
})

// Filtro Ano Mínimo

$("#input-ano-min").on("input", function() {
    addFiltro("ano-min", `Desde ${$(this).val()}`, null, "ano-min", "input", $(this));
})

// Filtro Ano Máximo

$("#input-ano-max").on("input", function() {
    addFiltro("ano-max", `Até ${$(this).val()}`, null, "ano-max", "input", $(this));
})

// Filtro Cores
document.addEventListener('DOMContentLoaded', function() {
    const filterHeader = document.querySelector('.filtro-cor-header');
    const filterContainer = document.querySelector('.filtro-cor-container');
    
    filterHeader.addEventListener('click', function() {
        filterContainer.classList.toggle('active');
        filterHeader.classList.toggle('active');
    });
});

const optionItems = document.querySelectorAll('.option-item');

// Function para colocar as cores na lista
optionItems.forEach((item) => {
    const label = $(item).find('label');

    label.click(function() {
        // Objeto com lista de cores
        cores = [];

        if (!$(this).prop("checked")) {
            cores.push($(this).text());
        }

        // Percorre todas as cores para refazer o array
        optionItems.forEach((item) => {
            // Pega o input checkbox dentro do item
            const checkbox = $(item).find('input[type="checkbox"]');
            // Pega a label dentro do item
            const label = $(item).find('label');   

            // Verifica se o input está checkado
            if (checkbox.prop("checked")) {
                // Se sim, adiciona a lista de cores
                cores.push(label.text());
            }
        })

        filtroSelect['cores'] = cores;
        
        $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);
    });
});
