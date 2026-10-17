/**
 * Галерея товара: переключение фото по миниатюрам и просмотр в полном размере.
 * Список фото берётся из миниатюр в разметке — других мест с путями к фото нет.
 *
 * hoverScrub() — когда возвращает true, фото листаются движением мыши по главному
 * фото (как на маркетплейсах): ширина делится на зоны по числу фото.
 */
export function initGallery(root, dialog, { hoverScrub = () => false } = {}) {
  const figure = root.querySelector('.gallery__main');
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

  // Полоски-индикаторы под фото (видны только в режиме листания наведением)
  const dots = photos.map(() => document.createElement('span'));
  if (hasMany) {
    const dotsRoot = document.createElement('div');
    dotsRoot.className = 'gallery__dots';
    dotsRoot.setAttribute('aria-hidden', 'true');
    dotsRoot.append(...dots);
    figure.append(dotsRoot);
  }

  let current = 0; // выбранное фото (миниатюрой, стрелками)
  let shown = 0; // фото, которое сейчас на экране (в т. ч. при наведении)

  function display(index) {
    shown = index;
    const photo = photos[index];
    mainImage.src = photo.currentSrc || photo.src;
    mainImage.alt = photo.alt;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function show(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];

    display(current);
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
    // открываем то фото, которое сейчас видно — в том числе выбранное наведением
    show(shown);
  }

  if (hasMany) {
    figure.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || !hoverScrub()) return;
      const rect = figure.getBoundingClientRect();
      const zone = Math.floor(((event.clientX - rect.left) / rect.width) * photos.length);
      const index = Math.min(photos.length - 1, Math.max(0, zone));
      if (index !== shown) display(index);
    });

    figure.addEventListener('pointerleave', () => {
      if (shown !== current) display(current);
    });
  }

  dots[0]?.classList.add('is-active');

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
