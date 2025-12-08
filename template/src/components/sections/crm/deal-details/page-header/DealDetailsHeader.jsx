import { useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';
import CRMDropdownMenu from 'components/sections/crm/common/CRMDropdownMenu';
import AccessToggle from './AccessToggle';
import DealStatus from './DealStatus';

const DealDetailsHeader = ({ title }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { down } = useBreakpoints();

  const downLg = down('lg');

  return (
    <Paper sx={{ px: { xs: 3, md: 5 }, py: 3 }}>
      <div>
        <PageBreadcrumb
          items={[
            { label: 'Home', url: paths.crm },
            { label: 'Deal Details', active: true },
          ]}
          sx={{ mb: 1 }}
        />
        <Stack
          sx={{ gap: 2, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Typography variant="h4" sx={[{ flexGrow: 999 }, downLg && { fontSize: 'h5.fontSize' }]}>
            {title}
          </Typography>

          <Stack gap={2} sx={{ justifyContent: 'space-between', flexGrow: 1 }}>
            <Stack gap={{ xs: 1, sm: 2 }}>
              <AccessToggle />
              <DealStatus />
            </Stack>
            <Button shape="square" color="neutral" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <IconifyIcon icon="material-symbols:more-vert" sx={{ fontSize: 20 }} />
            </Button>
            <CRMDropdownMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              handleClose={() => setAnchorEl(null)}
            />
          </Stack>
        </Stack>
      </div>
    </Paper>
  );
};

export default DealDetailsHeader;
