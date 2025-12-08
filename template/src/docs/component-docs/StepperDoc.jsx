import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { kebabCase } from 'lib/utils';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const horizontalLinearStepperCode = `const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const HorizontalLinearStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Stack sx={{ pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Stack>
        </Fragment>
      ) : (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Stack sx={{ pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Stack>
        </Fragment>
      )}
    </Box>
  );
}
render(<HorizontalLinearStepper />)`;

const horizontalNonLinearStepperCode = `const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const HorizontalNonLinearStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Stack sx={{ pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Stack>
          </Fragment>
        ) : (
          <Fragment>
            <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              Step {activeStep + 1}
            </Typography>
            <Stack sx={{ pt: 2, alignItems: 'center' }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))}
            </Stack>
          </Fragment>
        )}
      </div>
    </Box>
  );
}
render(<HorizontalNonLinearStepper />)`;

const alternativeLabelStepperCode = `<Box sx={{ width: '100%', overflowX: 'auto' }}>
  <Stepper activeStep={1} alternativeLabel>
    <Step>
      <StepLabel>Select master blaster campaign settings</StepLabel>
    </Step>
    <Step>
      <StepLabel>Create an ad group</StepLabel>
    </Step>
    <Step>
      <StepLabel>Create an ad</StepLabel>
    </Step>
  </Stepper>
</Box>`;

const errorStepCode = `const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const HorizontalStepperWithError = () => {
  const isStepFailed = (step) => {
    return step === 1;
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Stepper activeStep={1}>
        {steps.map((label, index) => {
          const labelProps = {};
          if (isStepFailed(index)) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                Alert message
              </Typography>
            );

            labelProps.error = true;
          }

          return (
            <Step key={label}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
render(<HorizontalStepperWithError />)`;

const verticalStepperCode = `const steps = [
  {
    label: 'Select campaign settings',
    description: \`For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.\`,
  },
  {
    label: 'Create an ad group',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Create an ad',
    description: \`Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.\`,
  },
];

const VerticalLinearStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    variant="soft"
                    color="neutral"
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
render(<VerticalLinearStepper />)`;

const textMobileStepperCode = `const steps = [
  {
    label: 'Select campaign settings',
    description: \`For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.\`,
  },
  {
    label: 'Create an ad group',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Create an ad',
    description: \`Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.\`,
  },
];

const TextMobileStepper = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{steps[activeStep].label}</Typography>
      </Paper>
      <Box 
        sx={{
          height: 255,
          maxWidth: 400,
          width: 1,
          p: 2
        }}
      >
        {steps[activeStep].description}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === 'rtl' ? (
              <IconifyIcon icon="material-symbols:keyboard-arrow-left" sx={{ fontSize: 24 }} />
            ) : (
              <IconifyIcon icon="material-symbols:keyboard-arrow-right" sx={{ fontSize: 24 }} />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <IconifyIcon icon="material-symbols:keyboard-arrow-right" sx={{ fontSize: 24 }} />
            ) : (
              <IconifyIcon icon="material-symbols:keyboard-arrow-left" sx={{ fontSize: 24 }} />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
}
render(<TextMobileStepper />);`;

const dotsMobileStepperCode = `const DotsMobileStepper = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="dots"
      steps={6}
      position="static"
      activeStep={activeStep}
      sx={{ maxWidth: 400, flexGrow: 1 }}
      nextButton={
        <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
          Next
          {theme.direction === 'rtl' ? (
            <IconifyIcon icon="material-symbols:keyboard-arrow-left" sx={{ fontSize: 24 }} />
          ) : (
            <IconifyIcon icon="material-symbols:keyboard-arrow-right" sx={{ fontSize: 24 }} />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === 'rtl' ? (
            <IconifyIcon icon="material-symbols:keyboard-arrow-right" sx={{ fontSize: 24 }} />
          ) : (
            <IconifyIcon icon="material-symbols:keyboard-arrow-left" sx={{ fontSize: 24 }} />
          )}
          Back
        </Button>
      }
    />
  );
}
render(<DotsMobileStepper />)`;

const progressMobileStepperCode = `const ProgressMobileStepper = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="progress"
      steps={12}
      position="static"
      activeStep={activeStep}
      sx={{ maxWidth: 400, flexGrow: 1 }}
      nextButton={
        <Button size="small" onClick={handleNext} disabled={activeStep === 11}>
          Next
          {theme.direction === 'rtl' ? (
            <IconifyIcon icon="material-symbols:keyboard-arrow-left" sx={{ fontSize: 24 }} />
          ) : (
            <IconifyIcon icon="material-symbols:keyboard-arrow-right" sx={{ fontSize: 24 }} />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === 'rtl' ? (
            <IconifyIcon icon="material-symbols:keyboard-arrow-right" sx={{ fontSize: 24 }} />
          ) : (
            <IconifyIcon icon="material-symbols:keyboard-arrow-left" sx={{ fontSize: 24 }} />
          )}
          Back
        </Button>
      }
    />
  );
}
render(<ProgressMobileStepper />)`;

const StepperDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Stepper',
        description:
          'Steppers convey progress through numbered steps. It provides a wizard-like workflow.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Stepper',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-stepper`,
        folderLink: `${folderBaseLink}/StepperDoc.jsx`,
      }}
    >
      <DocSection
        title="Horizontal stepper"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 2,
            }}
          >
            Horizontal steppers are ideal when the contents of one step depend on an earlier step.
          </Typography>
        }
      >
        <DocNestedSection title="Linear" id={kebabCase('Linear')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            A linear stepper allows the user to complete the steps in sequence.
          </Typography>
          <DocCard code={horizontalLinearStepperCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Non-linear" id={kebabCase('Non-linear')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Non-linear stepper allow the user to enter a multi-step flow at any point.
          </Typography>
          <DocCard code={horizontalNonLinearStepperCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Alternative label" id={kebabCase('Alternative label')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Labels can be placed below the step icon by setting the <Code>alternativeLabel</Code>{' '}
            prop on the <Code>Stepper</Code> component.
          </Typography>
          <DocCard code={alternativeLabelStepperCode} sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Error step" id={kebabCase('Error step')}>
          <DocCard code={errorStepCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Vertical stepper"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Vertical steppers are designed for narrow screen sizes. They are ideal for mobile. All
            the features of the horizontal stepper can be implemented. To use vertical steppers, set
            the <Code>orientation="vertical"</Code>.
          </Typography>
        }
      >
        <DocCard code={verticalStepperCode} noInline />
      </DocSection>
      <DocSection
        title="Mobile stepper"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 4,
            }}
          >
            The mobile stepper supports three variants to display progress through the available
            steps: text, dots (default) and progress.
          </Typography>
        }
      >
        <DocNestedSection title="Text" id={kebabCase('Text')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The current step and total number of steps are displayed as text.
          </Typography>
          <DocCard code={textMobileStepperCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Dots" id={kebabCase('Dots')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use dots when the number of steps is small.
          </Typography>
          <DocCard code={dotsMobileStepperCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Progress" id={kebabCase('Progress')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use a progress bar when there are many steps, or if there are steps that need to be
            inserted during the process (based on responses to earlier steps).
          </Typography>
          <DocCard code={progressMobileStepperCode} noInline />
        </DocNestedSection>
      </DocSection>
    </DocPageLayout>
  );
};

export default StepperDoc;
