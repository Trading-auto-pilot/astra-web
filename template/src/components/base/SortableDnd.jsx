import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBreakpoints } from 'providers/BreakpointsProvider';

const SortableDnd = ({ children, items, handleDragEnd, ...rest }) => {
  const { up } = useBreakpoints();
  const upMd = up('md');

  const pointerSensor = useSensor(PointerSensor);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 50,
      tolerance: 5,
    },
  });

  const sensors = useSensors(upMd ? pointerSensor : touchSensor);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => typeof item === 'object' && item.id === active.id);
    const newIndex = items.findIndex((item) => typeof item === 'object' && item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && handleDragEnd) {
      handleDragEnd(oldIndex, newIndex, event);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      autoScroll={false}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      {...rest}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default SortableDnd;
