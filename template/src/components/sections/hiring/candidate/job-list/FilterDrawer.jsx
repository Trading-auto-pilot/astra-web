import Button from '@mui/material/Button';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import FilterSection from './FilterSection';

const FilterDrawer = ({ open, handleClose }) => {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={handleClose}
      anchor="right"
      slotProps={{
        paper: {
          background: 1,
        },
      }}
      sx={(theme) => ({
        [`& .${drawerClasses.paper}`]: {
          width: 300,
          border: 0,
          outline: `1px solid ${theme.vars.palette.divider}`,
        },
      })}
    >
      <Stack direction="column" height={1}>
        <Stack
          sx={{
            py: 1,
            px: 3,
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'background.elevation1',
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Filters
          </Typography>
          <Button shape="circle" color="neutral" onClick={handleClose}>
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
          </Button>
        </Stack>
        <Paper
          component={Stack}
          direction="column"
          justifyContent="space-between"
          background={1}
          flexGrow={1}
        >
          <Stack direction="column" sx={{ p: 3 }}>
            <FilterSection
              name="Date Post"
              options={[
                { label: 'Any Time', value: 'anyTime' },
                { label: 'Last 24 hours', value: 'last24Hours' },
                { label: 'Last Week', value: 'lastWeek' },
                { label: 'Last Month', value: 'lastMonth' },
              ]}
            />
            <FilterSection
              name="Work Mode"
              options={[
                { label: 'All', value: 'all' },
                { label: 'On-Site', value: 'onSite' },
                { label: 'Remote', value: 'remote' },
                { label: 'Hybrid', value: 'hybrid' },
              ]}
            />
            <FilterSection
              name="Employment Type"
              options={[
                { label: 'All', value: 'all' },
                { label: 'Full-Time', value: 'fullTime' },
                { label: 'Part-Time', value: 'partTime' },
                { label: 'Contract', value: 'contract' },
                { label: 'Other', value: 'other' },
              ]}
            />
            <FilterSection
              name="Experience"
              options={[
                { label: 'All', value: 'all' },
                { label: '0-1 year', value: '0-1' },
                { label: '1-3 years', value: '1-3' },
                { label: '3-5 years', value: '3-5' },
                { label: '5-10 years', value: '5-10' },
                { label: '10+ years', value: '10+' },
              ]}
            />
          </Stack>
          <Stack gap={1} sx={{ px: 5, py: 3 }}>
            <Button color="neutral">Clear</Button>
            <Button variant="contained" fullWidth onClick={handleClose}>
              Apply
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Drawer>
  );
};

export default FilterDrawer;
