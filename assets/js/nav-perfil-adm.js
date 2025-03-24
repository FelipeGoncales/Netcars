// Lógica para não permitir que um tipo de usuário acesse o perfil de outros
const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
const tipoUser = dadosUser.tipo_usuario;

if (tipoUser === 2) {
    window.location.href = 'vendedor-perfil.html';
}
if (tipoUser === 3) {
    window.location.href = 'cliente-perfil.html';
}

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

const mensagemCadVeic = localStorage.getItem('msgCadVeic');
if (mensagemCadVeic) {
    alertMessage(mensagemCadVeic, 'success');
    localStorage.removeItem('msgCadVeic')
};

// Fazer o nav funcionar
// Função para trocar a borda roxa do A que for clicado
function selecionarA(clicado) {
    $('nav').find('a').each(function(_, a) {
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
    $('#cadUser').css('display', 'none');
    $('#editUser').css('display', 'none');
    $('.container-relatorios').css('display', 'none');
    
    // Mostrar apenas o relatório selecionado
    $(`#relatorio-${tipo}`).css('display', 'flex');
    
    // Destacar o item no submenu
    $('.sub-relatorio').removeClass('destaque');
    $(`#${tipo}`).addClass('destaque');
}

$(document).ready(function() {
    // Inicialmente ocultar todos os relatórios específicos
    $('.container-relatorios').hide();
    
    $("#link_minhaConta").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);
        $('#minha-conta').css('display', 'flex');
        $('#cadUser').css('display', 'none');
        $('#editUser').css('display', 'none');
        $('.container-relatorios').css('display', 'none');
        $('.submenu-relatorios').slideUp(); // Fecha o submenu se estiver aberto
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
   
    $("#link_relatorios").on("click", function() {
        const elementoClicado = this;
        if ($(elementoClicado).hasClass('selecionado')) {
            $('#minha-conta').css('display', 'flex');
            $('#cadUser').css('display', 'none');
            $('#editUser').css('display', 'none');
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

    $("#link_cadUser").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);
        $('#minha-conta').css('display', 'none');
        $('#cadUser').css('display', 'flex');
        $('#editUser').css('display', 'none');
        $('.container-relatorios').css('display', 'none');
        $('.submenu-relatorios').slideUp(); // Fecha o submenu se estiver aberto
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });

    $("#link_editUser").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);
        $('#minha-conta').css('display', 'none');
        $('#cadUser').css('display', 'none');
        $('#editUser').css('display', 'flex');
        $('.container-relatorios').css('display', 'none');
        $('.submenu-relatorios').slideUp(); // Fecha o submenu se estiver aberto
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
    
    // Ação ao clicar nos itens do submenu
    $("#movimentacao").on("click", function() {
        exibirRelatorio('movimentacao');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
    
    $("#carros").on("click", function() {
        exibirRelatorio('carros');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
    
    $("#motos").on("click", function() {
        exibirRelatorio('motos');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
    
    $("#clientes").on("click", function() {
        console.log("Clique em clientes detectado");
        exibirRelatorio('clientes');
        if ($(window).width() <= 980) {
            fecharBarraLateral();
        }
    });
});

// Função para tabela de listagem de usuários

$(document).ready(function() {
    // Alternar cores de fundo das linhas da tabela
    $(".user-table tbody tr:odd").css("background-color", "#ffffff");
    $(".user-table tbody tr:even").css("background-color", "#E3D3FD");
    
    // Aplicar cor cinza aos ícones de edição
    $(".fa-solid.fa-pen-to-square").css("color", "#7B7B7B");
});1




// Função para mostrar senha quando clicar no olho

$('#mostrarSenha').click(function() {
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
            alertMessage(response.success, 'success');
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
const selectAnoVeic = $('#select-ano-veic');

for (let ano = anoMin; ano <= anoMax; ano++) {
    const option = $(`<option value="${ano}">${ano}</option>`);
    selectAnoVeic.append(option);
}


//pdf carros
$('#pdf-carros').click(function(e) {
    e.preventDefault();

    // 1) Pegar valores do filtro
    const marca = $('#select-marca-carro').val();
    const anoMin = $('#ano-minimo-carro').val();
    const anoMax = $('#ano-maximo-carro').val();

    // 2) Montar URL
    let url = `${BASE_URL}/relatorio/carros?`;

    if (marca) {
        url += 'marca=' + encodeURIComponent(marca) + '&';
    }
    if (anoMin) {
        url += 'ano_minimo=' + encodeURIComponent(anoMin) + '&';
    }
    if (anoMax) {
        url += 'ano_maximo=' + encodeURIComponent(anoMax) + '&';
    }

    // 3) Abrir em nova aba (ou na mesma, se preferir)
    window.open(url, '_blank');
});


//pdf motos
$('#pdf-motos').click(function(e) {
    e.preventDefault();

    const marca = $('#select-marca-moto').val();
    const anoMin = $('#ano-minimo-moto').val();
    const anoMax = $('#ano-maximo-moto').val();

    let url = `${BASE_URL}/relatorio/motos?`;
    if (marca) {
        url += 'marca=' + encodeURIComponent(marca) + '&';
    }
    if (anoMin) {
        url += 'ano_minimo=' + encodeURIComponent(anoMin) + '&';
    }
    if (anoMax) {
        url += 'ano_maximo=' + encodeURIComponent(anoMax) + '&';
    }
    window.open(url, '_blank');
});


//pdf usuarios
$('#pdf-clientes').click(function(e) {
    e.preventDefault();

    const nome   = $('#nome-cliente').val();
    const cpf    = $('#cpf-cnpj-cliente').val();
    const status = $('#status-cliente').val();
    const dia    = $('#dia-cliente').val();
    const mes    = $('#mes-cliente').val();
    const ano    = $('#ano-cliente').val();

    let url = `${BASE_URL}/relatorio/usuarios?`; 

    if (nome) {
        url += 'nome=' + encodeURIComponent(nome) + '&';
    }
    if (cpf) {
        url += 'cpf=' + encodeURIComponent(cpf) + '&';
    }
    if (status) {
        url += 'status=' + encodeURIComponent(status) + '&';
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