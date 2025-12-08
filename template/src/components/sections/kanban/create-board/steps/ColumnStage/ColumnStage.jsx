import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Stack } from '@mui/material';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import SortableDnd from 'components/base/SortableDnd';
import DraggableColumnItem from 'components/sections/kanban/create-board/steps/ColumnStage/DraggableColumnItem';

export const columnInfoSchema = yup.object().shape({
  columns: yup.array().of(
    yup.object().shape({
      columnType: yup.string().required('Task type is required'),
      hasCardLimit: yup.boolean(),
      cardLimit: yup.number().min(1, 'min 1*').max(20, 'max 20*'),
    }),
  ),
});

const ColumnStage = () => {
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    name: 'columns',
    control,
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((column) => column.id === active.id);
      const newIndex = fields.findIndex((column) => column.id === over?.id);
      move(oldIndex, newIndex);
    }
  };

  return (
    <Box sx={{ mb: 5 }}>
      <SortableDnd items={fields} onDragEnd={handleDragEnd}>
        <Stack direction="column" spacing={3} sx={{ mb: 3 }}>
          {fields.map((item, index) => (
            <DraggableColumnItem key={item.id} item={item} index={index} remove={remove} />
          ))}
        </Stack>
      </SortableDnd>

      <Button
        variant="text"
        color="primary"
        startIcon={
          <IconifyIcon icon="material-symbols:add-circle-rounded" sx={{ height: 20, width: 20 }} />
        }
        onClick={() =>
          append({
            columnType: 'To Do',
            cardLimit: 20,
            color: 'warning.lighter',
            hasCardLimit: false,
          })
        }
      >
        Add New Column
      </Button>
    </Box>
  );
};

export default ColumnStage;
