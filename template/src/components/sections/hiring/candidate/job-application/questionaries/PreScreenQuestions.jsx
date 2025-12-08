import { Controller, useFormContext } from 'react-hook-form';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ApplicationFormSection from '../common/ApplicationFormSection';

const PreScreenQuestions = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <ApplicationFormSection name="Pre-Screen Questions">
      <Stack direction="column" gap={3}>
        <div>
          <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 1 }}>
            1. Why did you choose to apply to this company?
          </Typography>
          <TextField
            label="Answer"
            fullWidth
            error={!!errors.questionaries?.preScreen?.applyingReason}
            helperText={errors.questionaries?.preScreen?.applyingReason?.message}
            {...register('questionaries.preScreen.applyingReason')}
          />
        </div>
        <div>
          <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 1 }}>
            2. What are your greatest strengths?
          </Typography>
          <TextField
            label="Answer"
            fullWidth
            error={!!errors.questionaries?.preScreen?.greatestStrengths}
            helperText={errors.questionaries?.preScreen?.greatestStrengths?.message}
            {...register('questionaries.preScreen.greatestStrengths')}
          />
        </div>
        <div>
          <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 1 }}>
            3. How do you prefer to work on tasks?
          </Typography>
          <Controller
            control={control}
            name="questionaries.preScreen.workPreference"
            render={({ field }) => (
              <RadioGroup
                aria-labelledby="color-filter-group-label"
                sx={{
                  alignItems: 'flex-start',
                  [`& .${formControlLabelClasses.label}`]: {
                    color: 'text.secondary',
                  },
                }}
                {...field}
              >
                <FormControlLabel value="independent" control={<Radio />} label="Independently" />
                <FormControlLabel
                  value="collaborative"
                  control={<Radio />}
                  label="Collaboratively"
                />
                <FormControlLabel
                  value="clear-deadline"
                  control={<Radio />}
                  label="With clear deadlines"
                />
                <FormControlLabel
                  value="creative-freedom"
                  control={<Radio />}
                  label="With creative freedom"
                />
              </RadioGroup>
            )}
          />
        </div>
        <div>
          <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 1 }}>
            4. Have you worked remotely before?
          </Typography>
          <Controller
            control={control}
            name="questionaries.preScreen.remoteWork"
            render={({ field }) => (
              <RadioGroup
                row
                aria-labelledby="color-filter-group-label"
                sx={{
                  alignItems: 'flex-start',
                  [`& .${formControlLabelClasses.label}`]: {
                    color: 'text.secondary',
                  },
                }}
                {...field}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            )}
          />
        </div>
      </Stack>
    </ApplicationFormSection>
  );
};

export default PreScreenQuestions;
