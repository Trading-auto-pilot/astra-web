import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { weeks } from 'data/weeks';
import { LineChart } from 'echarts/charts';
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
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
]);

const ProjectsWorkedChart = ({ data, sx, ...rest }) => {
  const theme = useTheme();
  const { getThemeColor } = useSettingsContext();

  const option = useMemo(
    () => ({
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
        containerLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => tooltipFormatterList(params, true),
      },
      xAxis: {
        type: 'category',
        data: weeks,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        boundaryGap: 0,
      },
      yAxis: {
        type: 'value',
        min: 1,
        max: 15,
        minInterval: 1,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      series: [
        {
          name: 'Last Week',
          data: data.lastWeek,
          type: 'line',
          smooth: true,
          showSymbol: false,
          symbol: 'circle',
          itemStyle: {
            color: getThemeColor(theme.vars.palette.chBlue[500]),
          },
          lineStyle: {
            width: 2,
            type: 'solid',
            cap: 'round',
            color: getThemeColor(theme.vars.palette.chBlue[500]),
          },
          z: 2,
        },
        {
          name: 'Prev Week',
          data: data.prevWeek,
          type: 'line',
          smooth: true,
          showSymbol: false,
          symbol: 'circle',
          itemStyle: {
            color: getThemeColor(theme.vars.palette.chGrey[300]),
          },
          lineStyle: {
            width: 2,
            type: 'dashed',
            cap: 'round',
            color: getThemeColor(theme.vars.palette.chGrey[300]),
          },
          z: 1,
        },
      ],
    }),
    [theme.vars.palette, getThemeColor, data],
  );

  return <ReactEchart echarts={echarts} option={option} sx={sx} {...rest} />;
};

export default ProjectsWorkedChart;
