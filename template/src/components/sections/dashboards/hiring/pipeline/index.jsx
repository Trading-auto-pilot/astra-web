import { useCallback } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useGridApiRef } from '@mui/x-data-grid';
import { pipelineData as data } from 'data/hiring/dashboard';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardSelectMenu from 'components/common/DashboardSelectMenu';
import SectionHeader from 'components/common/SectionHeader';
import StyledTextField from 'components/styled/StyledTextField';
import SectionWrapper from '../common/SectionWrapper';
import PipelineTable from './PipelineTable';

const Pipeline = () => {
  const apiRef = useGridApiRef();

  const handleSearch = useCallback(
    (e) => apiRef.current?.setQuickFilterValues([e.target.value]),
    [apiRef],
  );

  return (
    <SectionWrapper>
      <SectionHeader
        title="Pipeline"
        subTitle="Current status of all hiring pipelines"
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        actionComponent={
          <Stack gap={1} flex={1} justifyContent="flex-end">
            <StyledTextField
              placeholder="Search Positions"
              fullWidth
              onChange={handleSearch}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon
                        icon="material-symbols:search"
                        sx={{ fontSize: 20, color: 'text.secondary' }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ maxWidth: { sm: 250 } }}
            />
            <DashboardSelectMenu
              defaultValue={30}
              size="medium"
              options={[
                {
                  value: 7,
                  label: 'Last Day',
                },
                {
                  value: 15,
                  label: 'Last 6 Days',
                },
                {
                  value: 30,
                  label: 'Last 30 Days',
                },
              ]}
              sx={{ maxWidth: { sm: 150 }, width: 1 }}
            />
          </Stack>
        }
      />
      <PipelineTable apiRef={apiRef} data={data} />
    </SectionWrapper>
  );
};

export default Pipeline;
