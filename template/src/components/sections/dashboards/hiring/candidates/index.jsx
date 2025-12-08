import { useRef } from 'react';
import { candidatesData as data } from 'data/hiring/dashboard';
import DashboardSelectMenu from 'components/common/DashboardSelectMenu';
import SectionHeader from 'components/common/SectionHeader';
import SectionWrapper from '../common/SectionWrapper';
import CandidatesChart from './CandidatesChart';

const Candidates = () => {
  const chartRef = useRef(null);

  return (
    <SectionWrapper>
      <SectionHeader
        title="Candidates"
        subTitle="Summary of candidate engagement"
        direction={{ xs: 'column', sm: 'row' }}
        actionComponent={
          <DashboardSelectMenu
            size="medium"
            defaultValue={30}
            sx={{ width: { xs: '50%', sm: 150 } }}
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
          />
        }
      />
      <CandidatesChart ref={chartRef} data={data} sx={{ height: '240px !important' }} />
    </SectionWrapper>
  );
};

export default Candidates;
