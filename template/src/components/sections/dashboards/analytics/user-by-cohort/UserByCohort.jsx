import { Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import SimpleBar from 'components/base/SimpleBar';
import DashboardSelectMenu from 'components/common/DashboardSelectMenu';
import SectionHeader from 'components/common/SectionHeader';
import UserByCohortChart from './UserByCohortChart';

const UserByCohort = ({ data }) => {
  return (
    <Paper component={Stack} sx={{ p: { xs: 3, md: 5 }, height: 1, flexDirection: 'column' }}>
      <SectionHeader
        title="User activity by Cohort"
        subTitle="Detail information of the products"
        actionComponent={
          <DashboardSelectMenu
            defaultValue="count"
            options={[
              {
                value: 'count',
                label: 'Count Per User',
              },
              {
                value: 'retention',
                label: 'Retention Rate',
              },
              {
                value: 'sessions',
                label: 'Sessions Per User',
              },
            ]}
            sx={{ minWidth: 0 }}
          />
        }
        sx={{ mb: 3, flexWrap: 'wrap' }}
      />

      <SimpleBar sx={{ flex: 1, height: 349 }}>
        <Stack sx={{ height: 1, minWidth: 600 }}>
          <Table sx={{ width: 'auto' }}>
            <TableHead>
              <TableRow
                sx={{
                  height: 48,
                  '& th': { bgcolor: 'transparent', fontWeight: 400, color: 'text.secondary' },
                }}
              >
                <TableCell sx={{ width: 140, pl: '0px !important' }}>Acquisition</TableCell>
                <TableCell sx={{ width: 72 }}>Users</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.time} sx={{ minHeight: { xl: 78 }, td: { border: 0 } }}>
                  <TableCell sx={{ pl: '0px !important', whiteSpace: 'nowrap' }}>
                    {row.time}
                  </TableCell>
                  <TableCell>{row.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Stack sx={{ flex: 1 }}>
            <UserByCohortChart data={data} sx={{ width: 1, height: '100% !important' }} />
          </Stack>
        </Stack>
      </SimpleBar>
    </Paper>
  );
};

export default UserByCohort;
