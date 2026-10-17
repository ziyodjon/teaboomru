/**
 * Переключатель вариантов оформления карточки («Вариант 1», «Вариант 2»).
 * Вариант задаётся атрибутом data-layout у карточки, разметка и данные не меняются.
 * Выбор сохраняется в адресе (?variant=2) — ссылку на нужный вариант можно отправить —
 * и в localStorage этого браузера.
 */
const STORAGE_KEY = 'teaboom:card-layout';
const PARAM = 'variant';

export function initLayoutSwitch(root, card) {
  const options = [...root.querySelectorAll('[data-layout-option]')];
  const available = options.map((option) => option.dataset.layoutOption);

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

  function apply(layout, { save = false } = {}) {
    card.dataset.layout = layout;
    options.forEach((option) => {
      option.setAttribute('aria-pressed', String(option.dataset.layoutOption === layout));
    });
    if (!save) return;

    const url = new URL(location.href);
    url.searchParams.set(PARAM, layout);
    history.replaceState(null, '', url);
    try {
      localStorage.setItem(STORAGE_KEY, layout);
    } catch {
      // не критично: выбор останется в адресе
    }
  }

  options.forEach((option) => {
    option.addEventListener('click', () => apply(option.dataset.layoutOption, { save: true }));
  });

  apply(readSaved());
}
