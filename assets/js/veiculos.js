// Função para trocar o filtro entre carro e moto

const divTipoCarro = $('#tipo-veic-carro');
const divTipoMoto = $('#tipo-veic-moto');
const tipoVeicBgSelecionado =  $('#tipo-veic-bg-selecionado');

divTipoCarro.click(() => {
    if (!divTipoCarro.hasClass('active')) {
        divTipoCarro.addClass('active');
        divTipoMoto.removeClass('active');
    }
    tipoVeicBgSelecionado.css('left', '0');
})

divTipoMoto.click(() => {
    if (!divTipoMoto.hasClass('active')) {
        divTipoMoto.addClass('active');
        divTipoCarro.removeClass('active');
    }
    tipoVeicBgSelecionado.css('left', '50%');
})

document.addEventListener('DOMContentLoaded', function() {
    const filterHeader = document.querySelector('.filtro-cor-header');
    const filterContainer = document.querySelector('.filtro-cor-container');
    
    filterHeader.addEventListener('click', function() {
        filterContainer.classList.toggle('active');
        filterHeader.classList.toggle('active');
    });
});

const optionItems = document.querySelectorAll('.option-item');

optionItems.forEach((item) => {
    item.addEventListener('click', () => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        
        checkbox.checked = !checkbox.checked;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Selecionar os elementos
    const btnCarro = document.getElementById('tipo-veic-carro');
    const btnMoto = document.getElementById('tipo-veic-moto');
    const bgSelecionado = document.getElementById('tipo-veic-bg-selecionado');
    const secCarro = document.querySelector('.sec-veiculos-carro');
    
    // Verificar se a seção de motos existe ou precisa ser criada
    let secMoto = document.querySelector('.sec-veiculos-moto');
    if (!secMoto) {
        // Caso a seção de motos não exista, crie-a (opcional - você pode remover isto se já tiver a seção no HTML)
        secMoto = document.createElement('section');
        secMoto.className = 'sec-veiculos-moto';
        secMoto.innerHTML = `
            <div class="div-qts-anuncios">
                <p>587 anúncios encontrados</p>
            </div>
            <div class="div-pai-cards">
                <!-- Seus cards de motos aqui -->
            </div>
        `;
        secMoto.style.display = 'none'; // Esconde inicialmente
        secCarro.parentNode.insertBefore(secMoto, secCarro.nextSibling);
    }

    // Função para alternar entre carros e motos
    function mostrarCarros() {
        secCarro.style.display = 'flex';
        secMoto.style.display = 'none';
        btnCarro.classList.add('active');
        btnMoto.classList.remove('active');
        // Move o background para o botão de carros
        bgSelecionado.style.left = '0';
    }

    function mostrarMotos() {
        secCarro.style.display = 'none';
        secMoto.style.display = 'flex';
        btnMoto.classList.add('active');
        btnCarro.classList.remove('active');
        // Move o background para o botão de motos
        bgSelecionado.style.left = '50%';
    }

    // Adicionar event listeners
    btnCarro.addEventListener('click', mostrarCarros);
    btnMoto.addEventListener('click', mostrarMotos);

    // Inicializar (mostrar carros por padrão)
    mostrarCarros();
});

// Lógica para funcionar o scroll
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos necessários
    const divPaiFiltro = document.querySelector('.div-pai-filtro');
    const secVeiculosCarro = document.querySelector('.sec-veiculos-carro');
    const secVeiculosMoto = document.querySelector('.sec-veiculos-moto');
    
    // Guarda o estilo original para poder restaurá-lo depois
    const estiloOriginal = {
        width: '100%',
        position: 'static',
        top: '20px'
    };
    
    const estiloFixo = {
        width: '28.3%',
        position: 'fixed',
        top: '86px'
    };
    
    // Função para verificar a posição do scroll e aplicar os estilos adequados
    function verificarScroll() {
        const scrollPosition = window.scrollY;
        
        // Obtém a posição e dimensões das seções de veículos
        const secVeiculosCarroRect = secVeiculosCarro.getBoundingClientRect();
        const secVeiculosMotoRect = secVeiculosMoto.getBoundingClientRect();
        
        // Calcula o final da seção de veículos (considerando ambas as seções)
        const finalSecVeiculos = Math.max(
            secVeiculosCarro.offsetTop + secVeiculosCarro.offsetHeight,
            secVeiculosMoto.offsetTop + secVeiculosMoto.offsetHeight
        );
        
        // Altura do elemento de filtro
        const alturaFiltro = divPaiFiltro.offsetHeight;
        
        // Posição onde o filtro deve parar (final da seção de veículos menos a altura do filtro)
        const posicaoParada = finalSecVeiculos - alturaFiltro;
        
        if (scrollPosition < 128.8) {
            // Antes do ponto de fixação, mantém o estilo original
            divPaiFiltro.style.width = estiloOriginal.width;
            divPaiFiltro.style.position = estiloOriginal.position;
            divPaiFiltro.style.top = estiloOriginal.top;
            divPaiFiltro.style.left = '';
        } else if (scrollPosition >= 128.8 && scrollPosition < posicaoParada - 86) {
            // Entre o ponto de fixação e o ponto de parada, mantém fixo
            divPaiFiltro.style.width = estiloFixo.width;
            divPaiFiltro.style.position = estiloFixo.position;
            divPaiFiltro.style.top = estiloFixo.top;
            divPaiFiltro.style.left = '';
        } else {
            // Após o ponto de parada, posiciona absolutamente no final da seção
            divPaiFiltro.style.width = estiloFixo.width;
            divPaiFiltro.style.position = 'absolute';
            divPaiFiltro.style.top = (posicaoParada + 0) + 'px';
            divPaiFiltro.style.left = '';
        }
    }
    
    // Adiciona o listener de evento para o scroll
    window.addEventListener('scroll', verificarScroll);
    
    // Verifica a posição inicial ao carregar a página
    verificarScroll();
    
    // Atualiza quando a janela é redimensionada
    window.addEventListener('resize', verificarScroll);
});