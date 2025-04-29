// Lógica para não permitir que um tipo de usuário acesse o perfil de outros

$(document).ready(function() {
    $.ajax({
        url: `${BASE_URL}/obter_tipo_usuario`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: function(response) {
            const tipoUser = response.tipo_usuario;

            if (tipoUser === 2) {
                window.location.href = 'vendedor-perfil.html';
            }
            if (tipoUser === 3) {
                window.location.href = 'cliente-perfil.html';
            }
        },
        error: function(response) {
            localStorage.deleteItem('dadosUser');
            localStorage.setItem('mensagem', JSON.stringify({
                "error": response.responseJSON.error
            }))
            window.location.href = "login.html";
        }
    })
})

// Aparecer mensagem
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
}

$(document).ready(function() {
    // Exibir mensagem de reserva
    const mensagemLocalStorage = localStorage.getItem('msgReserva');

    if (mensagemLocalStorage) {
        alertMessage(mensagemLocalStorage, 'success');
        localStorage.removeItem('msgReserva')
    };

    // Exibir mensagem de cadastro de veículo
    const mensagemCadVeic = localStorage.getItem('msgCadVeic');

    if (mensagemCadVeic) {
        alertMessage(mensagemCadVeic, 'success');
        localStorage.removeItem('msgCadVeic')
    };
})

// FUNÇÃO PARA NÃO "BUGAR" O SELECT E INPUT

// Ao carregar o documento, adiciona a classe "active" ao label anterior se o input/select tiver valor
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os selects e inputs dentro de elementos com a classe .div-input
    const inputs = document.querySelectorAll(".div-input select, .div-input input");

    inputs.forEach((input) => {
        // Adiciona um ouvinte de evento para mudanças no valor do input/select
        input.addEventListener("change", function () {
            if (this.value) {
                // Se houver valor, adiciona a classe "active" no elemento irmão anterior (geralmente o label)
                this.previousElementSibling.classList.add("active");
            } else {
                // Se não houver valor, remove a classe "active"
                this.previousElementSibling.classList.remove("active");
            }
        });

        // Ao carregar a página, se o input já tiver um valor, ativa o label correspondente
        if (input.value) {
            input.previousElementSibling.classList.add("active");
        }
    });
});

// Fazer o nav funcionar
// Função para trocar a borda roxa do A que for clicado
function selecionarA(clicado) {
    $('nav').find('a').each(function (_, a) {
        if (a !== clicado) {
            $(a).removeClass('selecionado');
        } else {
            $(a).addClass('selecionado');
        }
    });
}

// Função para exibir relatório específico
function exibirRelatorio(tipo) {
    // Esconder todas as telas de relatório
    $('#minha-conta').css('display', 'none');
    $('#editUser').css('display', 'none');
    $('.container-relatorios').css('display', 'none');
    $('#reservas').css('display', 'none');

    // Mostrar apenas o relatório selecionado
    $(`#relatorio-${tipo}`).css('display', 'flex');

    // Destacar o item no submenu
    $('.sub-relatorio').removeClass('destaque');
    $(`#${tipo}`).addClass('destaque');
}

$(document).ready(function () {
    // Inicialmente ocultar todos os relatórios específicos
    $('.container-relatorios').hide();

    $("#link_minhaConta").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);
        $('#minha-conta').css('display', 'flex');
        $('#editUser').css('display', 'none');
        $('.container-relatorios').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('.submenu-relatorios').slideUp(); // Fecha o submenu se estiver aberto
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });

    $("#link_relatorios").on("click", function () {
        const elementoClicado = this;
        if ($(elementoClicado).hasClass('selecionado')) {
            $('#minha-conta').css('display', 'flex');
            $('#editUser').css('display', 'none');
            $('#reservas').css('display', 'none');
            $('.container-relatorios').css('display', 'none');
            $('.submenu-relatorios').slideUp(); // Fecha o submenu se estiver aberto

            const minhaConta = document.getElementById('link_minhaConta');
            selecionarA(minhaConta);
        } else {
            // Alternar a exibição do submenu
            $(".submenu-relatorios").slideDown();

            // Exibir a página de movimentação automaticamente
            exibirRelatorio('movimentacao');
            selecionarA(elementoClicado);
        }
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });

    $("#link_editUser").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);
        $('#minha-conta').css('display', 'none');
        $('#editUser').css('display', 'flex');
        $('#reservas').css('display', 'none');
        $('.container-relatorios').css('display', 'none');
        $('.submenu-relatorios').slideUp(); // Fecha o submenu se estiver aberto
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });

    $("#link_reservas").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#editUser').css('display', 'none');
        $('#reservas').css('display', 'flex');
        $('.container-relatorios').css('display', 'none');
        $('.submenu-relatorios').slideUp(); // Fecha o submenu se estiver aberto

        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    })

    // Ação ao clicar nos itens do submenu
    $("#movimentacao").on("click", function () {
        exibirRelatorio('movimentacao');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });

    $("#carros").on("click", function () {
        exibirRelatorio('carros');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });

    $("#motos").on("click", function () {
        exibirRelatorio('motos');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });

    $("#clientes").on("click", function () {
        exibirRelatorio('clientes');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });

    $("#manutencao").on("click", function () {
        exibirRelatorio('manutencao');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });

});

