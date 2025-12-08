import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { getPastDates } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([GridComponent, CanvasRenderer, LineChart]);

const HoursCompletedChart = ({ sx, data }, ref) => {
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          z: 1,
          lineStyle: {
            color: getThemeColor(vars.palette.chGrey[300]),
            type: 'solid',
          },
        },
        formatter: (params) => tooltipFormatterList(params),
      },
      xAxis: {
        data: getPastDates(9).map((date) => {
          return dayjs(date).format('MMM DD');
        }),
        boundaryGap: false,
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: true,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: getThemeColor(vars.palette.divider),
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          align: 'left',
          margin: 30,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: getThemeColor(vars.palette.divider),
          },
        },
      },
      series: [
        {
          name: 'Aurora',
          type: 'line',
          data: data.aurora,
          zlevel: 1,
          lineStyle: {
            color: getThemeColor(vars.palette.primary.main),
            width: 1,
          },
          itemStyle: {
            color: getThemeColor(vars.palette.primary.main),
          },
          showSymbol: false,
        },
        {
          name: 'Falcon',
          type: 'line',
          data: data.falcon,
          zlevel: 2,
          lineStyle: {
            color: getThemeColor(vars.palette.warning.main),
            width: 2,
          },
          itemStyle: {
            color: getThemeColor(vars.palette.warning.main),
          },
          showSymbol: false,
        },
        {
          name: 'Phoenix',
          type: 'line',
          data: data.phoenix,
          lineStyle: {
            color: getThemeColor(vars.palette.chBlue[200]),
            width: 1,
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chBlue[200]),
          },
          showSymbol: false,
        },
      ],
      grid: {
        left: 30,
        right: 20,
        top: 6,
        bottom: 22,
        outerBoundsMode: 'none',
      },
    };
  }, [data, vars.palette, getThemeColor]);

  return <ReactEchart ref={ref} echarts={echarts} option={getOptions} sx={sx} />;
};

export default HoursCompletedChart;
