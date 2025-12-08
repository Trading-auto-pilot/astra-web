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

const TotalHoursChart = ({ data, sx, ...rest }) => {
  const theme = useTheme();
  const { getThemeColor } = useSettingsContext();

  const option = useMemo(
    () => ({
      tooltip: {
        formatter: '{c} Hours',
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
          boundaryGap: false,
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
          min: 0,
          max: Math.max(10, Math.max(...data)),
          minInterval: 1,
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
          name: 'Hours',
          type: 'bar',
          barWidth: 12,
          showBackground: true,
          backgroundStyle: {
            color: getThemeColor(theme.vars.palette.chBlue[50]),
            borderRadius: [16, 16, 16, 16],
          },
          data,
          itemStyle: {
            color: getThemeColor(theme.vars.palette.chBlue[200]),
            borderRadius: [16, 16, 16, 16],
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

export default TotalHoursChart;
