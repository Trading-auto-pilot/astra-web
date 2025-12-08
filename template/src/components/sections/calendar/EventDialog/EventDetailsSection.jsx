import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, Button, InputAdornment, MenuItem, Stack } from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const EventDetailsSection = ({ eventType, errors }) => {
  const { control, register } = useFormContext();

  return (
    <Stack direction="column" spacing={2}>
      <Controller
        name="eventType"
        control={control}
        render={({ field }) => (
          <StyledTextField
            label="Event type"
            select
            error={!!errors.eventType}
            helperText={errors.eventType?.message}
            {...field}
            value={field.value || ''}
          >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="physical">Physical</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
          </StyledTextField>
        )}
      />

      {(eventType === 'online' || eventType === 'hybrid') && (
        <StyledTextField
          label="Virtual"
          fullWidth
          placeholder="Add meeting link"
          error={!!errors.url}
          helperText={errors.url?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="material-symbols:videocam-outline-rounded" />
                </InputAdornment>
              ),
            },
          }}
          {...register('url')}
        />
      )}

      {(eventType === 'physical' || eventType === 'hybrid') && (
        <StyledTextField
          label="Physical"
          fullWidth
          placeholder="Add location"
          error={!!errors.location}
          helperText={errors.location?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="material-symbols:location-on-outline-rounded" />
                </InputAdornment>
              ),
            },
          }}
          {...register('location')}
        />
      )}

      <Stack
        spacing={1}
        sx={{
          alignItems: 'flex-end',
        }}
      >
        <Controller
          name="guests"
          control={control}
          render={({ field }) => (
            <Autocomplete
              fullWidth
              multiple
              options={users}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={field.value
                ?.map((id) => users.find((user) => user.id.toString() === id))
                .filter((user) => user !== undefined)}
              onChange={(_, newValue) =>
                field.onChange(newValue?.map((user) => user.id.toString()) || [])
              }
              renderInput={(params) => {
                return (
                  <StyledTextField
                    label="Add guests"
                    placeholder="User ID"
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="end" sx={{ ml: 0 }}>
                              <IconifyIcon
                                fontSize={20}
                                icon="material-symbols:account-circle"
                                sx={{ color: 'text.secondary' }}
                              />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      },
                    }}
                    sx={{ flexGrow: 1 }}
                    {...params}
                  />
                );
              }}
            />
          )}
        />
        <Button variant="soft" size="medium" sx={{ textWrap: 'nowrap', minWidth: 'max-content' }}>
          Send E-vite
        </Button>
      </Stack>

      <Controller
        name="notifyInMinutes"
        control={control}
        render={({ field: { onChange, value } }) => (
          <StyledTextField
            select
            value={value || 0}
            onChange={(e) => onChange(e.target.value)}
            label="Notification"
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
            <MenuItem value={0} disabled>
              Do not notify
            </MenuItem>
            <MenuItem value={15}>15 minutes before</MenuItem>
            <MenuItem value={30}>30 minutes before</MenuItem>
            <MenuItem value={45}>45 minutes before</MenuItem>
            <MenuItem value={60}>60 minutes before</MenuItem>
          </StyledTextField>
        )}
      />

      <Button
        variant="text"
        color="neutral"
        size="small"
        startIcon={
          <IconifyIcon icon="material-symbols:notification-add-outline" height={18} width={18} />
        }
        sx={{ alignSelf: 'flex-start' }}
      >
        Add Notification
      </Button>
    </Stack>
  );
};

export default EventDetailsSection;
