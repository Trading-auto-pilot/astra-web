import { Divider, Stack } from '@mui/material';
import AccountTabPanelSection from '../common/AccountTabPanelSection';
import DateAndTime from './DateAndTime';
import Timezone from './Timezone';

const DateTimeTabPanel = () => {
  return (
    <Stack direction="column" divider={<Divider />} spacing={5}>
      <AccountTabPanelSection
        title="Precision Time"
        subtitle="Effortlessly manage accurate time settings and adjustments for precise, reliable timekeeping across all time zones."
        icon="material-symbols:timer-outline-rounded"
      >
        <DateAndTime />
      </AccountTabPanelSection>
      <AccountTabPanelSection
        title="Location-Based Time Sync"
        subtitle="Automatically adjust time zones using your current location for accurate, real-time synchronization."
        icon="material-symbols:location-on-outline-rounded"
      >
        <Timezone />
      </AccountTabPanelSection>
    </Stack>
  );
};

export default DateTimeTabPanel;
