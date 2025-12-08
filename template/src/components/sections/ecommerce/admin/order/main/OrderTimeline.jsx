import { useEffect, useRef, useState } from 'react';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import { Avatar, Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { orderActivities } from 'data/e-commerce/orders';
import { users } from 'data/users';
import dayjs from 'dayjs';
import Editor, { editorDefaultToolbar } from 'components/base/Editor';
import { useOrderDetails } from '../OrderDetailsProvider';

const OrderTimeline = () => {
  const { order } = useOrderDetails();
  const [activities, setActivities] = useState([]);
  const rteRef = useRef(null);

  const handlePost = () => {
    const value = rteRef.current?.editor?.isEmpty ? '' : rteRef.current?.editor?.getHTML();
    if (value) {
      setActivities([
        {
          id: activities.length + 1,
          content: value,
          createdAt: dayjs().toDate(),
        },
        ...activities,
      ]);
      rteRef.current?.editor?.commands.clearContent();
    }
  };

  useEffect(() => {
    if (order) {
      setActivities(order.activities);
    }
  }, [order]);

  return (
    <Paper sx={{ height: 1, p: { xs: 3, md: 5 } }}>
      <Container maxWidth={false} sx={{ maxWidth: 694, px: { xs: 0 } }}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
          }}
        >
          Timeline
        </Typography>

        <Timeline
          sx={{
            my: 0,
            p: 0,
            [`& .${timelineItemClasses.root}`]: {
              '&:before': {
                flex: 0,
                padding: 0,
              },
              '&:last-of-type': {
                minHeight: 0,
              },
            },
          }}
        >
          <TimelineItem sx={{ mb: 1 }}>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  p: 0,
                  border: 'none',
                }}
              >
                <Avatar alt="" src={users[14].avatar} sx={{ width: 54, height: 54 }} />
              </TimelineDot>
              <TimelineConnector sx={{ width: '1px', backgroundColor: 'divider' }} />
            </TimelineSeparator>

            <TimelineContent sx={{ pb: { xs: 3, xl: 5 }, pt: 0, minWidth: 0 }}>
              <Editor
                ref={rteRef}
                renderControls={() => (
                  <Stack
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      columnGap: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        overflowX: 'auto',
                        '& > div:first-of-type': {
                          flexWrap: 'nowrap',
                        },
                      }}
                    >
                      {editorDefaultToolbar()}
                    </Box>
                    <Button
                      color="neutral"
                      variant="text"
                      size="small"
                      sx={{ flexShrink: 0 }}
                      onClick={handlePost}
                      disabled={rteRef.current?.editor?.isEmpty}
                    >
                      Post
                    </Button>
                  </Stack>
                )}
                sx={{
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  '& .MuiTiptap-RichTextContent-root .tiptap': {
                    minHeight: 24,
                  },
                }}
              />
            </TimelineContent>
          </TimelineItem>

          {activities.map((activity, index) => (
            <TimelineItem sx={{ minHeight: 60, mb: 1 }} key={activity.id}>
              <TimelineSeparator sx={{ width: 54, flex: 'unset' }}>
                <TimelineDot
                  sx={{
                    alignSelf: 'unset',
                    mt: 0.5,
                    mb: 1,
                    p: 0.75,
                    border: 0,
                    boxShadow: 'none',
                    bgcolor: index === 0 ? 'primary.main' : 'divider',
                  }}
                />
                {index !== activities.length - 1 && (
                  <TimelineConnector sx={{ bgcolor: 'divider', width: '1px' }} />
                )}
              </TimelineSeparator>
              <TimelineContent
                sx={{ pb: index !== orderActivities.length - 1 ? { xs: 3, xl: 5 } : 0, pt: 0 }}
              >
                <Stack
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexDirection: { xs: 'column', sm: 'row' },
                    rowGap: 1,
                    columnGap: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    dangerouslySetInnerHTML={{ __html: activity.content }}
                  />
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontWeight: 500,
                      color: 'text.disabled',
                      flexShrink: 0,
                    }}
                  >
                    {dayjs(activity.createdAt).fromNow()}
                  </Typography>
                </Stack>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Container>
    </Paper>
  );
};

export default OrderTimeline;
