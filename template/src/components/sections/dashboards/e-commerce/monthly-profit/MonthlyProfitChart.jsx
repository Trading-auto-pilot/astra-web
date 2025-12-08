import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { getPastDates } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, LineChart, CanvasRenderer]);

const MonthlyProfitChart = ({ data, sx }) => {
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        confine: false,
        position: (point, params, dom, rect, size) => {
          const [x, y] = point;
          const [tooltipWidth, tooltipHeight] = size.contentSize;
          const [chartWidth, chartHeight] = size.viewSize;

          const posX = x + tooltipWidth > chartWidth ? x - tooltipWidth - 10 : x + 10;
          const posY = Math.max(
            10,
            Math.min(y - tooltipHeight / 2, chartHeight - tooltipHeight - 10),
          );

          return [posX, posY];
        },
        formatter: (params) => tooltipFormatterList(params, true),
      },
      xAxis: {
        type: 'category',
        data: getPastDates(7).map((date) => dayjs(date).format('MMM DD')),
        show: false,
        boundaryGap: false,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      yAxis: {
        show: false,
        type: 'value',
        boundaryGap: false,
      },
      series: [
        {
          name: 'Current year',
          type: 'line',
          data: data.currentYear,
          showSymbol: false,
          symbol: 'circle',
          zlevel: 1,
          lineStyle: {
            width: 3,
            color: getThemeColor(vars.palette.chBlue[500]),
          },
          emphasis: {
            lineStyle: {
              color: getThemeColor(vars.palette.chBlue[500]),
            },
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chBlue[500]),
          },
        },
        {
          name: 'Last year',
          type: 'line',
          data: data.lastYear,
          showSymbol: false,
          symbol: 'circle',
          lineStyle: {
            width: 1,
            color: getThemeColor(vars.palette.chGrey[300]),
          },
          emphasis: {
            lineStyle: {
              color: getThemeColor(vars.palette.chGrey[300]),
            },
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chGrey[300]),
          },
        },
      ],
      grid: { left: 5, right: '5%', top: 5, bottom: '5%' },
    }),
    [vars.palette, getThemeColor, data],
  );

  return <ReactEchart echarts={echarts} option={getOptions} sx={sx} />;
};

export default MonthlyProfitChart;
