/**
 * Вкладки по паттерну WAI-ARIA Tabs: Tab переводит фокус в панель,
 * стрелки, Home и End переключают вкладки.
 */
export function initTabs(root) {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));

  function select(index, { focus = false } = {}) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      const target = {
        ArrowRight: index === last ? 0 : index + 1,
        ArrowLeft: index === 0 ? last : index - 1,
        Home: 0,
        End: last,
      }[event.key];

      if (target === undefined) return;
      event.preventDefault();
      select(target, { focus: true });
    });
  });

  return {
    /** Открыть вкладку по id её панели, например из ссылки «оставить отзыв» */
    showPanel(panelId) {
      const index = panels.findIndex((panel) => panel.id === panelId);
      if (index === -1) return;
      select(index, { focus: true });
      root.scrollIntoView({ block: 'start' });
    },
  };
}
