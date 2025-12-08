import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import NumberTextField from 'components/base/NumberTextField';
import ColorPicker from 'components/base/color-picker/ColorPicker';

const DraggableColumnItem = ({ item, index, remove }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const columnErrors = errors?.columns?.[index] || {};

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const hasCardLimit = useWatch({
    name: `columns.${index}.hasCardLimit`,
    control,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        zIndex: 1,
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
    >
      <Stack justifyContent="space-between" sx={{ mb: 1 }}>
        <div>
          <Controller
            name={`columns.${index}.color`}
            control={control}
            render={({ field }) => (
              <ColorPicker
                value={field.value}
                onChange={(color) => field.onChange(color)}
                id={`column-color-picker-${index}`}
              />
            )}
          />

          <FormControlLabel
            control={
              <Controller
                name={`columns.${index}.hasCardLimit`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label={
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  ml: 1,
                  display: 'inline',
                }}
              >
                Card Limit
              </Typography>
            }
            sx={{ mr: 0, ml: 1 }}
          />
        </div>
        <IconButton onClick={() => remove(index)}>
          <IconifyIcon icon="material-symbols:close-rounded" color="text.primary" fontSize={20} />
        </IconButton>
      </Stack>
      <Stack spacing={1}>
        <FormControl fullWidth sx={{ flex: 1 }} error={!!columnErrors.columnType}>
          <Controller
            name={`columns.${index}.columnType`}
            control={control}
            render={({ field }) => (
              <TextField
                label={`Column #${index + 1}`}
                error={!!columnErrors.columnType}
                helperText={columnErrors.columnType?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" {...listeners}>
                        <IconifyIcon
                          sx={{ cursor: 'grab' }}
                          icon="material-symbols-light:drag-indicator"
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                {...field}
              />
            )}
          />
        </FormControl>
        <FormControl sx={{ maxWidth: 90 }} error={!!columnErrors.cardLimit}>
          <Controller
            name={`columns.${index}.cardLimit`}
            control={control}
            render={({ field }) => (
              <NumberTextField
                value={field.value || ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
                disabled={!hasCardLimit}
                label="Max. Card"
                error={!!columnErrors.cardLimit}
              />
            )}
          />
          {!!columnErrors.cardLimit && (
            <FormHelperText>{columnErrors.cardLimit.message}</FormHelperText>
          )}
        </FormControl>
      </Stack>
    </Box>
  );
};

export default DraggableColumnItem;
