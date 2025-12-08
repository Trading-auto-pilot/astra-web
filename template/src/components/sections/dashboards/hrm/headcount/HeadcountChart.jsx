import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { BarChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([LegendComponent, TooltipComponent, BarChart, CanvasRenderer]);

const HeadcountChart = ({ ref, sx, data }) => {
  const { vars, typography } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const option = useMemo(
    () => ({
      grid: { left: 25, right: 0, top: 10, bottom: 50 },
      tooltip: {
        formatter: (params) => tooltipFormatterList(params),
      },
      legend: {
        show: false,
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.period),
        axisLabel: {
          rotate: 47,
          margin: 35,
          fontSize: 12,
          align: 'center',
          color: getThemeColor(vars.palette.text.disabled),
          fontFamily: typography.fontFamily,
          padding: [0, 0, 0, 5],
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: getThemeColor(vars.palette.text.disabled) },
        splitLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.chGrey[200]),
          },
        },
      },
      series: [
        {
          name: 'Involuntary',
          type: 'bar',
          stack: 'total',
          barWidth: 8,
          data: data.map((item) => item.stats.involuntary),
          itemStyle: {
            borderWidth: 1,
            borderColor: vars.palette.background.elevation1,
            borderRadius: [5, 5, 0, 0],
            color: getThemeColor(vars.palette.chBlue[200]),
          },
        },
        {
          name: 'Voluntary',
          type: 'bar',
          stack: 'total',
          barWidth: 8,
          data: data.map((item) => item.stats.voluntary),
          itemStyle: {
            borderWidth: 1,
            borderColor: getThemeColor(vars.palette.background.elevation1),
            borderRadius: [5, 5, 0, 0],
            color: getThemeColor(vars.palette.chBlue[100]),
          },
        },
        {
          name: 'Other',
          type: 'bar',
          stack: 'total',
          barWidth: 8,
          data: data.map((item) => item.stats.other),
          itemStyle: {
            borderWidth: 1,
            borderColor: getThemeColor(vars.palette.background.elevation1),
            borderRadius: [5, 5, 0, 0],
            color: getThemeColor(vars.palette.chGrey[200]),
          },
        },
      ],
    }),
    [vars.palette, getThemeColor, data],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={option} sx={sx} />;
};

export default HeadcountChart;
