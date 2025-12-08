import { Controller, useFormContext } from 'react-hook-form';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const NotificationOptions = ({ checked, notificationMethod, label, icon }) => {
  const { control } = useFormContext();

  return (
    <div>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconifyIcon icon={icon} sx={{ fontSize: 24 }} />
        <span>{label}</span>
      </Typography>
      {checked && (
        <>
          <Typography
            variant="subtitle2"
            sx={{ mt: 1, fontWeight: 400, color: 'text.secondary', lineHeight: 1.6 }}
          >
            Select how you receive notifications and stay updated on posts, feedback, deals, and
            account activity.
          </Typography>
          <Stack direction="column" spacing={3} py={3} alignItems="flex-start">
            <FormGroup>
              <Controller
                name={`${notificationMethod}.options.newNotifications`}
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} {...field} />}
                    label="New Notifications"
                    disabled={!checked}
                  />
                )}
              />
              <Controller
                name={`${notificationMethod}.options.directNotifications`}
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} {...field} />}
                    label="Direct Notifications"
                    disabled={!checked}
                  />
                )}
              />
              <Controller
                name={`${notificationMethod}.options.postsEmailed`}
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} {...field} />}
                    label="Posts emailed to you"
                    disabled={!checked}
                  />
                )}
              />
            </FormGroup>
            <FormControl sx={{ gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Top posts & stories
              </Typography>
              <Controller
                name={`${notificationMethod}.options.notificationFrequency`}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    aria-labelledby="top-posts-radio-buttons-group-label"
                    sx={{ gap: 2 }}
                    {...field}
                  >
                    <FormControlLabel
                      value="Daily"
                      control={<Radio />}
                      label="Daily"
                      disabled={!checked}
                      sx={{ mr: 0 }}
                    />
                    <FormControlLabel
                      value="Weekly"
                      control={<Radio />}
                      label="Weekly"
                      disabled={!checked}
                      sx={{ mr: 0 }}
                    />
                    <FormControlLabel
                      value="Periodically"
                      control={<Radio />}
                      label="Periodically"
                      disabled={!checked}
                      sx={{ mr: 0 }}
                    />
                    <FormControlLabel
                      value="Off"
                      control={<Radio />}
                      label="Off"
                      disabled={!checked}
                      sx={{ mr: 0 }}
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
            <FormControl sx={{ gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Feedback
              </Typography>
              <FormGroup row aria-labelledby="feedback-checkbox-label" sx={{ gap: 1 }}>
                <Controller
                  name={`${notificationMethod}.options.feedback`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label="Get notified about your reviews, answers to questions and more"
                      control={<Checkbox checked={field.value} {...field} />}
                      disabled={!checked}
                    />
                  )}
                />
              </FormGroup>
            </FormControl>
            <FormControl sx={{ gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Deals & Recommendations
              </Typography>
              <FormGroup aria-labelledby="deals-checkbox-label" sx={{ gap: 1 }}>
                <Controller
                  name={`${notificationMethod}.options.deals`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox checked={field.value} {...field} />}
                      label="The latest on deals, offers and savings events"
                      disabled={!checked}
                    />
                  )}
                />
                <Controller
                  name={`${notificationMethod}.options.personalizedDeals`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox checked={field.value} {...field} />}
                      label="Personalized based on shopping activity"
                      disabled={!checked}
                    />
                  )}
                />
                <Controller
                  name={`${notificationMethod}.options.updates`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox checked={field.value} {...field} />}
                      label="Updates on new programs, product launches & releases"
                      disabled={!checked}
                    />
                  )}
                />
              </FormGroup>
            </FormControl>
            <FormControl sx={{ gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Accounts & Shipping
              </Typography>
              <FormGroup aria-labelledby="accounts-shipping-checkbox-label" sx={{ gap: 1 }}>
                <Controller
                  name={`${notificationMethod}.options.accountSecurity`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox checked={field.value} {...field} />}
                      label="Get notified about account security, payment and orders"
                      disabled={!checked}
                    />
                  )}
                />
                <Controller
                  name={`${notificationMethod}.options.packageUpdates`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox checked={field.value} {...field} />}
                      label="Find out when packages ship and arrive"
                      disabled={!checked}
                    />
                  )}
                />
              </FormGroup>
            </FormControl>
          </Stack>
        </>
      )}
    </div>
  );
};

export default NotificationOptions;
