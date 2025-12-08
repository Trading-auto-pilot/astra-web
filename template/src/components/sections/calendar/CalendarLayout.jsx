import { Suspense } from 'react';
import { Outlet } from 'react-router';
import CalendarProvider from 'providers/CalendarProvider';
import PageLoader from 'components/loading/PageLoader';

const CalendarLayout = () => {
  return (
    <CalendarProvider>
      <Suspense fallback={<PageLoader sx={{ flex: 1 }} />}>
        <Outlet />
      </Suspense>
    </CalendarProvider>
  );
};
export default CalendarLayout;
