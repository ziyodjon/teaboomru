import { formatPrice, formatWeight, discountPercent } from './format.js';
import { STOCK_LABELS } from './products.js';
import { initGallery } from './gallery.js';
import { initTabs } from './tabs.js';
import { initFavorite } from './favorite.js';

/**
 * Карточка товара: выбор фасовки, цена, «В корзину», галерея, вкладки, «оставить отзыв», избранное.
 * view — блок .product-view с карточкой и её окном просмотра фото; product — данные из products.js.
 */
export function initProductCard(view, product, { variantTemplate, showToast }) {
  const card = view.querySelector('.product');
  const form = card.querySelector('[data-buy-form]');
  const variantsRoot = form.querySelector('[data-variants]');
  const fields = {
    sku: form.querySelector('[data-sku]'),
    stock: form.querySelector('[data-stock]'),
    price: form.querySelector('[data-price]'),
    oldPrice: form.querySelector('[data-old-price]'),
    oldPriceWrap: form.querySelector('[data-old-price-wrap]'),
    discount: form.querySelector('[data-discount]'),
    unitPrice: form.querySelector('[data-unit-price]'),
  };

  const findVariant = (sku) => product.variants.find((variant) => variant.sku === sku);
  const stockLevel = (stock) => (STOCK_LABELS[stock].low ? 'few' : 'ok');

  function renderVariants() {
    const fragment = document.createDocumentFragment();

    product.variants.forEach((variant) => {
      const row = variantTemplate.content.cloneNode(true);
      const input = row.querySelector('input');
      const field = (name) => row.querySelector(`[data-field="${name}"]`);

      input.value = variant.sku;
      input.checked = variant.sku === product.defaultSku;
      field('weight').textContent = formatWeight(variant.weight);
      field('sku').textContent = variant.sku;
      field('price').textContent = formatPrice(variant.price);
      field('stock').textContent = STOCK_LABELS[variant.stock].row;
      field('stock').dataset.level = stockLevel(variant.stock);

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
    fields.stock.dataset.level = stockLevel(variant.stock);
    fields.price.textContent = formatPrice(variant.price);
    fields.oldPriceWrap.hidden = !hasDiscount;
    fields.discount.hidden = !hasDiscount;

    if (hasDiscount) {
      fields.oldPrice.textContent = formatPrice(variant.oldPrice);
      fields.discount.textContent = `−${discountPercent(variant)}%`;
    }

    // Цена за 100 г помогает сравнить выгоду крупных фасовок
    const unitPrice = Math.round((variant.price * 100) / variant.weight);
    fields.unitPrice.textContent = `${formatPrice(unitPrice)} за 100 г`;
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
  renderVariant(findVariant(product.defaultSku));

  initGallery(card.querySelector('[data-gallery]'), view.querySelector('[data-lightbox]'), {
    // листание фото наведением мыши — в компактном оформлении («Вариант 2»)
    hoverScrub: () => card.dataset.layout === '2',
  });

  const tabs = initTabs(card.querySelector('[data-tabs]'));
  const reviewLink = form.querySelector('[data-review-link]');
  reviewLink.addEventListener('click', (event) => {
    event.preventDefault();
    tabs.showPanel(reviewLink.hash.slice(1));
  });

  initFavorite(form.querySelector('[data-favorite]'), `teaboom:favorite:${card.dataset.product}`, (active) => {
    showToast(active ? 'Товар добавлен в избранное в этом браузере.' : 'Товар убран из избранного.');
  });
}
