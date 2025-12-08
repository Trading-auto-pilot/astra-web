import { Divider, Stack } from '@mui/material';
import AccountTabPanelSection from '../common/AccountTabPanelSection';
import EducationHistorySection from './EducationHistorySection';
import WorkHistorySection from './WorkHistorySection';

const WorkEducationTabPanel = () => {
  return (
    <Stack direction="column" divider={<Divider />} spacing={5} mt={2}>
      <AccountTabPanelSection
        title="Work History"
        subtitle="Add where you are currently working and where you used to work."
        icon="material-symbols:work-outline"
      >
        <WorkHistorySection />
      </AccountTabPanelSection>

      <AccountTabPanelSection
        title="Education"
        subtitle="Add schools where you study/studied and what your major was."
        icon="material-symbols:school-outline"
      >
        <EducationHistorySection />
      </AccountTabPanelSection>
    </Stack>
  );
};

export default WorkEducationTabPanel;
