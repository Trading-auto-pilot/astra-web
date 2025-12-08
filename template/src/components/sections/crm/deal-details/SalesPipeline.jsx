import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';

const SalesPipeline = ({ salesPipelineData }) => {
  const { currentBreakpoint } = useBreakpoints();

  return (
    <Paper component={Stack} direction="column" sx={{ p: { xs: 3, md: 5 }, gap: 4 }}>
      <Typography variant="h5">Sales Pipeline</Typography>
      <ButtonGroup
        orientation={currentBreakpoint === 'xs' ? 'vertical' : 'horizontal'}
        sx={{ gap: 0.25 }}
      >
        {salesPipelineData.map((data) => (
          <Button
            key={data.id}
            href={paths.deals}
            size="small"
            variant="soft"
            color={
              data.status === 'done' ? 'success' : data.status === 'ongoing' ? 'primary' : 'neutral'
            }
            fullWidth
            endIcon={
              data.status === 'done' && (
                <IconifyIcon icon="material-symbols:check-circle-outline-rounded" />
              )
            }
            sx={{ height: 46 }}
          >
            {data.name}
          </Button>
        ))}
      </ButtonGroup>
    </Paper>
  );
};

export default SalesPipeline;
