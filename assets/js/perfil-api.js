// URL API

const BASE_URL = "http://192.168.1.12:5000";

// Função para preencher as informações nos inputs ao entrar na página

let isValidCPF_CNPJ = false;

$(document).ready(function() {
    let dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        localStorage.setItem('mensagem', JSON.stringify({
            error: 'Sessão não iniciada.'
        }))
        window.location.href = 'login.html';
    }

    if (dadosUser.data_nascimento) {
        var data = new Date(dadosUser.data_nascimento);
        let ano = data.getFullYear();
        let mes = data.getMonth()+1;
        let dia = data.getDate()+1;

        if (mes < 10) {
            mes = `0${mes}`;
        }

        // Correção para ajustar também dias menores que 10
        if (dia < 10) {
            dia = `0${dia}`;
        }

        let dataAjustada = `${ano}-${mes}-${dia}`;

        $("#data_nascimento_input").val(dataAjustada);
    }

    // Preencher os inputs do formulário
    $("#email_input").val(dadosUser.email);
    $("#nome_completo_input").val(dadosUser.nome_completo);
    $("#cpf_cnpj_input").val(dadosUser.cpf_cnpj);
    $("#telefone_input").val(dadosUser.telefone);

    // Preencher as informações do menu nav
    $("#nomeNav").text(dadosUser.nome_completo)
    $("#emailNav").text(dadosUser.email)

    // Disparar eventos de input para formatar os campos
    const cpfCnpjInput = document.getElementById("cpf_cnpj_input");
    if (cpfCnpjInput) {
        cpfCnpjInput.dispatchEvent(new Event('input'));
    }

    const telefoneInput = document.getElementById("telefone_input");
    if (telefoneInput) {
        telefoneInput.dispatchEvent(new Event('input'));
    }

    // Agora não validamos visualmente ao carregar a página
    if ($('#cpf_cnpj_input').val().trim() !== "") {
        const rawValue = $('#cpf_cnpj_input').val().replace(/\D/g, '');
        isValidCPF_CNPJ = validarDocumento(rawValue);
    }
});

// Função para deslogar da conta ao clicar em sair
$('#deslogarConta').click(function(e) {
    e.preventDefault()

    localStorage.clear();

    localStorage.setItem('mensagem', JSON.stringify({
        success: 'Usuário deslogado com sucesso!'
    }))

    window.location.href = 'login.html';
})

// Função para auxiliar na animação dos inputs já preenchidos ao abrir o site
$(document).ready(function() {
    $('.container-input').each(function() {
        const $input = $(this).find('input');
        const $label = $(this).find('label');

        $input.on('input', function() {
            $label.toggleClass('active', $(this).val().trim() !== '');
        }).trigger('input'); // Dispara inicialmente
    });
});

// Lógica para adicionar uma função nos inputs para quando forem preenchidos ficarem com a animação correta
$(document).find('.container-input').each((_, container) => {
    const input = $(container).find('input');
    const label = $(container).find('label');

    input.on('input', function() {
        if ($(this).val().trim() !== '') {
            label.addClass('active');
        } else {
            label.removeClass('active');
        }
    })
})

// Formatação do input de telefone
document.getElementById("telefone_input").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);

    let formatted = '';
    if (value.length > 0) {
        formatted = `(${value.substring(0,2)}) `;
        if (value.length > 2) {
            formatted += `${value.substring(2,7)}`;
            if (value.length > 7) {
                formatted += `-${value.substring(7,11)}`;
            }
        }
    }
    e.target.value = formatted;
});

// Handler unificado para o input de CPF/CNPJ - só aplicamos cores durante a edição
$("#cpf_cnpj_input").on("input", function(e) {
    const input = e.target;
    const rawValue = input.value.replace(/\D/g, '');

    // Formatação
    input.value = formatarDocumento(rawValue);

    // Validação e feedback visual
    if (rawValue.length === 0) {
        // Input vazio, usar cor padrão
        input.style.borderColor = '#AEAEBA';
    } 
    else if (rawValue.length >= 11) {
        // Temos dígitos suficientes para validar
        isValidCPF_CNPJ = validarDocumento(rawValue);
        
        if (isValidCPF_CNPJ) {
            input.style.borderColor = '#0bd979'; // Verde para válido
        } else {
            input.style.borderColor = '#ff0000'; // Vermelho para inválido
        }
    }
    // Se tiver menos de 11 dígitos, não alteramos a cor
});

