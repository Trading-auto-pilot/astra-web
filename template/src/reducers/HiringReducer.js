import { arrayMove } from '@dnd-kit/sortable';

export const DRAG_START = 'DRAG_START';
export const DRAG_OVER = 'DRAG_OVER';
export const DRAG_END = 'DRAG_END';

const findList = (id, listItems) => {
  if (!id) {
    return null;
  }

  const list = listItems.find((item) => item.id === id) ?? null;
  if (list) {
    return list;
  }

  const listId = listItems
    .flatMap((list) => list.items.map((pipeline) => ({ itemId: pipeline.id, listId: list.id })))
    .find((item) => item.itemId === id)?.listId;

  return listItems.find((list) => list.id === listId) ?? null;
};

export const hiringReducer = (state, action) => {
  switch (action.type) {
    case DRAG_START: {
      if (action.payload.type === 'item')
        return { ...state, draggedItem: action.payload.item.pipeline };
      if (action.payload.type === 'list')
        return { ...state, draggedList: action.payload.item.list };

      return state;
    }

    case DRAG_OVER: {
      const { activeId, overId, activeRect, overRect } = action.payload;
      const activeList = findList(activeId, state.listItems);
      const overList = findList(overId, state.listItems);

      if (!activeList || !overList || activeList.id === overList.id || !activeRect || !overRect) {
        return state;
      }

      const activeItems = activeList.items;
      const overItems = overList.items;

      const activeIndex = activeItems.findIndex((deal) => deal.id === activeId);
      const overIndex = overItems.findIndex((deal) => deal.id === overId);

      if (activeIndex === -1) {
        return state;
      }

      const newIndex =
        overIndex >= 0 ? overIndex + (activeRect.top > overRect.top + overRect.height ? 1 : 0) : 0;

      return {
        ...state,
        listItems: state.listItems.map((item) => {
          if (item.id === activeList.id) {
            return { ...item, items: activeItems.filter((item) => item.id !== activeId) };
          } else if (item.id === overList.id) {
            return {
              ...item,
              items: [
                ...overItems.slice(0, newIndex),
                { ...activeItems[activeIndex], stage: item.title },
                ...overItems.slice(newIndex),
              ],
            };
          }

          return item;
        }),
      };
    }

    case DRAG_END: {
      const { activeId, overId } = action.payload;
      const activeList = findList(activeId, state.listItems);
      const overList = findList(overId, state.listItems);

      if (!activeList || !overList) return { ...state, draggedItem: null, draggedList: null };

      if (state.draggedItem && activeList.id === overList.id) {
        const activeIndex = activeList.items.findIndex((item) => item.id === activeId);
        const overIndex = activeList.items.findIndex((item) => item.id === overId);
        if (activeIndex !== overIndex) {
          const sortedItems = arrayMove(activeList.items, activeIndex, overIndex);

          return {
            ...state,
            listItems: state.listItems.map((list) =>
              list.id === activeList.id ? { ...list, items: sortedItems } : list,
            ),
            draggedItem: null,
            draggedList: null,
          };
        }
      } else if (activeList) {
        const activeIndex = state.listItems.findIndex((list) => list.id === activeId);
        const overIndex = state.listItems.findIndex((list) => list.id === overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          const sortedListItems = arrayMove(state.listItems, activeIndex, overIndex);

          return {
            ...state,
            listItems: sortedListItems,
            draggedItem: null,
            draggedList: null,
          };
        }
      }

      return { ...state, draggedItem: null, draggedList: null };
    }

    default:
      return state;
  }
};
