import { createContext, use, useCallback, useReducer } from 'react';
import { kanbanBoard } from 'data/kanban/kanban';
import { DRAG_END, DRAG_OVER, DRAG_START } from 'reducers/KanbanReducer';
import { kanbanReducer } from 'reducers/KanbanReducer';

const initialState = {
  kanbanBoard: kanbanBoard,
  listItems: kanbanBoard.listItems,
  draggedList: null,
  draggedTask: null,
  taskDetails: null,
};

export const KanbanContext = createContext({});

const KanbanProvider = ({ children }) => {
  const [state, kanbanDispatch] = useReducer(kanbanReducer, initialState);

  const handleDragStart = (event) => {
    kanbanDispatch({
      type: DRAG_START,
      payload: { type: event.active.data.current?.type, item: event.active.data.current },
    });
  };

  const handleDragOver = useCallback(
    (() => {
      let timeoutId;

      return (event) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          kanbanDispatch({
            type: DRAG_OVER,
            payload: {
              activeId: event.active.id,
              overId: event.over?.id,
              activeRect: event.active.rect.current.translated,
              overRect: event.over?.rect,
            },
          });
        }, 16);
      };
    })(),
    [],
  );

  const handleDragEnd = (event) => {
    kanbanDispatch({
      type: DRAG_END,
      payload: { activeId: event.active.id, overId: event.over?.id },
    });
  };

  return (
    <KanbanContext
      value={{ ...state, handleDragStart, handleDragOver, handleDragEnd, kanbanDispatch }}
    >
      {children}
    </KanbanContext>
  );
};

export const useKanbanContext = () => use(KanbanContext);

export default KanbanProvider;
