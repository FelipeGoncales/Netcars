// URL API

const BASE_URL = "http://192.168.1.123:5000";

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
        width: '28.3%',
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

let filtroSelect = {};

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

            console.log(filtroSelect);
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
}

// Função para trocar o filtro entre carro e moto

const divTipoCarro = $('#tipo-veic-carro');
const divTipoMoto = $('#tipo-veic-moto');
const tipoVeicBgSelecionado =  $('#tipo-veic-bg-selecionado');

// Lógica para mudar cor do selecionado
function alterarTipoSelecionado(tipo1, tipo2, posicao, texto, categoria1, categoria2, marca1, marca2) {
    if (!tipo1.hasClass('active')) {
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
    }
}
divTipoCarro.click(() => {
   alterarTipoSelecionado(divTipoCarro, divTipoMoto, '0', 'Carros', $('#categorias-carro'), 
   $('#categorias-moto'), $('#marcas-carro'), $('#marcas-moto')); 
})

divTipoMoto.click(() => {
    alterarTipoSelecionado(divTipoMoto, divTipoCarro, '50%', 'Motos', $('#categorias-moto'),  
    $('#categorias-carro'), $('#marcas-moto'), $('#marcas-carro'));
})

// Limpar filtros

function limparFiltros() {
    filtroSelect = {};
    $("#filtros-aplic").empty();
    $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);
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
                divEstado.remove(); // Remove o filtro de estado ao clicar no X
                estadoContainer.remove();
                estadoSelect.val(""); // Limpa o estado selecionado
                cidadeSelect.empty().prop("disabled", true); // Limpa o select de cidade
                cidadeSelect.prev("label").removeClass("active"); // Remove a classe ativa do label de cidade

                // Remove as cidades
                divFiltro.find('#cidade-filtro').remove();
                fluxoFiltro.find("#cidade-container").remove();

                // Remover estado do objeto
                delete filtroSelect.estado;
            });
            
            addFiltro('estado', estado.nome, removerFiltro, 'estado-filtro')

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

        // Cria a div para cidade com ícone de remoção
        let divFiltro = $('#filtros-aplic');
            
        // Criação da div para o estado com o ícone de remoção
        let divCidade = $("<div></div>").attr('id','cidade-filtro').addClass('filtro');
        let pNome = $("<p></p>").text(cidadeNome);
        let removerFiltro = $("<i></i>").addClass("fa-solid fa-x").on("click", function() {
            divCidade.remove(); // Remove o filtro de estado ao clicar no X
            cidadeContainer.remove();
            cidadeSelect.find('option[value=""]').prop('selected', true);
        });
        
        divCidade.append(pNome).append(removerFiltro);
        divFiltro.append(divCidade);

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

        console.log(filtroSelect);
    });
});
