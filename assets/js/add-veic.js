// Lógica para não permitir que um usuário cliente cadastre

$(document).ready(function() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'))

    if (!dadosUser) {
        localStorage.setItem('mensagem', JSON.stringify({
            "error": "Sessão não iniciada."
        }))
        window.location.href = 'login.html';
    }
    
    const token = dadosUser.token;

    if (!token) {
        localStorage.removeItem('dadosUser');
        localStorage.setItem('mensagem', JSON.stringify({
            "error": "Sessão não iniciada."
        }))
        window.location.href = 'login.html';
    }

    $.ajax({
        url: `${BASE_URL}/obter_tipo_usuario`,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(response) {
            const tipoUser = response.tipo_usuario;

            if (tipoUser === 3) {
                localStorage.removeItem('dadosUser');
                localStorage.setItem('mensagem', JSON.stringify({
                    "error": "Tentativa de violação identificada."
                }))
                window.location.href = 'login.html';
            }
        },
        error: function(response) {
            localStorage.removeItem('dadosUser');
            localStorage.setItem('mensagem', JSON.stringify({
                "error": response.responseJSON.error
            }))
            window.location.href = "login.html";
        }
    })
})

// ???? (QM ADICIONOU ESSA PORRA AQUI)
const renavamValidity = {
    'renavam-carro': false,
    'renavam-moto': false
};

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
    const regexMercosul = /^[A-Za-z]{3}[0-9]{1}[A-Za-z]{1}[0-9]{2}$/; // Formato ABC1D23
    const regexAntigo = /^[A-Za-z]{3}[0-9]{4}$/; // Formato ABC1234

    if (!regexMercosul.test(placa) && !regexAntigo.test(placa)) {
        alertMessage("Formato de placa inválido! A placa deve seguir o padrão ABC1234 ou ABC1D23.", 'error');
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


// Rota para adicionar as options do select ano veículo

const anoMin = 1950;
const anoMax = new Date().getFullYear();
const anoModeloCarro = $('#ano-modelo-carro');
const anoFabricacaoCarro = $('#ano-fabricacao-carro');
const anoModeloMoto = $('#ano-modelo-moto');
const anoFabricacaoMoto = $('#ano-fabricacao-moto');

function addAnoInput(input) {
    for (let ano = anoMax; ano >= anoMin; ano--) {
        const option = $(`<option value="${ano}">${ano}</option>`);
        input.append(option);
    }
}
// Adicionado options aos inputs
addAnoInput(anoModeloCarro);
addAnoInput(anoFabricacaoCarro);
addAnoInput(anoModeloMoto);
addAnoInput(anoFabricacaoMoto);

// Função para validar o RENAVAM (tanto de carros quanto de motos)
function validarRENAVAM(seletor) {
    let renavam = $(seletor).val().replace(/\D/g, '');

    // Verificação do tamanho
    if (renavam.length === 10) {
        $(seletor).val(renavam);
    } else if (renavam.length !== 11) {
        alertMessage("O RENAVAM deve contem 11 dígitos.", 'error');
        return false;
    }

    const digitoVerificador = parseInt(renavam.charAt(10));
    const base = renavam.substring(0, 10);

    let soma = 0;
    let peso = 2;

    for (let i = base.length - 1; i >= 0; i--) {
        const digito = parseInt(base.charAt(i));
        soma += digito * peso;

        peso++;
        if (peso > 9) {
            peso = 2;
        }
    }

    const resto = soma % 11;

    let digitoEsperado = 11 - resto;

    if (digitoEsperado === 10 || digitoEsperado === 11) {
        digitoEsperado = 0;
    }

    if (digitoVerificador !== digitoEsperado) {
        return false;
    }
    return true;
}

// Handler para input - feedback visual durante digitação
$('#renavam-carro, #renavam-moto').on('input', function () {
    const input = this;
    const inputId = input.id;
    const rawValue = input.value.replace(/\D/g, '');

    // Limitar o tamanho a 11 dígitos
    if (rawValue.length > 11) {
        input.value = rawValue.substring(0, 11);
        return;
    }

    // Verificação visual
    if (rawValue.length === 0) {
        // Input vazio, usar cor padrão
        input.style.borderColor = '#AEAEBA';
    }
    else if (rawValue.length >= 10) {
        // Temos dígitos suficientes para validar
        renavamValidity[inputId] = validarRENAVAM('#' + inputId);

        if (renavamValidity[inputId]) {
            input.style.borderColor = '#0bd979'; // Verde para válido
        } else {
            input.style.borderColor = '#ff0000'; // Vermelho para inválido
        }
    }
});

// Handler para blur - validação completa e mensagem de erro
$('#renavam-carro, #renavam-moto').on('blur', function () {
    const input = this;
    const inputId = input.id;
    let renavam = input.value.replace(/\D/g, '');

    if (renavam.length === 0) {
        // Input vazio
        input.style.borderColor = '#AEAEBA';
        return;
    }

    if (renavam.length === 10) {
        renavam = '0' + renavam;
        $(this).val(renavam);
    } else if (renavam.length !== 11) {
        alertMessage("RENAVAM inválido.", 'error');
        input.style.borderColor = '#ff0000';
        return;
    }

    renavamValidity[inputId] = validarRENAVAM('#' + inputId);

    if (renavamValidity[inputId]) {
        // Válido, volta para cor neutra
        input.style.borderColor = '#AEAEBA';
    } else {
        // Inválido, mantém vermelho e exibe mensagem
        input.style.borderColor = '#ff0000';
        alertMessage("RENAVAM inválido! Verifique os números digitados.", 'error');
    }
});

// Limitar o tamanho do RENAVAM a 11 dígitos durante a digitação
$('#renavam-carro, #renavam-moto').on('input', function () {
    let valor = $(this).val().replace(/\D/g, '');
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }
    $(this).val(valor);
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
            // O value é o nome (para envio ao banco) e data-id guarda o id do estado
            $.each(estados, function (index, estado) {
                select.append(`<option value="${estado.nome}" data-id="${estado.id}">${estado.nome}</option>`);
            });
        });
    }

    // Função para carregar as cidades com base no estado selecionado
    function carregarCidades(estadoId, select) {
        $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`, function (cidades) {
            select.empty(); // Limpa as opções anteriores do select de cidades

            // Adiciona cada cidade como opção, com value como o nome e data-id com o id da cidade
            $.each(cidades, function (index, cidade) {
                select.append(`<option value="${cidade.nome}" data-id="${cidade.id}">${cidade.nome}</option>`);
            });

            // Habilita o select de cidades e ativa o label (para animações ou estilos visuais)
            select.prop("disabled", false);
            select.prev("label").addClass("active");
        });
    }

    // Quando o select de estados mudar de valor, carrega as cidades correspondentes
    function addCidades(selectCid, selectEst) {
        // Recupera o id do estado a partir do atributo data-id do option selecionado
        const estadoId = $(selectEst).find('option:selected').data('id');

        // Reinicia o select de cidades e desabilita-o temporariamente
        selectCid.empty().prop("disabled", true);
        // Remove a classe ativa do label de cidade caso o usuário mude de estado
        selectCid.prev("label").removeClass("active");

        if (estadoId) {
            carregarCidades(estadoId, selectCid);
        }
    };
    
    const camposQuilometragem = $('#quilometragem-carro, #quilometragem-moto');
    
    camposQuilometragem.each(function() {
        $(this).data('valor-numerico', '');
    });
    
    camposQuilometragem.on('input', function() {
        const valorNumerico = extrairNumeros($(this).val());
        $(this).data('valor-numerico', valorNumerico);
        $(this).val(valorNumerico ? formatarQuilometragem(valorNumerico) : '');
    });
    
    camposQuilometragem.on('blur', function() {
        const valorNumerico = $(this).data('valor-numerico');
        $(this).val(valorNumerico ? formatarQuilometragem(valorNumerico) : '');
    });
    
    $('#form-add-veic').on('submit', function() {
        camposQuilometragem.each(function() {
            const valorNumerico = $(this).data('valor-numerico');
            // Garante que o valor numérico seja enviado corretamente
            $(this).val(valorNumerico);
        });
    });

    estadoCarroSelect.on("change", () => {
        addCidades(cidadeCarroSelect, estadoCarroSelect);
    });

    estadoMotoSelect.on("change", () => {
        addCidades(cidadeMotoSelect, estadoMotoSelect);
    });

    // Carrega os estados assim que a página é carregada
    carregarEstados(estadoCarroSelect);
    carregarEstados(estadoMotoSelect);
});

// FASE 5

// JS PARA EXIBIR A IMAGEM DO VEÍCULO
// Ao selecionar um arquivo, utiliza FileReader para exibir uma prévia da imagem

// Variável global para armazenar os arquivos
let currentFiles = new DataTransfer();

$("#upload-imagem").on("change", function(event) {
    const newFiles = Array.from(this.files);
    currentFiles = new DataTransfer();
    
    // Adiciona novos arquivos ao DataTransfer
    newFiles.forEach(file => currentFiles.items.add(file));
    
    // Atualiza o input com os novos arquivos
    this.files = currentFiles.files;

    const previewContainer = $("#preview-container");

    previewContainer.empty();

    Array.from(this.files).forEach((file, index) => {
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imgContainer = $('<div>')
                    .addClass('preview-item')
                    .css('background-image', `url(${e.target.result})`);

                const removeBtn = $('<i>')
                    .addClass('fa-solid fa-xmark remove-btn')
                    .on('click', () => {
                        // Remove do DataTransfer
                        currentFiles.items.remove(index);
                        
                        // Atualiza o input
                        $('#upload-imagem')[0].files = currentFiles.files;
                        
                        // Atualiza preview
                        imgContainer.remove();
                    });

                imgContainer.append(removeBtn);
                previewContainer.append(imgContainer);
            };

            reader.readAsDataURL(file);
        }
    });
});

// Fases para adicionar informações de cada tipo de veículo
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

            $('#btn-voltar').css('display', 'flex');

            if (listaFases[listaFases.length - 1].is(':visible')) {
                $('#btn-continuar').find('p').text('Concluir');
                $('#btn-continuar').find('i').removeClass('fa-arrow-right').addClass('fa-check');
                setTimeout(() => {
                    $('#btn-continuar').attr('type', 'submit');
                }, 100);
            }
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

            if (divCerta === 0) {
                $('#btn-voltar').css('display', 'none');
            }

            if ($('#btn-continuar').attr('type') === 'submit') {
                $('#btn-continuar').find('p').text('Continuar');
                $('#btn-continuar').find('i').removeClass('fa-check').addClass('fa-arrow-right');
                setTimeout(() => {
                    $('#btn-continuar').attr('type', 'button');
                }, 100);
            }
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

$('#form-add-veic').on('submit', function (e) {
    e.preventDefault();

    if ($('#btn-continuar').attr('disabled')) return;

    $('#btn-continuar').attr('disabled', true);

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
            quilometragem: extrairNumeros(data.get('quilometragem-carro')),
            estado: data.get('estado-carro'),
            cidade: data.get('cidade-carro'),
            preco_compra: desformatarPreco(data.get('preco_c-carro')),
            preco_venda: desformatarPreco(data.get('preco_v-carro')),
            licenciado: data.get('licenciado-carro')
        }

        for (const key in envia) {
            if (!envia[key]) {
                alertMessage(`Informações faltando: ${key}.`, 'error');
                return;
            }
        }

        envia = JSON.stringify(envia);

        const files = $('#upload-imagem')[0].files; // Obter os arquivos

        if (!files.length) {
            alertMessage(`Informações faltando: Imagens.`, 'error');
            return;
        }

        if (files.length < 3) {
            alertMessage(`Adicione, ao menos, 3 imagens.`, 'error');
            return;
        }

        $.ajax({
            method: "post",
            url: `${BASE_URL}/carro`, // URL da API para carros
            data: envia,
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
            },
            success: function (response) {
                alertMessage(`Veículo cadastrado com sucesso!`, 'success');
                // Após o primeiro AJAX que cria o carro e retorna o id_carro:
                const id_carro = response.dados.id_carro;

                // Ao montar o FormData para as imagens:
                let formDataImg = new FormData();
                for (let i = 0; i < files.length; i++) {
                    formDataImg.append('imagens', files[i]);
                }

                // Envia as imagens para a API
                $.ajax({
                    method: "post",
                    url: `${BASE_URL}/carro/upload_img/${id_carro}`, // Usa o id_carro retornado
                    data: formDataImg,
                    contentType: false,  // Permite que o navegador defina o contentType apropriado (multipart/form-data)
                    processData: false,  // Impede que o jQuery tente processar os dados
                    headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                    },
                    success: function () {
                        // Redirecionar para a página de perfil após cadastrar
                        const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
                        const tipoUser = dadosUser.tipo_usuario;
                        localStorage.setItem('msgCadVeic', 'Veículo cadastrado com sucesso!');
                        if (tipoUser === 1) {
                            window.location.href = 'administrador-perfil.html';
                        }
                        if (tipoUser === 2) {
                            window.location.href = 'vendedor-perfil.html';
                        }
                    },
                    error: function (response) {
                        alertMessage(`${response.responseJSON.error}`, 'error');
                    }
                });
            },
            error: function (response) {
                alertMessage(`${response.responseJSON.error}`, 'error');
                $('#btn-continuar').attr('disabled', false);
            }
        })
    }

    if ($('#tipo-moto').hasClass('active')) {

        let preco_compra = data.get('preco_c-moto');
        let preco_venda = data.get('preco_v-moto');

        let envia = {
            placa: data.get('placa'),
            marca: data.get('marca-moto'),
            modelo: data.get('modelo-moto'),
            ano_modelo: data.get('ano-modelo-moto'),
            ano_fabricacao: data.get('ano-fabricacao-moto'),
            categoria: data.get('categoria-moto'),
            cor: data.get('cor-moto'),
            renavam: data.get('renavam-moto'),
            licenciado: data.get('licenciado-moto'),
            marchas: data.get('marchas-moto'),
            partida: data.get('partida-moto'),
            tipo_motor: data.get('tipo-motor-moto'),
            cilindrada: data.get('cilindradas-moto'),
            freio_dianteiro_traseiro: data.get('freio-moto'),
            refrigeracao: data.get('refrigeracao-moto'),
            estado: data.get('estado-moto'),
            cidade: data.get('cidade-moto'),
            alimentacao: data.get('alimentacao-moto'),
            quilometragem: data.get('quilometragem-moto'),
            preco_compra: desformatarPreco(preco_compra),
            preco_venda: desformatarPreco(preco_venda)
        }

        for (const key in envia) {
            if (!envia[key]) {
                alertMessage(`Informações faltando: ${key}.`, 'error');
                return;
            }
        }

        envia = JSON.stringify(envia);

        const files = $('#upload-imagem')[0].files; // Obter os arquivos

        if (!files.length) {
            alertMessage(`Informações faltando: Imagens.`, 'error');
            return;
        }

        if (files.length < 3) {
            alertMessage(`Adicione, ao menos, 3 imagens.`, 'error');
            return;
        }

        $.ajax({
            method: "post",
            url: `${BASE_URL}/moto`, // URL da API para motos
            data: envia,
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
            },
            success: function (response) {
                alertMessage(`Veículo cadastrado com sucesso!`, 'success');
                // CORREÇÃO: Atualize o comentário e variável para refletir que é uma moto.
                const id_moto = response.dados.id_moto;

                // Ao montar o FormData para as imagens:
                let formDataImg = new FormData();
                for (let i = 0; i < files.length; i++) {
                    formDataImg.append('imagens', files[i]);
                }

                // CORREÇÃO: Alterado o endereço IP para manter consistência com a API (usando 192.168.1.122, igual ao endpoint de POST).
                $.ajax({
                    method: "post",
                    url: `${BASE_URL}/moto/upload_img/${id_moto}`, // Usa o id_moto retornado
                    data: formDataImg,
                    contentType: false,
                    processData: false,
                    headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                    },
                    success: function () {
                        // Redirecionar para a página de perfil após cadastrar
                        const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
                        const tipoUser = dadosUser.tipo_usuario;
                        localStorage.setItem('msgCadVeic', 'Veículo cadastrado com sucesso!');
                        if (tipoUser === 1) {
                            window.location.href = 'administrador-perfil.html';
                        }
                        if (tipoUser === 2) {
                            window.location.href = 'vendedor-perfil.html';
                        }
                    },
                    error: function (response) {
                        alertMessage(`${response.responseJSON.error}`, 'error');
                    }
                });
            },
            error: function (response) {
                alertMessage(`${response.responseJSON.error}`, 'error');
            }
        })
    }
})


// Funções de formatação

// Evento de input para formatação em tempo real

function formatarPreco(input) {
    $(input).on('input', function() {
        // 1. Limpeza do Input: Remove caracteres não numéricos
        let valor = $(this).val().replace(/[^\d]/g, '');
        
        // Ignora se estiver vazio
        if (!valor) {
            $(this).val('');
            return;
        }
        
        // 2. Separação Parte Decimal/Inteira (considera o valor como centavos)
        const centavos = parseInt(valor, 10);
        const reais = Math.floor(centavos / 100);
        const centavosFinal = centavos % 100;
        
        // Converte para strings para formatação
        let parteInteira = reais.toString();
        const parteDecimal = centavosFinal.toString().padStart(2, '0');
        
        // 3. Formatação da Parte Inteira
        // Adiciona pontos a cada 3 dígitos
        if (parteInteira.length > 3) {
            parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        
        // 4. Montagem Final: Combina tudo no padrão R$ X.XXX,XX
        const precoFormatado = 'R$ ' + parteInteira + ',' + parteDecimal;
        
        // Atualiza o valor do campo
        $(this).val(precoFormatado);
    })

    $(input).on('blur', function() {
        let valor = $(this).val();
    
        // Ignora se campo estiver vazio
        if (!valor) return;
        
        // Se o valor não estiver corretamente formatado, aplica a formatação
        if (!valor.startsWith('R$')) {
            $(this).trigger('input');
        }
    })
}

// Adicionando formatação de preço
formatarPreco('#preco_c-moto');
formatarPreco('#preco_v-moto');
formatarPreco('#preco_c-carro');
formatarPreco('#preco_v-carro');

// Desformatar preço
function desformatarPreco(valorFormatado) {
    // Remove "R$", espaços e pontos, troca vírgula por ponto
    let valorLimpo = valorFormatado
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
    
        // Aredonda o valor para duas casas decimais
    return parseFloat(valorLimpo);
}

// Formatar quilometragem
function formatarQuilometragem(quilometragem) {
    const km = Number(quilometragem);
    if (isNaN(km)) {
        return "";
    }

    // Formata o número com separador de milhar
    let formatted = km.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return `${formatted} km`;
}

// Extrair números
function extrairNumeros(valor) {
    // Remove qualquer caractere que não seja número
    let valorNumerico = valor.replace(/[^\d]/g, '');
    
    return valorNumerico;
}