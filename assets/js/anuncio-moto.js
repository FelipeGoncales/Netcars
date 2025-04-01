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

// Função para carregar os valores dos inputs e selects para seus respectivos mirrors
function carregarInputsESelects() {
    // Carregar valores dos inputs
    $('input').each(function () {
        const id = $(this).attr('id');
        if (id) {
            const mirrorElement = $(`#mirror-${id}`);
            $(this).css('display', 'none');
            mirrorElement.text($(this).val()).css('display', 'flex');
        }
    });

    // Carregar valores dos selects
    $('select').each(function () {
        const id = $(this).attr('id');
        if (id) {
            const mirrorElement = $(`#mirror-${id}`);
            $(this).css('display', 'none');
            mirrorElement.text($(this).val()).css('display', 'flex');
        }
    });
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

// Declarando a variável id_moto fora da função para usá-la depois
let id_moto = '';

$(document).ready(function () {

    // Recupera a query string da URL
    const urlFrontEnd = window.location.search;

    // Cria um objeto URLSearchParams
    const urlParams = new URLSearchParams(urlFrontEnd);

    // Obtém o valor do parâmetro 'id'
    id_moto = urlParams.get('id');

    if (!id_moto) {
        window.location.href = "veiculos.html";
    }

    // Carregar dados do veículo
    $.ajax({
        method: "post",
        url: `${BASE_URL}/buscar-moto`, // URL da API para motos
        data: JSON.stringify({
            'id': id_moto
        }),
        contentType: "application/json",
        success: function (response) {

            console.log(response);

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
                carregarInputsESelects();
            })

            // Input ano
            $('#input-ano').val(`${infoVeic.ano_modelo}/${infoVeic.ano_fabricacao}`);

            // Input marchas
            $('#input-marchas').val(infoVeic.marchas);

            // Input quilometragem
            $('#input-quilometragem').val(formatarQuilometragem(infoVeic.quilometragem));

            // Input tipo motor
            $('#input-tipo-motor').val(infoVeic.tipo_motor);

            // Input cor
            $('#input-cor').val(infoVeic.cor);

            // Input refrigeração
            $('#input-refrigeracao').val(infoVeic.refrigeracao);

            // Input categoria
            $('#input-categoria').val(infoVeic.categoria);

            // Input cilindrada
            $('#input-cilindrada').val(infoVeic.cilindrada);

            // Input partida
            $('#input-partida').val(infoVeic.partida);

            // Input freio
            $('#input-freio').val(infoVeic.freio_dianteiro_traseiro);

            // Input alimentacao
            $('#input-alimentacao').val(infoVeic.alimentacao);

            // Input final placa
            const ultimoCaracterPlaca = infoVeic.placa.slice(-1);
            $('#input-placa').val(ultimoCaracterPlaca)

            // Input preço venda
            $("#input-preco-venda").val(formatarValor(infoVeic.preco_venda));

            // Carregar foto da marca da moto
            $("#logo-img").attr('src', `${logo_motos[infoVeic.marca]}`);

            carregarInputsESelects();
        },
        error: function (response) {
            alert('Erro ao carregar os dados do veículo.');
            console.log(response);
        }
    });
})

// Lógica do botão salvar alterações
$('#salvar-alteracoes').click(function () {
    if (editarOn === true) {
        // Obter todos os valores dos inputs
        const marca = $('#input-marca').val();
        const modelo = $('#input-modelo').val();
        const cidade = $('#input-cidade').val();
        const ano = $('#input-ano').val();
        const marchas = $('#input-marchas').val();
        const quilometragem = extrairNumeros($('#input-quilometragem').val());
        const tipoMotor = $('#input-tipo-motor').val();
        const cor = $('#input-cor').val();
        const freio = $('#input-freio').val();
        const direcaoEletrica = $('#input-direcao-eletrica').val();
        const computadorBordo = $('#input-computador-bordo').val();
        const alarme = $('#input-alarme').val();
        const cilindrada = $('#input-cilindrada').val();
        const precoVenda = desformatarPreco($('#input-preco-venda').val());

        // Preparando dados para enviar ao backend
        const dadosMoto = {
            id: id_moto,
            marca: marca,
            modelo: modelo,
            quilometragem: quilometragem,
            cor: cor,
            marchas: marchas,
            tipo_motor: tipoMotor,
            freio: freio,
            direcao_eletrica: direcaoEletrica,
            computador_bordo: computadorBordo,
            alarme: alarme,
            cilindrada: cilindrada,
            preco_venda: precoVenda
        };

        // Ano normalmente vem no formato "2020/2021", separando ano de fabricação e modelo
        if (ano && ano.includes('/')) {
            const [anoFabricacao, anoModelo] = ano.split('/');
            dadosMoto.ano_fabricacao = anoFabricacao;
            dadosMoto.ano_modelo = anoModelo;
        }

        // Cidade normalmente vem no formato "Cidade - UF", separando a cidade e o estado
        if (cidade && cidade.includes(' - ')) {
            const [cidadeNome, estado] = cidade.split(' - ');
            dadosMoto.cidade = cidadeNome;
            dadosMoto.estado = estado;
        }

        // Requisição AJAX para atualizar o anúncio da moto
        $.ajax({
            method: "PUT",
            url: `${BASE_URL}/moto/${id_moto}`,
            data: JSON.stringify(dadosMoto),
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
            },
            success: function (response) {
                // Desativa o modo de edição
                editarOn = false;
                
                // Exibe mensagem de sucesso
                alertMessage('Alterações salvas com sucesso!', 'success');
                
                // Atualiza os inputs e selects visuais
                carregarInputsESelects();
            },
            error: function (response) {
                alertMessage(response.responseJSON.error || 'Erro ao salvar alterações!', 'error');
                console.log(response);
            }
        });
    }
});

// Sobrescrever a função de edição do anuncio.js para funcionar com selects também
$('#editarAnuncio').off('click').on('click', function () {
    if (editarOn === false) {
        editarOn = true;

        // Habilitar e mostrar inputs
        $('input').each(function () {
            const id = $(this).attr('id');
            if (id) {
                const mirrorElement = $(`#mirror-${id}`);
                $(this).css('display', 'flex').attr('disabled', false);
                mirrorElement.css('display', 'none');
            }
        });

        // Habilitar e mostrar selects
        $('select').each(function () {
            const id = $(this).attr('id');
            if (id) {
                const mirrorElement = $(`#mirror-${id}`);
                $(this).css('display', 'flex').attr('disabled', false);
                mirrorElement.css('display', 'none');
            }
        });
    } else {
        editarOn = false;
        alertMessage('Alterações salvas com sucesso!', 'success');

        // Lógica para salvar no banco será executada no botão salvar alterações
        carregarInputsESelects();
    }
});

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