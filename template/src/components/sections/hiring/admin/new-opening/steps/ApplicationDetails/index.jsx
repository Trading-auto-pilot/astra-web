import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import OptionRow from './OptionRow';
import Questionaries from './Questionaries';

export const applicationDetailsSchema = yup.object({
  candidateData: yup.object({
    name: yup.boolean().required(),
    email: yup.boolean().required(),
    phoneNo: yup.boolean().required(),
  }),
  options: yup.object({
    image: yup.string().required(),
    address: yup.string().required(),
    referredBy: yup.string().required(),
    desiredSalary: yup.string().required(),
    resume: yup.string().required(),
    coverLetter: yup.string().required(),
    websitePortfolio: yup.string().required(),
    education: yup.string().required(),
    workExperience: yup.string().required(),
  }),
});

const ApplicationDetails = () => {
  const { control } = useFormContext();

  return (
    <Stack direction="column" gap={3} alignItems="flex-start">
      <Button
        variant="soft"
        size="small"
        color="neutral"
        startIcon={<IconifyIcon icon="material-symbols:preview" />}
      >
        Preview
      </Button>
      <Box sx={{ width: 1 }}>
        <Typography fontWeight={600} mb={2}>
          Candidate Data
        </Typography>
        <Grid container mb={4}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <Stack alignItems="center" gap={{ xs: 1, sm: 2 }}>
              <Typography variant="body2" fontWeight={500} sx={{ textWrap: 'nowrap' }}>
                Name
              </Typography>
              <Controller
                control={control}
                name="candidateData.name"
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} {...field} />}
                    label="Required"
                    sx={{
                      ml: 0,
                      [`& .${formControlLabelClasses.label}`]: { color: 'text.secondary' },
                    }}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <Stack alignItems="center" gap={{ xs: 1, sm: 2 }}>
              <Typography variant="body2" fontWeight={500} sx={{ textWrap: 'nowrap' }}>
                Email
              </Typography>
              <Controller
                control={control}
                name="candidateData.email"
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} {...field} />}
                    label="Required"
                    sx={{
                      ml: 0,
                      [`& .${formControlLabelClasses.label}`]: { color: 'text.secondary' },
                    }}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 9, sm: 4 }}>
            <Stack alignItems="center" gap={{ xs: 1, sm: 2 }}>
              <Typography variant="body2" fontWeight={500} sx={{ textWrap: 'nowrap' }}>
                Phone No
              </Typography>
              <Controller
                control={control}
                name="candidateData.phoneNo"
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} {...field} />}
                    label="Required"
                    sx={{
                      ml: 0,
                      [`& .${formControlLabelClasses.label}`]: { color: 'text.secondary' },
                    }}
                  />
                )}
              />
            </Stack>
          </Grid>
        </Grid>

        <Stack
          direction="column"
          divider={
            <Divider flexItem orientation="horizontal" sx={{ borderColor: 'dividerLight' }} />
          }
          sx={{ mb: 3 }}
        >
          <Stack
            gap={1}
            sx={{
              px: { xs: 1, sm: 3 },
              py: 1,
              height: 46,
              bgcolor: 'background.elevation1',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            <Stack direction="column" justifyContent="center" sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">Option</Typography>
            </Stack>
            <Stack
              direction="column"
              justifyContent="center"
              sx={{ flexBasis: { xs: '17.5%', sm: '20%' } }}
            >
              <Typography variant="subtitle2" textAlign="center">
                Required
              </Typography>
            </Stack>
            <Stack
              direction="column"
              justifyContent="center"
              sx={{ flexBasis: { xs: '17.5%', sm: '20%' } }}
            >
              <Typography variant="subtitle2" textAlign="center">
                Optional
              </Typography>
            </Stack>
            <Stack
              direction="column"
              justifyContent="center"
              sx={{ flexBasis: { xs: '17.5%', sm: '20%' } }}
            >
              <Typography variant="subtitle2" textAlign="center">
                Disabled
              </Typography>
            </Stack>
          </Stack>
          <Controller
            control={control}
            name="options.image"
            render={({ field }) => <OptionRow field={field} label="Image" />}
          />
          <Controller
            control={control}
            name="options.address"
            render={({ field }) => <OptionRow field={field} label="Address" />}
          />
          <Controller
            control={control}
            name="options.referredBy"
            render={({ field }) => <OptionRow field={field} label="Referred by" />}
          />
          <Controller
            control={control}
            name="options.desiredSalary"
            render={({ field }) => <OptionRow field={field} label="Desired Salary" />}
          />
          <Controller
            control={control}
            name="options.resume"
            render={({ field }) => <OptionRow field={field} label="Resume" />}
          />
          <Controller
            control={control}
            name="options.coverLetter"
            render={({ field }) => <OptionRow field={field} label="Cover letter" />}
          />
          <Controller
            control={control}
            name="options.websitePortfolio"
            render={({ field }) => <OptionRow field={field} label="Website/Portfolio" />}
          />
          <Controller
            control={control}
            name="options.education"
            render={({ field }) => <OptionRow field={field} label="Education" />}
          />
          <Controller
            control={control}
            name="options.workExperience"
            render={({ field }) => <OptionRow field={field} label="Work Experience" />}
          />
        </Stack>

        <Questionaries />
      </Box>
    </Stack>
  );
};

export default ApplicationDetails;
