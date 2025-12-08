import { FormProvider, useForm } from 'react-hook-form';
import { Button, Divider, Stack } from '@mui/material';
import { useThemeMode } from 'hooks/useThemeMode';
import { useSnackbar } from 'notistack';
import AccountTabPanelSection from '../common/AccountTabPanelSection';
import ColorFilter from './ColorFilter';
import Contrast from './Contrast';
import Font from './Font';

const AccessibilityTabPanel = () => {
  const { isDark } = useThemeMode();

  const methods = useForm({
    defaultValues: {
      textSize: 14,
      colorFilter: null,
      contrast: isDark ? 'dark' : 'light',
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, reset } = methods;
  const onSubmit = (data) => {
    console.log(data);
    enqueueSnackbar('Updated successfully!', { variant: 'success', autoHideDuration: 3000 });
  };

  return (
    <FormProvider {...methods}>
      <Stack
        component="form"
        direction="column"
        divider={<Divider />}
        spacing={5}
        onSubmit={handleSubmit(onSubmit)}
      >
        <AccountTabPanelSection
          title="Font"
          subtitle="Adjust the font size to optimize readability and minimize eye strain."
          icon="material-symbols:text-fields"
        >
          <Font />
        </AccountTabPanelSection>

        <AccountTabPanelSection
          title="Color Filter"
          subtitle="Customize color filters to suit your vision needs, making your experience more accessible and comfortable."
          icon="material-symbols:visibility-outline"
        >
          <ColorFilter />
        </AccountTabPanelSection>

        <AccountTabPanelSection
          title="Contrast"
          subtitle="Select a theme that suits your style to personalize the overall appearance and enhance the visual experience."
          icon="material-symbols:visibility-outline"
        >
          <Contrast />
          <Stack justifyContent="flex-end" spacing={1}>
            <Button variant="soft" color="neutral" onClick={() => reset()}>
              Discard
            </Button>
            <Button type="submit" variant="contained">
              Confirm
            </Button>
          </Stack>
        </AccountTabPanelSection>
      </Stack>
    </FormProvider>
  );
};

export default AccessibilityTabPanel;
