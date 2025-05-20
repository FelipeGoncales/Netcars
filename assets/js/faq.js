$(document).ready(function () {
  $('.owl-carousel').owlCarousel({
    margin: 15,
    autoWidth: true,
    loop: true,
    center: true,
    dots: false,
    responsiveClass: true,
    responsive: {
      0: {
        items: 2,
        nav: true
      },
      600: {
        items: 2,
        nav: true
      },
      1000: {
        items: 4,
        dots: false,
        nav: true
      }
    }
  });

  const secoes = [
    'cadastro', 'comprar', 'financiamento', 'manutencao', 'seguranca',
    'sobrenos', 'documentacao', 'suporte', 'localizacao', 'evitegolpes',
    'pagamentos', 'ia'
  ];

  secoes.forEach(sec => {
    $(`#card-${sec}`).on('click', function () {
      // Esconde todas as seções e asides
      secoes.forEach(s => {
        $(`.sec-${s}`).css('display', 'none');
        $(`#aside-${s}`).css('display', 'none');
      });

      // Mostra a seção e o aside correspondente
      $(`.sec-${sec}`).css('display', 'flex');
      $(`#aside-${sec}`).css('display', 'flex');
    });
  });

  // Correção segura: troca de cor nos cards ao clicar
  $('.card-ajuda2').on('click', function () {
    $('.card-ajuda2').removeClass('ativo-ajuda2');
    $(this).addClass('ativo-ajuda2');
  });

  // Clique no título (abre e fecha submenu)
  $('.title-aside').on('click', function () {
    const $titulo = $(this);
    const $submenu = $titulo.next('.ul2-aside');

    if ($titulo.hasClass('ativo')) {
      $('.title-aside').removeClass('ativo');
      $('.ul2-aside').slideUp();
    } else {
      $('.title-aside').removeClass('ativo');
      $('.ul2-aside').slideUp();

      $titulo.addClass('ativo');
      $submenu.stop(true, true).slideDown();
    }
  });

  // Clique nos links do submenu (li2-aside)
  $('.li2-aside').on('click', function () {
    $('.li2-aside').removeClass('ativo-li2'); // Remove o destaque de todos
    $(this).addClass('ativo-li2'); // Destaca o clicado
  });

  // Ações de navegação
  $("#link_comocriarconta").on("click", function () {
    $('#link_esquecisenha, #link_inicial, #link_login').css('display', 'none');
    $('#link_cadastro').css('display', 'flex');
  });

  $("#link_comofazerlogin").on("click", function () {
    $('#link_esquecisenha, #link_inicial, #link_cadastro').css('display', 'none');
    $('#link_login').css('display', 'flex');
  });

  $("#link_comotrocarsenha").on("click", function () {
    $('#link_login, #link_inicial, #link_cadastro').css('display', 'none');
    $('#link_esquecisenha').css('display', 'flex');
  });

  $("#link_bemvindo").on("click", function () {
    $('#link_login, #link_esquecisenha, #link_cadastro').css('display', 'none');
    $('#link_inicial').css('display', 'flex');
  });
});
