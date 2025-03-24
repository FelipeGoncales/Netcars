// URL da API
const BASE_URL = "http://192.168.1.123:5000";

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
            600: { items: 2 },
            1000: { items: 3 }
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

function carregarInputs() {
    $('input').each(function () {
        const id = $(this).attr('id');
        const spanMirror = $(`#mirror-${id}`)

        $(this).css('display', 'none');
        spanMirror.text($(this).val()).css('display', 'flex');
    })
}

// Recupera a query string da URL
const urlFrontEnd = window.location.search;

// Cria um objeto URLSearchParams
const urlParams = new URLSearchParams(urlFrontEnd);

// Obtém o valor do parâmetro 'id'
const id = urlParams.get('id');

// Carregar dados do veículo
$.ajax({
    method: "post",
    url: `${BASE_URL}/buscar-carro`, // URL da API para carros
    data: JSON.stringify({
        'id': id
    }),
    contentType: "application/json",
    headers: {
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
    },
    success: function(response) {
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

        for (const imagem of urlImagens) {
            const divImg = $('<div></div>');
            divImg.append($('<img>').attr('src', imagem));
            divCarrossel.append(divImg);
        }

        // Inicializa o carrossel após adicionar os itens
        carregarOwlCarrossel();

        // Input marca
        $("#input-marca").val(infoVeic.marca);
        // Input modelo
        $("#input-modelo").val(infoVeic.modelo);
        // Input versao
        $("#input-subtitle").val(infoVeic.versao);
        // Input cidade - estado
        $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`, function(estados) {
            let siglaEstado = '';

            for (estado of estados) {
                if (estado.nome == infoVeic.estado) {
                    siglaEstado = estado.sigla;
                    break;
                }
            }

            $("#input-cidade").val(`${infoVeic.cidade} - ${siglaEstado}`);
            // É necessário chamar a função carregarInputs dentro do ajax novamente
            carregarInputs();
        })

        // Input ano
        $('#input-ano').val(`${infoVeic.ano_modelo}/${infoVeic.ano_fabricacao}`);

        // Input quilometragem
        $('#input-quilometragem').val(`${infoVeic.quilometragem} Km`);

        // Input câmbio
        $('#input-cambio').val(infoVeic.cambio);

        // Input categoria
        $('#input-categoria').val(infoVeic.categoria);

        // Input combustível
        $('#input-combustivel').val(infoVeic.combustivel);

        // Input cor
        $('#input-cor').val(infoVeic.cor);
        
        // Input licenciado
        let textoLicenciado = infoVeic.licenciado == 1 ? "Sim" : "Não";
        $('#input-licenciado').val(textoLicenciado);

        // Input final placa
        const ultimoCaracterPlaca = infoVeic.placa.slice(-1);
        $('#input-placa').val(ultimoCaracterPlaca)

        // Input preço venda
        $("#input-preco-venda").val(infoVeic.preco_venda);

        // Logo img
        $("#logo-img").attr('src', `assets/img/${infoVeic.marca.toLowerCase()}.png`);

    
        carregarInputs();
    },
    error: function(response) {
        alert('Erro ao carregar os dados do veículo.');
        console.log(response);
    }
});

