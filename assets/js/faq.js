$(document).ready(function () {
   $('.owl-carousel').owlCarousel({
        margin: 15,
        autoWidth:true,
        loop:true,
        center:true,
        dots:false,
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
                dots:false,
                nav: true
            }
        }
    });

   $('#card-cadastro').on('click', function () {
    $('.sec-cadastro').css('display', 'flex');
    $('#aside-cadastro').css('display', 'flex');

    $('.sec-comprar, .sec-financiamento, .sec-manutencao, .sec-seguranca, .sec-sobrenos, .sec-documentacao, .sec-suporte, .sec-localizacao, .sec-evitegolpes, .sec-pagamentos, .sec-ia').css('display', 'none');
    $('#aside-comprar, #aside-financiamento, #aside-manutencao, #aside-seguranca, #aside-sobrenos, #aside-documentacao, #aside-suporte, #aside-localizacao, #aside-evitegolpes, #aside-pagamentos, #aside-ia').css('display', 'none');
  });

  $('#card-comprar').on('click', function () {
    $('.sec-comprar').css('display', 'flex');
    $('#aside-comprar').css('display', 'flex');

    $('.sec-cadastro, .sec-financiamento, .sec-manutencao, .sec-seguranca, .sec-sobrenos, .sec-documentacao, .sec-suporte, .sec-localizacao, .sec-evitegolpes, .sec-pagamentos, .sec-ia').css('display', 'none');
    $('#aside-cadastro, #aside-financiamento, #aside-manutencao, #aside-seguranca, #aside-sobrenos, #aside-documentacao, #aside-suporte, #aside-localizacao, #aside-evitegolpes, #aside-pagamentos, #aside-ia').css('display', 'none');
  });

  $('#card-financiamento').on('click', function () {
    $('.sec-financiamento').css('display', 'flex');
    $('#aside-financiamento').css('display', 'flex');

    $('.sec-cadastro, .sec-comprar, .sec-manutencao, .sec-seguranca, .sec-sobrenos, .sec-documentacao, .sec-suporte, .sec-localizacao, .sec-evitegolpes, .sec-pagamentos, .sec-ia').css('display', 'none');
    $('#aside-cadastro, #aside-comprar, #aside-manutencao, #aside-seguranca, #aside-sobrenos, #aside-documentacao, #aside-suporte, #aside-localizacao, #aside-evitegolpes, #aside-pagamentos, #aside-ia').css('display', 'none');
  });

  $('#card-manutencao').on('click', function () {
    $('.sec-manutencao').css('display', 'flex');
    $('#aside-manutencao').css('display', 'flex');

    $('.sec-cadastro, .sec-comprar, .sec-financiamento, .sec-seguranca, .sec-sobrenos, .sec-documentacao, .sec-suporte, .sec-localizacao, .sec-evitegolpes, .sec-pagamentos, .sec-ia').css('display', 'none');
    $('#aside-cadastro, #aside-comprar, #aside-financiamento, #aside-seguranca, #aside-sobrenos, #aside-documentacao, #aside-suporte, #aside-localizacao, #aside-evitegolpes, #aside-pagamentos, #aside-ia').css('display', 'none');
  });

  $('#card-seguranca').on('click', function () {
    $('.sec-seguranca').css('display', 'flex');
    $('#aside-seguranca').css('display', 'flex');

    $('.sec-cadastro, .sec-comprar, .sec-financiamento, .sec-manutencao, .sec-sobrenos, .sec-documentacao, .sec-suporte, .sec-localizacao, .sec-evitegolpes, .sec-pagamentos, .sec-ia').css('display', 'none');
    $('#aside-cadastro, #aside-comprar, #aside-financiamento, #aside-manutencao, #aside-sobrenos, #aside-documentacao, #aside-suporte, #aside-localizacao, #aside-evitegolpes, #aside-pagamentos, #aside-ia').css('display', 'none');
  });

  $('#card-sobrenos').on('click', function () {
    $('.sec-sobrenos').css('display', 'flex');
    $('#aside-sobrenos').css('display', 'flex');

    $('.sec-cadastro, .sec-comprar, .sec-financiamento, .sec-manutencao, .sec-seguranca, .sec-documentacao, .sec-suporte, .sec-localizacao, .sec-evitegolpes, .sec-pagamentos, .sec-ia').css('display', 'none');
    $('#aside-cadastro, #aside-comprar, #aside-financiamento, #aside-manutencao, #aside-seguranca, #aside-documentacao, #aside-suporte, #aside-localizacao, #aside-evitegolpes, #aside-pagamentos, #aside-ia').css('display', 'none');
  });

  $('#card-documentacao').on('click', function () {
    $('.sec-documentacao').css('display', 'flex');
    $('#aside-documentacao').css('display', 'flex');

    $('.sec-cadastro, .sec-comprar, .sec-financiamento, .sec-manutencao, .sec-seguranca, .sec-sobrenos, .sec-suporte, .sec-localizacao, .sec-evitegolpes, .sec-pagamentos, .sec-ia').css('display', 'none');
    $('#aside-cadastro, #aside-comprar, #aside-financiamento, #aside-manutencao, #aside-seguranca, #aside-sobrenos, #aside-suporte, #aside-localizacao, #aside-evitegolpes, #aside-pagamentos, #aside-ia').css('display', 'none');
  });

  $('#card-suporte').on('click', function () {
    $('.sec-suporte').css('display', 'flex');
    $('#aside-suporte').css('display', 'flex');

    $('.sec-cadastro, .sec-comprar, .sec-financiamento, .sec-manutencao, .sec-seguranca, .sec-sobrenos, .sec-documentacao, .sec-localizacao, .sec-evitegolpes, .sec-pagamentos, .sec-ia').css('display', 'none');
    $('#aside-cadastro, #aside-comprar, #aside-financiamento, #aside-manutencao, #aside-seguranca, #aside-sobrenos, #aside-documentacao, #aside-localizacao, #aside-evitegolpes, #aside-pagamentos, #aside-ia').css('display', 'none');
  });

  $('#card-localizacao').on('click', function () {
    $('.sec-localizacao').css('display', 'flex');
    $('#aside-localizacao').css('display', 'flex');

    $('.sec-cadastro, .sec-comprar, .sec-financiamento, .sec-manutencao, .sec-seguranca, .sec-sobrenos, .sec-documentacao, .sec-suporte, .sec-evitegolpes, .sec-pagamentos, .sec-ia').css('display', 'none');
    $('#aside-cadastro, #aside-comprar, #aside-financiamento, #aside-manutencao, #aside-seguranca, #aside-sobrenos, #aside-documentacao, #aside-suporte, #aside-evitegolpes, #aside-pagamentos, #aside-ia').css('display', 'none');
  });

  $('#card-evitegolpes').on('click', function () {
    $('.sec-evitegolpes').css('display', 'flex');
    $('#aside-evitegolpes').css('display', 'flex');

    $('.sec-cadastro, .sec-comprar, .sec-financiamento, .sec-manutencao, .sec-seguranca, .sec-sobrenos, .sec-documentacao, .sec-suporte, .sec-localizacao, .sec-pagamentos, .sec-ia').css('display', 'none');
    $('#aside-cadastro, #aside-comprar, #aside-financiamento, #aside-manutencao, #aside-seguranca, #aside-sobrenos, #aside-documentacao, #aside-suporte, #aside-localizacao, #aside-pagamentos, #aside-ia').css('display', 'none');
  });

  $('#card-pagamentos').on('click', function () {
    $('.sec-pagamentos').css('display', 'flex');
    $('#aside-pagamentos').css('display', 'flex');

    $('.sec-cadastro, .sec-comprar, .sec-financiamento, .sec-manutencao, .sec-seguranca, .sec-sobrenos, .sec-documentacao, .sec-suporte, .sec-localizacao, .sec-evitegolpes, .sec-ia').css('display', 'none');
    $('#aside-cadastro, #aside-comprar, #aside-financiamento, #aside-manutencao, #aside-seguranca, #aside-sobrenos, #aside-documentacao, #aside-suporte, #aside-localizacao, #aside-evitegolpes, #aside-ia').css('display', 'none');
  });

  $('#card-ia').on('click', function () {
    $('.sec-ia').css('display', 'flex');
    $('#aside-ia').css('display', 'flex');

    $('.sec-cadastro, .sec-comprar, .sec-financiamento, .sec-manutencao, .sec-seguranca, .sec-sobrenos, .sec-documentacao, .sec-suporte, .sec-localizacao, .sec-evitegolpes, .sec-pagamentos').css('display', 'none');
    $('#aside-cadastro, #aside-comprar, #aside-financiamento, #aside-manutencao, #aside-seguranca, #aside-sobrenos, #aside-documentacao, #aside-suporte, #aside-localizacao, #aside-evitegolpes, #aside-pagamentos').css('display', 'none');
  });
    


   // Clique nos cards
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