// Função para mostrar senha quando clicar no olho

$('#mostrarSenha').click(function () {
    if ($('#input-senha').attr('type') === 'password') {
        $('#mostrarSenha').removeClass('fa-eye').addClass('fa-eye-slash') // Trocando o ícone do olho
        $('#input-senha').attr('type', 'text') // Trocando o tipo de input
    } else {
        $('#mostrarSenha').removeClass('fa-eye-slash').addClass('fa-eye') // Trocando o ícone do olho 
        $('#input-senha').attr('type', 'password') // Trocando o tipo de input
    }
})

// Rota para cadastrar usuários
$("#formCadastroUsuario").on("submit", function (e) {
    e.preventDefault();

    let dados = new FormData(this);

    if (!dados.get('tipo_user')) {
        return alertMessage("Tipo de usuário inválido.", 'error');
    }

    let envia = {
        nome_completo: dados.get("nome_completo"),
        email: dados.get("email"),
        senha_hash: dados.get("senha_hash"),
        tipo_usuario: dados.get("tipo_user")
    }

    envia = JSON.stringify(envia);

    $.ajax({
        method: "post",
        url: `${BASE_URL}/cadastro`, // URL da API na Web
        data: envia,
        contentType: "application/json",
        success: function (response) {
            localStorage.setItem('usuario-editado', JSON.stringify({
                success: response.success
            }));

            window.location.reload();
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
})

// Fechar barra lateral
function fecharBarraLateral() {
    barraLateral.css('animation', 'fecharBarraLateral 0.7s');
    overlayBg.css('animation', 'sumirOverlay 0.7s');
    setTimeout(() => {
        barraLateral.css('display', 'none');
        overlayBg.css('display', 'none');
    }, 699);
}

// Rota para adicionar as options do select ano veículo

const anoMin = 1950;    
const anoMax = new Date().getFullYear();
const selectAnoFabCarro = $('#ano-fabricacao-carro');
const selectAnoModCarro = $('#ano-modelo-carro');
const selectAnoFabMoto = $('#ano-fabricacao-moto');
const selectAnoModMoto = $('#ano-modelo-moto');

function carregarAnos(select) {
    for (let ano = anoMax; ano >= anoMin; ano--) {
        const option = $(`<option value="${ano}">${ano}</option>`);
        select.append(option);
    }
}

carregarAnos(selectAnoFabCarro);
carregarAnos(selectAnoModCarro);
carregarAnos(selectAnoFabMoto);
carregarAnos(selectAnoModMoto);

//pdf carros
$('#pdf-carros').click(function (e) {
    e.preventDefault();

    // 1) Pegar valores do filtro
    const marca = $('#select-marca-carro').val();
    const anoModelo = parseInt($('#ano-modelo-carro').val());
    const anoFabricacao = parseInt($('#ano-fabricacao-carro').val());

    // 2) Montar URL
    let url = `${BASE_URL}/relatorio/carros?`;

    let listaUrl = [];

    if (marca) {
        listaUrl.push(`marca=${encodeURIComponent(marca)}`);
    }
    if (anoModelo) {
        listaUrl.push(`ano_modelo=${encodeURIComponent(anoModelo)}`);
    }
    if (anoFabricacao) {
        listaUrl.push(`ano_fabricacao=${encodeURIComponent(anoFabricacao)}`);
    }

    url += listaUrl.join('&');

    window.open(url, '_blank');
});


//pdf motos
$('#pdf-motos').click(function (e) {
    e.preventDefault();

    // 1) Pegar valores do filtro
    const marca = $('#select-marca-moto').val();
    const anoModelo = parseInt($('#ano-modelo-moto').val());
    const anoFabricacao = parseInt($('#ano-fabricacao-moto').val());

    // 2) Montar URL
    let url = `${BASE_URL}/relatorio/motos?`;

    let listaUrl = [];

    if (marca) {
        listaUrl.push(`marca=${encodeURIComponent(marca)}`);
    }
    if (anoModelo) {
        listaUrl.push(`ano_modelo=${encodeURIComponent(anoModelo)}`);
    }
    if (anoFabricacao) {
        listaUrl.push(`ano_fabricacao=${encodeURIComponent(anoFabricacao)}`);
    }

    url += listaUrl.join('&');

    window.open(url, '_blank');
});

//pdf usuarios
$('#pdf-clientes').click(function (e) {
    e.preventDefault();

    const nome = $('#nome-cliente').val();
    const cpf = $('#cpf-cnpj-cliente').val();
    const status = $('#status-cliente').val();
    const dia = $('#dia-cliente').val();
    const mes = $('#mes-cliente').val();
    const ano = $('#ano-cliente').val();

    let url = `${BASE_URL}/relatorio/usuarios?`;

    if (nome) {
        url += 'nome=' + encodeURIComponent(nome) + '&';
    }
    if (cpf) {
        url += 'cpf_cnpj=' + encodeURIComponent(cpf) + '&';
    }
    if (status) {
        url += 'ativo=' + encodeURIComponent(status) + '&';
    }
    if (dia) {
        url += 'dia=' + encodeURIComponent(dia) + '&';
    }
    if (mes) {
        url += 'mes=' + encodeURIComponent(mes) + '&';
    }
    if (ano) {
        url += 'ano=' + encodeURIComponent(ano) + '&';
    }
    window.open(url, '_blank');
});

//pdf manutenções
$('#pdf-manutencao').click(function (e) {
    e.preventDefault();

    const tipo = $('#tipo-veic-manutencao').val();
    const dia = $('#dia-manutencao').val();
    const mes = $('#mes-manutencao').val();
    const ano = $('#ano-manutencao').val();

    let url = `${BASE_URL}/relatorio/manutencao?`;

    if (tipo) {
        url += 'tipo-veic=' + encodeURIComponent(tipo) + '&';
    }
    if (dia) {
        url += 'dia=' + encodeURIComponent(dia) + '&';
    }
    if (mes) {
        url += 'mes=' + encodeURIComponent(mes) + '&';
    }
    if (ano) {
        url += 'ano=' + encodeURIComponent(ano) + '&';
    }
    window.open(url, '_blank');

});


// Exibir PDF de movimentações
$('#pdf-movimentacao').click(() => {
    window.open(`${BASE_URL}/relatorio/movimentacoes`, '_blank');
});




// FUNÇÃO PARA NÃO "BUGAR" O SELECT E INPUT

// Ao carregar o documento, adiciona a classe "active" ao label anterior se o input/select tiver valor
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os selects e inputs dentro de elementos com a classe .div-input
    const inputs = document.querySelectorAll("#select-marca-carro, #ano-minimo-carro .div-input input");

    inputs.forEach((input) => {
        // Adiciona um ouvinte de evento para mudanças no valor do input/select
        input.addEventListener("change", function () {
            if (this.value) {
                // Se houver valor, adiciona a classe "active" no elemento irmão anterior (geralmente o label)
                this.previousElementSibling.classList.add("active");
            } else {
                // Se não houver valor, remove a classe "active"
                this.previousElementSibling.classList.remove("active");
            }
        });

        // Ao carregar a página, se o input já tiver um valor, ativa o label correspondente
        if (input.value) {
            input.previousElementSibling.classList.add("active");
        }
    });
});

// Carregar usuários

function carregarUsuarios(usuarios_lista) {
    $.ajax({
        url: `${BASE_URL}/cadastro`,
        success: function (response) {
            const tbody = $("#tbody-users");

            let usuarios = usuarios_lista;
            // Caso não tiver parâmetro lista, usar resposta API
            if (!usuarios_lista) {
                usuarios = response.usuarios;
            }

            // Limpa o tbody antes de carregar os outros elementos
            tbody.empty();

            for (let index in usuarios) {
                // Cria um elemento <tr> para agrupar as colunas
                const $tr = $('<tr>');

                if (index % 2 === 0) {
                    $tr.addClass('tipo2');
                } else {
                    $tr.addClass('tipo1');
                }

                // Cria os tds que irão conter as informações
                const $tdIcon = $('<td>');
                const $icone = $('<i>').addClass('fa-solid fa-pen-to-square edit-icon').attr('id', usuarios[index].id_usuario);
                $tdIcon.append($icone);

                const $tdNome = $('<td>').text(usuarios[index].nome_completo).addClass('nome-td');
                const $tdEmail = $('<td>').text(usuarios[index].email).addClass('email-td');
                const $tdTelefone = $('<td>').text(usuarios[index].telefone).addClass('telefone-td');

                let textoAtivo = usuarios[index].ativo === 1 ? "Ativo" : "Inativo";
                const $tdAtivo = $('<td>').text(textoAtivo).addClass('ativo-td');

                let textoTipoUser = usuarios[index].tipo_usuario === 1 ? "Administrador" : usuarios[index].tipo_usuario === 2 ? "Vendedor" : "Cliente";
                const $tdTipoUsuario = $('<td>').text(textoTipoUser).addClass('tipo-user-td');

                $tr.append($tdIcon)
                    .append($tdNome)
                    .append($tdEmail)
                    .append($tdTelefone)
                    .append($tdAtivo)
                    .append($tdTipoUsuario);

                tbody.append($tr);
            }
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
}

// Chamar a função ao abrir a página

$(document).ready(() => {
    carregarUsuarios();
});

// Fechar modal editar
$("#close-modal-editar").click(function () {
    $('#modal-editar-usuario').css('display', 'none');
    $('#overlay-bg').css('display', 'none');
})

// Abrir modal editar ao clicar no ícone de editar
$('table').on('click', '.edit-icon', function () {
    const idUser = $(this).attr('id');

    const tdPai = $(this).closest('tr');

    const nome = tdPai.find('.nome-td');
    const email = tdPai.find('.email-td');
    const telefone = tdPai.find('.telefone-td');
    const ativo = tdPai.find('.ativo-td').text();
    const tipoUser = tdPai.find('.tipo-user-td').text();

    let textoNome = nome.text();
    let textoEmail = email.text();
    let textoTelefone = telefone.text();

    // Transformando em número
    let textoAtivo = ativo === "Ativo" ? 1 : 0;

    // Transformando em número
    let textoTipoUser = tipoUser === "Administrador" ? 1 : tipoUser === "Vendedor" ? 2 : 3;

    $('#modal-editar-usuario').css('display', 'flex')
    $('#overlay-bg-modal-edit').css('display', 'flex');

    $('#nome-editar').val(textoNome);
    $('#email-editar').val(textoEmail);
    $('#telefone-editar').val(textoTelefone);
    $('#ativo-editar').val(textoAtivo);
    $('#tipo-usuario-editar').val(textoTipoUser);

    // Rota para editar perfil
    $('#modal-editar-usuario').on("submit", function (e) {
        e.preventDefault();

        let dados = new FormData(this);

        // Preparar objeto com os dados para atualização
        let editar = {
            id_usuario: idUser,
            email: dados.get('email-editar'),
            nome_completo: dados.get('nome-editar'),
            telefone: dados.get('telefone-editar'),
            tipo_usuario: dados.get('tipo-usuario-editar'),
            ativo: dados.get('ativo-editar')
        };

        console.log(editar)

        const editarJSON = JSON.stringify(editar);

        $.ajax({
            method: "put",
            url: `${BASE_URL}/update_user`, // URL da API na Web
            data: editarJSON,
            contentType: "application/json",
            success: function (response) {
                localStorage.setItem('usuario-editado', JSON.stringify({
                    success: response.success
                }));

                window.location.reload();
            },
            error: function (response) {
                // Exibir mensagem de erro
                alertMessage(response.responseJSON.error, 'error');
            }
        });
    });
})

// Abrir modal editar
$('#btn-modal-cad-user').click(function() {
    $('#formCadastroUsuario').css('display', 'flex');
    $('#overlay-bg').css('display', 'flex');
})
// Fechar modal editar
$('#close-modal-cad-user, #overlay-bg').on('click', function() {
    $('#overlay-bg, #formCadastroUsuario').css('display', 'none');
  });  

 // Abre modal de receitas
 $('#mov-recietas').on('click', function() {
    $('.overlay-bg').css('display', 'flex');
    $('#modal-receita').css('display', 'flex');
  })

  // Fecha modal de receitas (X e overlay)
  $('#close-modal-receita, .overlay-bg').on('click', function() {
    $('.overlay-bg, #modal-receita').css('display', 'none');
  })

  // Abre modal de despesas
  $('#mov-despesas').on('click', function() {
    $('.overlay-bg').css('display', 'flex');
    $('#modal-despesa').css('display', 'flex');
  })

  // Fecha modal de despesas (X e overlay)
  $('#close-modal-despesa, .overlay-bg').on('click', function() {
    $('.overlay-bg, #modal-despesa').css('display', 'none');
  })

// Verificar se usuário foi editado
$(document).ready(() => {
    const userEditado = JSON.parse(localStorage.getItem('usuario-editado'));

    if (userEditado) {
        // Aparecer a tabela logo ao abrir a página 
        $('#minha-conta').css('display', 'none');
        $('#editUser').css('display', 'flex');
        // Código para selecionar o ícone de editar usuário
        const editA = $('#link_editUser');
        selecionarA(editA[0]);

        alertMessage(userEditado.success, "success");

        localStorage.removeItem('usuario-editado');
    }
})

// Fetch filtro usuarios

function fetchFiltroUsuarios() {
    const nomeLike = $('#search-user-input').val();
    const ativo = $('#status-select').val();
    const tipoUser = $('#type-select').val();

    const data = {
        'nome-like': nomeLike,
        'ativo': ativo,
        'tipo_usuario': tipoUser
    }

    const dataJSON = JSON.stringify(data);

    $.ajax({
        method: 'POST',
        url: `${BASE_URL}/get_user_filtro`,
        data: dataJSON,
        contentType: "application/json",
        success: function(response) {
            carregarUsuarios(response.usuarios);
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
}

// Adicionado a função quando os inputs forem alterados
$('#search-user-input').on('input', () => fetchFiltroUsuarios());
$('#status-select').on('change', () => fetchFiltroUsuarios());
$('#type-select').on('change', () => fetchFiltroUsuarios());

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

// Função para gerar o card
async function gerarCard(listaVeic, divAppend, tipoVeiculo) {
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

        const pReservadoPor = $('<p></p>').addClass('reservado-por').html(`Reservado por <span>${veiculo.nome_cliente}</span>`)
    
        // Cria a div de itens do card
        const divItensCard = $("<div></div>").addClass("itens-card");
    
        // Modelo
        const spanModelo = $(`<span></span>`)
            .text(veiculo.modelo)
            .css({
                'color': 'var(--roxo)',
                'font-size': '1.5rem'
            });

        // Título do veículo
        const h3Title = $("<h3></h3>")
            .append(`${veiculo.marca} `)
            .append(spanModelo)
            .css({
                'text-transform': 'uppercase',
                'font-size': '1.5rem'
            }) // Inserir nome do carro
    
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
        divCard.append(img, pReservadoPor, divItensCard);
    
        // Insere o card no container desejado na página
        divAppend.append(divCard);
    }
}

// Buscar reservas
function buscarReservas() {
    $.ajax({
        url: `${BASE_URL}/buscar_reservas`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: async function (response) {
            listaVeicCarro = response.carros;

            listaVeicMotos = response.motos;
        
            const $divReservas = $('#div-reservas');

            if (!listaVeicCarro.length && !listaVeicMotos.length) {
                const divPai = $('<div></div>').addClass('div-pai');
                const icon = $('<i></i>').addClass('fa-solid fa-thumbs-down icon');
                const btnBuscar = $('<a></a>').attr('href', 'veiculos.html').addClass('buscar-btn').html(`Gerenciar anúncios <i class="fa-solid fa-magnifying-glass"></i>`)
                const msg = ($('<p></p>').addClass('nada-encontrado').text('Nenhuma reserva encontrada até o momento.'));

                divPai.append(icon, msg, btnBuscar);
                $divReservas.append(divPai);
                return;
            }

            if (listaVeicCarro.length) {
                await gerarCard(listaVeicCarro, $divReservas, "carro");
            }

            if (listaVeicMotos.length) {
                await gerarCard(listaVeicMotos, $divReservas, "moto");
            }
        },
        error: function (response) {
            alert(response.responseJSON.error);
        }
    })
}

// Ao abrir o site, carregar reservas
$(document).ready(() =>{
    buscarReservas();
});