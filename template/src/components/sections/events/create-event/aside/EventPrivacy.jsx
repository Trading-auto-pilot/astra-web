import { Controller, useFormContext } from 'react-hook-form';
import { Box, Button, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const EventPrivacy = () => {
  const { control } = useFormContext();

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Privacy
      </Typography>

      <Controller
        rules={{ required: true }}
        name="eventPrivacy"
        defaultValue="private"
        control={control}
        render={({ field }) => (
          <RadioGroup {...field} aria-labelledby="public-event-checkbox" sx={{ rowGap: 3, mb: 3 }}>
            <FormControlLabel
              value="public"
              label={
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontWeight: 400, mt: '7px' }}
                >
                  The event will be made public and anyone will be able to find it
                </Typography>
              }
              control={<Radio />}
            />
            <FormControlLabel
              value="private"
              control={<Radio />}
              label={
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontWeight: 400, mt: '7px' }}
                >
                  Only people invited will be able to find this event from a link in their inbox
                </Typography>
              }
            />
          </RadioGroup>
        )}
      />
      <div>
        <Button
          fullWidth
          color="neutral"
          variant="soft"
          size="small"
          startIcon={
            <IconifyIcon
              icon="material-symbols:outgoing-mail-outline-rounded"
              height={18}
              width={18}
              sx={{ mt: 0.5 }}
            />
          }
        >
          Send invite
        </Button>
        <Typography variant="caption" color="info" sx={{ mt: 1, textAlign: 'center' }}>
          0 people invited
        </Typography>
      </div>
    </Box>
  );
};

export default EventPrivacy;
