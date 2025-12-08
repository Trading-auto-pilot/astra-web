import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { LineChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { cssVarRgba, getPastDates } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

const data = {
  currentYear: [
    200000, 120000, 160000, 140000, 260000, 160000, 175000, 180000, 110000, 130000, 80000, 160000,
    160000, 150000, 90000,
  ],
  lastYear: [
    100000, 150000, 95000, 95000, 98000, 140000, 130000, 150000, 150000, 160000, 255000, 140000,
    140000, 160000, 160000,
  ],
};

echarts.use([TooltipComponent, LineChart, CanvasRenderer]);

const SimpleLineChart = () => {
  const { vars, typography } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = {
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
      valueFormatter: (value) => `$${Number(value) / 1000}K`,
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
    grid: { left: 20, right: 20, top: 0, bottom: 25 },
  };

  return <ReactEchart echarts={echarts} option={getOptions} />;
};

export default SimpleLineChart;
