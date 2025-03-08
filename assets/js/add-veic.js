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

// FASE 1

// Função para validar a placa
function validarPlaca() {
    const placa = $('#placa').val(); // Pega o valor da placa
    const regex = /^[A-Za-z]{3}[0-9]{1}[A-Za-z]{1}[0-9]{2}$/; // Expressão regular para validar o formato

    if (!regex.test(placa)) {
        alertMessage("Formato de placa inválido! A placa deve seguir o padrão ABC1D23.", 'error');
        return false; // Retorna falso se não passar na validação
    }

    return true; // Retorna verdadeiro se for válido
}

// Chama a função ao sair do campo de texto (evento blur)
$('#placa').blur(function() {
    validarPlaca();
});


// FASE 2

// Função para mudar o tipo selecionado
function mudarTipo(tipo1, tipo2) {
    if (tipo2.hasClass('active')) {
        tipo1.addClass('active');
        tipo2.removeClass('active');
    }
}

// Adicionando a função de mudar o selecionado ao clicar
$('#tipo-carro').click(() => mudarTipo($('#tipo-carro'), $('#tipo-moto')));
$('#tipo-moto').click(() => mudarTipo($('#tipo-moto'), $('#tipo-carro')));

// FASE 3

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

// FUNÇÃO QUE VALIDA O ANO DOS CARROS
function validarCampo(input) {
    const min = 1950; // A partir de 1950
    const max = new Date().getFullYear();

    // Se o campo estiver vazio, não faz a validação
    if (!input.value) return;

    const valor = +input.value; // Converte o valor para número

    // Se o valor estiver fora do intervalo permitido
    if (valor < min || valor > max) {
        // Exibe o alerta apenas uma vez
        if (!input.alertado) {
            input.alertado = true;
            alertMessage(`Insira um ano válido.`, 'error')
            input.focus();
        }
    }
}

// Seleciona os inputs de ano de modelo e de fabricação e adiciona os eventos para validação
document.querySelectorAll("#ano-modelo, #ano-fabricacao").forEach(input => {
    input.addEventListener("blur", () => validarCampo(input));
    input.addEventListener("input", () => input.alertado = false);
});


// FASE 4

// FUNÇÃO API DO IBGE
// Utiliza jQuery para popular selects de estados e cidades usando a API do IBGE
$(document).ready(function () {
    const estadoSelect = $("#estado");   // Seleciona o elemento select de estados
    const cidadeSelect = $("#cidade");     // Seleciona o elemento select de cidades

    // Função para carregar os estados do IBGE
    function carregarEstados() {
        $.getJSON("https://servicodados.ibge.gov.br/api/v1/localidades/estados", function (estados) {
            // Ordena os estados por nome
            estados.sort((a, b) => a.nome.localeCompare(b.nome));

            // Para cada estado, adiciona uma opção no select
            $.each(estados, function (index, estado) {
                estadoSelect.append(`<option value="${estado.id}">${estado.nome}</option>`);
            });
        }).fail(function () {
            console.error("Erro ao carregar estados.");
        });
    }

    // Função para carregar as cidades com base no estado selecionado
    function carregarCidades(estadoId) {
        $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`, function (cidades) {
            cidadeSelect.empty(); // Limpa as opções anteriores do select de cidades

            // Adiciona cada cidade como opção
            $.each(cidades, function (index, cidade) {
                cidadeSelect.append(`<option value="${cidade.id}">${cidade.nome}</option>`);
            });

            // Habilita o select de cidades e ativa o label (para animações ou estilos visuais)
            cidadeSelect.prop("disabled", false);
            cidadeSelect.prev("label").addClass("active");
        }).fail(function () {
            console.error("Erro ao carregar cidades.");
        });
    }

    // Quando o select de estados mudar de valor, carrega as cidades correspondentes
    estadoSelect.on("change", function () {
        const estadoId = $(this).val();

        // Reinicia o select de cidades e desabilita-o temporariamente
        cidadeSelect.empty().prop("disabled", true);
        // Remove a classe ativa do label de cidade caso o usuário mude de estado
        cidadeSelect.prev("label").removeClass("active");

        if (estadoId) {
            carregarCidades(estadoId);
        }
    });

    // Carrega os estados assim que a página é carregada
    carregarEstados();
});


// FASE 5

// JS PARA EXIBIR A IMAGEM DO VEÍCULO
// Ao selecionar um arquivo, utiliza FileReader para exibir uma prévia da imagem
document.getElementById("upload-imagem").addEventListener("change", function (event) {
    const files = event.target.files;
    const previewContainer = document.getElementById("preview-container");

    Array.from(files).forEach(file => {
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const imgContainer = document.createElement("div");
                imgContainer.classList.add("preview-item");
                imgContainer.style.backgroundImage = `url(${e.target.result})`;

                // Botão para remover a imagem
                const removeBtn = document.createElement("i");
                removeBtn.classList.add("fa-solid");
                removeBtn.classList.add('fa-xmark');
                removeBtn.classList.add('remove-btn');
                removeBtn.onclick = () => imgContainer.remove();

                imgContainer.appendChild(removeBtn);
                previewContainer.appendChild(imgContainer);
            };

            reader.readAsDataURL(file);
        }
    });
});


// Função para continuar
$('#btn-continuar').click(function () {
    let divCerta = -1;

    let fases = [
        $('#fase-1'),
        $('#fase-2'),
        $('#fase-3'),
        $('#fase-4'),
        $('#fase-5'),
    ]

    for (i = 0; i < fases.length; i++) {
        if (fases[i].is(':visible')) {
            divCerta = i + 1;
            fases[i].hide();
            break;
        }
    }
    
    if (divCerta < fases.length) {
        fases[divCerta].css('display', 'flex');

        setTimeout(() => {
            if (fases[4].is(':visible')) {
                $('#btn-continuar').attr('type', 'submit');
            }
        }, 100);
    } else {
        fases[divCerta - 1].css('display', 'flex');
    }
})

// Funções para voltar
$('#btn-voltar').click(function () {
    let divCerta = -1;

    let fases = [
        $('#fase-1'),
        $('#fase-2'),
        $('#fase-3'),
        $('#fase-4'),
        $('#fase-5'),
    ]

    for (i = 0; i < fases.length; i++) {
        if (fases[i].is(':visible')) {
            divCerta = i - 1;
            fases[i].hide();
            break;
        }
    }
    
    if (divCerta >= 0) {
        fases[divCerta].css('display', 'flex');

        setTimeout(() => {
            if ($('#btn-continuar').attr('type') === 'submit') {
                $('#btn-continuar').attr('type', 'button');
            }
        }, 100);
    } else {
        fases[divCerta + 1].css('display', 'flex');
    }
})