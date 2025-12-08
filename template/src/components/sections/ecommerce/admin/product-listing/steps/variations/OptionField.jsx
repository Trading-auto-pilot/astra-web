import { useCallback } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import SortableDnd from 'components/base/SortableDnd';
import ValueItem from './OptionValueField';

const OptionField = ({ id, variantIndex, variantsFieldArray }) => {
  const { down } = useBreakpoints();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext();

  const variants = watch('variants') ?? [];

  const { remove } = variantsFieldArray;

  const itemsFiledArray = useFieldArray({
    control,
    name: `variants.${variantIndex}.items`,
  });

  const { fields: itemFields, append, move } = itemsFiledArray;

  const canRemoveOption = variants.length > 1;

  const downSm = down('sm');

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (over) {
        if (active.id !== over.id) {
          const oldIndex = itemFields.findIndex((variant) => variant.id === active.id);
          const newIndex = itemFields.findIndex((variant) => variant.id === over.id);
          move(oldIndex, newIndex);
        }
      }
    },
    [itemFields, move],
  );
  const draggingStyle = isDragging
    ? {
        opacity: 0.4,
      }
    : {};

  return (
    <Stack
      ref={setNodeRef}
      sx={{
        gap: 2,
        transform: CSS.Translate.toString(transform),
        transition,
        mb: { xs: 3, sm: 4 },
        pb: { xs: 3, sm: 0 },
        borderBottom: { xs: '1px solid', sm: 'none' },
        borderColor: (theme) => `${theme.vars.palette.divider} !important`,
        ...draggingStyle,
      }}
    >
      {!downSm && (
        <Button
          variant="text"
          color="neutral"
          shape="square"
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab' }}
        >
          <IconifyIcon icon="material-symbols:drag-indicator" fontSize={20} />
        </Button>
      )}

      <Stack
        direction="column"
        sx={{
          gap: 3,
          flex: 1,
        }}
      >
        <div>
          <Stack
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
              gap: 1,
            }}
          >
            {downSm && (
              <Button
                variant="text"
                color="neutral"
                shape="square"
                {...attributes}
                {...listeners}
                sx={{ cursor: 'grab' }}
              >
                <IconifyIcon icon="material-symbols:drag-indicator" fontSize={20} />
              </Button>
            )}

            <Typography variant="subtitle1" flex={1}>
              Option {variantIndex + 1}
            </Typography>

            <IconButton
              color="error"
              disabled={!canRemoveOption}
              onClick={() => remove(variantIndex)}
            >
              <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
            </IconButton>
          </Stack>

          <FormControl variant="filled" fullWidth error={!!errors.variants?.[variantIndex]?.type}>
            <InputLabel id="variants-type-label">Select variant</InputLabel>

            <Controller
              name={`variants.${variantIndex}.name`}
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <Select
                  labelId="variants-type-label"
                  label="Variants type"
                  displayEmpty
                  onChange={(e) => {
                    onChange(e);
                    itemsFiledArray.replace([
                      {
                        color: e.target.value === 'color' ? '' : undefined,
                        value: '',
                        images: [],
                      },
                    ]);
                  }}
                  {...rest}
                >
                  <MenuItem value="color">Color</MenuItem>
                  <MenuItem value="fabric">Fabric material</MenuItem>
                  <MenuItem value="size">Size</MenuItem>
                </Select>
              )}
            />

            <FormHelperText>{errors.variants?.[variantIndex]?.name?.message}</FormHelperText>
          </FormControl>
        </div>

        {variants[variantIndex].name && (
          <div>
            <Typography variant="subtitle1" mb={2}>
              Values
            </Typography>

            <Stack rowGap={1} direction="column">
              <SortableDnd items={itemFields} onDragEnd={handleDragEnd}>
                {itemFields.map((item, valueIndex) => {
                  return (
                    <ValueItem
                      itemsFiledArray={itemsFiledArray}
                      key={item.id}
                      id={item.id}
                      valueIndex={valueIndex}
                      variantIndex={variantIndex}
                    />
                  );
                })}
              </SortableDnd>
              <Button
                variant="text"
                color="neutral"
                sx={{ alignSelf: 'flex-start' }}
                startIcon={
                  <IconifyIcon icon="material-symbols:add-rounded" fontSize="20px !important" />
                }
                onClick={() => append({ color: '', value: '', images: [] })}
              >
                Add another value
              </Button>
            </Stack>
          </div>
        )}
      </Stack>
    </Stack>
  );
};

export default OptionField;
