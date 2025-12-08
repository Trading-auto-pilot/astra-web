import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Divider,
  Link,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  stepLabelClasses,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import RenderStepData from './RenderStepData';
import CustomerInfo, { customerInfoFormSchema } from './steps/CustomerInfo';
import DeliveryOptions, { deliveryOptionFormSchema } from './steps/DeliveryOptions';
import ShippingAddress, { shippingAddressFormSchema } from './steps/ShippingAddress';

const steps = [
  {
    label: 'Customer information',
    content: <CustomerInfo />,
  },
  {
    label: 'Shipping address',
    content: <ShippingAddress />,
  },
  {
    label: 'Delivery options',
    content: <DeliveryOptions />,
  },
];

const checkoutFormSchema = [
  customerInfoFormSchema,
  shippingAddressFormSchema,
  deliveryOptionFormSchema,
  null,
];

const CheckoutStepper = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const methods = useForm({
    //@ts-ignore
    resolver: checkoutFormSchema[activeStep]
      ? //@ts-ignore
        yupResolver(checkoutFormSchema[activeStep])
      : undefined,
    defaultValues: {
      customer: {
        email: 'anyname@email.com',
        firstName: 'Captain',
        lastName: 'Haddock',
        phoneNumber: '12514463453',
      },
      shippingAddress: {
        street: 'Apt: 6/B, 192 Edsel Road',
        townCity: 'Van Nuys',
        postcode: '96580',
        country: 'USA',
        state: 'California',
      },
    },
  });

  const { handleSubmit, trigger, watch } = methods;

  const data = watch();

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleStepEdit = (step) => {
    setActiveStep(step);
  };

  const onSubmit = (data) => {
    console.log({ data });

    methods.reset();
    enqueueSnackbar('Checkout successful!', {
      variant: 'success',
    });
    navigate(paths.payment);
  };

  const handleProceed = async () => {
    const isValid = await trigger();

    if (isValid) {
      setCompletedSteps((prevCompletedSteps) => {
        const newCompleted = [...prevCompletedSteps];
        newCompleted[activeStep] = true;

        return newCompleted;
      });
      handleNextStep();
    }
  };

  const renderStepData = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <RenderStepData
            stepData={[
              { label: 'Email address', value: data.customer.email },
              { label: 'First name', value: data.customer.firstName },
              { label: 'Last name', value: data.customer.lastName },
              { label: 'Phone Number', value: data.customer.phoneNumber },
            ]}
          />
        );

      case 1:
        return (
          <RenderStepData
            stepData={[
              { label: 'Street address', value: data.shippingAddress.street },
              { label: 'Town/City', value: data.shippingAddress.townCity },
              { label: 'Postcode', value: data.shippingAddress.postcode },
              { label: 'Country', value: data.shippingAddress.country },
              { label: 'State', value: data.shippingAddress.state },
            ]}
          />
        );
      case 2:
        return (
          <RenderStepData stepData={[{ label: 'Delivery Option', value: data.deliveryOption }]} />
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" id="checkoutForm" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stepper
          nonLinear
          activeStep={activeStep}
          connector={<Divider sx={{ my: 4 }} />}
          orientation="vertical"
        >
          {steps.map((step, index) => {
            const isLastStep = activeStep === steps.length - 1;

            return (
              <Step key={step.label} completed={completedSteps[index]}>
                <StepLabel
                  sx={{
                    py: 0,
                    [`& .${stepLabelClasses.iconContainer}`]: {
                      pr: 2,
                    },
                  }}
                >
                  <Stack
                    sx={{
                      gap: 1,
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        lineHeight: 1.4,
                      }}
                    >
                      {step.label}
                    </Typography>
                    {activeStep !== index && completedSteps[index] && (
                      <Button variant="text" size="small" onClick={() => handleStepEdit(index)}>
                        Edit
                      </Button>
                    )}
                  </Stack>
                </StepLabel>
                <StepContent sx={{ border: 'none', m: 0, pl: 5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'info.main',
                      mt: 1,
                    }}
                  >
                    Please fill out all the required fields to continue
                  </Typography>

                  {step.content}

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.disabled',
                    }}
                  >
                    <Link href={paths.defaultJwtLogin}>Login</Link> or{' '}
                    <Link href={paths.defaultJwtSignup}>Signup</Link> to save your information
                  </Typography>
                  {!isLastStep && (
                    <Box
                      sx={{
                        textAlign: 'right',
                        mt: 4,
                      }}
                    >
                      <Button
                        type="button"
                        variant="soft"
                        color="primary"
                        endIcon={
                          <IconifyIcon
                            icon="material-symbols:chevron-right-rounded"
                            fontSize="20px !important"
                          />
                        }
                        onClick={handleProceed}
                      >
                        Continue
                      </Button>
                    </Box>
                  )}
                </StepContent>
                {activeStep !== index && completedSteps[index] && renderStepData(index)}
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </FormProvider>
  );
};

export default CheckoutStepper;
