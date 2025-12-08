import { Controller, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
  formControlLabelClasses,
} from '@mui/material';

const GeneralNotification = () => {
  const { control, watch } = useFormContext();
  const { desktopNotifications, taggedNotifications, muteNotifications } = watch();

  return (
    <Stack direction="column" spacing={3}>
      <FormControl
        component="fieldset"
        variant="standard"
        sx={{ gap: 2, alignItems: 'flex-start' }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Desktop notifications
        </Typography>
        {desktopNotifications.map((notificationItem, index) => (
          <Controller
            key={notificationItem.name}
            control={control}
            name={`desktopNotifications.${index}.checked`}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} {...field} />}
                label={notificationItem.label}
                sx={{
                  gap: 2,
                  ml: 0,
                  [`& .${formControlLabelClasses.label}`]: {
                    display: 'flex',
                    gap: 1,
                  },
                }}
              />
            )}
          />
        ))}
      </FormControl>
      <FormControl
        component="fieldset"
        variant="standard"
        sx={{ gap: 2, alignItems: 'flex-start' }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Get notifications when you are tagged by
        </Typography>
        {taggedNotifications.map((notificationItem, index) => (
          <Controller
            key={notificationItem.name}
            control={control}
            name={`taggedNotifications.${index}.checked`}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} {...field} />}
                label={notificationItem.label}
                sx={{ gap: 2, ml: 0 }}
              />
            )}
          />
        ))}
      </FormControl>
      <FormControl
        component="fieldset"
        variant="standard"
        sx={{ gap: 2, alignItems: 'flex-start' }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Mute notifications for the following people
        </Typography>
        {muteNotifications.map((notificationItem, index) => (
          <Controller
            key={notificationItem.name}
            control={control}
            name={`muteNotifications.${index}.checked`}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} {...field} />}
                label={notificationItem.label}
                sx={{ gap: 2, ml: 0 }}
              />
            )}
          />
        ))}
      </FormControl>
    </Stack>
  );
};

export default GeneralNotification;
