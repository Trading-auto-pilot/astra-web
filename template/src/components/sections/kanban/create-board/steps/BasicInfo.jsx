import { Controller, useFormContext } from 'react-hook-form';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
  formControlLabelClasses,
} from '@mui/material';
import * as yup from 'yup';

export const basicInfoFormSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  boardType: yup.string().required('Board type is required'),
  visibility: yup
    .string()
    .oneOf(['private', 'public'], 'Invalid visibility')
    .required('Visibility is required'),
  allowGuest: yup.boolean(),
  description: yup.string(),
});

const BasicInfo = () => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <Stack direction="column" spacing={3}>
      <TextField
        fullWidth
        id="name"
        label="Name of board"
        variant="filled"
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register('name')}
      />

      <FormControl fullWidth variant="filled" error={!!errors.boardType}>
        <InputLabel id="board-type-label">Board Type</InputLabel>
        <Controller
          name="boardType"
          control={control}
          render={({ field }) => (
            <Select
              labelId="board-type-label"
              displayEmpty
              inputProps={{ 'aria-label': 'Board Type' }}
              {...field}
            >
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="agile">Agile</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
              <MenuItem value="hr">HR Onboarding</MenuItem>
              <MenuItem value="team">Team Collaboration</MenuItem>
            </Select>
          )}
        />
        {errors.boardType && <FormHelperText>{errors.boardType?.message}</FormHelperText>}
      </FormControl>

      <Stack justifyContent="space-between">
        <FormControl component="fieldset" error={!!errors.visibility}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Controller
              name="visibility"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup
                  sx={{
                    color: 'text.secondary',
                    flexDirection: 'row',
                    gap: { xs: 1, sm: 3 },
                    [`& .${formControlLabelClasses.root}`]: { mr: 0 },
                    [`& .${formControlLabelClasses.label}`]: { ml: '3px' },
                  }}
                  {...field}
                  value={field.value || 'private'}
                >
                  <FormControlLabel value="private" control={<Radio />} label="Private" />
                  <FormControlLabel value="public" control={<Radio />} label="Public" />
                </RadioGroup>
              )}
            />
          </Stack>
          {errors.visibility && <FormHelperText>{errors.visibility.message}</FormHelperText>}
        </FormControl>
        <FormControl component="fieldset" variant="filled" sx={{ flexShrink: 0 }}>
          <FormControlLabel
            sx={{ mr: 0 }}
            control={
              <Controller
                name="allowGuest"
                control={control}
                render={({ field }) => <Checkbox checked={field.value} {...field} />}
              />
            }
            label={
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  ml: '3px',
                }}
              >
                Allow Guest
              </Typography>
            }
          />
        </FormControl>
      </Stack>
      <TextField
        fullWidth
        label={<Typography variant="subtitle2">Description (Optional)</Typography>}
        variant="filled"
        multiline
        minRows={3}
        maxRows={6}
        error={!!errors.description}
        helperText={errors.description && errors.description.message}
        {...register('description')}
      />
    </Stack>
  );
};

export default BasicInfo;
