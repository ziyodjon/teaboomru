import { initGallery } from './gallery.js';

/**
 * Варианты фасовки — единственный источник данных о ценах, артикулах и наличии.
 * Цены хранятся в копейках (целые числа), чтобы избежать ошибок округления.
 * Артикулы — строки, чтобы не потерять ведущие нули.
 * stock — остаток на складе, подписи в STOCK_LABELS.
 */
const VARIANTS = [
  { weight: 500, sku: '31689', oldPrice: 155000, price: 149300, stock: 'many' },
  { weight: 1000, sku: '31690', oldPrice: 240000, price: 218600, stock: 'few' },
  { weight: 5000, sku: '31691', oldPrice: 975000, price: 893000, stock: 'few' },
];

const STOCK_LABELS = { many: 'В наличии', few: 'Мало в наличии' };

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
const optionsRoot = form.querySelector('[data-pack-options]');
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

function renderOptions() {
  const fragment = document.createDocumentFragment();

  VARIANTS.forEach((variant) => {
    const label = document.createElement('label');
    label.className = 'pack-option';

    const input = document.createElement('input');
    input.className = 'pack-option__input visually-hidden';
    input.type = 'radio';
    input.name = 'pack';
    input.value = variant.sku;
    input.checked = variant.sku === DEFAULT_SKU;

    const card = document.createElement('span');
    card.className = 'pack-option__card';

    const weight = document.createElement('span');
    weight.className = 'pack-option__weight';
    weight.textContent = formatWeight(variant.weight);

    const price = document.createElement('span');
    price.className = 'pack-option__price';
    price.textContent = formatPrice(variant.price);

    card.append(weight, price);
    label.append(input, card);
    fragment.append(label);
  });

  optionsRoot.replaceChildren(fragment);
}

function renderVariant(variant) {
  const hasDiscount = variant.oldPrice > variant.price;

  fields.sku.textContent = variant.sku;
  fields.stock.textContent = STOCK_LABELS[variant.stock];
  fields.stock.dataset.stock = variant.stock;
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

optionsRoot.addEventListener('change', (event) => {
  renderVariant(findVariant(event.target.value));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const variant = findVariant(form.elements.pack.value);
  showToast(
    `Демонстрационный режим: корзина не подключена. Выбрано: ${formatWeight(variant.weight)}, арт. ${variant.sku}.`,
  );
});

renderOptions();
renderVariant(findVariant(DEFAULT_SKU));
initGallery(document.querySelector('[data-gallery]'), document.querySelector('[data-lightbox]'));
