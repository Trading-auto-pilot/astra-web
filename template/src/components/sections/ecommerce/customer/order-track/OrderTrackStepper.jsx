import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
  stepConnectorClasses,
  stepIconClasses,
  stepLabelClasses,
} from '@mui/material';
import { kebabCase } from 'lib/utils';

const OrderTrackStepper = ({ steps, sx }) => {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        bgcolor: 'background.elevation1',
        borderRadius: 6,
        ...sx,
      }}
    >
      <Stepper activeStep={1} alternativeLabel orientation="horizontal">
        {steps.map(({ title, subtitle }, index) => {
          return (
            <Step
              key={kebabCase(title)}
              sx={[
                {
                  [`& .${stepConnectorClasses.horizontal}`]: {
                    right: 'calc(50% + 20px)',
                    left: 'calc(-100% + 40px)',
                    [`& .${stepConnectorClasses.line}`]: {
                      borderTopWidth: 2,
                      borderColor: 'divider',
                    },
                  },
                },
                index === steps.length - 1 && {
                  [`& .${stepConnectorClasses.horizontal}`]: {
                    right: '40px !important',
                    left: 'calc(-50% + 20px)',
                  },
                },
              ]}
            >
              <StepLabel
                optional={
                  <Typography
                    variant="caption"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    {subtitle}
                  </Typography>
                }
                sx={[
                  {
                    alignItems: { xs: 'center' },
                    [`& .${stepIconClasses.root}`]: {
                      color: 'background.elevation2',

                      [`& .${stepIconClasses.text}`]: {
                        fill: (theme) => theme.vars.palette.text.primary,
                      },

                      [`&.${stepIconClasses.completed}`]: {
                        color: 'success.main',
                      },

                      [`&.${stepIconClasses.active}`]: {
                        color: 'primary.main',

                        [`& .${stepIconClasses.text}`]: {
                          fill: (theme) => theme.vars.palette.primary.contrastText,
                        },
                      },
                    },
                    [`& .${stepLabelClasses.labelContainer}`]: {
                      textAlign: { xs: 'center' },
                      [`& .${stepLabelClasses.label}`]: {
                        my: 1,
                        fontWeight: 700,

                        '& + span': {
                          position: 'relative',
                        },
                      },
                    },
                  },
                  index === 0 && {
                    alignItems: { sm: 'flex-start' },
                    [`& .${stepLabelClasses.labelContainer}`]: {
                      textAlign: { xs: 'center', sm: 'left !important' },
                    },
                  },
                  index === steps.length - 1 && {
                    alignItems: { sm: 'flex-end' },
                    [`& .${stepLabelClasses.labelContainer}`]: {
                      textAlign: { xs: 'center', sm: 'right' },
                    },
                  },
                ]}
              >
                {title}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default OrderTrackStepper;
