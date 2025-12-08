import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { getPastDates } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer, LegendComponent]);

const CandidatesChart = ({ ref, data, sx }) => {
  const { getThemeColor } = useSettingsContext();
  const { vars } = useTheme();

  const getOptions = useMemo(
    () => ({
      xAxis: {
        type: 'category',
        offset: 16,
        data: getPastDates(18).map((date) => dayjs(date).format('MMM D')),
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.dividerLight),
            opacity: 1,
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        offset: 8,
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: (params) => {
            if (params < 1000) return params.toString();

            const kValue = Math.floor(params / 100) / 10;
            if (Number.isInteger(kValue)) {
              return `${kValue}k`;
            }

            return `${kValue}k`;
          },
        },
      },
      series: [
        {
          type: 'bar',
          data: data,
          barCategoryGap: 0,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: getThemeColor(vars.palette.chBlue[600]),
                },
                {
                  offset: 0.025,
                  color: getThemeColor(vars.palette.chBlue[200]),
                },
                {
                  offset: 0.7,
                  color: getThemeColor(vars.palette.background.default),
                },
                {
                  offset: 1,
                  color: getThemeColor(vars.palette.background.default),
                },
              ],
              global: false,
            },
          },
        },
      ],
      grid: { left: 0, right: 0, top: 10, bottom: 0 },
    }),
    [data, getThemeColor, vars.palette],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={getOptions} sx={sx} />;
};

export default CandidatesChart;
