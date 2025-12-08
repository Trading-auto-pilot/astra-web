import { Paper, Stack, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';

const PageHeader = ({ title, breadcrumb, actionComponent, sx }) => {
  const { down } = useBreakpoints();
  const downLg = down('lg');

  return (
    <Paper sx={{ px: { xs: 3, md: 5 }, py: 3 }}>
      <Stack
        sx={{
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'flex-end' },
          justifyContent: 'space-between',
          ...sx,
        }}
      >
        <div>
          <PageBreadcrumb items={breadcrumb} sx={{ mb: 1 }} />
          <Typography variant="h4" sx={[downLg && { fontSize: 'h5.fontSize' }]}>
            {title}
          </Typography>
        </div>

        {actionComponent}
      </Stack>
    </Paper>
  );
};

export default PageHeader;
