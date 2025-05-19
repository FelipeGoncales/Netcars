 $(document).ready(function () {
    $('.title-aside').on('click', function () {
      const $currentUl = $(this).next('.ul2-aside');

      // Fecha todos os outros
      $('.ul2-aside').not($currentUl).removeClass('aberto');

      // Alterna o atual
      $currentUl.toggleClass('aberto');
    });
  });