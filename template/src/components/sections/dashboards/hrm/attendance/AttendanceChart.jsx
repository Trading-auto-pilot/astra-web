import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

const AttendanceChart = ({ data, sx }) => {
  const { vars, direction, typography } = useTheme();
  const { getThemeColor } = useSettingsContext();
  const { summary } = data;

  const option = useMemo(
    () => ({
      grid:
        direction === 'rtl'
          ? { left: -20, right: 25, top: 5, bottom: 5, outerBoundsMode: 'none' }
          : { left: 35, right: -20, top: 5, bottom: 5, outerBoundsMode: 'none' },
      tooltip: {
        formatter: (params) => tooltipFormatterList(params),
      },
      xAxis: {
        type: 'category',
        data: summary.map((item) => item.status),
        inverse: direction === 'rtl' ? true : false,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          rotate: direction === 'rtl' ? -90 : 90,
          inside: true,
          fontSize: 14,
          fontFamily: typography.fontFamily,
          rich: {
            green: { color: getThemeColor(vars.palette.success.main) },
            orange: { color: getThemeColor(vars.palette.warning.main) },
            red: { color: getThemeColor(vars.palette.error.main) },
            blue: { color: getThemeColor(vars.palette.primary.main) },
          },
          formatter: (value) => {
            const colorMap = {
              'ON TIME': 'green',
              DELAYED: 'orange',
              ABSENT: 'red',
              LEAVE: 'blue',
            };

            return `{${colorMap[value]}|${value}}`;
          },
          verticalAlign: 'bottom',
          padding: [0, 0, 8, 0],
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 30,
        position: direction === 'rtl' ? 'right' : 'left',
        axisLabel: {
          color: getThemeColor(vars.palette.text.disabled),
          fontFamily: typography.fontFamily,
          padding: [0, 10, 0, 0],
        },
        splitLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.chGrey[200]),
          },
        },
      },
      series: [
        {
          data: summary.map((item) => item.count),
          type: 'bar',
          barWidth: 8,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: (params) => {
              const colors = [
                getThemeColor(vars.palette.chGreen[100]),
                getThemeColor(vars.palette.chOrange[100]),
                getThemeColor(vars.palette.chRed[100]),
                getThemeColor(vars.palette.chBlue[100]),
              ];

              return colors[params.dataIndex];
            },
          },
        },
      ],
    }),
    [data, vars.palette, getThemeColor],
  );

  return <ReactEchart echarts={echarts} option={option} sx={sx} />;
};

export default AttendanceChart;
