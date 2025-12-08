import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import SectionHeader from 'components/common/SectionHeader';
import Notification from './NotificationItem';
import SortBySelect from './SortBySelect';

const Notifications = ({ notifications }) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [expanded, setExpanded] = useState(false);
  const { up } = useBreakpoints();
  const upMd = up('md');

  useEffect(() => {
    if (upMd) {
      setVisibleCount(notifications.items.length);
    } else {
      setVisibleCount(5);
    }
  }, [upMd]);

  const handleExpandItems = () => {
    if (expanded) {
      setVisibleCount(5);
    } else {
      setVisibleCount(notifications.items.length);
    }
    setExpanded(!expanded);
  };

  return (
    <Paper
      component={Stack}
      direction="column"
      sx={{ p: { xs: 3, md: 5 }, pb: { md: '1px', xl: 5 }, height: { md: 400, xl: 1 } }}
    >
      <SectionHeader
        direction={{ xs: 'column', sm: 'row' }}
        title={notifications.date}
        subTitle="Here’s some issues needing your attention"
        actionComponent={<SortBySelect />}
      />

      <Box sx={{ flexGrow: 1, flexBasis: { sm: 0 }, overflowY: { md: 'auto' } }}>
        <List
          sx={{ pb: { xs: 1, md: 5, xl: 0 }, columns: { xs: 1, md: 2, xl: 1 }, gap: 1 }}
          disablePadding
        >
          {notifications.items.slice(0, visibleCount).map((item) => (
            <Notification key={item.id} item={item} />
          ))}
        </List>
        {!upMd && (
          <Button variant="text" fullWidth onClick={handleExpandItems}>
            {expanded ? 'See less' : 'See more'}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default Notifications;
