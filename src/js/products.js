/**
 * Данные фасовок — единственный источник цен, артикулов и наличия.
 * Цены хранятся в копейках (целые числа), чтобы избежать ошибок округления.
 * Артикулы — строки, чтобы не потерять ведущие нули.
 * stock — ключ из STOCK_LABELS (подписи как на teaboom.ru).
 *
 * Ключ товара совпадает с атрибутом data-product у карточки в index.html.
 */
export const STOCK_LABELS = {
  plenty: { row: 'Много', summary: 'В наличии' },
  inStock: { row: 'В наличии', summary: 'В наличии' },
  few: { row: 'Мало', summary: 'Мало в наличии', low: true },
};

export const PRODUCTS = {
  // Вариант 1 — товар из задания
  'ananasovij-ulun': {
    defaultSku: '01306',
    variants: [
      { weight: 100, sku: '01306', oldPrice: 34920, price: 32640, stock: 'plenty' },
      { weight: 500, sku: '01307', oldPrice: 164600, price: 143200, stock: 'plenty' },
      { weight: 1000, sku: '01308', oldPrice: 259200, price: 206400, stock: 'plenty' },
      { weight: 5000, sku: '01309', oldPrice: 871000, price: 632000, stock: 'plenty' },
    ],
  },

  // Вариант 2 — другой товар сайта с несколькими фото
  'mate-amanda-tradicional': {
    defaultSku: '31689',
    variants: [
      { weight: 500, sku: '31689', oldPrice: 155000, price: 149300, stock: 'inStock' },
      { weight: 1000, sku: '31690', oldPrice: 240000, price: 218600, stock: 'few' },
      { weight: 5000, sku: '31691', oldPrice: 975000, price: 893000, stock: 'few' },
    ],
  },
};
