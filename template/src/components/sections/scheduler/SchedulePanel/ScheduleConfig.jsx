import { Controller, useFormContext } from 'react-hook-form';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  inputBaseClasses,
} from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';
import NumberTextField from 'components/base/NumberTextField';
import { useScheduleColors } from 'components/sections/scheduler/SchedulePanel/useSchedulerColors';
import SettingsToggle from 'components/sections/scheduler/SettingsToggle';
import StyledTextField from 'components/styled/StyledTextField';

const ScheduleConfig = () => {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const { colorMap } = useScheduleColors();

  const { value, unit } = watch('alertBefore');

  const handleIncrement = () => {
    setValue('alertBefore', { value: value + 1, unit });
  };

  const handleDecrement = () => {
    if (value > 0) {
      setValue('alertBefore', { value: value - 1, unit });
    }
  };

  const handleUnitChange = (event) => {
    const selectedUnit = event.target.value;
    setValue('alertBefore', { value, unit: selectedUnit });
  };

  return (
    <SettingsToggle
      title="Appointment schedule"
      icon="material-symbols:schedule-outline"
      defaultOpen
    >
      <Stack direction="column" spacing={3} sx={{ mb: 4 }}>
        <StyledTextField
          fullWidth
          label="Event Title"
          error={!!errors.title}
          helperText={errors?.title?.message}
          {...register('title')}
        />
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <StyledTextField
                  fullWidth
                  label="Duration"
                  select
                  error={!!errors.duration}
                  helperText={errors.duration?.message}
                  {...field}
                >
                  <MenuItem value="1hr">1 hour</MenuItem>
                  <MenuItem value="2hr">2 hours</MenuItem>
                  <MenuItem value="5hr">5 hours</MenuItem>
                </StyledTextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 7 }}>
            <Controller
              name="timeZone"
              control={control}
              render={({ field }) => (
                <StyledTextField
                  fullWidth
                  label="Time zone"
                  select
                  error={!!errors.timeZone}
                  helperText={errors.timeZone?.message}
                  {...field}
                >
                  <MenuItem value="PST">Pacific Time (PST)</MenuItem>
                  <MenuItem value="CST">Central (CST)</MenuItem>
                  <MenuItem value="EST">Eastern (EST)</MenuItem>
                </StyledTextField>
              )}
            />
          </Grid>
        </Grid>
        <StyledTextField
          fullWidth
          placeholder="Add description"
          label="Description"
          multiline
          rows={3}
          sx={{
            [`& .${inputBaseClasses.root}`]: {
              py: 0.5,
              [`& .${inputBaseClasses.input}`]: {
                py: 0.5,
              },
            },
          }}
          {...register('description')}
        />
      </Stack>
      <Stack direction="column" spacing={3} sx={{ mb: 4 }}>
        <StyledTextField
          label="Virtual"
          placeholder="Add meeting link"
          error={!!errors.virtualLink}
          helperText={errors.virtualLink?.message}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton edge="end">
                    <IconifyIcon icon="material-symbols:content-copy-outline" fontSize={20} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...register('virtualLink')}
        />
        <StyledTextField
          label="Physical"
          placeholder="Location"
          error={!!errors.location}
          helperText={errors.location?.message}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton edge="end">
                    <IconifyIcon icon="material-symbols:pin-drop-outline" fontSize={20} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...register('location')}
        />

        <Stack direction="column" spacing={0.5} alignItems="flex-start">
          <Controller
            name="guests"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                fullWidth
                multiple
                limitTags={2}
                disableClearable
                options={users.slice(0, 5)}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderValue={(selectedOptions, getItemProps) =>
                  selectedOptions.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.name}
                      avatar={<Avatar src={option.avatar} />}
                      {...getItemProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderOption={(props, option, { selected }) => (
                  <li
                    {...props}
                    key={option.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {option.name}
                    {selected && (
                      <IconifyIcon icon="material-symbols:check-rounded" sx={{ fontSize: 18 }} />
                    )}
                  </li>
                )}
                renderInput={(params) => (
                  <StyledTextField
                    sx={{ flexGrow: 1 }}
                    label="Add Guests"
                    placeholder="User ID"
                    error={!!errors.guests}
                    helperText={errors.guests?.message}
                    {...params}
                  />
                )}
                onChange={(event, newValue) => {
                  field.onChange(newValue);
                }}
              />
            )}
          />

          <Button
            size="small"
            endIcon={
              <IconifyIcon
                icon="material-symbols:outgoing-mail-outline"
                height={18}
                width={18}
                sx={{ mt: '2px' }}
              />
            }
          >
            Send E-vite
          </Button>
        </Stack>
      </Stack>

      <Stack direction="column" spacing={3}>
        <div>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Pre-Meeting Alerts
          </Typography>
          <Controller
            name="preMeetingAlert"
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                <FormControlLabel value="email" control={<Radio />} label="Email" />
                <FormControlLabel value="notifications" control={<Radio />} label="Notifications" />
              </RadioGroup>
            )}
          />

          <Stack spacing={1}>
            <Button color="neutral" variant="soft" shape="square" onClick={handleDecrement}>
              <IconifyIcon icon="material-symbols:remove-rounded" fontSize={20} />
            </Button>
            <Controller
              name="alertBefore.value"
              control={control}
              render={({ field }) => (
                <NumberTextField
                  {...field}
                  value={value}
                  variant="custom"
                  sx={{
                    maxWidth: 64,
                    [`& .${inputBaseClasses.input}`]: {
                      textAlign: 'center',
                    },
                  }}
                  onChange={(e) => setValue('alertBefore', { value: Number(e.target.value), unit })}
                />
              )}
            />
            <Button color="neutral" variant="soft" shape="square" onClick={handleIncrement}>
              <IconifyIcon icon="material-symbols:add-rounded" fontSize={20} />
            </Button>
            <StyledTextField
              select
              fullWidth
              value={unit}
              onChange={handleUnitChange}
              sx={{ flexGrow: 1 }}
            >
              <MenuItem value="minute">Minutes</MenuItem>
              <MenuItem value="hr">Hour</MenuItem>
              <MenuItem value="day">Day</MenuItem>
            </StyledTextField>
          </Stack>
        </div>

        <div>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Color
          </Typography>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} row>
                {Object.entries(colorMap).map(([key, cssColor]) => (
                  <FormControlLabel
                    key={key}
                    value={cssColor}
                    control={
                      <Radio
                        icon={
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 4,
                              bgcolor: cssColor,
                            }}
                          />
                        }
                        checkedIcon={
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 4,
                              bgcolor: cssColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                            }}
                          >
                            <IconifyIcon
                              icon="material-symbols:check-small-rounded"
                              sx={{
                                fontSize: 18,
                                color: 'white',
                              }}
                            />
                          </Box>
                        }
                        sx={{ p: 0 }}
                      />
                    }
                    label=""
                    sx={{ ml: 0, mr: 1 }}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </div>
        <Controller
          name="appointmentType"
          control={control}
          render={({ field }) => (
            <StyledTextField
              fullWidth
              label="Appointment Type"
              select
              error={!!errors.appointmentType}
              helperText={errors.appointmentType?.message}
              {...field}
            >
              <MenuItem value="design">Design consultation</MenuItem>
              <MenuItem value="follow-up">Follow-up meeting</MenuItem>
              <MenuItem value="review">Project review</MenuItem>
              <MenuItem value="support">Technical support</MenuItem>
            </StyledTextField>
          )}
        />
        <div>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Access
          </Typography>
          <Controller
            name="access"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} sx={{ gap: 1 }}>
                <FormControlLabel
                  value="private"
                  control={<Radio />}
                  label={
                    <Stack direction="column" spacing={1} sx={{ mt: '3px' }}>
                      <Typography variant="subtitle2">Private</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Only admins and linked clients can book.
                      </Typography>
                    </Stack>
                  }
                />
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label={
                    <Stack direction="column" spacing={1} sx={{ mt: '3px' }}>
                      <Typography variant="subtitle2">Public</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Anyone with the link can book.
                      </Typography>
                    </Stack>
                  }
                />
              </RadioGroup>
            )}
          />
        </div>
      </Stack>
    </SettingsToggle>
  );
};

export default ScheduleConfig;
