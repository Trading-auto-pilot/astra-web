import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { weeks } from 'data/weeks';
import { BarChart } from 'echarts/charts';
import { AxisPointerComponent, GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([BarChart, TooltipComponent, GridComponent, AxisPointerComponent, CanvasRenderer]);

const EarnedThisWeekChart = ({ data, sx, ...rest }) => {
  const theme = useTheme();
  const { getThemeColor } = useSettingsContext();
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: 'Earned: ${c}',
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        outerBoundsMode: 'same',
        outerBoundsContain: 'axisLabel',
      },
      xAxis: [
        {
          type: 'category',
          data: weeks.map((item) => item.slice(0, 3)),
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: getThemeColor(theme.vars.palette.text.secondary),
            fontSize: theme.typography.caption.fontSize,
            fontFamily: theme.typography.fontFamily,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 10,
          minInterval: 10,
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: 'Earned This Week',
          type: 'bar',
          barWidth: 24,
          data,
          itemStyle: {
            color: getThemeColor(theme.vars.palette.chGrey[200]),
            borderRadius: [4, 4, 4, 4],
          },
          emphasis: {
            itemStyle: {
              color: getThemeColor(theme.vars.palette.chBlue[400]),
            },
          },
        },
      ],
    }),
    [theme.vars.palette, getThemeColor, data],
  );

  return <ReactEchart echarts={echarts} option={option} sx={sx} {...rest} />;
};

export default EarnedThisWeekChart;
