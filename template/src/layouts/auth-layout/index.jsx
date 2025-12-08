import { Suspense } from 'react';
import { Outlet } from 'react-router';
import useSettingsPanelMountEffect from 'hooks/useSettingsPanelMountEffect';
import Splash from 'components/loading/Splash';

const AuthLayout = () => {
  useSettingsPanelMountEffect({
    disableNavigationMenuSection: true,
    disableSidenavShapeSection: true,
    disableTopShapeSection: true,
    disableNavColorSection: true,
  });

  return (
    <Suspense fallback={<Splash />}>
      <Outlet />
    </Suspense>
  );
};

export default AuthLayout;
