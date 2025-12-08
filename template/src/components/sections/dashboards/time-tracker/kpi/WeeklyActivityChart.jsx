import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { weeks } from 'data/weeks';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { cssVarRgba } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
]);

const WeeklyActivityChart = ({ data, sx, ...rest }) => {
  const theme = useTheme();
  const { getThemeColor } = useSettingsContext();
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: 'Activity: {c}%',
      },
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        containerLabel: true,
      },
      xAxis: {
        type: 'category',
        data: weeks,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        boundaryGap: 0,
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        minInterval: 10,
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          data,
          type: 'line',
          smooth: true,
          showSymbol: false,
          symbol: 'none',
          lineStyle: {
            width: 2,
            type: 'solid',
            cap: 'round',
            color: getThemeColor(theme.vars.palette.chBlue[500]),
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: cssVarRgba(getThemeColor(theme.vars.palette.chBlue['500Channel']), 0.5),
              },
              {
                offset: 1,
                color: cssVarRgba(getThemeColor(theme.vars.palette.chBlue['500Channel']), 0.1),
              },
            ]),
          },
          emphasis: {
            disabled: true,
          },
        },
      ],
    }),
    [theme.vars.palette, getThemeColor, data],
  );

  return <ReactEchart echarts={echarts} option={option} sx={sx} {...rest} />;
};

export default WeeklyActivityChart;
