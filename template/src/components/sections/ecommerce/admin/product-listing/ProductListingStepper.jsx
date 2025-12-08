import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography,
  stepLabelClasses,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import Inventory from './steps/Inventory';
import MediaFiles from './steps/MediaFiles';
import NameDescription from './steps/NameDescription';
import PricingQuantity from './steps/PricingQuantity';
import Shipping from './steps/Shipping';
import Tags from './steps/Tags';
import ProductInfo from './steps/product-information/ProductInfo';
import Variations from './steps/variations/ProductVariants';
import VitalInfo from './steps/vital-info/VitalInfo';
import useProductListingForm from './useProductListingForm';

const steps = [
  {
    label: 'Vital info',
    content: <VitalInfo />,
  },
  {
    label: 'Name and description',
    content: <NameDescription />,
  },
  {
    label: 'Product information',
    content: <ProductInfo />,
  },
  {
    label: 'Images and videos',
    content: <MediaFiles />,
  },
  {
    label: 'Variations',
    content: <Variations />,
  },
  {
    label: 'Pricing and quantity',
    content: <PricingQuantity />,
  },
  {
    label: 'Inventory',
    content: <Inventory />,
  },
  {
    label: 'Shipping',
    content: <Shipping />,
  },
  {
    label: 'Tag',
    content: <Tags />,
  },
];

const ProductListingStepper = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const methods = useProductListingForm(activeStep);

  const { handleSubmit, trigger, watch } = methods;

  const data = watch();

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = (data) => {
    console.log({ data });
    enqueueSnackbar('Product added successfully', { variant: 'success' });
    navigate(paths.adminProductList);
  };

  const handleProceed = async () => {
    const isValid = await trigger();
    console.log({ data });

    if (isValid) {
      setCompletedSteps((prevCompletedSteps) => {
        const newCompleted = [...prevCompletedSteps];
        newCompleted[activeStep] = true;

        return newCompleted;
      });
      handleNextStep();
    }
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" id="productListingForm" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stepper activeStep={activeStep} nonLinear connector={<Divider />} orientation="vertical">
          {steps.map((step, index) => {
            const isLastStep = activeStep === steps.length - 1;

            return (
              <Step key={step.label} completed={completedSteps[index]}>
                <Container maxWidth="md" sx={{ p: { xs: 3, md: 5 } }}>
                  <StepButton
                    onClick={() => setActiveStep(index)}
                    sx={{
                      py: 0,
                      [`& .${stepLabelClasses.iconContainer}`]: {
                        pr: 2,
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {step.label}
                    </Typography>
                  </StepButton>
                  <StepContent sx={{ border: 'none', m: 0, pl: { xs: 0, sm: 5 }, pr: 0 }}>
                    <Box
                      sx={{
                        my: { xs: 3, md: 5 },
                      }}
                    >
                      {step.content}
                    </Box>

                    <Stack
                      sx={[
                        {
                          rowGap: 5,
                          columnGap: 1,
                          width: 1,
                          justifyContent: isLastStep ? 'space-between' : 'flex-start',
                        },
                        isLastStep && { flexDirection: { xs: 'column', sm: 'row' } },
                      ]}
                    >
                      {activeStep !== 0 && (
                        <Button
                          type="button"
                          variant="soft"
                          color="neutral"
                          sx={{ alignSelf: 'flex-start' }}
                          onClick={handlePreviousStep}
                          startIcon={<IconifyIcon icon="material-symbols:chevron-left-rounded" />}
                        >
                          Previous
                        </Button>
                      )}
                      {!isLastStep ? (
                        <Button
                          type="button"
                          variant="soft"
                          color="neutral"
                          onClick={handleProceed}
                          endIcon={<IconifyIcon icon="material-symbols:chevron-right-rounded" />}
                        >
                          Finish and proceed
                        </Button>
                      ) : (
                        <Stack
                          sx={{
                            rowGap: 5,
                            columnGap: 1,
                            width: { xs: 1, sm: 'unset' },
                          }}
                        >
                          <Button
                            type="button"
                            fullWidth
                            variant="soft"
                            color="primary"
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            Archive product
                          </Button>
                          <Button
                            form="productListingForm"
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            Publish product
                          </Button>
                        </Stack>
                      )}
                    </Stack>
                  </StepContent>
                </Container>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </FormProvider>
  );
};

export default ProductListingStepper;
