let isValidCPF_CNPJ = false; 

// Fazer o nav funcionar
$(document).ready(function() {
    $('#conteudo').load('com-Cliente/minha-conta.html');

    $("#link_minhaConta").on("click", function() {
        $('#conteudo').load('com-Cliente/minha-conta.html');
    })
    $("#link_reservas").on("click", function() {
        $('#conteudo').load('com-Cliente/reservas.html');
    })
    $("#link_hCompras").on("click", function() {
        $('#conteudo').load('com-Cliente/historico-compras.html');
    })
});

// Função para preencher as informações nos inputs ao entrar na página

$(document).ready(function() {
    let dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = 'login.html';
    }

    var data = new Date(dadosUser.data_nascimento);
    let ano = data.getFullYear();
    let mes = data.getMonth()+1;
    let dia = data.getDate()+1;

    if (mes < 10) {
        mes = `0${mes}`;
    }

    let dataAjustada = `${ano}-${mes}-${dia}`;

    // Preencher os inputs do formulário
    $("#email_input").val(dadosUser.email);
    $("#nome_completo_input").val(dadosUser.nome_completo);
    $("#data_nascimento_input").val(dataAjustada);
    $("#cpf_cnpj_input").val(dadosUser.cpf_cnpj);
    $("#telefone_input").val(dadosUser.telefone);

    // Preencher as informações do menu nav
    $("#nomeNav").text(dadosUser.nome_completo)
    $("#emailNav").text(dadosUser.email)

    // Verifica CPF/CNPJ ao carregar a página
    if ($('#cpf_cnpj_input').val().trim() !== "") {
        validarCPF_CNPJ(cpfCnpjInput);
    }
});

// Função para deslogar da conta ao clicar em sair
$('#deslogarConta').click(function(e) {
    e.preventDefault()

    localStorage.clear();
    window.location.href = 'login.html';
})

function validarCPF_CNPJ(input) {
    let value = input.value.replace(/\D/g, '');
    isValidCPF_CNPJ = value.length === 11 ? validarCPF(value) : 
                      value.length === 14 ? validarCNPJ(value) : false;

    if (value.length >= 11 && !isValidCPF_CNPJ) {
        input.style.borderColor = '#ff0000';
    } else {
        input.style.borderColor = '#AEAEBA';
    }
}

// Modifique o evento 'input' para chamar diretamente validarCPF_CNPJ()
document.getElementById("cpf_cnpj_input").addEventListener("input", function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = value;

    if (value.length > 11) {
        formatted = formatted.replace(/(\d{2})(\d)/, '$1.$2')
                             .replace(/(\d{3})(\d)/, '$1.$2')
                             .replace(/(\d{3})(\d)/, '$1/$2')
                             .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        formatted = formatted.replace(/(\d{3})(\d)/, '$1.$2')
                             .replace(/(\d{3})(\d)/, '$1.$2')
                             .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    e.target.value = formatted;
    validarCPF_CNPJ(e.target);
});


// Função para auxiliar na animação dos inputs quando preenchidos

$(document).ready(function() {
    $('.container-input').each(function() {
    const $input = $(this).find('input');
    const $label = $(this).find('label');

    if ($input.val().trim() !== "") {
        $label.addClass('active');
    } else {
        $label.removeClass('active');
    }
});
});

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
        if (value.length <= 2) {
            formatted = value;
        } else {
            formatted = `(${value.substring(0,2)}) `;
            value = value.substring(2);
            if (value.length > 5) {
                formatted += `${value.substring(0,5)}-${value.substring(5,9)}`;
            } else {
                formatted += value;
            }
        }
    }
    e.target.value = formatted;
});

// Função para validar CPF e CNPJ
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    const pesos = [5,4,3,2,9,8,7,6,5,4,3,2];
    let soma = pesos.reduce((acc, peso, i) => acc + (parseInt(cnpj.charAt(i)) * peso), 0);
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== parseInt(cnpj.charAt(12))) return false;

    pesos.unshift(6);
    soma = pesos.reduce((acc, peso, i) => acc + (parseInt(cnpj.charAt(i)) * peso), 0);
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    return digito2 === parseInt(cnpj.charAt(13));
}

// Formatação e validação do CPF/CNPJ
document.getElementById("cpf_cnpj_input").addEventListener("input", function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let originalLength = value.length;
    let isCNPJ = value.length > 11;

    // Formatação
    let formatted = value;
    if (isCNPJ) {
        formatted = value.substring(0, 14);
        formatted = formatted
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        formatted = value.substring(0, 11);
        formatted = formatted
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    e.target.value = formatted;

    // Validação
    const rawValue = formatted.replace(/\D/g, '');
    isValidCPF_CNPJ = rawValue.length === 11 ? validarCPF(formatted) : 
                      rawValue.length === 14 ? validarCNPJ(formatted) : false;

    // Feedback visual
    if (rawValue.length >= 11 && !isValidCPF_CNPJ) {
        e.target.style.borderColor = '#ff0000';
    } else if (isValidCPF_CNPJ) {
        return;
    } else {
        e.target.style.borderColor = '#AEAEBA';
    }
});

$("#formEditarUsuario").on("submit", function(e) {
    e.preventDefault();

    if (!isValidCPF_CNPJ) {
        $('#divAlertMessage').css('display', 'flex')

        $('<p>')
        .addClass('alertMessage')
        .text('CPF/CNPJ inválido.')
        .css({
            'background-color': '#f71445'
        })
        .appendTo('#divAlertMessage')
        .hide()
        .fadeIn(400)
        .delay(3500)
        .fadeOut(400);
        return;
    }

    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
    const id = dadosUser.id_usuario;

    let dados = new FormData(this);

    let editar = {
        id_usuario: id,
        email: dados.get('email'),
        nome_completo: dados.get('nome_completo'),
        data_nascimento: dados.get('data_nascimento'),
        cpf_cnpj: dados.get('cpf_cnpj').replace(/[./-]/g, ''),
        telefone: dados.get('telefone').replace(/[\s()-]/g, ''),
        senha_hash: dados.get('senha_hash'),
        senha_nova: dados.get('senha_nova')
    };
    
    editar = JSON.stringify(editar);

    $.ajax({
        method: "put",
        url: `http://192.168.1.4:5000/user/${id}`,
        data: editar,
        contentType: "application/json",
        success: function(response) {
            localStorage.setItem('dadosUser', editar);
            
            $('#divAlertMessage').css('display', 'flex')

            $('<p>')
            .addClass('alertMessage')
            .text(response.success)
            .css({
                'background-color': '#0bd979'
            })
            .appendTo('#divAlertMessage')
            .hide()
            .fadeIn(400)
            .delay(3500)
            .fadeOut(400);
        },
        error: function(response) {
            $('#divAlertMessage').css('display', 'flex')

            $('<p>')
            .addClass('alertMessage')
            .text(response.responseJSON.error)
            .css({
                'background-color': '#f71445'
            })
            .appendTo('#divAlertMessage')
            .hide()
            .fadeIn(400)
            .delay(3500)
            .fadeOut(400);
        }
    })
})


   