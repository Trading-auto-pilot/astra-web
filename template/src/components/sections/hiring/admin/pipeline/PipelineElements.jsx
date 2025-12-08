import { createPortal } from 'react-dom';
import { DragOverlay } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useHiringContext } from 'providers/HiringProvider';
import ListContainerOverlay from './ListContainerOverlay';
import PipelineCardOverlay from './PipelineCardOverlay';
import SortableListItem from './SortableListItem';

const PipelineElements = () => {
  const {
    admin: {
      pipeline: { listItems, draggedList, draggedItem },
    },
  } = useHiringContext();

  return (
    <>
      <SortableContext items={listItems} strategy={horizontalListSortingStrategy}>
        {listItems.map((item) => (
          <SortableListItem key={item.id} list={item} />
        ))}
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {draggedList && <ListContainerOverlay list={draggedList} />}
          {draggedItem && <PipelineCardOverlay pipeline={draggedItem} />}
        </DragOverlay>,
        document.body,
      )}
    </>
  );
};

export default PipelineElements;
