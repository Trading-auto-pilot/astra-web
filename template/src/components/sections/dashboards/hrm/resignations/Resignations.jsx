import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconifyIcon from 'components/base/IconifyIcon';
import SectionHeader from 'components/common/SectionHeader';
import ResignationsTable from './ResignationsTable';

const Resignations = ({ resignations }) => {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
      <SectionHeader
        title="Recent Resignations"
        subTitle=""
        sx={{ flexWrap: 'wrap' }}
        actionComponent={
          <Button
            variant="soft"
            color="neutral"
            endIcon={<IconifyIcon icon="material-symbols:open-in-new-rounded" />}
            sx={{ flexShrink: 0 }}
          >
            Exit-interview Records
          </Button>
        }
      />
      <ResignationsTable tableData={resignations} />
    </Paper>
  );
};

export default Resignations;
