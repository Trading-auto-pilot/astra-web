import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FilledInput, FormHelperText, InputAdornment, inputBaseClasses } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { companies } from 'data/crm/deals';
import { users } from 'data/users';
import dayjs from 'dayjs';
import { useDealsContext } from 'providers/DealsProvider';
import { ADD_NEW_DEAL, SET_CREATE_DEAL_DIALOG } from 'reducers/DealsReducer';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';

const validationSchema = yup.object().shape({
  name: yup.string().required('Deal name is required'),
  stage: yup.string().required('Stage is required'),
  amount: yup.number().typeError('Amount must be a number').required('Amount is required'),
  lastUpdate: yup.string().required('Last update is required'),
  createDate: yup.string().required('Create date is required'),
  closeDate: yup.string().required('Close date is required'),
  owner: yup.object().required('Owner is required'),
  client: yup.object().required('Client is required'),
  priority: yup.string().required('Priority is required'),
  company: yup.object().required('Company is required'),
  collaborators: yup.array().of(yup.object()).optional(),
});

const CreateDealDialog = () => {
  const { listItems, createDealDialog, dealsDispatch } = useDealsContext();
  const listTitle = listItems.find((list) => list.id === createDealDialog.listId)?.title;

  const initialData = useMemo(
    () => ({
      name: '',
      description: '',
      pipeline: '',
      stage: listTitle ?? '',
      amount: 0,
      client: {
        name: 'Tsamina Mina',
        phone: '+81-90-1234-5678',
        email: 'mina@xyz.com',
        videoChat: 'https://zoom.us/j/123456789',
        address: 'Shibuya, Tokyo, Japan',
        link: '#!',
      },
      createDate: dayjs().toString(),
      lastUpdate: dayjs().toString(),
      closeDate: dayjs().toString(),
      priority: '',
      progress: 0,
    }),
    [listTitle],
  );

  const methods = useForm({
    defaultValues: initialData,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, control, reset } = methods;

  useEffect(() => {
    reset(initialData);
  }, [createDealDialog, methods]);

  const onSubmit = (data) => {
    console.log(data);
    dealsDispatch({ type: ADD_NEW_DEAL, payload: { listName: data.stage, deal: data } });
    dealsDispatch({ type: SET_CREATE_DEAL_DIALOG, payload: { isOpen: false } });
    reset();
  };

  const handleDiscardChanges = () => {
    dealsDispatch({ type: SET_CREATE_DEAL_DIALOG, payload: { isOpen: false } });
    reset();
  };

  return (
    <Dialog
      open={createDealDialog.isOpen}
      onClose={() => dealsDispatch({ type: SET_CREATE_DEAL_DIALOG, payload: { isOpen: false } })}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        [`& .${dialogClasses.paper}`]: {
          p: 0,
          borderRadius: 6,
          width: 1,
          maxWidth: 600,
        },
      }}
    >
      <Stack
        sx={{
          p: 3,
          pb: 2,
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <DialogTitle id="dialog-title" sx={{ p: 0, typography: 'h6' }}>
          Create Deal
        </DialogTitle>
        <Button
          shape="square"
          variant="text"
          size="small"
          color="neutral"
          onClick={() =>
            dealsDispatch({ type: SET_CREATE_DEAL_DIALOG, payload: { isOpen: false } })
          }
        >
          <IconifyIcon
            icon="material-symbols:close-rounded"
            sx={{ color: 'text.primary', fontSize: 20 }}
          />
        </Button>
      </Stack>

      <DialogContent sx={{ px: 3, py: 1 }}>
        <Grid container spacing={1}>
          <Grid size={12}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id="deal-name"
                  label="Deal name"
                  variant="filled"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          <Grid size={12} sx={{ mb: 1 }}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="deal-description"
                  label="Deal description"
                  variant="filled"
                  size="small"
                  rows={3}
                  multiline
                  fullWidth
                  sx={{ [`& .${inputBaseClasses.root}`]: { borderRadius: 2 } }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 1 }}>
            <Controller
              name="pipeline"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Pipeline</InputLabel>
                  <Select {...field} label="Pipeline">
                    <MenuItem value="Sales Pipeline">Sales Pipeline</MenuItem>
                    <MenuItem value="Marketing Pipeline">Marketing Pipeline</MenuItem>
                    <MenuItem value="Development Pipeline">Development Pipeline</MenuItem>
                    <MenuItem value="Support Pipeline">Support Pipeline</MenuItem>
                    <MenuItem value="Operations Pipeline">Operations Pipeline</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 1 }}>
            <Controller
              name="stage"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <InputLabel id="stage-select-label" error={!!fieldState.error}>
                    Stage
                  </InputLabel>
                  <Select {...field} error={!!fieldState.error} label="stage">
                    {listItems.map((list) => (
                      <MenuItem key={list.id} value={list.title}>
                        {list.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 1 }}>
            <Controller
              name="amount"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl variant="filled" fullWidth>
                  <InputLabel htmlFor="deal-amount" error={!!fieldState.error}>
                    Amount
                  </InputLabel>
                  <FilledInput
                    {...field}
                    id="deal-amount"
                    error={!!fieldState.error}
                    type="number"
                    startAdornment={
                      <InputAdornment position="start">
                        <IconifyIcon
                          icon="material-symbols:attach-money-rounded"
                          color="text.secondary"
                        />
                      </InputAdornment>
                    }
                  />
                  <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={6} sx={{ mb: 1, display: { xs: 'none', sm: 'flex' } }} />

          <Grid size={6} sx={{ mb: 1 }}>
            <Controller
              name="createDate"
              control={control}
              render={({ field: { onChange } }) => (
                <DatePicker
                  label="Create Date"
                  format="DD MMM, YYYY"
                  defaultValue={dayjs()}
                  onChange={(date) => {
                    onChange(date);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                    inputAdornment: {
                      position: 'start',
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={6} sx={{ mb: 1 }}>
            <Controller
              name="closeDate"
              control={control}
              render={({ field: { onChange } }) => (
                <DatePicker
                  label="Close Date"
                  format="DD MMM, YYYY"
                  defaultValue={dayjs()}
                  onChange={(date) => {
                    onChange(date);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                    inputAdornment: {
                      position: 'start',
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 1 }}>
            <Controller
              name="owner"
              control={control}
              render={({ field: { value, onChange }, fieldState }) => (
                <FormControl fullWidth>
                  <InputLabel id="deal-owner-label" error={!!fieldState.error}>
                    Deal owner
                  </InputLabel>
                  <Select
                    value={value?.name || ''}
                    error={!!fieldState.error}
                    onChange={(event) => {
                      const selectedUser = users.find((user) => user.name === event.target.value);
                      onChange(selectedUser);
                    }}
                    label="deal-owner"
                  >
                    {users.slice(0, 10).map((user) => (
                      <MenuItem key={user.id} value={user.name}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 4 }}>
            <Controller
              name="priority"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <InputLabel id="priority-select-label" error={!!fieldState.error}>
                    Priority
                  </InputLabel>
                  <Select {...field} error={!!fieldState.error} label="priority">
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                  <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="company"
              control={control}
              render={({ field: { value, onChange }, fieldState }) => (
                <FormControl fullWidth>
                  <InputLabel id="company-label" error={!!fieldState.error}>
                    Associate deal with
                  </InputLabel>
                  <Select
                    label="company"
                    value={value?.name || ''}
                    error={!!fieldState.error}
                    onChange={(event) => {
                      const company = companies.find((item) => item.name === event.target.value);
                      onChange(company);
                    }}
                  >
                    {companies.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="collaborators"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  id="users-autocomplete"
                  options={users}
                  getOptionLabel={(option) => option.name}
                  popupIcon={null}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  clearIcon={null}
                  sx={{ width: 1 }}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderTags={(selectedOptions, getTagProps) =>
                    selectedOptions.map((option, index) => (
                      <Chip
                        label={option.name}
                        avatar={<Avatar src={option.avatar} />}
                        {...getTagProps({ index })}
                        key={option.id}
                      />
                    ))
                  }
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;

                    return (
                      <Stack
                        gap={1}
                        key={key}
                        component="li"
                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                        {...optionProps}
                      >
                        <Avatar src={option.avatar} sx={{ width: 24, height: 24 }} />
                        <Typography sx={{ lineClamp: 1 }}>{option.name}</Typography>
                      </Stack>
                    );
                  }}
                  renderInput={(params) => <TextField {...params} label="Collaborators" />}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          position: 'sticky',
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <Button variant="soft" color="neutral" onClick={handleDiscardChanges}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" autoFocus>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDealDialog;
