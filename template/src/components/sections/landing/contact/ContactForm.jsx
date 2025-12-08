import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import StyledTextField from 'components/styled/StyledTextField';
import RevealText from '../common/RevealText';
import SectionHeader from '../common/SectionHeader';

const contactFormSchema = yup.object({
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  email: yup.string().email('Email must be a valid email.').required('Email is required.'),
  phone: yup.string().required('Phone number is required.'),
  company: yup.string().required('Company is required.'),
  purpose: yup.string().required('Purpose is required.'),
  policyChecked: yup
    .boolean()
    .oneOf([true], 'You must accept the privacy policy.')
    .required('Policy is required.'),
});

const ContactForm = () => {
  const methods = useForm({
    resolver: yupResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      purpose: '',
      policyChecked: false,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler = (data) => {
    console.log(data);
  };

  return (
    <Stack direction="column">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <SectionHeader title="CONTACT" subtitle="Get in touch" sx={{ mb: 2 }} />

        <RevealText>
          <Typography variant="body2" color="textSecondary">
            Reach out to us anytime! We're here to help with your inquiries{' '}
            <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
              and support
            </Box>
            .
          </Typography>
        </RevealText>
      </Box>

      <FormProvider {...methods}>
        <Stack direction="column" component="form" onSubmit={handleSubmit(onSubmitHandler)}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
            Personal Information
          </Typography>

          <Grid container spacing={1} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StyledTextField
                type="text"
                fullWidth
                variant="filled"
                size="large"
                placeholder="First Name"
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                slotProps={{
                  input: {
                    sx: {
                      '& .MuiInputBase-input': {
                        color: 'text.secondary',
                        padding: '9px 16px !important',
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StyledTextField
                type="text"
                fullWidth
                variant="filled"
                size="large"
                placeholder="Last Name"
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                slotProps={{
                  input: {
                    sx: {
                      '& .MuiInputBase-input': {
                        color: 'text.secondary',
                        padding: '9px 16px !important',
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <StyledTextField
                type="email"
                fullWidth
                variant="filled"
                size="large"
                placeholder="Email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                slotProps={{
                  input: {
                    sx: {
                      '& .MuiInputBase-input': {
                        color: 'text.secondary',
                        padding: '9px 16px !important',
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <StyledTextField
                type="text"
                fullWidth
                variant="filled"
                size="large"
                placeholder="Phone"
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                slotProps={{
                  input: {
                    sx: {
                      '& .MuiInputBase-input': {
                        color: 'text.secondary',
                        padding: '9px 16px !important',
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <StyledTextField
                type="text"
                fullWidth
                size="large"
                placeholder="Company"
                variant="filled"
                {...register('company')}
                error={!!errors.company}
                helperText={errors.company?.message}
                slotProps={{
                  input: {
                    sx: {
                      '& .MuiInputBase-input': {
                        color: 'text.secondary',
                        padding: '9px 16px !important',
                      },
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
            Purposes
          </Typography>

          <Box sx={{ mb: 3 }}>
            <StyledTextField
              type="text"
              fullWidth
              size="large"
              placeholder="Message"
              variant="filled"
              {...register('purpose')}
              error={!!errors.purpose}
              helperText={errors.purpose?.message}
              slotProps={{
                input: {
                  sx: {
                    '& .MuiInputBase-input': {
                      color: 'text.secondary',
                      padding: '9px 16px !important',
                    },
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <FormControl error={!!errors.policyChecked}>
              <FormControlLabel
                control={<Switch {...register('policyChecked')} />}
                label={
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    By selecting this, you agree to our{' '}
                    <Link href="#!" sx={{ fontWeight: 500 }}>
                      privacy policy.
                    </Link>
                  </Typography>
                }
                sx={{ gap: 1, marginLeft: 0 }}
              />
              {errors.policyChecked && (
                <FormHelperText error sx={{ mx: 1 }}>
                  {errors.policyChecked.message}
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          <Button type="submit" variant="soft" color="primary" sx={{ width: 220 }}>
            Send message
          </Button>
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default ContactForm;
