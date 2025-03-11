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