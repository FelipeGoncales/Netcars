// Função para trocar pesquisa entre carro e moto

const tipoVeicMoto = $("#veiculo-moto");
const tipoVeicCarro = $("#veiculo-carro")
const divInputPesquisarMoto = $('#div-input-pesquisar-moto');
const divInputPesquisarCarro = $('#div-input-pesquisar-carro');

function mudarVeiculoSelecionado(veic1, veic2, div1, div2) {
    if (veic1.hasClass('veiculo-nao-selecionado')) {
        veic1.removeClass("veiculo-nao-selecionado").addClass('veiculo-selecionado');
        div1.css('display', 'flex')
        div2.css('display', 'none')
        veic2.removeClass('veiculo-selecionado').addClass('veiculo-nao-selecionado')
    }
}

tipoVeicMoto.click(() => {
    mudarVeiculoSelecionado(tipoVeicMoto, tipoVeicCarro, divInputPesquisarMoto, divInputPesquisarCarro);
});

tipoVeicCarro.click(() => {
    mudarVeiculoSelecionado(tipoVeicCarro, tipoVeicMoto, divInputPesquisarCarro, divInputPesquisarMoto);
});

// Lógica para carregar quantidade de veículos na home

function formatarQntVeic(valor) {  
    if (valor >= 1000) {
        let qntCasasMilhar = (String(valor).length) - 3; 
        
        let valorString = String(valor);

        let milhar = valorString.slice(0, qntCasasMilhar);
        let centena = valorString.slice(qntCasasMilhar, valorString.length);
        
        return `${milhar}.${centena}`;
    }

    return valor;
}

$(document).ready(async function() {
    
    await $.ajax({
        url: `${BASE_URL}/qnt_veiculos`,
        success: function(response) {

            // Span de carros
            $('#qnt-carros').text(formatarQntVeic(response.qnt_carros));
            
            // Span de motos
            $('#qnt-motos').text(formatarQntVeic(response.qnt_motos));
        },
        error: function() {
            alertMessage("Erro ao carregar quantidade de veículos", "error");
        }
    })

    // Atualizar data das reservas
    await $.ajax({
        url: `${BASE_URL}/atualizar_reservas`
    })
})

// Salvar marca veículo no Local Storage

$(document).ready(function() {
    $(".a-marcas-car").on("click", function(e) {

        e.preventDefault(); // Previne o comportamento padrão do link

        localStorage.setItem('tipo-veiculo', 'carro');

        // Pegamos o id do elemento clicado
        const marca = $(this).attr("marca");

        // Salvamos no localStorage para usar na próxima página
        localStorage.setItem("filtro-marca", marca);

        // Redireciona para a página de veículos
        window.location.href = "veiculos.html";  
    });
});

$(document).ready(function() {
    $(".a-marcas-moto").on("click", function(e) {
        e.preventDefault(); // Previne o comportamento padrão do link

        localStorage.setItem('tipo-veiculo', 'moto');

        // Pegamos o id do elemento clicado
        const marca = $(this).attr("marca");

        // Salvamos no localStorage para usar na próxima página
        localStorage.setItem("filtro-marca", marca);

        // Redireciona para a página de veículos
        window.location.href = "veiculos.html";  
    });
});