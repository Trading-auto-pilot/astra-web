import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { getPastDates } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

const VisitorRevenueChart = ({ data, sx }) => {
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
        data: getPastDates(8).map((date) => dayjs(date).format('MMM DD')),
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
          type: 'bar',
          data: data.currentYear,
          barWidth: '4px',
          barGap: 1,
          label: { show: false },
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
            color: getThemeColor(vars.palette.chBlue[500]),
          },
        },
        {
          name: 'Last year',
          type: 'bar',
          data: data.lastYear,
          barWidth: '4px',
          barGap: '100%',
          label: { show: false },
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
            color: getThemeColor(vars.palette.chGrey[300]),
          },
        },
      ],
      grid: {
        outerBoundsMode: 'none',
        left: '5%',
        right: '-5%',
        top: 0,
        bottom: '5%',
      },
    }),
    [vars.palette, getThemeColor, data],
  );

  return <ReactEchart echarts={echarts} option={getOptions} sx={sx} />;
};

export default VisitorRevenueChart;
