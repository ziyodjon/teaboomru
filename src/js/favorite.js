/**
 * Кнопка «Избранное» (сердечко). Состояние хранится только в этом браузере —
 * серверного избранного в демо нет.
 */
export function initFavorite(button, storageKey, onChange) {
  const read = () => {
    try {
      return localStorage.getItem(storageKey) === '1';
    } catch {
      return false;
    }
  };

  const write = (value) => {
    try {
      if (value) localStorage.setItem(storageKey, '1');
      else localStorage.removeItem(storageKey);
    } catch {
      // хранилище недоступно (приватный режим) — состояние живёт до перезагрузки
    }
  };

  function render(active) {
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Убрать из избранного' : 'Добавить в избранное');
  }

  button.addEventListener('click', () => {
    const active = button.getAttribute('aria-pressed') !== 'true';
    write(active);
    render(active);
    onChange(active);
  });

  render(read());
}
