import { useState } from 'react';
import Resizable from 'components/base/Resizable';

const ResizableSidebar = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(280);

  const handleResize = (width) => {
    setSidebarWidth(width);
  };

  return (
    <Resizable
      size={{ width: sidebarWidth, height: '100%' }}
      handleResize={handleResize}
      sx={{
        maxWidth: { md: '50%', xl: 'calc(100% - 824px)' },
        minWidth: { md: 340, lg: 404 },
        ['.resizable-handler']: {
          width: '6px !important',
          outlineWidth: 1,
          outlineColor: 'divider',
        },
      }}
    >
      {children}
    </Resizable>
  );
};

export default ResizableSidebar;
