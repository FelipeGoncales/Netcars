$(document).ready(function () {
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
});

$(document).ready(function () {
    $("#link_comocriarconta").on("click", function (){
        $('#link_cadastro').css('display' , 'flex');
    })

    $("#link_comofazerlogin").on("click", function (){
        $('#link_cadastro').css('display' , 'none');
        $('#link_login').css('display' , 'flex');
    })


});


