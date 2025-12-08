import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { TabPanel } from '@mui/lab';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import NewTeamTable from 'components/sections/kanban/create-board/steps/TeamInvite/NewTeamTable';
import StyledTextField from 'components/styled/StyledTextField';

export const newTeamFormSchema = yup.object().shape({
  team: yup.array().of(
    yup.object().shape({
      name: yup.string(),
      email: yup.string().email('Invalid email format'),
      role: yup
        .string()
        .oneOf(['Member', 'Admin', 'Guest'], 'Invalid role')
        .required('Role is required'),
    }),
  ),
});

const NewTeamTabPanel = ({ value, options }) => {
  const {
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'team',
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [customEmail, setCustomEmail] = useState(null);

  const handleAddRow = () => {
    const emailToUse = selectedUser?.email || customEmail;

    if (!emailToUse) {
      setError('root', { type: 'custom', message: 'Please provide a valid email address.' });

      return;
    }

    if (!yup.string().email().isValidSync(emailToUse)) {
      setError('root', { type: 'custom', message: 'Invalid email format.' });

      return;
    }

    const isDuplicate = fields.some((member) => member.email === emailToUse);

    if (isDuplicate) {
      setError('root', { type: 'custom', message: 'This user is already added to the team.' });

      return;
    }

    append({
      name: selectedUser?.name || '',
      email: emailToUse,
      avatar: selectedUser?.avatar || '',
      role: 'Guest',
    });

    setSelectedUser(null);
    setCustomEmail('');
  };

  return (
    <TabPanel value={value} sx={{ px: 0, pb: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Stack spacing={1}>
          <Autocomplete
            id="user-select"
            freeSolo
            options={options}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.email || '')}
            value={selectedUser}
            inputValue={customEmail || ''}
            onInputChange={(_, inputValue) => {
              clearErrors('root');
              setCustomEmail(inputValue);
            }}
            onChange={(_, value) => {
              if (typeof value !== 'string') {
                setSelectedUser(value);
                setCustomEmail('');
              } else {
                setSelectedUser(null);
                setCustomEmail(value);
              }
            }}
            renderOption={(props, option) => {
              const { key, ...rest } = props;

              return (
                <Box component="li" {...rest} key={key}>
                  <Avatar src={option.avatar} sx={{ mr: 1 }} />
                  <div>
                    <Typography variant="subtitle1">{option.name || 'Unknown User'}</Typography>
                    <Typography variant="caption">{option.email}</Typography>
                  </div>
                </Box>
              );
            }}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                placeholder="User ID or Email address"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0 }}>
                        <IconifyIcon
                          icon="material-symbols:account-circle"
                          sx={{ color: 'text.secondary' }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
            sx={{ flexGrow: 1 }}
          />

          <Button
            variant="contained"
            color="neutral"
            onClick={handleAddRow}
            disabled={!selectedUser && !customEmail}
            sx={{ px: { xs: 3.5, md: 5.5 } }}
          >
            Add
          </Button>
        </Stack>
        {errors.root && <FormHelperText error>{errors.root?.message}</FormHelperText>}
      </Box>

      <NewTeamTable fields={fields} remove={remove} />
    </TabPanel>
  );
};

export default NewTeamTabPanel;
