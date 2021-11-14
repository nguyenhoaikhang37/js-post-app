import dayjs from 'dayjs';
import postApi from './apis/postApi';
import { setTextContent } from './utils';
import { registerLightBox } from './utils/lightbox';

function renderPostDetail(post) {
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm')
  );

  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;
    heroImage.addEventListener('error', () => {
      heroImage.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post';
  }
}

// Main
(async () => {
  registerLightBox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="modalImg"]',
    prevSelector: 'button[data-id="modalPrev"]',
    nextSelector: 'button[data-id="modalNext"]',
  });

  try {
    // get id from URL
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');
    if (!postId) {
      console.log('Post id not found');
      return;
    }
    // fetch data
    const post = await postApi.getById(postId);
    // render
    renderPostDetail(post);
  } catch (error) {
    console.log('failed to fetch post detail page', error);
  }
})();
