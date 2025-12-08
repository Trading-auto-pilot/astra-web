import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, TextField, autocompleteClasses } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { categories } from 'data/e-commerce/product-listing';
import IconifyIcon from 'components/base/IconifyIcon';

const CategorySelect = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name="vitalInfo.category"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Autocomplete
          id="category"
          fullWidth
          popupIcon={<IconifyIcon icon="material-symbols:search-rounded" fontSize="24" />}
          options={categories}
          getOptionLabel={(option) => option}
          value={categories.includes(field.value) ? field.value : null}
          onChange={(_, value) => field.onChange(value || '')}
          isOptionEqualToValue={(option, value) => option === value || value === ''}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select category"
              variant="filled"
              error={!!errors.vitalInfo?.category}
              helperText={errors.vitalInfo?.category?.message}
              sx={{
                [`& .${autocompleteClasses.popupIndicator}`]: {
                  [`&.${autocompleteClasses.popupIndicatorOpen}`]: {
                    transform: 'unset',
                  },
                },
              }}
            />
          )}
          renderOption={(props, option, { inputValue }) => {
            const matches = match(option, inputValue, { insideWords: true });
            const parts = parse(option, matches);

            const { key, ...restProps } = props;

            return (
              <li key={key} {...restProps}>
                <div>
                  {parts.map((part, index) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
              </li>
            );
          }}
        />
      )}
    />
  );
};

export default CategorySelect;
