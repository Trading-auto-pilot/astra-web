import { useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import { default as ReactEChartsCore } from 'echarts-for-react/lib/core';
import merge from 'lodash.merge';
import { grey } from 'theme/palette/colors';

const ReactEchart = ({ option, ref, ...rest }) => {
  const theme = useTheme();

  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  const defaultTooltip = useMemo(
    () => ({
      padding: [7, 10],
      axisPointer: {
        type: 'none',
      },
      textStyle: {
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 400,
        fontSize: 12,
        color: theme.vars.palette.common.white,
      },
      backgroundColor: grey[800],
      borderWidth: 0,
      borderColor: theme.vars.palette.menuDivider,
      extraCssText: 'box-shadow: none;',
      transitionDuration: 0,
      confine: true,
      triggerOn: isTouchDevice ? 'click' : 'mousemove|click',
      ...theme.applyStyles('dark', {
        backgroundColor: grey[900],
        borderWidth: 1,
      }),
    }),
    [theme, option],
  );

  return (
    <Box
      component={ReactEChartsCore}
      ref={ref}
      option={{
        ...option,
        tooltip: merge(defaultTooltip, option.tooltip),
      }}
      {...rest}
    />
  );
};

ReactEchart.displayName = 'ReactEchart';

export default ReactEchart;
