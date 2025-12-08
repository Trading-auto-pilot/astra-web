import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CollapsiblePanel from '../common/CollapsiblePanel';
import AdditionalInfo from './AdditionalInfo';
import BasicInfo from './BasicInfo';
import EducationInfo from './EducationInfo';
import ExperienceInfo from './ExperienceInfo';

const PersonalInformation = () => {
  return (
    <Paper background={1} sx={{ outline: 0, p: 2, borderRadius: 4 }}>
      <CollapsiblePanel name="Personal Information">
        <Stack direction="column" gap={4} sx={{ px: 1, pt: 3 }}>
          <BasicInfo />
          <EducationInfo />
          <ExperienceInfo />
          <AdditionalInfo />
        </Stack>
      </CollapsiblePanel>
    </Paper>
  );
};

export default PersonalInformation;
