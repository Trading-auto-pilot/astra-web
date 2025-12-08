import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import DateRangePicker from 'components/base/DateRangePicker';
import IconifyIcon from 'components/base/IconifyIcon';
import SortableDnd from 'components/base/SortableDnd';
import ApplicationFormSection from '../common/ApplicationFormSection';

const ExperienceInfo = () => {
  const { control } = useFormContext();
  const { fields, move, remove, append } = useFieldArray({
    control,
    name: 'personalInfo.experience',
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
    <ApplicationFormSection name="Experience">
      <SortableDnd items={fields} onDragEnd={handleDragEnd}>
        <Stack direction="column" gap={3}>
          {fields.map((field, index) => (
            <ExperienceFormItem
              key={field.id}
              index={index}
              field={fields[index]}
              remove={remove}
            />
          ))}
          <Button
            color="neutral"
            startIcon={<IconifyIcon icon={'material-symbols:add-rounded'} />}
            onClick={() => {
              append({
                institutionName: '',
                position: '',
                location: '',
                timePeriod: [null, null],
              });
            }}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add More
          </Button>
        </Stack>
      </SortableDnd>
    </ApplicationFormSection>
  );
};

export default ExperienceInfo;

const ExperienceFormItem = ({ index, field, remove }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  return (
    <Stack
      ref={setNodeRef}
      gap={1}
      sx={{ alignItems: 'flex-start', transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
    >
      <IconButton {...listeners}>
        <IconifyIcon icon="material-symbols:drag-indicator" sx={{ cursor: 'grab', fontSize: 20 }} />
      </IconButton>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Institution Name"
            fullWidth
            error={!!errors.personalInfo?.experience?.[index]?.institutionName}
            helperText={errors.personalInfo?.experience?.[index]?.institutionName?.message}
            {...register(`personalInfo.experience.${index}.institutionName`)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Position"
            fullWidth
            error={!!errors.personalInfo?.experience?.[index]?.position}
            helperText={errors.personalInfo?.experience?.[index]?.position?.message}
            {...register(`personalInfo.experience.${index}.position`)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Location"
            fullWidth
            error={!!errors.personalInfo?.experience?.[index]?.location}
            helperText={errors.personalInfo?.experience?.[index]?.location?.message}
            {...register(`personalInfo.experience.${index}.location`)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl
            fullWidth
            error={!!errors.personalInfo?.experience?.[index]?.timePeriod}
            sx={{ mb: 1 }}
          >
            <Controller
              name={`personalInfo.experience.${index}.timePeriod`}
              control={control}
              render={({ field }) => (
                <DateRangePicker
                  selected={field.value?.[0] || undefined}
                  startDate={field.value?.[0] || undefined}
                  endDate={field.value?.[1] || undefined}
                  onChange={(dates) => {
                    field.onChange(dates);
                  }}
                  isClearable
                  customInput={
                    <TextField
                      label="Time period"
                      fullWidth
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconifyIcon icon="material-symbols:calendar-today-outline" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  }
                />
              )}
            />
            {errors.personalInfo?.experience?.[index]?.timePeriod && (
              <FormHelperText>
                {errors.personalInfo?.experience?.[index]?.timePeriod.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <IconButton onClick={() => remove(index)}>
        <IconifyIcon
          icon="material-symbols:close-rounded"
          sx={{
            fontSize: 20,
          }}
        />
      </IconButton>
    </Stack>
  );
};
