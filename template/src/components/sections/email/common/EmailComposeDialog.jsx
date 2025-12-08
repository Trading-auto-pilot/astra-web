import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Autocomplete,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
  dialogClasses,
} from '@mui/material';
import { defaultEmails } from 'data/email';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import EmailComposeEditor from './EmailComposeEditor';

const emailComposeSchema = yup.object().shape({
  to: yup.string().email('Must be a valid email!').required('This field is required!'),
  cc: yup.array().of(yup.string().email().required()).optional(),
  bcc: yup.array().of(yup.string().email().required()).optional(),
  subject: yup.string().optional(),
  body: yup.string().optional(),
});

const EmailComposeDialog = ({ open, handleClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(emailComposeSchema),
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
      hideBackdrop={!isExpanded}
      disableEnforceFocus
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit(submitHandler),
          sx: (theme) => ({
            position: isExpanded ? 'absolute' : 'sticky',
            bottom: isExpanded ? 'unset' : theme.mixins.footer.sm + 32,
            borderRadius: 6,
            pointerEvents: 'auto',
            margin: { xs: 2, sm: 4 },
            mx: isExpanded ? 'auto !important' : undefined,
            maxWidth: isExpanded ? 800 : 746,
            width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' },
            boxShadow: theme.vars.shadows[5],
            height: 'max-content',
            ...theme.applyStyles('light', {
              outline: 0,
            }),
          }),
        },
      }}
      sx={{
        pointerEvents: isExpanded ? 'auto' : 'none',
        overflow: 'scroll',
        [`& .${dialogClasses.container}`]: {
          justifyContent: isExpanded ? 'center' : 'flex-end',
          alignItems: isExpanded ? 'center' : 'flex-end',
        },
      }}
      open={open}
    >
      <DialogContent sx={{ p: 3 }}>
        <Stack sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 400 }}>
            New message
          </Typography>
          <IconButton
            size="small"
            sx={{ p: 1, ml: 'auto' }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <IconifyIcon
              icon={
                isExpanded
                  ? 'material-symbols:close-fullscreen-rounded'
                  : 'material-symbols:open-in-full-rounded'
              }
              sx={{ fontSize: 20, color: 'text.primary' }}
            />
          </IconButton>
          <IconButton size="small" sx={{ p: 1 }} onClick={handleClose}>
            <IconifyIcon
              icon="material-symbols:close-rounded"
              sx={{ fontSize: 20, color: 'text.primary' }}
            />
          </IconButton>
        </Stack>
        <Controller
          name="to"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Autocomplete
              aria-labelledby="to-autocomplete-label"
              {...field}
              freeSolo
              options={defaultEmails}
              onChange={(_, newValue) => {
                field.onChange(newValue);
              }}
              onInputChange={(_, newValue) => {
                field.onChange(newValue);
              }}
              value={field.value || ''}
              renderInput={(params) => <TextField {...params} error={!!errors.to} label="To" />}
              sx={{ mb: 2 }}
            />
          )}
        />
        <Controller
          name="cc"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Autocomplete
              aria-labelledby="cc-autocomplete-label"
              {...field}
              multiple
              freeSolo
              options={defaultEmails}
              onChange={(_, newValue) => field.onChange(newValue)}
              value={field.value}
              renderInput={(params) => <TextField {...params} error={!!errors.cc} label="CC" />}
              sx={{ mb: 1 }}
            />
          )}
        />
        <Controller
          name="bcc"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Autocomplete
              aria-labelledby="bcc-autocomplete-label"
              {...field}
              disablePortal
              multiple
              freeSolo
              options={defaultEmails}
              onChange={(_, newValue) => field.onChange(newValue)}
              value={field.value}
              renderInput={(params) => <TextField {...params} error={!!errors.bcc} label="BCC" />}
            />
          )}
        />
        <TextField
          id="subject"
          label="Subject"
          variant="filled"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
          {...register('subject')}
        />

        <Controller
          name="body"
          control={control}
          render={({ field }) => (
            <EmailComposeEditor
              onChange={field.onChange}
              content={field.value}
              isValid={!errors.body}
            />
          )}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmailComposeDialog;
