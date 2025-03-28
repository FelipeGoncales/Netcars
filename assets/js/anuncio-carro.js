// Dicionário com a URL da foto da logo das marcas de carro
const logo_carros = {
        "Acura": "assets/img/logo-carro/acura.png",
        "Alfa Romeo": "assets/img/logo-carro/alfa romeo.png",
        "Aston Martin": "assets/img/logo-carro/aston martin.png",
        "Audi": "assets/img/logo-carro/audi.png",
        "Bentley": "assets/img/logo-carro/bentley.png",
        "BMW": "assets/img/logo-carro/bmw.png",
        "BYD": "assets/img/logo-carro/byd.svg",
        "Bugatti": "assets/img/logo-carro/bugatti.png",
        "Cadillac": "assets/img/logo-carro/cadillac.png",
        "Chevrolet": "assets/img/logo-carro/chevrolet.jpg",
        "Chery": "assets/img/logo-carro/chery.png",
        "Citroën": "assets/img/logo-carro/citroen.jpg",
        "Dodge": "assets/img/logo-carro/dodge.jpg",
        "Ferrari": "assets/img/logo-carro/ferrari.png",
        "Fiat": "assets/img/logo-carro/fiat.svg",
        "Ford": "assets/img/logo-carro/ford.png",
        "GMC": "assets/img/logo-carro/gmc.png",
        "Honda": "assets/img/logo-carro/honda.jpg",
        "Hyundai": "assets/img/logo-carro/hyundai.jpg",
        "Infiniti": "assets/img/logo-carro/infiniti.png",
        "JAC": "assets/img/logo-carro/jac.png",
        "Jeep": "assets/img/logo-carro/jeep.svg",
        "Kia": "assets/img/logo-carro/kia.jpg",
        "Land Rover": "assets/img/logo-carro/land-rover.png",
        "Lexus": "assets/img/logo-carro/lexus.jpg",
        "Maserati": "assets/img/logo-carro/maserati.jpg",
        "McLaren": "assets/img/logo-carro/mclaren.png",
        "Mazda": "assets/img/logo-carro/mazda.jpg",
        "Mini": "assets/img/logo-carro/mini.jpg",
        "Mitsubishi": "assets/img/logo-carro/mitsubishi.svg",
        "Nissan": "assets/img/logo-carro/nissan.png",
        "Peugeot": "assets/img/logo-carro/peugeot.png",
        "Porsche": "assets/img/logo-carro/porsche.png",
        "Renault": "assets/img/logo-carro/renault.png",
        "Rolls-Royce": "assets/img/logo-carro/rolls royce.png",
        "Saab": "assets/img/logo-carro/saab.png",
        "Smart": "assets/img/logo-carro/smart.jpg",
        "Subaru": "assets/img/logo-carro/subaru.jpg",
        "Suzuki": "assets/img/logo-carro/suzuki.svg",
        "Tesla": "assets/img/logo-carro/tesla.jpg",
        "Toyota": "assets/img/logo-carro/toyota.png",
        "Volkswagen": "assets/img/logo-carro/volkswagem.png",
        "Volvo": "assets/img/logo-carro/volvo.png"
    }

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
                // CSS para ficar todas as fotos do mesmo tamanho
                const divImg = $('<div></div>')
                                .css({
                                    "position": "relative",
                                    "min-height": "350px",
                                    "height": "500px",
                                    "overflow": "hidden"
                                })
                divImg.append($('<img>').attr('src', imagem).css({
                    "position": "absolute",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translate(-50%, -50%)",
                    "height": "100%",
                    "min-width": "100%",
                    "width": "auto"
                }))
                                
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

            // Carregar foto da marca do carro 
            $("#logo-img").attr('src', `${logo_carros[infoVeic.marca]}`);
        
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