import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';

export const hiringTeamSchema = yup.object({
  hiringManager: yup.object({
    employee: yup.string().required(),
    department: yup.string().required(),
  }),
  teamMember: yup.array().of(
    yup.object({
      employee: yup.string().required(),
      department: yup.string().required(),
    }),
  ),
});

const HiringTeam = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const teamMembers = useFieldArray({
    control,
    name: 'teamMember',
  });

  return (
    <Stack direction="column" gap={3}>
      <Stack direction="column" gap={2}>
        <Typography fontWeight={600}>Hiring Manager</Typography>
        <Stack gap={1}>
          <FormControl variant="filled" fullWidth error={!!errors.hiringManager?.employee}>
            <InputLabel id="hiring-manager-employee-label">Employee</InputLabel>
            <Controller
              control={control}
              name="hiringManager.employee"
              render={({ field }) => (
                <Select
                  labelId="hiring-manager-employee-label"
                  label="Employee"
                  inputProps={{ 'aria-label': 'Without label' }}
                  {...field}
                >
                  <MenuItem value="Michael Hall">Michael Hall</MenuItem>
                  <MenuItem value="Jack Smith">Jack Smith</MenuItem>
                  <MenuItem value="Grace Wong">Grace Wong</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.hiringManager?.employee?.message}</FormHelperText>
          </FormControl>
          <FormControl variant="filled" fullWidth error={!!errors.hiringManager?.department}>
            <InputLabel id="hiring-manager-department-label">Department</InputLabel>
            <Controller
              control={control}
              name="hiringManager.department"
              render={({ field }) => (
                <Select
                  labelId="hiring-manager-department-label"
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
            <FormHelperText>{errors.hiringManager?.department?.message}</FormHelperText>
          </FormControl>
        </Stack>
      </Stack>
      <Stack direction="column" gap={2}>
        <Typography fontWeight={600}>Team Member</Typography>
        {teamMembers.fields.map((field, index) => (
          <Stack key={field.id} gap={1} alignItems="center">
            <Stack gap={1} width={1} alignItems="center">
              <FormControl
                variant="filled"
                fullWidth
                error={!!errors.teamMember?.[index]?.employee}
              >
                <InputLabel id="team-member-employee-label">Employee</InputLabel>
                <Controller
                  control={control}
                  name={`teamMember.${index}.employee`}
                  render={({ field }) => (
                    <Select
                      labelId="team-member-employee-label"
                      label="Employee"
                      inputProps={{ 'aria-label': 'Without label' }}
                      {...field}
                    >
                      <MenuItem value="Michael Hall">Michael Hall</MenuItem>
                      <MenuItem value="Jack Smith">Jack Smith</MenuItem>
                      <MenuItem value="Grace Wong">Grace Wong</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>{errors.teamMember?.[index]?.employee?.message}</FormHelperText>
              </FormControl>
              <FormControl
                variant="filled"
                fullWidth
                error={!!errors.teamMember?.[index]?.department}
              >
                <InputLabel id="team-member-department-label">Department</InputLabel>
                <Controller
                  control={control}
                  name={`teamMember.${index}.department`}
                  render={({ field }) => (
                    <Select
                      labelId="team-member-department-label"
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
                <FormHelperText>{errors.teamMember?.[index]?.department?.message}</FormHelperText>
              </FormControl>
            </Stack>

            <Button shape="square" color="error" onClick={() => teamMembers.remove(index)}>
              <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
            </Button>
          </Stack>
        ))}
        <Button
          startIcon={<IconifyIcon icon="material-symbols:add" sx={{ fontSize: 20 }} />}
          onClick={() => teamMembers.append({ employee: '', department: '' })}
          sx={{ alignSelf: 'flex-start' }}
        >
          Add Member
        </Button>
      </Stack>
    </Stack>
  );
};

export default HiringTeam;
