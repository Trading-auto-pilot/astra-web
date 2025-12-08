import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Box, Container, Drawer, Paper, Stack, Typography, drawerClasses } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import paths from 'routes/paths';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';
import BottomBar from 'components/sections/events/create-event/BottomBar';
import EventAside from 'components/sections/events/create-event/aside/EventAside';
import EventSections from 'components/sections/events/create-event/main/EventSections';
import useCreateEventForm from 'components/sections/events/create-event/useCreateEventForm';

const CreateEvent = () => {
  const { methods } = useCreateEventForm();
  const { up } = useBreakpoints();
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  const { handleSubmit, reset } = methods;
  const upMd = up('md');

  const handleAsideOpen = () => setIsAsideOpen(true);

  const onSubmit = (formData) => {
    console.log('Form Submitted', formData);
    reset();
  };

  return (
    <FormProvider {...methods}>
      <Stack component="form" id="createEventForm" onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ p: { xs: 3, md: 5 }, flex: 1 }}>
          <Box sx={{ mb: 3 }}>
            <PageBreadcrumb
              items={[
                { label: 'Home', url: paths.events },
                { label: 'Events', url: '#!' },
                { label: 'Create Event', active: true },
              ]}
              sx={{ mb: 2 }}
            />
            <Typography variant="h4">Create Event</Typography>
          </Box>

          <Container maxWidth={false} sx={{ maxWidth: 520, px: { xs: 0 } }}>
            <EventSections />
          </Container>
        </Paper>

        {upMd ? (
          <EventAside />
        ) : (
          <Drawer
            anchor="right"
            variant="temporary"
            open={isAsideOpen}
            onClose={() => setIsAsideOpen(false)}
            sx={{
              [`& .${drawerClasses.paper}`]: { width: 1, maxWidth: 404 },
            }}
          >
            <EventAside handleClose={() => setIsAsideOpen(false)} />
          </Drawer>
        )}
      </Stack>

      {!upMd && (
        <Box sx={{ position: 'sticky', zIndex: 999, width: 1, bottom: 0 }}>
          <BottomBar handleAsideOpen={handleAsideOpen} />
        </Box>
      )}
    </FormProvider>
  );
};

export default CreateEvent;
