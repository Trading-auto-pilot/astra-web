import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer, LegendComponent]);

const CustomerFeedbackChart = ({ ref, sx, data }) => {
  const { vars, typography } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(
    () => ({
      legend: {
        data: ['Positive', 'Negative', '75th Percentile'],
        show: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        formatter: (params) => tooltipFormatterList(params, true),
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          show: false,
        },
        data: Array.from({ length: 13 }, (_, i) =>
          dayjs()
            .subtract(12 - i, 'month')
            .format('MMM YYYY'),
        ),
        axisLine: false,
        axisTick: false,
      },
      yAxis: {
        position: 'right',
        axisLabel: {
          align: 'right',
          margin: 30,
          formatter: (value) => `${Math.abs(Math.round(value / 1000))}k`,
          fontFamily: typography.fontFamily,
          color: getThemeColor(vars.palette.text.secondary),
          fontWeight: 400,
          fontSize: typography.caption.fontSize,
        },
        splitLine: false,
      },
      series: [
        {
          name: 'Positive',
          type: 'bar',
          stack: 'one',
          data: data.positive,
          barWidth: 12,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: getThemeColor(vars.palette.chBlue[200]),
          },
          emphasis: {
            disabled: true,
          },
        },
        {
          name: 'Negative',
          type: 'bar',
          stack: 'one',
          barWidth: 12,
          data: data.negative,
          itemStyle: {
            borderRadius: [0, 0, 4, 4],
            color: getThemeColor(vars.palette.chGrey[200]),
          },
          emphasis: {
            disabled: true,
          },
        },
        {
          name: '75th Percentile',
          data: data['75thPercentile'],
          type: 'line',
          smooth: 0.3,
          showSymbol: false,
          symbol: 'circle',
          zlevel: 1,
          itemStyle: {
            color: getThemeColor(vars.palette.chBlue[500]),
          },
          lineStyle: {
            width: 2,
            color: getThemeColor(vars.palette.chBlue[500]),
          },
          emphasis: {
            disabled: true,
          },
        },
      ],
      grid: { left: 0, right: 30, top: 10, bottom: 5, outerBoundsMode: 'none' },
    }),
    [vars.palette, getThemeColor, data],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={getOptions} sx={sx} />;
};

export default CustomerFeedbackChart;
