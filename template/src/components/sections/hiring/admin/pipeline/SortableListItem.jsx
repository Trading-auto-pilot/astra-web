import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ListContainer from './ListContainer';

const SortableListItem = ({ list }) => {
  const { id, items } = list;
  const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
    id: id,
    data: {
      type: 'list',
      list: list,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} {...attributes} style={style}>
        <ListContainer list={list} listeners={listeners} />
      </div>
    </SortableContext>
  );
};

export default SortableListItem;
