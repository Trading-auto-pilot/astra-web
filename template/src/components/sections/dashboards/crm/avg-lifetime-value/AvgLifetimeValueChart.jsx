import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { getPastDates } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, LineChart, CanvasRenderer, LegendComponent]);

const AvgLifetimeValueChart = ({ ref, sx, data }) => {
  const { vars, direction } = useTheme();
  const { getThemeColor } = useSettingsContext();
  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: getThemeColor(vars.palette.divider),
            type: 'solid',
          },
          z: 1,
        },
        formatter: (params) => tooltipFormatterList(params, true),
      },
      legend: {
        data: ['CAC', 'LTV', 'CCR'],
        show: false,
      },
      xAxis: {
        inverse: direction === 'rtl',
        type: 'category',
        data: getPastDates('month').map((date) => {
          return dayjs(date).format('MMM YYYY');
        }),
        splitLine: {
          show: true,
          interval: (index) => index % 6 === 0,
          lineStyle: {
            color: getThemeColor(vars.palette.dividerLight),
          },
        },
        axisLine: false,
        axisTick: false,
        axisLabel: false,
      },
      yAxis: {
        type: 'value',
        splitNumber: 4,
        splitLine: {
          show: true,
          lineStyle: {
            color: getThemeColor(vars.palette.dividerLight),
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: false,
        axisLabel: false,
      },
      series: [
        {
          name: 'CAC',
          type: 'line',
          data: data.cac,
          showSymbol: false,
          symbol: 'circle',
          lineStyle: {
            width: 2,
            color: getThemeColor(vars.palette.chGreen[500]),
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chGreen[500]),
          },
        },
        {
          name: 'LTV',
          type: 'line',
          data: data.ltv,
          showSymbol: false,
          symbol: 'circle',
          lineStyle: {
            width: 2,
            color: getThemeColor(vars.palette.chLightBlue[500]),
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chLightBlue[500]),
          },
        },
        {
          name: 'Average',
          type: 'line',
          data: data.cac.map((value, index) => (value + data.ltv[index]) / 2),
          showSymbol: false,
          symbol: 'circle',
          lineStyle: {
            width: 1,
            color: getThemeColor(vars.palette.chOrange[500]),
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chOrange[500]),
          },
        },
      ],
      grid: { left: -6, right: -6, top: 0, bottom: 0, outerBoundsMode: 'none' },
    }),
    [vars.palette, getThemeColor, data],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={getOptions} sx={sx} />;
};

export default AvgLifetimeValueChart;
