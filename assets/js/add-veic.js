
        //FUNÇÃO PARA N BUGAR O SELECT
        document.addEventListener("DOMContentLoaded", function () {
            const inputs = document.querySelectorAll(".div-input select, .div-input input");
    
            inputs.forEach((input) => {
                input.addEventListener("change", function () {
                    if (this.value) {
                        this.previousElementSibling.classList.add("active");
                    } else {
                        this.previousElementSibling.classList.remove("active");
                    }
                });
    
                // Para manter o estado correto ao recarregar a página
                if (input.value) {
                    input.previousElementSibling.classList.add("active");
                }
            });
        });
    
    
        
            //FUNÇÃO API DO IBGE
            $(document).ready(function () {
        const estadoSelect = $("#estado");
        const cidadeSelect = $("#cidade");
    
        // Função para carregar os estados
        function carregarEstados() {
            $.getJSON("https://servicodados.ibge.gov.br/api/v1/localidades/estados", function (estados) {
                estados.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena por nome
    
                $.each(estados, function (index, estado) {
                    estadoSelect.append(`<option value="${estado.id}">${estado.nome}</option>`);
                });
            }).fail(function () {
                console.error("Erro ao carregar estados.");
            });
        }
    
        // Função para carregar as cidades do estado selecionado
        function carregarCidades(estadoId) {
            $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`, function (cidades) {
                cidadeSelect.empty(); // Limpa as opções anteriores
    
                $.each(cidades, function (index, cidade) {
                    cidadeSelect.append(`<option value="${cidade.id}">${cidade.nome}</option>`);
                });
    
                // Após carregar as cidades, habilita o campo e ativa o label
                cidadeSelect.prop("disabled", false);
    
                // Adiciona a classe "active" ao label para disparar o transition e o ::after (se houver)
                cidadeSelect.prev("label").addClass("active");
            }).fail(function () {
                console.error("Erro ao carregar cidades.");
            });
        }
    
        // Quando o estado for alterado:
        estadoSelect.on("change", function () {
            const estadoId = $(this).val();
    
            // Reinicia o campo de cidade
            cidadeSelect.empty().prop("disabled", true);
            // Remove a classe ativa do label da cidade (caso o usuário mude de estado)
            cidadeSelect.prev("label").removeClass("active");
    
            if (estadoId) {
                carregarCidades(estadoId);
            }
        });
    
        // Carrega os estados ao iniciar a página
        carregarEstados();
    });
    
        //FUNÇÃO QUE LISTA O ANO DOS CARROS
        function validarCampo(input) {
        const min = 1886;
        const max = new Date().getFullYear();
        if (!input.value) return; // não valida se estiver vazio
        const valor = +input.value;
        if (valor < min || valor > max) {
          if (!input.alertado) { // mostra o alerta apenas uma vez
            input.alertado = true;
            alert(`O valor deve ser entre ${min} e ${max}.`);
            input.focus();
          }
        }
      }
      
      document.querySelectorAll("#ano-modelo, #ano-fabricacao").forEach(input => {
        input.addEventListener("blur", () => validarCampo(input));
        input.addEventListener("input", () => input.alertado = false);
      });
    
    
        //JS DA IMAGEM DO VEICULO
        document.getElementById("upload-imagem").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("preview-imagem").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });