import { arrayMove } from '@dnd-kit/sortable';
import { kanbanBoard } from 'data/kanban/kanban';

export const DRAG_START = 'DRAG_START';
export const DRAG_END = 'DRAG_END';
export const DRAG_OVER = 'DRAG_OVER';
export const ADD_NEW_TASK = 'ADD_NEW_TASK';
export const ADD_NEW_LIST = 'ADD_NEW_LIST';
export const TASK_DETAILS_OPEN = 'TASK_DETAILS_OPEN';
export const TASK_DETAILS_CLOSE = 'TASK_DETAILS_CLOSE';
export const TOGGLE_COMPACT_MODE = 'TOGGLE_COMPACT_MODE';
export const UPDATE_LIST_TITLE = 'UPDATE_LIST_TITLE';
export const UPDATE_BOARD_BACKGROUND = 'UPDATE_BOARD_BACKGROUND';

const findTaskList = (id, listItems) => {
  if (!id) {
    return null;
  }

  const list = listItems.find((item) => item.id === id) ?? null;
  if (list) {
    return list;
  }

  const listId = listItems
    .flatMap((list) => list.tasks.map((task) => ({ taskId: task.id, listId: list.id })))
    .find((item) => item.taskId === id)?.listId;

  return listItems.find((list) => list.id === listId) ?? null;
};

export const kanbanReducer = (state, action) => {
  switch (action.type) {
    case DRAG_START: {
      if (action.payload.type === 'task')
        return { ...state, draggedTask: action.payload.item.task };
      if (action.payload.type === 'list')
        return { ...state, draggedList: action.payload.item.list };

      return state;
    }

    case DRAG_OVER: {
      const { activeId, overId, activeRect, overRect } = action.payload;
      const activeList = findTaskList(activeId, state.listItems);
      const overList = findTaskList(overId, state.listItems);

      if (!activeList || !overList || activeList.id === overList.id || !activeRect || !overRect) {
        return state;
      }

      const activeTasks = activeList.tasks;
      const overTasks = overList.tasks;

      const activeIndex = activeTasks.findIndex((task) => task.id === activeId);
      const overIndex = overTasks.findIndex((task) => task.id === overId);

      if (activeIndex === -1) {
        return state;
      }

      const newIndex =
        overIndex >= 0 ? overIndex + (activeRect.top > overRect.top + overRect.height ? 1 : 0) : 0;

      return {
        ...state,
        listItems: state.listItems.map((list) => {
          if (list.id === activeList.id) {
            return { ...list, tasks: activeTasks.filter((item) => item.id !== activeId) };
          } else if (list.id === overList.id) {
            return {
              ...list,
              tasks: [
                ...overTasks.slice(0, newIndex),
                activeTasks[activeIndex],
                ...overTasks.slice(newIndex),
              ],
            };
          }

          return list;
        }),
      };
    }

    case DRAG_END: {
      const { activeId, overId } = action.payload;
      const activeList = findTaskList(activeId, state.listItems);
      const overList = findTaskList(overId, state.listItems);

      if (!activeList || !overList) return { ...state, draggedTask: null, draggedList: null };

      if (state.draggedTask && activeList.id === overList.id) {
        const activeIndex = activeList.tasks.findIndex((task) => task.id === activeId);
        const overIndex = activeList.tasks.findIndex((task) => task.id === overId);
        if (activeIndex !== overIndex) {
          const sortedTasks = arrayMove(activeList.tasks, activeIndex, overIndex);

          return {
            ...state,
            listItems: state.listItems.map((list) =>
              list.id === activeList.id ? { ...list, tasks: sortedTasks } : list,
            ),
            draggedTask: null,
            draggedList: null,
          };
        }
      } else if (activeList) {
        const activeIndex = state.listItems.findIndex((list) => list.id === activeId);
        const overIndex = state.listItems.findIndex((list) => list.id === overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          const updatedListContainers = arrayMove(state.listItems, activeIndex, overIndex);

          return {
            ...state,
            listItems: updatedListContainers,
            draggedTask: null,
            draggedList: null,
          };
        }
      }

      return { ...state, draggedTask: null, draggedList: null };
    }

    case ADD_NEW_TASK: {
      return {
        ...state,
        listItems: state.listItems.map((list) =>
          list.id === action.payload.listId
            ? {
                ...list,
                tasks:
                  action.payload.position === 'top'
                    ? [{ id: Date.now().toString(), title: action.payload.title }, ...list.tasks]
                    : [...list.tasks, { id: Date.now().toString(), title: action.payload.title }],
              }
            : list,
        ),
      };
    }

    case ADD_NEW_LIST: {
      return {
        ...state,
        listItems: [
          ...state.listItems.slice(0, action.payload.columnNo - 1),
          { id: Date.now().toString(), title: action.payload.title, compactMode: false, tasks: [] },
          ...state.listItems.slice(action.payload.columnNo - 1),
        ],
      };
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

    case UPDATE_BOARD_BACKGROUND: {
      return {
        ...state,
        kanbanBoard: {
          ...kanbanBoard,
          backgroundOption: action.payload,
        },
      };
    }

    case TASK_DETAILS_OPEN: {
      return {
        ...state,
        taskDetails: {
          ...action.payload,
          column: findTaskList(action.payload.id, state.listItems)?.title,
          board: kanbanBoard.name,
        },
      };
    }

    case TASK_DETAILS_CLOSE: {
      return { ...state, taskDetails: null };
    }

    default:
      return state;
  }
};
