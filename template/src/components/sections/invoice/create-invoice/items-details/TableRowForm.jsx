import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const TableRowForm = ({ index, field, remove }) => {
  const { currencyFormat, currencySymbol } = useNumberFormat();
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  const itemDetails = watch(`itemDetails.${index}`);
  const quantity = itemDetails.quantity || 0;
  const price = itemDetails.price || 0;

  return (
    <TableRow
      ref={setNodeRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
    >
      <TableCell sx={{ width: 24, paddingRight: '12px !important' }}>
        <IconButton {...listeners} sx={{ p: 0 }}>
          <IconifyIcon sx={{ cursor: 'grab' }} icon="material-symbols:drag-indicator" />
        </IconButton>
      </TableCell>
      <TableCell sx={{ width: 140 }}>
        <Controller
          name={`itemDetails.${index}.type`}
          control={control}
          render={({ field }) => (
            <StyledTextField
              variant="filled"
              select
              size="large"
              {...field}
              fullWidth
              error={!!errors.itemDetails?.[index]?.type}
              slotProps={{
                input: {
                  sx: {
                    '& .MuiInputBase-input': {
                      color: 'text.secondary',
                      padding: '9px 16px !important',
                    },
                  },
                },
              }}
            >
              <MenuItem value="service">Service</MenuItem>
              <MenuItem value="product">Product</MenuItem>
            </StyledTextField>
          )}
        />
      </TableCell>
      <TableCell sx={{ width: 316 }}>
        <StyledTextField
          variant="filled"
          type="text"
          size="large"
          {...register(`itemDetails.${index}.description`)}
          error={!!errors.itemDetails?.[index]?.description}
          fullWidth
          slotProps={{
            input: {
              sx: {
                '& .MuiInputBase-input': {
                  color: 'text.secondary',
                  padding: '9px 16px !important',
                },
              },
            },
          }}
        />
      </TableCell>
      <TableCell sx={{ width: 104 }}>
        <Controller
          name={`itemDetails.${index}.quantity`}
          control={control}
          render={({ field }) => (
            <StyledTextField
              type="number"
              variant="filled"
              size="large"
              value={
                field.value !== undefined && field.value !== null
                  ? String(field.value).padStart(2, '0')
                  : ''
              }
              onChange={(e) => {
                const numericValue = parseInt(e.target.value, 10) || 0;
                field.onChange(numericValue);
              }}
              error={!!errors.itemDetails?.[index]?.quantity}
              slotProps={{
                input: {
                  sx: {
                    '& .MuiInputBase-input': {
                      textAlign: 'end',
                      color: 'text.secondary',
                      padding: '9px 16px !important',
                    },
                  },
                },
              }}
            />
          )}
        />
      </TableCell>
      <TableCell sx={{ width: 130 }}>
        <Controller
          name={`itemDetails.${index}.price`}
          control={control}
          render={({ field: controllerField }) => {
            const [displayValue, setDisplayValue] = useState(
              controllerField.value !== undefined && controllerField.value !== null
                ? currencyFormat(controllerField.value, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : '',
            );
            const [isFocused, setIsFocused] = useState(false);

            useEffect(() => {
              if (!isFocused) {
                if (controllerField.value !== undefined && controllerField.value !== null) {
                  setDisplayValue(
                    currencyFormat(controllerField.value, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                  );
                } else {
                  setDisplayValue('');
                }
              }
            }, [controllerField.value, currencyFormat, isFocused]);

            const handlePriceChange = (e) => {
              const rawValue = e.target.value.replace(/[^0-9.]/g, '');
              setDisplayValue(rawValue);
              controllerField.onChange(rawValue ? Number(rawValue) : '');
            };

            const handleBlur = () => {
              setIsFocused(false);
              if (
                controllerField.value !== undefined &&
                controllerField.value !== null &&
                controllerField.value !== 0
              ) {
                const numValue = Number(controllerField.value);
                const roundedValue = Number(numValue.toFixed(2));
                controllerField.onChange(roundedValue);
                setDisplayValue(
                  currencyFormat(roundedValue, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
                );
              } else {
                controllerField.onChange('');
                setDisplayValue('');
              }
            };

            const handleFocus = () => {
              setIsFocused(true);
              if (
                controllerField.value !== undefined &&
                controllerField.value !== null &&
                controllerField.value !== 0
              ) {
                setDisplayValue(String(controllerField.value));
              } else {
                setDisplayValue('');
              }
            };

            return (
              <StyledTextField
                variant="filled"
                size="large"
                fullWidth
                value={displayValue}
                error={!!errors.itemDetails?.[index]?.price}
                onChange={handlePriceChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                InputProps={{
                  startAdornment: (
                    <Typography sx={{ color: 'text.secondary' }}>{currencySymbol}</Typography>
                  ),
                }}
                slotProps={{
                  input: {
                    sx: {
                      '& .MuiInputBase-input': {
                        textAlign: 'end',
                        color: 'text.secondary',
                        padding: '9px 16px !important',
                      },
                    },
                  },
                }}
              />
            );
          }}
        />
      </TableCell>
      <TableCell align="right" sx={{ width: 80 }}>
        {currencyFormat((Math.round((price || 0) * 100) * (quantity || 0)) / 100)}
      </TableCell>
      <TableCell sx={{ width: 36 }}>
        <IconButton color="error" onClick={() => remove(index)}>
          <IconifyIcon
            icon="mdi:trash-can-outline"
            sx={{
              fontSize: '20px',
            }}
          />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default TableRowForm;
