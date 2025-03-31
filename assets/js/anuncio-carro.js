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

function carregarInputs() {
    $('input').each(function () {
        const id = $(this).attr('id');
        const spanMirror = $(`#mirror-${id}`)

        $(this).css('display', 'none');
        spanMirror.text($(this).val()).css('display', 'flex');
    })
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


// Declarando a variável id_carro fora da função para usá-la depois
let id_carro = '';

$(document).ready(function () {

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
        success: function (response) {
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
                        "min-height": "400px",
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
            $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`, function (estados) {
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
            $('#input-quilometragem').val(formatarQuilometragem(infoVeic.quilometragem));

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
            $("#input-preco-venda").val(formatarValor(infoVeic.preco_venda));

            // Carregar foto da marca do carro 
            $("#logo-img").attr('src', `${logo_carros[infoVeic.marca]}`);

            carregarInputs();
        },
        error: function (response) {
            alert('Erro ao carregar os dados do veículo.');
            console.log(response);
        }
    });
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
                url: `${BASE_URL}/carro/${id_carro}`,
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
    });
})

// Reservar carro

$('#reservar-btn').click(function () {
    Swal.fire({
        title: "Deseja reservar esse veículo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {
            const id_usuario = JSON.parse(localStorage.getItem('dadosUser')).id_usuario;

            const envia = {
                "id_usuario": id_usuario,
                "id_veiculo": id_carro,
                "tipo_veiculo": "carro"
            }

            $.ajax({
                method: "POST",
                url: `${BASE_URL}/reservar_veiculo`,
                contentType: 'application/json',
                data: JSON.stringify(envia),
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
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