import { createPortal } from 'react-dom';
import { DragOverlay } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useDealsContext } from 'providers/DealsProvider';
import AddNewList from './list-container/AddNewList';
import SortableListItem from './list-container/SortableListItem';
import DealCardOverlay from './overlays/DealCardOverlay';
import ListContainerOverlay from './overlays/ListContainerOverlay';

const KanbanElements = () => {
  const { listItems, draggedList, draggedDeal } = useDealsContext();

  return (
    <>
      <SortableContext items={listItems} strategy={horizontalListSortingStrategy}>
        {listItems.map((item) => (
          <SortableListItem key={item.id} dealList={item} />
        ))}
        <AddNewList />
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {draggedList && <ListContainerOverlay dealList={draggedList} />}
          {draggedDeal && <DealCardOverlay deal={draggedDeal} />}
        </DragOverlay>,
        document.body,
      )}
    </>
  );
};

export default KanbanElements;
