import { arrayMove } from '@dnd-kit/sortable';

export const DRAG_START = 'DRAG_START';
export const DRAG_OVER = 'DRAG_OVER';
export const DRAG_END = 'DRAG_END';
export const ADD_NEW_DEAL = 'ADD_NEW_DEAL';
export const ADD_NEW_LIST = 'ADD_NEW_LIST';
export const SET_CREATE_DEAL_DIALOG = 'SET_CREATE_DEAL_DIALOG';
export const TOGGLE_COMPACT_MODE = 'TOGGLE_COMPACT_MODE';
export const TOGGLE_DEAL_EXPAND = 'TOGGLE_DEAL_EXPAND';
export const UPDATE_LIST_TITLE = 'UPDATE_LIST_TITLE';

const findList = (id, listItems) => {
  if (!id) {
    return null;
  }

  const list = listItems.find((item) => item.id === id) ?? null;
  if (list) {
    return list;
  }

  const listId = listItems
    .flatMap((list) => list.deals.map((deal) => ({ dealId: deal.id, listId: list.id })))
    .find((item) => item.dealId === id)?.listId;

  return listItems.find((list) => list.id === listId) ?? null;
};

export const dealsReducer = (state, action) => {
  switch (action.type) {
    case DRAG_START: {
      if (action.payload.type === 'deal')
        return { ...state, draggedDeal: action.payload.item.deal };
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

      const activeDeals = activeList.deals;
      const overDeals = overList.deals;

      const activeIndex = activeDeals.findIndex((deal) => deal.id === activeId);
      const overIndex = overDeals.findIndex((deal) => deal.id === overId);

      if (activeIndex === -1) {
        return state;
      }

      const newIndex =
        overIndex >= 0 ? overIndex + (activeRect.top > overRect.top + overRect.height ? 1 : 0) : 0;

      return {
        ...state,
        listItems: state.listItems.map((item) => {
          if (item.id === activeList.id) {
            return { ...item, deals: activeDeals.filter((item) => item.id !== activeId) };
          } else if (item.id === overList.id) {
            return {
              ...item,
              deals: [
                ...overDeals.slice(0, newIndex),
                { ...activeDeals[activeIndex], stage: item.title },
                ...overDeals.slice(newIndex),
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

      if (!activeList || !overList) return { ...state, draggedDeal: null, draggedList: null };

      if (state.draggedDeal && activeList.id === overList.id) {
        const activeIndex = activeList.deals.findIndex((deal) => deal.id === activeId);
        const overIndex = activeList.deals.findIndex((deal) => deal.id === overId);
        if (activeIndex !== overIndex) {
          const sortedDeals = arrayMove(activeList.deals, activeIndex, overIndex);

          return {
            ...state,
            listItems: state.listItems.map((list) =>
              list.id === activeList.id ? { ...list, deals: sortedDeals } : list,
            ),
            draggedDeal: null,
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
            draggedDeal: null,
            draggedList: null,
          };
        }
      }

      return { ...state, draggedDeal: null, draggedList: null };
    }

    case ADD_NEW_LIST: {
      return {
        ...state,
        listItems: [
          ...state.listItems.slice(0, action.payload.columnNo - 1),
          {
            id: Date.now().toString(),
            title: action.payload.title,
            compactMode: false,
            deals: [],
          },
          ...state.listItems.slice(action.payload.columnNo - 1),
        ],
      };
    }

    case SET_CREATE_DEAL_DIALOG: {
      return {
        ...state,
        createDealDialog: {
          isOpen: !state.createDealDialog.isOpen,
          listId: action.payload.listId,
        },
      };
    }

    case ADD_NEW_DEAL: {
      return {
        ...state,
        listItems: state.listItems.map((list) =>
          list.title === action.payload.listName
            ? {
                ...list,
                deals: [...list.deals, { ...action.payload.deal, id: Date.now().toString() }],
              }
            : list,
        ),
      };
    }

    case TOGGLE_DEAL_EXPAND: {
      const listId = findList(action.payload.id, state.listItems)?.id;
      if (listId) {
        const newListItems = state.listItems.map((list) =>
          list.id === listId
            ? {
                ...list,
                deals: list.deals.map((deal) =>
                  deal.id === action.payload.id ? { ...deal, expanded: !deal.expanded } : deal,
                ),
              }
            : list,
        );

        return { ...state, listItems: newListItems };
      }

      return state;
    }

    case TOGGLE_COMPACT_MODE: {
      return {
        ...state,
        listItems: state.listItems.map((item) =>
          item.id === action.payload.id ? { ...item, compactMode: !item.compactMode } : item,
        ),
      };
    }

    case UPDATE_LIST_TITLE: {
      return {
        ...state,
        listItems: state.listItems.map((item) =>
          item.id === action.payload.id ? { ...item, title: action.payload.title } : item,
        ),
      };
    }

    default:
      return state;
  }
};
