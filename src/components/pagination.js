import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
  const pageTemplate = pages.firstElementChild.cloneNode(true); // в качестве шаблона берём первый элемент из контейнера со страницами
  pages.firstElementChild.remove(); // и удаляем его (предполагаем, что там больше ничего, как вариант, можно и всё удалить из pages)
  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page; // страница переменной, потому что она может меняться при обработке действий позже
    // @todo: #2.6 — обработать действия
    if (action)
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break; // переход на предыдущую страницу
        case "next":
          page = Math.min(pageCount, page + 1);
          break; // переход на следующую страницу
        case "first":
          page = 1;
          break; // переход на первую страницу
        case "last":
          page = pageCount;
          break; // переход на последнюю страницу
      }
    return Object.assign({}, query, {
      // добавим параметры к query, но не изменяем исходный объект
      limit,
      page,
    });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);
    // @todo: #2.4 — получить список видимых страниц и вывести их
    const visiblePages = getPages(page, pageCount, 5); // переносим
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true); 
        return createPage(el, pageNumber, pageNumber === page); 
      })
    );
    // @todo: #2.5 — обновить статус пагинации
    fromRow.textContent = (page - 1) * limit + 1; // Переносим
    toRow.textContent = Math.min(page * limit, total); 
    totalRows.textContent = total; 
  };
  return {
    updatePagination,
    applyPagination,
  };
};