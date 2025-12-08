import {
  FormControlLabel,
  FormGroup,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import TogglePanel from 'components/sections/calendar/CalendarSidebar/TogglePanel';
import StyledTextField from 'components/styled/StyledTextField';

const CalendarFilters = () => (
  <TogglePanel title="Search Filters" defaultOpen>
    <FormGroup sx={{ gap: 3 }}>
      <Stack direction="column" gap={1}>
        <FormControlLabel
          control={<Switch defaultChecked size="small" />}
          label="Online events only"
          sx={{ gap: 1.5, mx: 0, color: 'text.secondary' }}
        />
        <FormControlLabel
          control={<Switch size="small" />}
          label="Repeated events"
          sx={{ gap: 1.5, mx: 0, color: 'text.secondary' }}
        />
      </Stack>

      <Stack direction="column" gap={1}>
        <StyledTextField
          select
          fullWidth
          defaultValue="personal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon
                    icon="material-symbols:supervisor-account-outline"
                    sx={{ color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        >
          <MenuItem value="personal">Hosted by: Anyone</MenuItem>
          <MenuItem value="me">Hosted by: Me</MenuItem>
          <MenuItem value="team">Hosted by: My Team</MenuItem>
          <MenuItem value="organization">Hosted by: My Organization</MenuItem>
        </StyledTextField>
        <StyledTextField
          fullWidth
          placeholder="Guest ID"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon
                    icon="material-symbols:account-circle"
                    sx={{ color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
        <StyledTextField
          fullWidth
          placeholder="Location"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon
                    icon="material-symbols:pin-drop-outline"
                    sx={{ color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>
    </FormGroup>
  </TogglePanel>
);

export default CalendarFilters;
