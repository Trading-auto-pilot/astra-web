import { createContext, use, useCallback, useReducer } from 'react';
import { dealsData } from 'data/crm/deals';
import { DRAG_END, DRAG_OVER, DRAG_START, dealsReducer } from 'reducers/DealsReducer';

const initialState = {
  listItems: dealsData,
  createDealDialog: { isOpen: false },
  draggedList: null,
  draggedDeal: null,
};

const DealsContext = createContext({});

const DealsProvider = ({ children }) => {
  const [state, dealsDispatch] = useReducer(dealsReducer, initialState);

  const handleDragStart = (event) => {
    dealsDispatch({
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
          dealsDispatch({
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
    dealsDispatch({
      type: DRAG_END,
      payload: { activeId: event.active.id, overId: event.over?.id },
    });
  };

  return (
    <DealsContext
      value={{ ...state, dealsDispatch, handleDragStart, handleDragOver, handleDragEnd }}
    >
      {children}
    </DealsContext>
  );
};

export const useDealsContext = () => use(DealsContext);

export default DealsProvider;
