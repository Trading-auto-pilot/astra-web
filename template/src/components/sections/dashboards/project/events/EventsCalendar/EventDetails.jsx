import { Controller, useFormContext } from 'react-hook-form';
import {
  Autocomplete,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  MenuItem,
  Stack,
  autocompleteClasses,
  filledInputClasses,
} from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const EventDetails = () => {
  const {
    control,
    watch,
    register,
    formState: { errors },
  } = useFormContext();

  const eventType = watch('eventType');

  return (
    <Stack direction="column" spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Stack spacing={1} sx={{ width: 1 }}>
        <FormControl sx={{ minWidth: 90 }}>
          <Controller
            name="eventType"
            control={control}
            render={({ field }) => (
              <StyledTextField
                label="Event type"
                select
                {...field}
                error={!!errors.eventType}
                helperText={errors.eventType?.message}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="physical">Physical</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </StyledTextField>
            )}
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <Controller
            control={control}
            name="notificationMinutesBefore"
            render={({ field }) => (
              <StyledTextField
                select
                label="Notification"
                {...field}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconifyIcon icon="material-symbols:notifications-active-outline-rounded" />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                <MenuItem value={15}>15 minutes before</MenuItem>
                <MenuItem value={30}>30 minutes before</MenuItem>
                <MenuItem value={45}>45 minutes before</MenuItem>
                <MenuItem value={60}>60 minutes before</MenuItem>
              </StyledTextField>
            )}
          />
        </FormControl>
        <Button
          shape="square"
          size="medium"
          color="neutral"
          sx={{ gap: 0.5, alignSelf: 'flex-end' }}
        >
          <IconifyIcon
            icon="material-symbols:notification-add-outline-rounded"
            sx={{ fontSize: 18 }}
          />
        </Button>
      </Stack>
      {(eventType === 'online' || eventType === 'hybrid') && (
        <StyledTextField
          label="Virtual"
          fullWidth
          placeholder="Add meeting link"
          error={!!errors.virtualLink}
          helperText={errors.virtualLink?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="material-symbols:videocam-outline-rounded" />
                </InputAdornment>
              ),
            },
          }}
          {...register('virtualLink')}
        />
      )}
      {(eventType === 'physical' || eventType === 'hybrid') && (
        <StyledTextField
          label="Physical"
          fullWidth
          placeholder="Add location"
          error={!!errors.physical}
          helperText={errors.physical?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="material-symbols:location-on-outline-rounded" />
                </InputAdornment>
              ),
            },
          }}
          {...register('physical')}
        />
      )}

      <Stack
        spacing={1}
        sx={{
          width: 1,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Controller
          control={control}
          name="members"
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              fullWidth
              multiple
              limitTags={2}
              disableClearable
              options={users.slice(0, 5)}
              onChange={(_, newValue) => onChange(newValue)}
              value={value}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderValue={(value, getItemProps) =>
                value.map((option, index) => {
                  const { key, ...rest } = getItemProps({ index });

                  return <Chip key={key} variant="outlined" label={option.name} {...rest} />;
                })
              }
              renderOption={(props, option, { selected }) => (
                <li
                  {...props}
                  key={option.id}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {option.name}
                  {selected && (
                    <IconifyIcon icon="material-symbols:check-rounded" sx={{ fontSize: 18 }} />
                  )}
                </li>
              )}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  label="Add Guests"
                  placeholder="User ID"
                  error={!!errors.members}
                  helperText={errors.members?.message}
                />
              )}
              slotProps={{
                popper: {
                  sx: {
                    "& .MuiAutocomplete-listbox .MuiAutocomplete-option[aria-selected='true']": {
                      backgroundColor: 'transparent',
                    },
                    '& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused': {
                      backgroundColor: 'background.elevation1',
                    },
                    "& .MuiAutocomplete-listbox .MuiAutocomplete-option[aria-selected='true'].Mui-focused":
                      {
                        backgroundColor: 'background.elevation1',
                      },
                  },
                },
              }}
              sx={{
                [`& .${autocompleteClasses.inputRoot}.${filledInputClasses.root}`]: {
                  pt: 1,
                },
              }}
            />
          )}
        />
        <Button variant="soft" size="medium" sx={{ textWrap: 'nowrap', minWidth: 'max-content' }}>
          Send E-vite
        </Button>
      </Stack>
    </Stack>
  );
};

export default EventDetails;
