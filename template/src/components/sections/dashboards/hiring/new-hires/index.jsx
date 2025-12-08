import { Divider, List } from '@mui/material';
import Stack from '@mui/material/Stack';
import { newHiresData as data } from 'data/hiring/dashboard';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import SectionWrapper from '../common/SectionWrapper';
import NewJoiner from './NewJoiner';

const NewHires = () => {
  return (
    <Stack component={SectionWrapper} direction="column">
      <SectionHeader
        title="New Hires"
        subTitle="Recent joiners by date, role"
        actionComponent={<DashboardMenu size="medium" />}
      />

      <List
        disablePadding
        component={Stack}
        direction="column"
        divider={<Divider flexItem sx={{ borderColor: 'dividerLight' }} />}
      >
        {data.map((item) => (
          <NewJoiner key={item.id} hire={item} />
        ))}
      </List>
    </Stack>
  );
};

export default NewHires;
