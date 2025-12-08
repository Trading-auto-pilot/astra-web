import { useFormContext } from 'react-hook-form';
import { MenuItem } from '@mui/material';
import { cssVarRgba } from 'lib/utils';

const ConfigMenuItem = ({ active, children, value, fieldName, disabled, ...props }) => {
  const { setValue } = useFormContext();

  const isLayout = fieldName === 'layout';

  const handleClick = () => {
    setValue(fieldName, value);
  };

  return (
    <MenuItem
      {...props}
      onClick={handleClick}
      disabled={disabled}
      sx={[
        {
          height: { xs: 42, md: isLayout ? 50 : 42 },
          borderRadius: 2,
          color: 'common.white',
          opacity: active ? 1 : 0.5,
          bgcolor: ({ vars }) => cssVarRgba(vars.palette.common.whiteChannel, active ? 0.16 : 0.08),

          '&:hover': {
            opacity: 1,
            bgcolor: ({ vars }) =>
              `${cssVarRgba(vars.palette.common.whiteChannel, 0.16)} !important`,
          },
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {children}
    </MenuItem>
  );
};

export default ConfigMenuItem;
