import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './common';

dayjs.extend(relativeTime);

export function createPostElement(post) {
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

  // go to detai page
  const divElement = liElement.firstElementChild;
  divElement.addEventListener('click', () => {
    window.location.assign(`/post-detail.html?id=${post.id}`);
  });

  return liElement;
}

export function renderPostList(elementId, data) {
  if (!Array.isArray(data)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  // clear current ul
  ulElement.textContent = '';

  data.forEach((postElement) => {
    const liElement = createPostElement(postElement);
    ulElement.appendChild(liElement);
  });
}
