import { Outlet } from 'react-router';
import HiringProvider from 'providers/HiringProvider';

const HiringRoot = () => {
  return (
    <HiringProvider>
      <Outlet />
    </HiringProvider>
  );
};

export default HiringRoot;
