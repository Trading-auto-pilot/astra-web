import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DealCard from './DealCard';

const SortableDealItem = ({ deal }) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: deal.id,
    data: {
      type: 'deal',
      deal: deal,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard deal={deal} />
    </div>
  );
};

export default SortableDealItem;
