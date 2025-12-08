import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import IconifyIcon from 'components/base/IconifyIcon';
import EventFileDropHandler from 'components/sections/events/create-event/EventFileDropHandler';

const EventInfoSection = ({ sectionIndex }) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.infoItems`,
  });

  const addInfoItem = () => {
    append({
      option: '',
      value: '',
      itemId: `item${fields.length + 1}`,
    });
  };

  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <Grid size={5}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  variant="filled"
                  error={!!errors?.sections?.[sectionIndex]?.infoItems?.[index]?.option}
                  helperText={errors.sections?.[sectionIndex]?.infoItems?.[index]?.option?.message}
                  {...register(`sections.${sectionIndex}.infoItems.${index}.option`)}
                />
              </Grid>
              <Grid size={5}>
                <TextField
                  label="Value"
                  variant="filled"
                  error={!!errors?.sections?.[sectionIndex]?.infoItems?.[index]?.value}
                  helperText={errors.sections?.[sectionIndex]?.infoItems?.[index]?.value?.message}
                  {...register(`sections.${sectionIndex}.infoItems.${index}.value`)}
                />
              </Grid>
              <Grid size={2} sx={{ textAlign: 'center' }}>
                <IconButton color="error" onClick={() => remove(index)} sx={{ flexShrink: 0 }}>
                  <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
                </IconButton>
              </Grid>
            </Fragment>
          ))}
        </Grid>

        <Button
          onClick={addInfoItem}
          variant="text"
          size="small"
          color="neutral"
          startIcon={<IconifyIcon icon="material-symbols:add-rounded" height={18} width={18} />}
          sx={{
            px: '5px',
          }}
        >
          Add
        </Button>
      </Box>

      <Stack direction="column" spacing={2}>
        <EventFileDropHandler imagesField={`sections.${sectionIndex}.images`} />
      </Stack>
    </div>
  );
};

export default EventInfoSection;
