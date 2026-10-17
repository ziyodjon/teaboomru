/**
 * Демо-переключатель «Вариант 1 / Вариант 2»: показывает одну из карточек (.product-view),
 * остальные скрыты атрибутом hidden. Выбор сохраняется в адресе (?variant=2) — ссылку на нужный
 * вариант можно отправить — и в localStorage этого браузера.
 */
const STORAGE_KEY = 'teaboom:card-variant';
const PARAM = 'variant';

export function initViewSwitch(root, views, onChange) {
  const options = [...root.querySelectorAll('[data-view-option]')];
  const available = options.map((option) => option.dataset.viewOption);

  function readSaved() {
    const fromUrl = new URLSearchParams(location.search).get(PARAM);
    if (available.includes(fromUrl)) return fromUrl;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (available.includes(stored)) return stored;
    } catch {
      // хранилище недоступно — используем вариант по умолчанию
    }
    return available[0];
  }

  function apply(id, { save = false } = {}) {
    views.forEach((view) => {
      view.hidden = view.dataset.productView !== id;
    });
    options.forEach((option) => {
      option.setAttribute('aria-pressed', String(option.dataset.viewOption === id));
    });
    onChange(views.find((view) => !view.hidden));
    if (!save) return;

    const url = new URL(location.href);
    url.searchParams.set(PARAM, id);
    history.replaceState(null, '', url);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // не критично: выбор останется в адресе
    }
  }

  options.forEach((option) => {
    option.addEventListener('click', () => apply(option.dataset.viewOption, { save: true }));
  });

  apply(readSaved());
}
