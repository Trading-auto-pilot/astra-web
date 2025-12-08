import { Drawer, drawerClasses } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import SimpleBar from 'components/base/SimpleBar';
import SchedulerPanel from 'components/sections/scheduler/SchedulePanel/SchedulerPanel';

const SettingsDrawer = ({
  isDrawerOpen,
  toggleDrawer,
  onAddAppointments,
  onUpdateAppointments,
  onRemoveAppointments,
}) => {
  const { up } = useBreakpoints();
  const upMd = up('md');

  return (
    <>
      {upMd ? (
        <Drawer
          variant="persistent"
          open={isDrawerOpen}
          sx={(theme) => ({
            [`& .${drawerClasses.paper}`]: {
              zIndex: 1,
              border: 0,
              overflow: 'hidden',
              position: 'absolute',
              top: 0,
              bottom: 0,
              minWidth: 0,
              outline: `1px solid ${theme.vars.palette.divider}`,
              width: 375,
              bgcolor: 'background.elevation1',
            },
          })}
        >
          <SimpleBar sx={{ maxHeight: 1 }}>
            <SchedulerPanel
              toggleDrawer={toggleDrawer}
              onAddAppointments={onAddAppointments}
              onUpdateAppointments={onUpdateAppointments}
              onRemoveAppointments={onRemoveAppointments}
            />
          </SimpleBar>
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={isDrawerOpen}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={[
            {
              [`& .${drawerClasses.paper}`]: {
                width: 375,
              },
            },
          ]}
        >
          <SimpleBar forceVisible="y" autoHide={true} sx={{ px: 0, pb: 2, height: '100%' }}>
            <SchedulerPanel
              toggleDrawer={toggleDrawer}
              onAddAppointments={onAddAppointments}
              onUpdateAppointments={onUpdateAppointments}
              onRemoveAppointments={onRemoveAppointments}
            />
          </SimpleBar>
        </Drawer>
      )}
    </>
  );
};

export default SettingsDrawer;
