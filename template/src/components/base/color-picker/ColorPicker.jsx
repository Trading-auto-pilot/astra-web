import { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Button, Popover } from '@mui/material';
import { Sketch } from '@uiw/react-color';
import { hexToHsva, hsvaToHexa } from '@uiw/react-color';
import useNumberFormat from 'hooks/useNumberFormat';
import IconifyIcon from 'components/base/IconifyIcon';
import InputFormats from './InputFormats';
import SwatchBox from './SwatchBox';

const ColorPicker = ({ value, onChange, id }) => {
  const { numberFormat } = useNumberFormat();
  const [anchorEl, setAnchorEl] = useState(null);
  const initialHsva = useMemo(() => hexToHsva(value), [value]);
  const initialHexa = useMemo(() => {
    const hex = hsvaToHexa(initialHsva);

    return {
      hex: initialHsva.a === 1 ? hex.slice(0, 7) : hex,
      alpha: initialHsva.a,
    };
  }, [initialHsva]);
  const [hsva, setHsva] = useState({ ...initialHsva });
  const [hexa, setHexa] = useState({ ...initialHexa });
  const debounceRef = useRef(null);
  const buttonRef = useRef(null);

  const updateColor = useCallback(
    (color) => {
      const formattedHex = hsvaToHexa(color);
      const alpha = numberFormat(color.a, { maximumFractionDigits: 2 });
      setHsva(color);
      setHexa({ hex: Number(alpha) === 1 ? formattedHex.slice(0, 7) : formattedHex, alpha });

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onChange(formattedHex);
      }, 300);
    },
    [onChange, numberFormat],
  );

  const updateHexaColor = useCallback(
    (color) => {
      if (color.hex.length > 2) {
        const parsedHsva = hexToHsva(color.hex);
        const alpha = Number(color.alpha);
        const newHsva = { ...parsedHsva, a: isNaN(alpha) ? 1 : alpha };
        updateColor(newHsva);
      }
    },
    [updateColor],
  );

  const handleColorChange = useCallback(
    (color) => {
      updateColor(color.hsva);
    },
    [updateColor],
  );

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? `${id}-popover` : undefined;

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Button
        variant="text"
        color="neutral"
        onClick={handleClick}
        ref={buttonRef}
        sx={{ p: 1, minWidth: 40 }}
        endIcon={
          <IconifyIcon
            icon="material-symbols:keyboard-arrow-down-rounded"
            fontSize="20px !important"
          />
        }
      >
        <Box
          sx={(theme) => ({
            width: 20,
            height: 20,
            borderRadius: 1,
            bgcolor: hsvaToHexa(hsva),
            border: `1px solid ${theme.vars.palette.dividerLight}`,
          })}
        />
      </Button>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box
          sx={(theme) => ({
            width: 344,
            bgcolor: theme.vars.palette.background.default,
            border: `1px solid ${theme.vars.palette.dividerLight}`,
            overflow: 'hidden',
            borderRadius: 2,
          })}
        >
          <Sketch color={hsva} onChange={handleColorChange} />
          <InputFormats
            hsva={hsva}
            hexa={hexa}
            updateHexaColor={updateHexaColor}
            handleColorChange={handleColorChange}
          />
          <SwatchBox color={hexa.hex.slice(0, 7)} updateHexaColor={updateHexaColor} />
        </Box>
      </Popover>
    </Box>
  );
};

export default ColorPicker;
