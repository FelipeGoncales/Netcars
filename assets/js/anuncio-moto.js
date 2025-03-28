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


// Declarando a variável id_carro fora da função para usá-la depois
let id_carro = '';

$(document).ready(function() {

    // Recupera a query string da URL
    const urlFrontEnd = window.location.search;

    // Cria um objeto URLSearchParams
    const urlParams = new URLSearchParams(urlFrontEnd);

    // Obtém o valor do parâmetro 'id'
    id_carro = urlParams.get('id');

    if (!id_carro) {
        window.location.href = "veiculos.html";
    }

    // Carregar dados do veículo
    $.ajax({
        method: "post",
        url: `${BASE_URL}/buscar-carro`, // URL da API para carros
        data: JSON.stringify({
            'id': id_carro
        }),
        contentType: "application/json",
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

            // Lista de extensões que você quer tentar
            var extensoes = ["png", "jpg", "jpeg", "svg"];
            var fileName = `assets/img/${infoVeic.marca.toLowerCase()}`;
            var $img = $("#logo-img");

            function tentarCarregar(i) {
                if (i >= extensoes.length) {
                    console.error("Imagem não encontrada para a marca:", infoVeic.marca);
                    return;
                }

                // Tenta carregar com a extensão atual
                $img.attr('src', `${fileName}.${extensoes[i]}`)
                    .off("error") // Remove qualquer handler anterior para evitar loops
                    .on("error", function() {
                        // Se der erro, tenta com a próxima extensão
                        tentarCarregar(i + 1);
                    });
            }

            tentarCarregar(0);
        
            carregarInputs();
        },
        error: function(response) {
            alert('Erro ao carregar os dados do veículo.');
            console.log(response);
        }
    });
})

// Deletar veículo

$('#deletar-veiculo').click( function () {
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
                url: `${BASE_URL}/carro/${id_carro}`,
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                },
                success: function(response) {
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
                error: function(response) {
                    alertMessage(response.responseJSON.error, 'error');
                }
            })
        }
      });
})