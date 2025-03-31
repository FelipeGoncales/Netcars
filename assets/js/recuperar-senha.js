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

        // Limpar o local storage para evitar que a mensagem de novo ao recarregar a página
        localStorage.clear();
}

// Função para manipular a inserção do código de 6 dígito

$("#div-codigo").find('input').on('input', function () {
    // Obtendo objeto
    let $input = $(this)

    // Lógica para permitir apenas números
    const numeros = ['0','1','2','3','4','5','6','7','8','9'];

    if (!numeros.includes($input.val())) {
        $input.val('');
        return;
    }  

    // Lógica para ir para o próximo input após preenchido
    let index = $("#div-codigo").find('input').index(this);
    let $proxInput = $("#div-codigo").find('input').eq(index + 1);

    if ($input.val() !== '' && $proxInput.length) {
        $proxInput.focus();
    }
});

// Evento para detectar Backspace e voltar ao input anterior
$("#div-codigo").find('input').on('keydown', function (e) {
    let $input = $(this);
    let index = $("#div-codigo").find('input').index(this);

    // Se a tecla Backspace for pressionada e o campo estiver vazio
    if (e.key === "Backspace" && $input.val() === '' && index > 0) {
        let $antInput = $("#div-codigo").find('input').eq(index - 1);
        $antInput.focus();  
    }
});

var ENVIAR_NOVAMENTE = false;

// Função para acionar esqueci a senha
$('#forgot-password').click( function() {
    // Retorna caso já tenha clicado
    if ($(this).prop('disabled')) return;

    // Define disabled para true para o usuário não clicar novamente
    $(this).prop('disabled', true)

    const email = $('#input-email').val();
    
    if (!email) {
        // Habilita novamente caso o email não tenha sido informado
        $(this).prop('disabled', false)
        alertMessage("Insira seu email.", 'error');
        return;
    }

    const data = { email: email }

    // Rota Gerar Código
    $.ajax({
        url: `${BASE_URL}/gerar_codigo`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: async function () {
            $('#div-form-login').css('display', 'none');
            $('#formVerificarCodigo').css('display', 'flex');

            $('#email-user').text(email);

            // Função para fazer a contagem regressiva para enviar novamente o código via email para o usuário
            $('#enviar-novamente').prop('disabled', true); // Desabilita inicialmente
            let tempo = 30;
            const intervalo = setInterval(() => {
                $("#tempoEspera").text(tempo);
                if (tempo === 0) {
                    clearInterval(intervalo);
                    ENVIAR_NOVAMENTE = true;
                    $('#enviar-novamente').prop('disabled', false); // Reabilita o botão
                }
                tempo--;
            }, 1000);

            // Rota reenviar o código
            $('#enviar-novamente').click( function () {
                // Retorna caso o botão esteja desabilitado
                if ($(this).prop('disabled')) return;
                
                $(this).prop('disabled', true);
                
                if (!ENVIAR_NOVAMENTE) {
                    alertMessage("Espere mais alguns segundos para enviar o código novamente.", 'error');
                    return;
                }
                
                $.ajax({
                    url: `${BASE_URL}/gerar_codigo`,
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function () {
                        // Função para fazer a contagem regressiva para enviar novamente o código via email para o usuário
                        $('#enviar-novamente').prop('disabled', true); // Desabilita inicialmente

                        alertMessage('Código reenviado por email!', "success");

                        ENVIAR_NOVAMENTE = false;
            
                        let tempo = 30;
                        const intervalo = setInterval(() => {
                            $("#tempoEspera").text(tempo);
                            if (tempo === 0) {
                                clearInterval(intervalo);
                                ENVIAR_NOVAMENTE = true;
                                $('#enviar-novamente').prop('disabled', false); // Reabilita o botão
                            }
                            tempo--;
                        }, 1000);
                    },
                    error: function(response) {
                        // Reabilita o botão para poder clicar novamente
                        $('#enviar-novamente').prop('disabled', false); // Reabilita o botão

                        alertMessage(response.responseJSON.error, 'error');
                    }
                })
            })
        },
        error: function(response) {
            // Reabilita o botão para poder clicar novamente
            $(this).prop('disabled', false);

            alertMessage(response.responseJSON.error, 'error');
        }
    })
})

// Form Verificar Código Submit

$('#formVerificarCodigo').on('submit', function (e) {
    e.preventDefault();

    let codigoUser = '';

    $("#div-codigo").find('input').each(function() {
        if (!$(this).val()) {
            return alertMessage("É necessário preencher os 6 dígitos do código.", 'error');
        }

        codigoUser += $(this).val();
    });

    const email = $('#input-email').val();

    const data = {
        email: email,
        codigo: codigoUser
    }

    $.ajax({
        url: `${BASE_URL}/validar_codigo`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
            $('#formVerificarCodigo').css('display', 'none');
            $('#formAltSenha').css('display', 'flex');
        },
        error: function(response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
})

// Redefinir senha
$('#formAltSenha').on('submit', function(e) {
    e.preventDefault();

    const data = new FormData(this);

    const email = $('#input-email').val();

    let enviar = {
        'senha_nova': data.get('senha-nova'),
        'repetir_senha_nova': data.get('repetir-senha-nova'),
        'email': email
    }

    let enviarJSON = JSON.stringify(enviar);

    $.ajax({
        method: "POST",
        url: `${BASE_URL}/redefinir_senha`,
        contentType: 'application/json',
        data: enviarJSON,
        success: function (response) {
            localStorage.setItem('mensagem', JSON.stringify({
                "success": response.success
            }));
            
            window.location.reload();
        },
        error: function (response) {  
            alertMessage(response.responseJSON.error, 'error');
        }
    })
})