import { useEffect, useState } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { Button, Divider, dividerClasses, listItemClasses } from '@mui/material';
import dayjs from 'dayjs';
import NotificationList from 'components/sections/notification/NotificationList';

const NotificationTabPanel = ({ value, notificationsData }) => {
  const [notifications, setNotifications] = useState({
    today: [],
    older: [],
  });

  useEffect(() => {
    const datewiseNotification = notificationsData.reduce(
      (acc, val) => {
        if (dayjs().diff(dayjs(val.createdAt), 'days') === 0) {
          acc.today.push(val);
        } else {
          acc.older.push(val);
        }

        return acc;
      },
      {
        today: [],
        older: [],
      },
    );

    setNotifications(datewiseNotification);
  }, [notificationsData]);

  return (
    <TabPanel value={value} sx={{ px: 0, pb: 0, mx: -2 }}>
      <NotificationList
        title="Today"
        notifications={notifications.today}
        sx={{
          pb: 2,
          [`& .${listItemClasses.root}`]: {
            borderRadius: 6,
          },
        }}
      />
      <NotificationList
        title="Older"
        notifications={notifications.older}
        sx={{
          pb: 2,
          [`& .${listItemClasses.root}`]: {
            borderRadius: 6,
          },
        }}
      />
      {notificationsData.length > 10 && (
        <Divider sx={{ [`& .${dividerClasses.wrapper}`]: { p: 0 } }}>
          <Button color="neutral" variant="soft" sx={{ borderRadius: 10 }}>
            Load more notifications
          </Button>
        </Divider>
      )}
    </TabPanel>
  );
};

export default NotificationTabPanel;
