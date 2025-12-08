import { createPortal } from 'react-dom';
import { DragOverlay } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useKanbanContext } from 'providers/KanbanProvider';
import ListContainerOverlay from 'components/sections/kanban/kanban/overlays/ListContainerOverlay';
import TaskCardOverlay from 'components/sections/kanban/kanban/overlays/TaskCardOverlay';
import AddNewList from './list-container/AddNewList';
import SortableListItem from './list-container/SortableListItem';

const KanbanElements = () => {
  const { listItems, draggedList, draggedTask } = useKanbanContext();

  return (
    <>
      <SortableContext items={listItems} strategy={horizontalListSortingStrategy}>
        {listItems.map((item) => (
          <SortableListItem key={item.id} taskList={item} />
        ))}
        <AddNewList />
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {draggedList && <ListContainerOverlay taskList={draggedList} />}
          {draggedTask && <TaskCardOverlay task={draggedTask} />}
        </DragOverlay>,
        document.body,
      )}
    </>
  );
};

export default KanbanElements;
