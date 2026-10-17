/**
 * Галерея товара: переключение фото по миниатюрам и просмотр в полном размере.
 * Список фото берётся из миниатюр в разметке — других мест с путями к фото нет.
 */
export function initGallery(root, dialog) {
  const mainImage = root.querySelector('[data-gallery-image]');
  const thumbs = [...root.querySelectorAll('[data-gallery-thumb]')];
  const photos = thumbs.map((thumb) => thumb.querySelector('img'));

  const lightboxImage = document.createElement('img');
  lightboxImage.className = 'lightbox__image';
  dialog.prepend(lightboxImage);

  const counter = dialog.querySelector('[data-lightbox-counter]');
  const hasMany = photos.length > 1;
  dialog.querySelector('[data-lightbox-prev]').hidden = !hasMany;
  dialog.querySelector('[data-lightbox-next]').hidden = !hasMany;
  counter.hidden = !hasMany;

  let current = 0;

  function show(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];

    mainImage.src = photo.currentSrc || photo.src;
    mainImage.alt = photo.alt;
    thumbs.forEach((thumb, i) => {
      if (i === current) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });

    if (dialog.open) {
      lightboxImage.src = mainImage.src;
      lightboxImage.alt = photo.alt;
      counter.textContent = `${current + 1} / ${photos.length}`;
    }
  }

  function open() {
    dialog.showModal();
    show(current);
  }

  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => show(index)));
  root.querySelector('[data-gallery-zoom]').addEventListener('click', open);
  mainImage.addEventListener('click', open);

  dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => show(current + 1));

  // Клик по затемнённому фону (мимо фото и кнопок) закрывает просмотр
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (!hasMany) return;
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
}
