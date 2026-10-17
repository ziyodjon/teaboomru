import { PRODUCTS } from './products.js';
import { initProductCard } from './product-card.js';
import { initViewSwitch } from './view-switch.js';
import { initCategories } from './categories.js';

const TOAST_DURATION = 4000;
const toast = document.querySelector('[data-toast]');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), TOAST_DURATION);
}

const views = [...document.querySelectorAll('[data-product-view]')];
const variantTemplate = document.querySelector('[data-variant-template]');
const categories = document.querySelector('[data-categories]');

views.forEach((view) => {
  const product = PRODUCTS[view.querySelector('.product').dataset.product];
  initProductCard(view, product, { variantTemplate, showToast });
});

initCategories(categories);

// При смене варианта — заголовок вкладки браузера и текущий раздел в меню категорий
initViewSwitch(document.querySelector('[data-layout-switch]'), views, (view) => {
  document.title = `${view.querySelector('.product__title').textContent} — Чайный Бум`;
  categories.querySelectorAll('.categories__list a').forEach((link) => {
    if (link.textContent === view.dataset.category) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
});
