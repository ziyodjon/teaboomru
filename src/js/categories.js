/**
 * Боковое меню категорий: как на teaboom.ru, сначала видны первые пункты,
 * остальные открываются кнопкой «•••». Без JS список показан целиком.
 */
export function initCategories(root, visibleCount = 10) {
  const list = root.querySelector('.categories__list');
  const toggle = root.querySelector('[data-categories-toggle]');
  const label = toggle.querySelector('.categories__more-label');
  const items = [...list.children];

  if (items.length <= visibleCount) return;

  function setExpanded(expanded) {
    items.slice(visibleCount).forEach((item) => {
      item.hidden = !expanded;
    });
    toggle.setAttribute('aria-expanded', String(expanded));
    label.textContent = expanded ? 'Свернуть' : 'Показать все категории';
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    setExpanded(toggle.getAttribute('aria-expanded') !== 'true');
  });
  setExpanded(false);
}
