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

const AcquisitionCostChart = ({ ref, sx, data }) => {
  const { vars, typography } = useTheme();
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
        formatter: (params) => tooltipFormatterList(params),
      },
      legend: {
        data: ['Allotted', 'Used'],
        show: false,
      },
      xAxis: {
        type: 'category',
        data: getPastDates('week').map((date) => dayjs(date).format('ddd')),
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.divider),
          },
        },
        axisTick: {
          alignWithLabel: true,
          length: 9,
          lineStyle: {
            color: getThemeColor(vars.palette.divider),
          },
        },
        axisLabel: {
          show: true,
          fontFamily: typography.fontFamily,
          color: getThemeColor(vars.palette.text.secondary),
          fontWeight: 400,
          fontSize: typography.overline.fontSize,
          margin: 13,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: false,
        axisLabel: false,
        splitLine: false,
      },
      series: [
        {
          name: 'Allotted',
          type: 'line',
          step: 'end',
          data: data.allotted,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: {
            width: 1,
            color: getThemeColor(vars.palette.chBlue[500]),
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chBlue[500]),
          },
        },
        {
          name: 'Used',
          type: 'line',
          step: 'start',
          data: data.used,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: {
            width: 1,
            color: getThemeColor(vars.palette.chGrey[300]),
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chGrey[300]),
          },
        },
      ],
      grid: { left: 20, right: 20, top: 30, bottom: 25, outerBoundsMode: 'none' },
    }),
    [vars.palette, getThemeColor, data],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={getOptions} sx={sx} />;
};

export default AcquisitionCostChart;
