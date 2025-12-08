import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import { stepLabelClasses } from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import ApplicationDetails from './steps/ApplicationDetails';
import HiringTeam from './steps/HiringTeam';
import JobBoard from './steps/JobBoard';
import JobInformation from './steps/JobInformation';
import JobPipeline from './steps/JobPipeline';
import useNewOpeningForm from './useNewOpeningForm';

const steps = [
  {
    label: 'Job Information',
    subtitle: 'Please fill out all the required fields to continue',
    content: <JobInformation />,
  },
  {
    label: 'Application Details',
    subtitle: 'Please ensure all required fields are selected and completed before proceeding.',
    content: <ApplicationDetails />,
  },
  {
    label: 'Job Pipeline',
    subtitle: 'Ensure all required steps in the job pipeline are set before proceeding.',
    content: <JobPipeline />,
  },
  {
    label: 'Hiring Team',
    subtitle: 'Ensure all required steps in the job pipeline are set before proceeding.',
    content: <HiringTeam />,
  },
  {
    label: 'Job Board',
    subtitle: 'Select the job boards where you want to post before saving',
    content: <JobBoard />,
  },
];

const NewOpeningStepper = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const methods = useNewOpeningForm(activeStep);

  const { handleSubmit, trigger, watch } = methods;

  const data = watch();

  const handleNextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);

  const handlePreviousStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const onSubmit = handleSubmit((data) => {
    console.log({ data, activeStep });
    enqueueSnackbar('Job posted successfully', { variant: 'success', autoHideDuration: 3000 });
    navigate(paths.hiringJobOpening);
  });

  const handleProceed = async () => {
    const isValid = await trigger();
    console.log({ data, isValid, activeStep });

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
      <Box component="form" id="newOpeningForm" noValidate onSubmit={onSubmit}>
        <Stepper
          activeStep={activeStep}
          nonLinear
          connector={<Divider />}
          orientation="vertical"
          sx={{ gap: 4 }}
        >
          {steps.map((step, index) => {
            const isLastStep = activeStep === steps.length - 1;

            return (
              <Step key={step.label} completed={completedSteps[index]}>
                <StepButton
                  onClick={() => setActiveStep(index)}
                  sx={{
                    py: 0,
                    [`& .${stepLabelClasses.iconContainer}`]: {
                      pr: 2,
                      py: 0.5,
                      alignSelf: 'flex-start',
                    },
                  }}
                >
                  <Typography variant="h6" lineHeight={1.5}>
                    {step.label}
                  </Typography>
                </StepButton>
                <StepContent sx={{ border: 'none', m: 0, pl: { xs: 0, sm: 5 }, pr: 0 }}>
                  <Typography variant="body2" color="info">
                    {step.subtitle}
                  </Typography>
                  <Box
                    sx={{
                      my: 3,
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
                        justifyContent: 'flex-end',
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
                      >
                        Previous
                      </Button>
                    )}
                    {!isLastStep ? (
                      <Button
                        type="button"
                        variant="soft"
                        onClick={(e) => {
                          e.preventDefault();
                          handleProceed();
                        }}
                        endIcon={<IconifyIcon icon="material-symbols:chevron-right-rounded" />}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        form="newOpeningForm"
                        type="submit"
                        variant="contained"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Save
                      </Button>
                    )}
                  </Stack>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </FormProvider>
  );
};

export default NewOpeningStepper;
