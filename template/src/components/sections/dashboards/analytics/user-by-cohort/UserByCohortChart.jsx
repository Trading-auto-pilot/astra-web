import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { HeatmapChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  HeatmapChart,
  CanvasRenderer,
  LegendComponent,
]);

const UserByCohortChart = ({ data, sx }) => {
  const { typography, vars, direction } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const heatmapData = useMemo(
    () =>
      data.flatMap(({ engagements }, row) =>
        engagements.map((value, col) => [col, data.length - 1 - row, value]),
      ),
    [data],
  );

  const getOptions = useMemo(
    () => ({
      gradientColor: [
        getThemeColor(vars.palette.chGrey[100]),
        getThemeColor(vars.palette.chBlue[200]),
        getThemeColor(vars.palette.chBlue[300]),
        getThemeColor(vars.palette.chBlue[400]),
      ],
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (Array.isArray(params.value)) {
            params.value = params.value[2];

            return tooltipFormatterList(params);
          }

          return tooltipFormatterList(params);
        },
      },
      legend: { show: false },
      xAxis: {
        type: 'category',
        position: 'top',
        inverse: direction === 'rtl' ? true : false,
        data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        axisTick: { show: false },
        axisLabel: {
          formatter: (_value, index) => {
            const firstCohort = data[0];
            if (!firstCohort) return `{week|Week ${index + 1}}\n{percentage|}`;
            const percentage = ((firstCohort.engagements[index] / firstCohort.count) * 100).toFixed(
              1,
            );

            return `{week|Week ${index + 1}}\n{percentage|${percentage}%}`;
          },
          align: 'center',
          interval: 0,
          rich: {
            week: {
              color: getThemeColor(vars.palette.text.secondary),
              fontSize: typography.body2.fontSize,
              fontFamily: typography.fontFamily,
              fontWeight: 500,
            },
            percentage: {
              color: getThemeColor(vars.palette.text.primary),
              fontFamily: typography.fontFamily,
              fontSize: typography.body2.fontSize,
              fontWeight: 500,
            },
          },
          lineHeight: 22.4,
          padding: 0,
        },
      },
      yAxis: {
        type: 'category',
        data: data.map((cohort) => cohort.time).reverse(),
        splitArea: { show: true },
        axisTick: { show: false },
        axisLabel: { show: false },
      },
      visualMap: {
        show: false,
      },
      series: [
        {
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: false,
          },
          itemStyle: {
            borderColor: getThemeColor(vars.palette.background.paper),
            borderWidth: 8,
          },
          emphasis: {
            disabled: true,
          },
        },
      ],
      grid: {
        outerBoundsMode: 'same',
        outerBoundsContain: 'axisLabel',
        right: 0,
        left: 0,
        bottom: 0,
        top: 0,
      },
    }),
    [vars.palette, getThemeColor, heatmapData],
  );

  return <ReactEchart echarts={echarts} option={getOptions} sx={sx} />;
};

export default UserByCohortChart;
