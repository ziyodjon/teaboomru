import { initGallery } from './gallery.js';
import { initTabs } from './tabs.js';
import { initCategories } from './categories.js';
import { initFavorite } from './favorite.js';

/**
 * Варианты фасовки — единственный источник данных о ценах, артикулах и наличии.
 * Цены хранятся в копейках (целые числа), чтобы избежать ошибок округления.
 * Артикулы — строки, чтобы не потерять ведущие нули.
 * stock — остаток на складе, подписи в STOCK_LABELS (как на teaboom.ru: «В наличии» / «Мало»).
 */
const VARIANTS = [
  { weight: 500, sku: '31689', oldPrice: 155000, price: 149300, stock: 'many' },
  { weight: 1000, sku: '31690', oldPrice: 240000, price: 218600, stock: 'few' },
  { weight: 5000, sku: '31691', oldPrice: 975000, price: 893000, stock: 'few' },
];

const STOCK_LABELS = {
  many: { row: 'В наличии', summary: 'В наличии' },
  few: { row: 'Мало', summary: 'Мало в наличии' },
};

const DEFAULT_SKU = '31689';
const TOAST_DURATION = 4000;

const wholeRubles = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const rublesWithKopecks = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2 });

/** 34920 → «349,20 ₽», 164600 → «1 646 ₽» */
function formatPrice(kopecks) {
  const formatter = kopecks % 100 === 0 ? wholeRubles : rublesWithKopecks;
  return `${formatter.format(kopecks / 100)} ₽`;
}

const formatWeight = (grams) => `${grams} г`;

const discountPercent = ({ price, oldPrice }) => Math.round((1 - price / oldPrice) * 100);

const form = document.querySelector('[data-buy-form]');
const variantsRoot = form.querySelector('[data-variants]');
const variantTemplate = form.querySelector('[data-variant-template]');
const fields = {
  sku: document.querySelector('[data-sku]'),
  stock: document.querySelector('[data-stock]'),
  price: form.querySelector('[data-price]'),
  oldPrice: form.querySelector('[data-old-price]'),
  oldPriceWrap: form.querySelector('[data-old-price-wrap]'),
  discount: form.querySelector('[data-discount]'),
  unitPrice: form.querySelector('[data-unit-price]'),
};
const toast = document.querySelector('[data-toast]');

function renderVariants() {
  const fragment = document.createDocumentFragment();

  VARIANTS.forEach((variant) => {
    const row = variantTemplate.content.cloneNode(true);
    const input = row.querySelector('input');
    const field = (name) => row.querySelector(`[data-field="${name}"]`);

    input.value = variant.sku;
    input.checked = variant.sku === DEFAULT_SKU;
    field('weight').textContent = formatWeight(variant.weight);
    field('sku').textContent = variant.sku;
    field('price').textContent = formatPrice(variant.price);
    field('stock').textContent = STOCK_LABELS[variant.stock].row;
    field('stock').dataset.level = variant.stock;

    if (variant.oldPrice > variant.price) {
      field('oldPrice').textContent = formatPrice(variant.oldPrice);
    } else {
      field('oldPrice').remove();
    }

    fragment.append(row);
  });

  variantsRoot.replaceChildren(fragment);
}

function renderVariant(variant) {
  const hasDiscount = variant.oldPrice > variant.price;

  fields.sku.textContent = variant.sku;
  fields.stock.textContent = STOCK_LABELS[variant.stock].summary;
  fields.stock.dataset.level = variant.stock;
  fields.price.textContent = formatPrice(variant.price);
  fields.oldPriceWrap.hidden = !hasDiscount;
  fields.discount.hidden = !hasDiscount;

  if (hasDiscount) {
    fields.oldPrice.textContent = formatPrice(variant.oldPrice);
    fields.discount.textContent = `−${discountPercent(variant)}%`;
  }

  // Цена за 100 г помогает сравнить выгоду крупных фасовок
  const unitPrice = Math.round((variant.price * 100) / variant.weight);
  fields.unitPrice.textContent = `${formatPrice(unitPrice)} за 100 г`;
}

const findVariant = (sku) => VARIANTS.find((variant) => variant.sku === sku);

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), TOAST_DURATION);
}

variantsRoot.addEventListener('change', (event) => {
  renderVariant(findVariant(event.target.value));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const variant = findVariant(form.elements.pack.value);
  showToast(
    `Демонстрационный режим: корзина не подключена. Выбрано: ${formatWeight(variant.weight)}, арт. ${variant.sku}.`,
  );
});

renderVariants();
renderVariant(findVariant(DEFAULT_SKU));
initGallery(document.querySelector('[data-gallery]'), document.querySelector('[data-lightbox]'));
const tabs = initTabs(document.querySelector('[data-tabs]'));

document.querySelector('[data-review-link]').addEventListener('click', (event) => {
  event.preventDefault();
  tabs.showPanel('panel-reviews');
});

initFavorite(document.querySelector('[data-favorite]'), 'teaboom:favorite:amanda-tradicional', (active) => {
  showToast(active ? 'Товар добавлен в избранное в этом браузере.' : 'Товар убран из избранного.');
});

initCategories(document.querySelector('[data-categories]'));
