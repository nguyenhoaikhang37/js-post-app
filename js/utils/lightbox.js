function showModal(modalElement) {
  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  if (modalElement.dataset.register) return;

  // selectors
  const imageElement = document.querySelector(imgSelector);
  const prevButton = document.querySelector(prevSelector);
  const nextButton = document.querySelector(nextSelector);
  if (!imageElement || !prevButton || !nextButton) return;

  let imgList = [];
  let currentIndex = 0;

  function showImgAtIndex(index) {
    imageElement.src = imgList[index].src;
  }

  document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'IMG' || !e.target.dataset.album) return;

    imgList = document.querySelectorAll(`img[data-album="${e.target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === e.target);
    console.log({ currentIndex });

    showImgAtIndex(currentIndex);
    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImgAtIndex(currentIndex);
  });
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    showImgAtIndex(currentIndex);
  });

  modalElement.dataset.register = 'true';
}
