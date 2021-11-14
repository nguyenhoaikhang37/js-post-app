import postApi from './apis/postApi';
import { initSearch, renderPagination, initPagination, renderPostList } from './utils';

async function handleFilterChange(filterText, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    url.searchParams.set(filterText, filterValue);

    if (filterText === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    // fetch API
    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postsList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

// Main
(async () => {
  try {
    const url = new URL(window.location);

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    // const queryParams = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postsList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
