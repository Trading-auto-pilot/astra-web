import { useEffect, useMemo, useRef } from 'react';
import { useTheme } from '@mui/material';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { getRandomNumber } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer, LegendComponent]);

const data = [
  17, 18, 19, 27, 23, 22, 16, 19, 27, 17, 30, 20, 25, 10, 25, 23, 18, 15, 24, 11, 16, 22, 29, 20,
  19, 11, 25, 25, 27, 21,
];

const axisData = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30,
];

const RealtimeEngagementChart = ({ sx, updateUserCounter }) => {
  const chartRef = useRef(null);
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        formatter: (params) => {
          return params
            .map((el) => `${el.seriesName} : ${isNaN(Number(el.value)) ? 0 : el.value}`)
            .join();
        },
      },
      xAxis: {
        type: 'category',

        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        boundaryGap: [0.2, 0.2],
        data: axisData,
      },

      yAxis: {
        type: 'value',
        scale: true,
        boundaryGap: false,
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        min: 0,
        max: 30,
      },
      series: [
        {
          name: 'Users',
          type: 'bar',
          barGap: 5,
          data,
          itemStyle: {
            color: getThemeColor(vars.palette.chBlue[200]),
            borderRadius: [2, 2, 0, 0],
          },
        },
      ],
      grid: {
        right: 0,
        left: 0,
        bottom: 0,
        top: 0,
      },
    }),
    [vars.palette, getThemeColor, data],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const rndData = getRandomNumber(10, 30);
      data.shift();
      data.push(rndData);
      axisData.shift();
      axisData.push(axisData[axisData.length - 1] + 1);
      updateUserCounter(rndData);

      chartRef?.current?.getEchartsInstance()?.setOption({
        xAxis: {
          data: axisData,
        },
        series: [
          {
            data,
          },
        ],
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return <ReactEchart ref={chartRef} echarts={echarts} option={getOptions} sx={sx} />;
};

export default RealtimeEngagementChart;
