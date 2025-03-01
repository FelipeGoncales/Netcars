let isValidCPF_CNPJ = false; 

// Função para preencher as informações nos inputs ao entrar na página

$(document).ready(function() {
    let dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        localStorage.setItem('mensagem', JSON.stringify({
            error: 'Sessão não iniciada.'
        }))

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

    // Disparar eventos de input para formatar os campos
    const cpfCnpjInput = document.getElementById("cpf_cnpj_input");
    if (cpfCnpjInput) {
        cpfCnpjInput.dispatchEvent(new Event('input'));
    }

    const telefoneInput = document.getElementById("telefone_input");
    if (telefoneInput) {
        telefoneInput.dispatchEvent(new Event('input'));
    }

    // Verifica CPF/CNPJ ao carregar a página
    if ($('#cpf_cnpj_input').val().trim() !== "") {
        validarCPF_CNPJ(cpfCnpjInput);
    }

    // Verifica CPF/CNPJ ao carregar a página
    if ($('#cpf_cnpj_input').val().trim() !== "") {
        validarCPF_CNPJ(cpfCnpjInput);
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


// Função para auxiliar na animação dos inputs já preenchidos ao abrir o site
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

// Handler unificado para o input
$("#cpf_cnpj_input").on("input", function(e) {
    const input = e.target;
    const rawValue = input.value.replace(/\D/g, '');
    
    // Formatação
    input.value = formatarDocumento(input.value);
    
    // Validação e feedback visual
    isValidCPF_CNPJ = validarDocumento(rawValue);
    
    if (rawValue.length >= 11 && !isValidCPF_CNPJ) {
        input.style.borderColor = '#ff0000';
    } else {
        input.style.borderColor = '#AEAEBA';
    }
});

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
    if ((resto === 10 || resto === 11) && cpf[9] !== '0') return false;
    if (resto.toString() !== cpf[9]) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    return (resto === 10 ? 0 : resto).toString() === cpf[10];
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

// Lógica para envio do formulário de editar perfil
$("#formEditarUsuario").on("submit", function(e) {
    e.preventDefault();

    if (!isValidCPF_CNPJ) {
        alertMessage('CPF/CNPJ inválido.', 'error');
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
        cpf_cnpj: dados.get('cpf_cnpj').replace(/[./-]/g, ''), // Função .replace para retirar caractéres "-", "." e "/"
        telefone: dados.get('telefone').replace(/[\s()-]/g, ''), // Função .replace para retirar caractéres "(", ")" e "-"
        senha_hash: dados.get('senha_hash'),
        senha_nova: dados.get('senha_nova')
    };
    
    editar = JSON.stringify(editar);

    // Rota para editar perfil
    $.ajax({
        method: "put",
        url: `https://netcars-api-render.onrender.com/user/${id}`, // URL da API na Web
        data: editar,
        contentType: "application/json",
        success: function(response) {
            localStorage.setItem('dadosUser', editar);

            // "desjsonizando" a variável editar para conseguir acessar os valores
            editar = JSON.parse(editar);

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
    })
})