// Adicionar evento blur que só retorna à cor neutra quando for válido
$("#cpf_cnpj_input").on("blur", function(e) {
    const input = e.target;
    const rawValue = input.value.replace(/\D/g, '');

    if (rawValue.length === 0) {
        // Input vazio
        input.style.borderColor = '#AEAEBA';
    } 
    else if (isValidCPF_CNPJ) {
        // Valor válido (verde), volta para cor neutra
        input.style.borderColor = '#AEAEBA';
    }
    // Se for inválido (vermelho), mantém a cor vermelha
});

// Função para mostrar senha quando clicar no olho
function mostrarSenha(olho, input) {
    if (input.attr('type') === 'password') {
        olho.removeClass('fa-eye').addClass('fa-eye-slash') // Trocando o ícone do olho
        input.attr('type', 'text') // Trocando o tipo de input
    } else {
        olho.removeClass('fa-eye-slash').addClass('fa-eye') // Trocando o ícone do olho
        input.attr('type', 'password') // Trocando o tipo de input
    }
}

// Adicionando a função ao ícone de olho no evento clique
$('#mostrarSenhaAtual').click(() => mostrarSenha($('#mostrarSenhaAtual'), $('#input-senha-atual') ));
$('#mostrarSenhaNova').click( () => mostrarSenha($('#mostrarSenhaNova'), $('#input-senha-nova') ));

// Função unificada de formatação
function formatarDocumento(value) {
    const numeros = value.replace(/\D/g, '');

    if (numeros.length > 11) { // CNPJ
        return numeros
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .substring(0, 18);
    }

    // CPF
    return numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .substring(0, 14);
}

// Função unificada de validação de CPF/CNPJ
function validarDocumento(value) {
    const numeros = value.replace(/\D/g, '');

    if (numeros.length === 11) {
        return validarCPF(numeros); // Utiliza função validar CPF
    } 
    if (numeros.length === 14) {
        return validarCNPJ(numeros); // Utiliza função validar CNPJ
    }
    return false;
}

// Validar CPF
function validarCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto.toString() !== cpf[9]) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto.toString() === cpf[10];
}

// Validar CNPJ
function validarCNPJ(cnpj) {
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    const pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2];
    const pesos2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];

    const calculaDigito = (slice, pesos) => {
        const soma = slice.reduce((acc, num, i) => acc + (num * pesos[i]), 0);
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const digitos = cnpj.split('').map(Number);
    const digito1 = calculaDigito(digitos.slice(0, 12), pesos1);
    const digito2 = calculaDigito(digitos.slice(0, 13), pesos2);

    return digito1 === digitos[12] && digito2 === digitos[13];
}

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

// Função para a barra lateral


// Abrir e fechar barra lateral
const sanduiche = $("#sanduicheHeader");
const barraLateral = $('#barra-lateral');
const overlayBg = $('#overlay-bg');
const closeBarraLateral = $('#fecharBarraLateral');

sanduiche.click(() => {
    barraLateral.css({
        'animation': 'abrirBarraLateral 0.5s',
        'display': 'flex'
    });
    overlayBg.css({
        'animation': 'aparecerOverlay 0.5s',
        'display': 'flex'
    });
});

function fecharBarraLateral() {
    barraLateral.css('animation', 'fecharBarraLateral 0.7s');
    overlayBg.css('animation', 'sumirOverlay 0.7s');

    setTimeout(() => {
        barraLateral.css('display', 'none');
        overlayBg.css('display', 'none');
    }, 660);
};


closeBarraLateral.click(() => {
    fecharBarraLateral()
});

