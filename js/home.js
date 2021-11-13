import postApi from './apis/postApi';
import { setTextContent } from './utils';

function createPostElement(post) {
  // clone template
  const postTemplate = document.getElementById('postItemTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // update title, desc, author, thumbnail
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', post.description);
  setTextContent(liElement, '[data-id="author"]', post.author);

  const thumbnail = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnail) thumbnail.src = post.imageUrl;

  return liElement;
}

function renderPostList(data) {
  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;

  data.forEach((postElement, idx) => {
    const liElement = createPostElement(postElement);
    ulElement.appendChild(liElement);
  });
}

(async () => {
  const queryParams = {
    _page: 1,
    _limit: 6,
  };
  const { data, pagination } = await postApi.getAll(queryParams);
  renderPostList(data);
})();
