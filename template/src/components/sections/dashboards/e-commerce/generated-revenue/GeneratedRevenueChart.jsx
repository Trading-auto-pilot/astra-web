import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { cssVarRgba, getPastDates } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, LineChart, CanvasRenderer, LegendComponent]);

const GeneratedRevenueChart = ({ sx, data, ref }) => {
  const { vars, typography } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: getThemeColor(vars.palette.chGrey[300]),
            type: 'solid',
          },
          z: 1,
        },
        formatter: (params) => tooltipFormatterList(params, true),
      },
      legend: {
        data: ['lastYear', 'thisYear'],
        show: false,
      },
      xAxis: {
        type: 'category',
        data: getPastDates(15).map((date) => {
          return dayjs(date).format('MMM DD');
        }),
        boundaryGap: false,
        show: true,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: true,
          interval: 0,
          lineStyle: {
            color: getThemeColor(vars.palette.chGrey[200]),
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          fontFamily: typography.fontFamily,
          color: getThemeColor(vars.palette.text.secondary),
        },
      },
      yAxis: {
        show: false,
        type: 'value',
        boundaryGap: false,
      },
      series: [
        {
          name: 'This year',
          type: 'line',
          data: data.currentYear,
          showSymbol: false,
          symbolSize: 8,
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
            itemStyle: {
              borderWidth: 16,
              borderColor: cssVarRgba(getThemeColor(vars.palette.chBlue['500Channel']), 0.2),
              color: getThemeColor(vars.palette.chBlue[900]),
            },
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chBlue[500]),
          },
        },
        {
          type: 'line',
          name: 'Last year',
          data: data.lastYear,
          showSymbol: true,
          symbolSize: 8,
          symbol: 'circle',
          lineStyle: {
            width: 3,
            color: getThemeColor(vars.palette.chGrey[200]),
          },
          emphasis: {
            lineStyle: {
              color: getThemeColor(vars.palette.chGrey[300]),
            },
            itemStyle: {
              borderWidth: 16,
              borderColor: cssVarRgba(getThemeColor(vars.palette.text.primaryChannel), 0.2),
              color: getThemeColor(vars.palette.text.primary),
            },
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chGrey[500]),
          },
        },
      ],
      grid: { left: 20, right: 20, top: 0, bottom: 25, outerBoundsMode: 'none' },
    }),
    [data, vars.palette, getThemeColor, typography.fontFamily],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={getOptions} sx={sx} />;
};

export default GeneratedRevenueChart;