// Lógica para envio do formulário de editar perfil
$("#formEditarUsuario").on("submit", function(e) {
    e.preventDefault();

    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
    const id = dadosUser.id_usuario;
    const tipoUser = dadosUser.tipo_usuario;

    let dados = new FormData(this);

    // Verificar se a senha nova foi fornecida sem a senha atual
    const senhaNova = dados.get('senha_nova');
    const senhaAtual = dados.get('senha_hash');

    // Verifica se a senha nova foi informada, mas a atual não
    if (senhaNova && !senhaAtual) {
        alertMessage('Para alterar a senha, informe a senha atual.', 'error');
        return;
    }

    // Verificar se o CPF/CNPJ é válido
    const cpfCnpj = dados.get('cpf_cnpj').replace(/\D/g, '');
    isValidCPF_CNPJ = validarDocumento(cpfCnpj);

    if (!isValidCPF_CNPJ) {
        alertMessage('CPF/CNPJ inválido.', 'error');
        return;
    }

    // Preparar objeto com os dados para atualização
    let editar = {
        id_usuario: id,
        email: dados.get('email'),
        nome_completo: dados.get('nome_completo'),
        data_nascimento: dados.get('data_nascimento'),
        cpf_cnpj: dados.get('cpf_cnpj').replace(/[./-]/g, ''), // Remove caracteres especiais
        telefone: dados.get('telefone').replace(/[\s()-]/g, ''), // Remove caracteres especiais
        tipo_usuario: tipoUser
    };
    
    // Apenas incluir as senhas no objeto se foram fornecidas
    if (senhaAtual) {
        editar.senha_hash = senhaAtual;
        
        if (senhaNova) {
            editar.senha_nova = senhaNova;
        }
    }

    const editarJSON = JSON.stringify(editar);

    // Rota para editar perfil
    $.ajax({
        method: "put",
        url: `${BASE_URL}/cadastro/${id}`, // URL da API na Web
        data: editarJSON,
        contentType: "application/json",
        success: function(response) {
            // Retirar as senhas do objeto editar para salvar no Local Storage depois
            delete editar.senha_nova;
            delete editar.senha_hash;

            // Limpar os inputs
            $("#input-senha-nova").val('');
            $("#input-senha-atual").val('');

            // Voltar as labels para o meio do input de novo
            $("#label-senha-nova").removeClass('active');
            $("#label-senha-atual").removeClass('active');
            
            // Ocultar os inputs de senha
            $("#mostrarSenhaNova").removeClass('fa-eye-slash').addClass('fa-eye')
            $("#input-senha-nova").attr('type', 'password')

            $("#mostrarSenhaAtual").removeClass('fa-eye-slash').addClass('fa-eye')
            $("#input-senha-atual").attr('type', 'password')

            // Atualizar os dados no localStorage após receber a resposta positiva
            localStorage.setItem('dadosUser', JSON.stringify(editar));

            // Preencher as informações do menu nav caso email e nome sejam alterados
            if (editar.email !== $("#emailNav").text()) {
                $("#emailNav").text(editar.email);
            }

            if (editar.nome_completo !== $("#nomeNav").text()) {
                $("#nomeNav").text(editar.nome_completo);
            }
            
            // Exibir mensagem de sucesso
            alertMessage(response.success, 'success');
        },
        error: function(response) {
            // Exibir mensagem de erro
            alertMessage(response.responseJSON.error, 'error');
        }
    });
});

// Rota para deletar perfil
$('#deletar-usuario').click(function() {
    Swal.fire({
        title: "Você tem certeza?",
        text: "Sua conta será deletada para sempre.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar" 
      }).then((result) => {
        if (result.isConfirmed) {
            const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
            const id = dadosUser.id_usuario;
        
            $.ajax({
                method: "delete",
                url: `${BASE_URL}/cadastro/${id}`, // URL da API na Web
                data: id,
                contentType: "application/json",
                success: function(response) {
                    localStorage.removeItem('dadosUser');
                    localStorage.setItem('mensagem', JSON.stringify({
                        success: 'Usuário deletado com sucesso!'
                    }))
                    window.location.href = 'login.html';
                },
                error: function(response) {
                    alertMessage(response.responseJSON.error, 'error');
                }
            })
        }
      });
 })
