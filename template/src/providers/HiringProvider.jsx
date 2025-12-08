import { createContext, use, useCallback, useReducer, useState } from 'react';
import { jobOpenings, pipelineData } from 'data/hiring/admin';
import { jobList } from 'data/hiring/candidate';
import { DRAG_END, DRAG_OVER, DRAG_START, hiringReducer } from 'reducers/HiringReducer';

const initialState = {
  listItems: pipelineData,
  draggedList: null,
  draggedItem: null,
};

export const HiringContext = createContext({});

const HiringProvider = ({ children }) => {
  const [job, setJob] = useState(null);
  const [state, hiringDispatch] = useReducer(hiringReducer, initialState);

  const handleDragStart = (event) => {
    hiringDispatch({
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
          hiringDispatch({
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
    hiringDispatch({
      type: DRAG_END,
      payload: { activeId: event.active.id, overId: event.over?.id },
    });
  };

  return (
    <HiringContext
      value={{
        job,
        setJob,
        candidate: { jobs: jobList },
        admin: {
          jobOpenings,
          pipeline: { ...state, hiringDispatch, handleDragEnd, handleDragOver, handleDragStart },
        },
      }}
    >
      {children}
    </HiringContext>
  );
};

export default HiringProvider;

export const useHiringContext = () => use(HiringContext);
