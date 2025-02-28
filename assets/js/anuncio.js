// Mudar perfil quando usuário estiver logado

$(document).ready(function() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (dadosUser) {
        const tipoUser = dadosUser.tipo_usuario;

        if (tipoUser === 2 || tipoUser === 1) {
           $('#div-button-vendedor').css('display', 'flex');
           $('#div-button-cliente').css('display', 'none');

           $('#editarAnuncio').css('display', 'flex');
        } else {
           $('#div-button-vendedor').css('display', 'none');
           $('#div-button-cliente').css('display', 'flex');

           $('#editarAnuncio').css('display', 'none');
        }
    } else { 
        $('#div-button-vendedor').css('display', 'none');
        $('#div-button-cliente').css('display', 'flex');

        $('#editarAnuncio').css('display', 'none');
    }
})

$('input').each(function() { 
        const id = $(this).attr('id');
        const spanMirror = $(`#mirror-${id}`)

        $(this).css('display', 'none');
        spanMirror.text($(this).val()).css('display', 'flex');
    }
)

// Funções para editar
let editarOn = false;

$('#editarAnuncio').click(function() {
    if (editarOn === false) {
        editarOn = true;

        $('input').each(function() { 
            const id = $(this).attr('id');
            const spanMirror = $(`#mirror-${id}`)
    
            $(this).css('display', 'flex').attr('disabled', false);
            spanMirror.css('display', 'none');
        })
    } else {
        editarOn = false;

        
        // Lógica para salvar no banco


        $('input').each(function() { 
            const id = $(this).attr('id');
            const spanMirror = $(`#mirror-${id}`)
    
            $(this).css('display', 'none');
            spanMirror.text($(this).val()).css('display', 'flex');
        })
    }
});

$('#salvar-alteracoes').click(function() {
    if (editarOn === true) {
        editarOn = false;

        
        // Lógica para salvar no banco


        $('input').each(function() { 
            const id = $(this).attr('id');
            const spanMirror = $(`#mirror-${id}`)
    
            $(this).css('display', 'none');
            spanMirror.text($(this).val()).css('display', 'flex');
        })
    }
});