import { cssVarRgba } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import NeutralButton from '../../common/NeutralButton';

const FloatingButton = ({ isDark, ref }) => {
  return (
    <NeutralButton
      ref={ref}
      size="large"
      shape="circle"
      sx={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 20,
        scale: 0,
        opacity: 0,
        width: 120,
        height: 120,
        backdropFilter: 'blur(4px)',
        ...(!isDark && {
          bgcolor: ({ vars }) => cssVarRgba(vars.palette.common.blackChannel, 0.4),
        }),
      }}
    >
      <IconifyIcon icon="material-symbols:arrow-outward-rounded" fontSize={24} />
    </NeutralButton>
  );
};

export default FloatingButton;
