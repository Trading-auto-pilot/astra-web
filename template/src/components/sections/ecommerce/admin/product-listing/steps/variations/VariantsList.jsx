import { Button, Paper } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import SortableDnd from 'components/base/SortableDnd';
import OptionField from './OptionField';

const VariantsList = ({ variantsFieldArray }) => {
  const { fields: variants, append, move } = variantsFieldArray;

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      if (active.id !== over.id) {
        const oldIndex = variants.findIndex((variant) => variant.id === active.id);
        const newIndex = variants.findIndex((variant) => variant.id === over.id);

        move(oldIndex, newIndex);
      }
    }
  };

  return (
    <Paper background={1} sx={{ p: 3, borderRadius: 6, outline: 'none', overflow: 'hidden' }}>
      <SortableDnd items={variants} onDragEnd={handleDragEnd}>
        {variants.map((field, variantIndex) => {
          return (
            <OptionField
              key={field.id}
              id={field.id}
              variantIndex={variantIndex}
              variantsFieldArray={variantsFieldArray}
            />
          );
        })}

        <Button
          variant="text"
          color="neutral"
          startIcon={<IconifyIcon icon="material-symbols:add-rounded" fontSize="20px !important" />}
          onClick={() => {
            append({ name: '', items: [] });
          }}
        >
          Add another option
        </Button>
      </SortableDnd>
    </Paper>
  );
};

export default VariantsList;
