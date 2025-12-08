import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { currencyFormat } from 'lib/utils';
import * as yup from 'yup';
import Editor from 'components/base/Editor';

export const jobInformationFormSchema = yup.object({
  jobInformation: yup.object({
    jobTitle: yup.string().required('Job title is required'),
    positionNumber: yup.number().required('Position number is required'),
    department: yup.string().required('Department is required'),
    hiringLead: yup.string().required('Hiring lead is required'),
    branch: yup.string().required('Branch is required'),
    experience: yup.number().required('Experience is required'),
    deadline: yup.string().required('Deadline is required'),
    compensation: yup.object({
      currency: yup.string().required('Currency is required'),
      salary: yup.number().required('Salary is required'),
      interval: yup.string().required('Interval is required'),
    }),
    jobDescription: yup.string().required('Job description is required'),
  }),
});

const JobInformation = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={2}>
      <Grid container size={12} spacing={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Job title"
            fullWidth
            error={!!errors.jobInformation?.jobTitle}
            helperText={errors.jobInformation?.jobTitle?.message}
            {...register('jobInformation.jobTitle')}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6 }}>
          <FormControl variant="filled" fullWidth error={!!errors.jobInformation?.positionNumber}>
            <InputLabel id="position-number-label">Position Number</InputLabel>
            <Controller
              control={control}
              name="jobInformation.positionNumber"
              render={({ field }) => (
                <Select
                  labelId="position-number-label"
                  label="Position Number"
                  inputProps={{ 'aria-label': 'Without label' }}
                  {...field}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.jobInformation?.positionNumber?.message}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6, sm: 6 }}>
          <FormControl variant="filled" fullWidth error={!!errors.jobInformation?.department}>
            <InputLabel id="department-label">Department</InputLabel>
            <Controller
              control={control}
              name="jobInformation.department"
              render={({ field }) => (
                <Select
                  labelId="department-label"
                  label="Department"
                  inputProps={{ 'aria-label': 'Without label' }}
                  {...field}
                >
                  <MenuItem value="Support">Support</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Data & Analytics">Data & Analytics</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.jobInformation?.department?.message}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6, sm: 6 }}>
          <FormControl variant="filled" fullWidth error={!!errors.jobInformation?.hiringLead}>
            <InputLabel id="hiring-lead-label">Hiring Lead</InputLabel>
            <Controller
              control={control}
              name="jobInformation.hiringLead"
              render={({ field }) => (
                <Select
                  labelId="hiring-lead-label"
                  label="Hiring Lead"
                  inputProps={{ 'aria-label': 'Without label' }}
                  {...field}
                >
                  <MenuItem value="Michael Hall">Michael Hall</MenuItem>
                  <MenuItem value="Jack Smith">Jack Smith</MenuItem>
                  <MenuItem value="Grace Wong">Grace Wong</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.jobInformation?.hiringLead?.message}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6, sm: 6 }}>
          <FormControl variant="filled" fullWidth error={!!errors.jobInformation?.branch}>
            <InputLabel id="branch-label">Branch</InputLabel>
            <Controller
              control={control}
              name="jobInformation.branch"
              render={({ field }) => (
                <Select
                  labelId="branch-label"
                  label="Branch"
                  inputProps={{ 'aria-label': 'Without label' }}
                  {...field}
                >
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="Chicago">Chicago</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.jobInformation?.branch?.message}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container size={12} spacing={1}>
        <Grid size={{ xs: 6, sm: 6 }}>
          <FormControl variant="filled" fullWidth error={!!errors.jobInformation?.experience}>
            <InputLabel id="experience-label">Experience</InputLabel>
            <Controller
              control={control}
              name="jobInformation.experience"
              render={({ field }) => (
                <Select
                  labelId="experience-label"
                  label="Experience"
                  inputProps={{ 'aria-label': 'Without label' }}
                  {...field}
                >
                  <MenuItem value={1}>1 Year</MenuItem>
                  <MenuItem value={2}>2 Years</MenuItem>
                  <MenuItem value={3}>3 Years</MenuItem>
                  <MenuItem value={4}>4 Years</MenuItem>
                  <MenuItem value={5}>5 Years</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.jobInformation?.experience?.message}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6, sm: 6 }}>
          <Controller
            control={control}
            name="jobInformation.deadline"
            render={({ field: { value, ...rest } }) => (
              <DatePicker
                label="Deadline"
                value={dayjs(value)}
                slotProps={{
                  textField: {
                    error: !!errors.jobInformation?.deadline,
                    helperText: errors.jobInformation?.deadline?.message,
                    fullWidth: true,
                  },
                  inputAdornment: {
                    position: 'start',
                  },
                }}
                {...rest}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container size={12} spacing={1}>
        <Grid size={12}>
          <Typography variant="caption" fontWeight={500}>
            Compensation
          </Typography>
        </Grid>
        <Grid container size={12}>
          <Grid size={{ xs: 6, sm: 'auto' }}>
            <FormControl
              variant="filled"
              fullWidth
              error={!!errors.jobInformation?.compensation?.currency}
              sx={{ minWidth: { sm: 120 } }}
            >
              <InputLabel id="currency-label">Currency</InputLabel>
              <Controller
                control={control}
                name="jobInformation.compensation.currency"
                render={({ field }) => (
                  <Select
                    labelId="currency-label"
                    label="Currency"
                    inputProps={{ 'aria-label': 'Without label' }}
                    {...field}
                  >
                    <MenuItem value="AUD">$AUD</MenuItem>
                    <MenuItem value="USD">$USD</MenuItem>
                    <MenuItem value="CAD">$CAD</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.jobInformation?.compensation?.currency?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size="grow" order={{ xs: 1, sm: 0 }}>
            <Controller
              control={control}
              name="jobInformation.compensation.salary"
              render={({ field }) => (
                <TextField
                  variant="filled"
                  label="Desired Salary"
                  fullWidth
                  value={
                    field.value &&
                    currencyFormat(field.value, 'en-US', { maximumFractionDigits: 0 })
                  }
                  error={!!errors.jobInformation?.compensation?.salary}
                  helperText={errors.jobInformation?.compensation?.salary?.message}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                    field.onChange(rawValue ? Number(rawValue) : '');
                  }}
                  sx={{ order: { xs: 1, sm: 0 } }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 'auto' }}>
            <FormControl
              variant="filled"
              fullWidth
              error={!!errors.jobInformation?.compensation?.interval}
              sx={{ minWidth: { sm: 165 } }}
            >
              <InputLabel id="interval-label">Interval</InputLabel>
              <Controller
                control={control}
                name="jobInformation.compensation.interval"
                render={({ field }) => (
                  <Select
                    labelId="interval-label"
                    label="Interval"
                    inputProps={{ 'aria-label': 'Without label' }}
                    {...field}
                  >
                    <MenuItem value="weekly">Per Week</MenuItem>
                    <MenuItem value="monthly">Per Month</MenuItem>
                    <MenuItem value="yearly">Per Year</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.jobInformation?.compensation?.interval?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>

      <Grid container size={12} rowSpacing={1}>
        <Grid size={12}>
          <Typography variant="caption" fontWeight={500}>
            Job Description
          </Typography>
        </Grid>

        <Grid size={12}>
          <FormControl variant="filled" fullWidth error={!!errors.jobInformation?.jobDescription}>
            <Controller
              name="jobInformation.jobDescription"
              control={control}
              render={({ field }) => (
                <Editor
                  onChange={field.onChange}
                  content={field.value}
                  isValid={!errors.jobInformation?.jobDescription}
                  sx={{
                    '& .tiptap': {
                      height: 110,
                      minHeight: '0 !important',
                    },
                  }}
                />
              )}
            />
            <FormHelperText>{errors.jobInformation?.jobDescription?.message}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JobInformation;
