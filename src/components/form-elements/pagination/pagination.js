require('paginationjs');

$(() => {
  function simpleTemplating(data) {
    let html = '<ul class="pagination__items-list">';
    $.each(data, (index, item) => {
      html += `<li class="pagination__item">${item}</li>`;
    });
    html += '</ul>';
    return html;
  }

  function addMaterialIconsClassToArrows() {
    $('.paginationjs-prev > a, .paginationjs-next > a').addClass('material-icons');
  }

  let $paginationNumberLastNum;

  function removeExcessPageNumbers() {
    const $pageNumbers = $('.paginationjs-page:not(.paginationjs-first):not(.paginationjs-last)');
    const $activePage = $('.paginationjs-page.active');
    const $ellipsis = $('.paginationjs-ellipsis');

    for (const pageNumber of $pageNumbers) {
      const activePageNum = $activePage.data('num');
      const pageNumberNum = $(pageNumber).data('num');
      const isPageNumNotIn2ClosestPagesFromActive = (pageNumberNum > activePageNum + 2 || pageNumberNum < activePageNum - 2)
        && pageNumberNum !== 1 && pageNumberNum !== $paginationNumberLastNum;
      if (isPageNumNotIn2ClosestPagesFromActive) { $(pageNumber).css('display', 'none'); }
    }
    switch ($activePage.data('num')) {
      case 5:
        $ellipsis.clone().insertAfter('.paginationjs-page[data-num="1"]');
        break;
      case $paginationNumberLastNum - 4:
        $ellipsis.clone().insertBefore($('.paginationjs-page:last'));
        break;
    }
  }

  const $paginator = $('.pagination');

  if ($paginator.length > 0) {
    $paginator.pagination({
      dataSource(done) {
        const result = [];
        for (let i = 1; i <= 180; i++) {
          result.push(i);
        }
        done(result);
      },
      callback(data, pagination) {
        // template method of yourself
        const html = simpleTemplating(data);
        $('.page-content').html(html);
      },
      pageSize: 12,
      autoHidePrevious: true,
      autoHideNext: true,
      prevText: 'arrow_back',
      nextText: 'arrow_forward',
      pageNumber: 1,
      pageRange: 2,
      afterRender() {
        addMaterialIconsClassToArrows();
        removeExcessPageNumbers();
        const navData = $('.paginationjs-nav').text().split(',');
        if (navData[0] == $paginationNumberLastNum) {
          $('.paginationjs-nav').text(
            `${navData[0] * 12 - 11} - ${navData[1]}
            из ${(navData[1]) >= 100 ? '100+' : navData[1]}
            вариантов аренды`,
          );
        } else {
          $('.paginationjs-nav').text(
            `${navData[0] * 12 - 11} - ${navData[0] * 12}
            из ${(navData[1]) >= 100 ? '100+' : navData[1]}
            вариантов аренды`,
          );
        }
      },
      formatNavigator: '<%= currentPage %>,<%= totalNumber %>',
      showNavigator: true,
    });
  }

  $paginationNumberLastNum = $('.paginationjs-last').data('num');
});
