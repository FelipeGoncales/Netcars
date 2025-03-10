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
$('#placa').blur(function () {
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
    const estadoCarroSelect = $("#estado-carro");  
    const cidadeCarroSelect = $("#cidade-carro"); 

    const estadoMotoSelect = $("#estado-moto");  
    const cidadeMotoSelect = $("#cidade-moto"); 

    // Função para carregar os estados do IBGE
    function carregarEstados(select) {
        $.getJSON("https://servicodados.ibge.gov.br/api/v1/localidades/estados", function (estados) {
            // Ordena os estados por nome
            estados.sort((a, b) => a.nome.localeCompare(b.nome));

            // Para cada estado, adiciona uma opção no select
            $.each(estados, function (index, estado) {
                select.append(`<option value="${estado.id}">${estado.nome}</option>`);
            });
        });
    }

    // Função para carregar as cidades com base no estado selecionado
    function carregarCidades(estadoId, select) {
        $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`, function (cidades) {
            select.empty(); // Limpa as opções anteriores do select de cidades

            // Adiciona cada cidade como opção
            $.each(cidades, function (index, cidade) {
                select.append(`<option value="${cidade.id}">${cidade.nome}</option>`);
            });

            // Habilita o select de cidades e ativa o label (para animações ou estilos visuais)
            select.prop("disabled", false);
            select.prev("label").addClass("active");
        });
    }

    // Quando o select de estados mudar de valor, carrega as cidades correspondentes
    function addCidades(selectCid, selectEst) {
        const estadoId = $(selectEst).val();

        // Reinicia o select de cidades e desabilita-o temporariamente
        selectCid.empty().prop("disabled", true);
        // Remove a classe ativa do label de cidade caso o usuário mude de estado
        selectCid.prev("label").removeClass("active");

        if (estadoId) {
            carregarCidades(estadoId, selectCid);
        }
    };


    estadoCarroSelect.on("change", () => {
        addCidades(cidadeCarroSelect, estadoCarroSelect)
    }); 
    
    estadoMotoSelect.on("change", () => {
        addCidades(cidadeMotoSelect, estadoMotoSelect)
    });

    // Carrega os estados assim que a página é carregada
    carregarEstados(estadoCarroSelect);
    carregarEstados(estadoMotoSelect);
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

let fasesCarro = [
    $('#fase-1'),
    $('#fase-2'),
    $('#fase-3-carro'),
    $('#fase-4-carro'),
    $('#fase-5'),
]

let fasesMoto = [
    $('#fase-1'),
    $('#fase-2'),
    $('#fase-3-moto'),
    $('#fase-4-moto'),
    $('#fase-5-moto'),
    $('#fase-5')
]

// Função para continuar
$('#btn-continuar').click(function () {
    let divCerta = -1;

    function continuarBtn(listaFases) {
        for (i = 0; i < listaFases.length; i++) {
            if (listaFases[i].is(':visible')) {
                divCerta = i + 1;
                listaFases[i].hide();
                break;
            }
        }

        if (divCerta < listaFases.length) {
            listaFases[divCerta].css('display', 'flex');

            setTimeout(() => {
                if (listaFases[listaFases.length - 1].is(':visible')) {
                    $('#btn-continuar').attr('type', 'submit');
                }
            }, 100);
        } else {
            listaFases[divCerta - 1].css('display', 'flex');
        }
    }

    if ($('#tipo-carro').hasClass('active')) {
        continuarBtn(fasesCarro);
    }

    if ($('#tipo-moto').hasClass('active')) {
        continuarBtn(fasesMoto);
    }
});

// Funções para voltar
$('#btn-voltar').click(function () {
    let divCerta = -1;

    function voltarBtn(listaFases) {
        for (i = 0; i < listaFases.length; i++) {
            if (listaFases[i].is(':visible')) {
                divCerta = i - 1;
                listaFases[i].hide();
                break;
            }
        }

        if (divCerta >= 0) {
            listaFases[divCerta].css('display', 'flex');

            setTimeout(() => {
                if ($('#btn-continuar').attr('type') === 'submit') {
                    $('#btn-continuar').attr('type', 'button');
                }
            }, 100);
        } else {
            listaFases[divCerta + 1].css('display', 'flex');
        }
    }

    if ($('#tipo-carro').hasClass('active')) {
        voltarBtn(fasesCarro);
    }

    if ($('#tipo-moto').hasClass('active')) {
        voltarBtn(fasesMoto);
    }
});

// Enviar dados (Rota POST Carro)

$('#form-add-veic').on('submit', function(e){
    e.preventDefault();

    let data = new FormData(this);

    if ($('#tipo-carro').hasClass('active')) {

        let envia = {
            placa: data.get('placa'),
            marca: data.get('marca-carro'),
            modelo: data.get('modelo-carro'),
            ano_modelo: data.get('ano-modelo-carro'),
            ano_fabricacao: data.get('ano-fabricacao-carro'),
            versao: data.get('versao-carro'),
            cor: data.get('cor-carro'),
            renavam: data.get('renavam-carro'),
            cambio: data.get('cambio-carro'),
            combustivel: data.get('combustivel-carro'),
            categoria: data.get('categoria-carro'),
            quilometragem: data.get('quilometragem-carro'),
            estado: data.get('estado-carro'),
            cidade: data.get('cidade-carro'),
            preco_compra: data.get('preco_c-carro'),
            preco_venda: data.get('preco_v-carro'),
            licenciado: data.get('licenciado-carro')
        }

        for (const key in envia) {
            if (!envia[key]) {
                alertMessage(`Informações faltando: ${key}.`, 'error');
                return;
            }
        }        

        envia = JSON.stringify(envia);

        $.ajax({
            method: "post",
            url: "http://192.168.1.120:5000/carro", // URL da API na Web
            data: envia,
            contentType: "application/json",
            success: function (response) {
                console.log(response);
                // Lógica para não permitir que um tipo de usuário acesse o perfil de outros
    
                // Redirecionar para a página de perfil após cadastrar
                const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
                const tipoUser = dadosUser.tipo_usuario;
    
                if (tipoUser === 1) {
                    window.location.href = 'administrador-perfil.html';
                }
                if (tipoUser === 2) {
                    window.location.href = 'vendedor-perfil.html';
                }
    
                // Definir mensagem para ser exibida no perfil
                localStorage.setItem('msgCadVeic', 'Veículo cadastrado com sucesso!');
            },
            error: function (response) {
                alertMessage(response.responseJSON.error, 'error');
                console.log(response);
            }
        })
    }


    if ($('#tipo-moto').hasClass(active)) {
        // Mesma lógica porém para adicionar moto
    }
}) 