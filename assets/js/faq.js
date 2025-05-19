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
