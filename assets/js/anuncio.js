// Função para pegar a informação dos inputs e colocar no espelho logo ao carregar o site

// Antes disso deve vir a função de inserir a informações da API para os inputs

$('input').each(function () {
    const id = $(this).attr('id');
    const spanMirror = $(`#mirror-${id}`)

    $(this).css('display', 'none');
    spanMirror.text($(this).val()).css('display', 'flex');
}
)

// Funções para editar

// Função de exibir alerta para evitar repetir código
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

// Variável para saber se a edição está ativa ou não
let editarOn = false;

// Lógica do botão da caneta de editar
$('#editarAnuncio').click(function () {
    if (editarOn === false) {
        editarOn = true;

        $('input').each(function () {
            const id = $(this).attr('id');
            const spanMirror = $(`#mirror-${id}`)

            $(this).css('display', 'flex').attr('disabled', false);
            spanMirror.css('display', 'none');
        })
    } else {
        editarOn = false;

        alertMessage('Alterações salvas com sucesso!', 'success');


        // Lógica para salvar no banco

        carregarInputs();
    }
});

// Lógica do botão salvar alterações
$('#salvar-alteracoes').click(function () {
    if (editarOn === true) {
        editarOn = false;

        alertMessage('Alterações salvas com sucesso!', 'success');


        // Lógica para salvar no banco

        carregarInputs();
    }
});

// Função para passar o valor dos inputs para o parágrafo espelho (mirror)

function carregarInputs() {
    $('input').each(function () {
        const id = $(this).attr('id');
        const spanMirror = $(`#mirror-${id}`)

        $(this).css('display', 'none');
        spanMirror.text($(this).val()).css('display', 'flex');
    })
}

// Função caso usuário não esteja logado e clique no botão reservar

$('#reservar-btn').click(function() {
    const dadosUser = localStorage.getItem('dadosUser');

    if (!dadosUser) {
        window.location.href = "login.html";
    }
})