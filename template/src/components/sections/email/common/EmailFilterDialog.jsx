import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  dialogClasses,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { defaultEmails } from 'data/email';
import * as yup from 'yup';
import DateRangePicker from 'components/base/DateRangePicker';
import IconifyIcon from 'components/base/IconifyIcon';

const emailFilterSchema = yup.object().shape({
  from: yup.array().of(yup.string().email().required()).optional(),
  to: yup.array().of(yup.string().email().required()).optional(),
  subject: yup.string().optional(),
  timePeriod: yup.string().optional(),
  date: yup.date().nullable().optional(),
  containsWords: yup.string().optional(),
  exclusiveWords: yup.string().optional(),
  search: yup.string().optional(),
  size: yup.string().optional(),
});

const EmailFilterDialog = ({ handleClose, open }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(emailFilterSchema),
    mode: 'onChange',
  });

  const submitHandler = (data) => {
    console.log(data);
    if (errors) {
      handleClose();
      reset();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(submitHandler)}
      sx={{
        [`& .${dialogClasses.paper}`]: { p: 0, width: 1, borderRadius: 6 },
      }}
    >
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          p: 3,
          pb: 2,
          zIndex: 1000,
        }}
      >
        <Typography variant="h6">Filter</Typography>
        <IconButton onClick={handleClose}>
          <IconifyIcon icon="material-symbols:close" sx={{ fontSize: 20, color: 'neutral.dark' }} />
        </IconButton>
      </Stack>
      <DialogContent sx={{ px: 3, py: 1 }}>
        <Controller
          name="from"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Autocomplete
              aria-labelledby="from-autocomplete-label"
              {...field}
              freeSolo
              multiple
              options={defaultEmails}
              onChange={(_, newValue) => field.onChange(newValue)}
              value={field.value}
              renderInput={(params) => <TextField {...params} label="From" error={!!errors.from} />}
            />
          )}
        />
        <Controller
          name="to"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Autocomplete
              aria-labelledby="to-autocomplete-label"
              {...field}
              multiple
              freeSolo
              options={defaultEmails}
              onChange={(_, newValue) => field.onChange(newValue)}
              value={field.value}
              renderInput={(params) => <TextField {...params} label="To" error={!!errors.to} />}
              sx={{ mt: 1, mb: 2 }}
            />
          )}
        />
        <TextField sx={{ width: 1 }} label="Subject" {...register('subject')} />
        <Grid container sx={{ my: 2 }} spacing={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="time-period-label">Time Period</InputLabel>
              <Select
                labelId="time-period-label"
                id="time-period"
                label="Time period"
                defaultValue=""
                {...register('timePeriod')}
              >
                <MenuItem value="1day">1 day</MenuItem>
                <MenuItem value="3days">3 days</MenuItem>
                <MenuItem value="1week">1 week</MenuItem>
                <MenuItem value="2weeks">1 weeks</MenuItem>
                <MenuItem value="1month">1 month</MenuItem>
                <MenuItem value="2months">2 months</MenuItem>
                <MenuItem value="6months">6 months</MenuItem>
                <MenuItem value="1year">1 year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DateRangePicker withPortal onChange={(dates) => field.onChange(dates)} />
              )}
            />
          </Grid>
        </Grid>
        <Grid container sx={{ mb: 1 }} spacing={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField sx={{ width: 1 }} label="Contains Words" {...register('containsWords')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField sx={{ width: 1 }} label="Excludes Words" {...register('exclusiveWords')} />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="search-label">Search</InputLabel>
              <Select
                labelId="search-label"
                defaultValue=""
                id="search"
                label="Search"
                {...register('search')}
              >
                <MenuItem value="allMail">All Mail</MenuItem>
                <MenuItem value="inbox">Inbox</MenuItem>
                <MenuItem value="starred">Starred</MenuItem>
                <MenuItem value="sentMail">Sent Mail</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="spam">Spam</MenuItem>
                <MenuItem value="trash">Trash</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="size-label">Size</InputLabel>
              <Select
                labelId="size-label"
                defaultValue=""
                id="size"
                label="Age"
                {...register('size')}
              >
                <MenuItem value="under10mb">Under 10 MB</MenuItem>
                <MenuItem value="10to25mb">10 MB - 25 MB</MenuItem>
                <MenuItem value="over25mb">Over 25 MB</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.default',
          zIndex: 1000,
        }}
      >
        <Button variant="text" color="primary" sx={{ mr: 'auto', ml: -1.5 }}>
          Clear
        </Button>
        <Button variant="soft" color="neutral" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailFilterDialog;
