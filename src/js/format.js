const wholeRubles = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const rublesWithKopecks = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2 });

/** 34920 → «349,20 ₽», 164600 → «1 646 ₽» (цены хранятся в копейках) */
export function formatPrice(kopecks) {
  const formatter = kopecks % 100 === 0 ? wholeRubles : rublesWithKopecks;
  return `${formatter.format(kopecks / 100)} ₽`;
}

export const formatWeight = (grams) => `${grams} г`;

export const discountPercent = ({ price, oldPrice }) => Math.round((1 - price / oldPrice) * 100);
