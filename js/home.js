import postApi from './apis/postApi';
import { getUlPagination, setTextContent, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import debounce from 'lodash.debounce';

dayjs.extend(relativeTime);

function createPostElement(post) {
  // clone template
  const postTemplate = document.getElementById('postItemTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // update title, desc, author, thumbnail
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);
  setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  return liElement;
}

function renderPostList(data) {
  if (!Array.isArray(data)) return;

  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;

  // clear current ul
  ulElement.textContent = '';

  data.forEach((postElement, idx) => {
    const liElement = createPostElement(postElement);
    ulElement.appendChild(liElement);
  });
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination();
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
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

function handlePrevClick(e) {
  e.preventDefault();

  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = parseInt(ulPagination.dataset.page) || 1;
  if (!page) return;

  if (page <= 1) return;

  handleFilterChange('_page', page - 1);
}

function handleNextClick(e) {
  e.preventDefault();
  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = parseInt(ulPagination.dataset.page) || 1;
  const totalPages = parseInt(ulPagination.dataset.totalPages);
  if (!totalPages || !page) return;

  if (page >= totalPages) return;

  handleFilterChange('_page', page + 1);
}

function initPagination() {
  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const prevLink = ulPagination.firstElementChild.firstElementChild;
  if (prevLink) prevLink.addEventListener('click', handlePrevClick);

  const nextLink = ulPagination.lastElementChild.firstElementChild;
  if (nextLink) nextLink.addEventListener('click', handleNextClick);
}

function getDefaultParams() {
  const url = new URL(window.location);

  // update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  history.pushState({}, '', url);
  return url.searchParams;
}

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  }

  const debounceSearch = debounce((e) => handleFilterChange('title_like', e.target.value), 500);
  searchInput.addEventListener('input', debounceSearch);
}

(async () => {
  initPagination();
  initSearch();

  const queryParams = getDefaultParams();

  // const queryParams = new URLSearchParams(window.location.search);
  const { data, pagination } = await postApi.getAll(queryParams);
  renderPostList(data);
  renderPagination(pagination);
})();
