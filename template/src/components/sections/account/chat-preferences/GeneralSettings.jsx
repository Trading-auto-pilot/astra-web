import { Controller, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

const GeneralSettings = () => {
  const { control, watch } = useFormContext();
  const { showActivity, allwaysShowSidebar, additonalSettings } = watch();

  return (
    <Stack direction="column" spacing={3} sx={{ mb: 5 }}>
      <FormControl
        component="fieldset"
        variant="standard"
        sx={{ gap: 2, alignItems: 'flex-start' }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Show activity
        </Typography>
        {showActivity.map((item, index) => (
          <Controller
            key={item.name}
            control={control}
            name={`showActivity.${index}.checked`}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} {...field} />}
                label={item.label}
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
          Always show in sidebar
        </Typography>
        {allwaysShowSidebar.map((item, index) => (
          <Controller
            key={item.name}
            control={control}
            name={`allwaysShowSidebar.${index}.checked`}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} {...field} />}
                label={item.label}
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
          Sort
        </Typography>
        <Controller
          control={control}
          name="sortOption"
          render={({ field }) => (
            <RadioGroup
              aria-labelledby="color-filter-group-label"
              sx={{ alignItems: 'flex-start' }}
              {...field}
            >
              <FormControlLabel value="all" control={<Radio />} label="All your conversations" />
              <FormControlLabel value="unread" control={<Radio />} label="Unread only" />
              <FormControlLabel value="mentions" control={<Radio />} label="Mentions only" />
              <FormControlLabel
                value="unread_starred"
                control={<Radio />}
                label="Unread conversations, plus your Starred section"
              />
            </RadioGroup>
          )}
        />
      </FormControl>
      <FormControl
        component="fieldset"
        variant="standard"
        sx={{ gap: 2, alignItems: 'flex-start' }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Always show in sidebar
        </Typography>
        {additonalSettings.map((item, index) => (
          <Controller
            key={item.name}
            control={control}
            name={`additonalSettings.${index}.checked`}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} {...field} />}
                label={item.label}
                sx={{ gap: 2, ml: 0 }}
              />
            )}
          />
        ))}
      </FormControl>
    </Stack>
  );
};

export default GeneralSettings;
