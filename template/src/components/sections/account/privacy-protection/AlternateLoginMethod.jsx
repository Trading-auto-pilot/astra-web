import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Chip,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  listItemTextClasses,
} from '@mui/material';
import { initialConfig } from 'config';
import { useSnackbar } from 'notistack';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import PasswordTextField from 'components/common/PasswordTextField';
import AccountFormDialog from '../common/AccountFormDialog';

const QrCode = {
  img: `${initialConfig.assetsDir}/images/account/2.webp`,
  code: '3412 1234 6355 1234',
};

const regSecurityKeySchema = yup.object().shape({
  currentSecurityKey: yup.string().required('Current security key is required'),
  newSecurityKey: yup
    .string()
    .required('New security key is required')
    .min(4, 'Security key PIN must be at least 4 characters.'),
  confirmSecurityKey: yup
    .string()
    .oneOf([yup.ref('newSecurityKey')], 'Security keys must match')
    .required('Confirm security key is required'),
});

const AlternateLoginMethod = () => {
  const [open, setOpen] = useState(false);
  const methods = useForm({
    resolver: yupResolver(regSecurityKeySchema),
  });
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    formState: { errors },
  } = methods;

  const { up } = useBreakpoints();
  const upSm = up('sm');

  const onSubmit = (data) => {
    console.log(data);
    setOpen(false);
    enqueueSnackbar('Updated successfully!', { variant: 'success', autoHideDuration: 3000 });
  };

  return (
    <FormProvider {...methods}>
      <Stack spacing={1} alignItems="flex-start">
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Use an authenticator app
        </Typography>
        <Chip label="Recommended" color="success" variant="soft" />
      </Stack>
      <List
        sx={{
          [`& .${listItemTextClasses.primary}`]: {
            fontSize: 'body2.fontSize',
            color: 'text.secondary',
            display: 'list-item',
            listStyleType: 'decimal',
          },
        }}
      >
        <ListItem>
          <ListItemText
            primary={
              <>
                Download an authenticator app such as <Link href="#!">Microsoft Authenticator</Link>
              </>
            }
            slotProps={{ primary: { variant: 'body2' } }}
          />
        </ListItem>
        <ListItem>
          <ListItemText>
            <Stack direction="column" spacing={1}>
              <Typography variant="body2">Scan this QR Code or copy the key</Typography>
              <Stack spacing={{ xs: 3, sm: 5 }} alignItems="center" ml={-2.5}>
                <Image src={QrCode.img} width={90} height={90} alt="qr-code" />
                <Typography
                  variant={upSm ? 'h6' : 'subtitle1'}
                  sx={{ color: 'text.primary', fontWeight: 700 }}
                >
                  {QrCode.code}
                </Typography>
              </Stack>
            </Stack>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`
            Copy and enter 6 digit code from the app whenever you are trying to log in.
            `}
            slotProps={{ primary: { variant: 'body2' } }}
          />
        </ListItem>
      </List>
      <Stack direction="column" alignItems="flex-start">
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Use security key
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Use a physical security key to gain access to your account instantly.
        </Typography>
        <Button
          variant="soft"
          color="neutral"
          endIcon={<IconifyIcon icon="material-symbols:chevron-right" sx={{ fontSize: 20 }} />}
          onClick={() => setOpen(true)}
        >
          Register security key
        </Button>
      </Stack>
      <AccountFormDialog
        title="Security Key Setup"
        subtitle={
          <>
            <Typography
              component="span"
              variant="body2"
              sx={{ display: 'inline-block', mb: 2, textWrap: 'pretty' }}
            >
              This will allow abcd.com to see the make and model of your security key. abcd.com
              needs to create a secure credential on your key so you can sign in without typing your
              username.
            </Typography>
            <Typography component="span" variant="body2" sx={{ textWrap: 'pretty' }}>
              Enter your security key PIN to proceed securely.
            </Typography>
          </>
        }
        open={open}
        handleDialogClose={() => setOpen(false)}
        onSubmit={onSubmit}
        sx={{
          maxWidth: 463,
        }}
      >
        <Stack direction="column" spacing={1} px={0.125} pb={0.125}>
          <PasswordTextField
            placeholder="Current security key PIN"
            label="Current security key PIN"
            error={!!errors.currentSecurityKey}
            helperText={errors.currentSecurityKey?.message}
            {...register('currentSecurityKey')}
          />
          <PasswordTextField
            placeholder="New security key PIN"
            label="New security key PIN"
            error={!!errors.newSecurityKey}
            helperText={errors.newSecurityKey?.message}
            {...register('newSecurityKey')}
          />
          <PasswordTextField
            placeholder="Confirm security key PIN"
            label="Confirm security key PIN"
            error={!!errors.confirmSecurityKey}
            helperText={errors.confirmSecurityKey?.message}
            {...register('confirmSecurityKey')}
          />
        </Stack>
      </AccountFormDialog>
    </FormProvider>
  );
};

export default AlternateLoginMethod;
