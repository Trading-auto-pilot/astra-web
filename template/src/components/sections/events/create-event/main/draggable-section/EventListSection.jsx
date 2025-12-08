import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, IconButton, Stack, TextField } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import EventFileDropHandler from 'components/sections/events/create-event/EventFileDropHandler';

const EventListSection = ({ sectionIndex }) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.listItems`,
  });

  const addItem = () => {
    append({ value: '', itemId: `item${fields.length + 1}` });
  };

  return (
    <div>
      <Stack direction="column" spacing={1} sx={{ mb: 3 }}>
        {fields.map((item, index) => (
          <Stack key={item.itemId} spacing={1} justifyContent="space-between" alignItems="center">
            <Stack spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <IconifyIcon
                icon="material-symbols:circle"
                color="background.elevation3"
                fontSize={8}
              />
              <TextField
                fullWidth
                label="Value"
                variant="filled"
                id={item.itemId}
                {...register(`sections.${sectionIndex}.listItems.${index}.value`)}
                error={!!errors?.sections?.[sectionIndex]?.listItems?.[index]?.value}
                helperText={errors.sections?.[sectionIndex]?.listItems?.[index]?.value?.message}
              />
            </Stack>

            <IconButton color="error" onClick={() => remove(index)}>
              <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
            </IconButton>
          </Stack>
        ))}
        <Button
          onClick={addItem}
          variant="text"
          size="small"
          color="neutral"
          startIcon={<IconifyIcon icon="material-symbols:add-rounded" height={18} width={18} />}
          sx={{
            alignSelf: 'flex-start',
            px: '5px',
          }}
        >
          Add
        </Button>
      </Stack>

      <Stack direction="column" spacing={2}>
        <EventFileDropHandler imagesField={`sections.${sectionIndex}.images`} />
      </Stack>
    </div>
  );
};

export default EventListSection;
