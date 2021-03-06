export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;

  // calc total pages
  const { _limit, _page, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // save page and total pages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check enable/disable
  if (_page <= 1) ulPagination.firstElementChild.classList.add('disabled');
  else ulPagination.firstElementChild.classList.remove('disabled');

  if (_page >= totalPages) ulPagination.lastElementChild.classList.add('disabled');
  else ulPagination.lastElementChild.classList.remove('disabled');
}

export function initPagination({ elementId, defaultParams, onChange }) {
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  // Set current active page
  // TODO: use default params

  const prevLink = ulPagination.firstElementChild.firstElementChild;
  if (prevLink)
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(ulPagination.dataset.page) || 1;

      if (page > 1) onChange?.(page - 1);
    });

  const nextLink = ulPagination.lastElementChild.firstElementChild;
  if (nextLink)
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(ulPagination.dataset.page) || 1;
      const totalPages = parseInt(ulPagination.dataset.totalPages);
      if (!totalPages || !page) return;

      if (page < totalPages) onChange?.(page + 1);
    });
}
