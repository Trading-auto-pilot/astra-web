import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { getRandomNumber } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer, LegendComponent]);

const RealtimeActivityChart = ({ sx }) => {
  const chartRef = useRef(null);
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();
  const [visibleBars, setVisibleBars] = useState(100);
  const [data, setData] = useState(
    Array(visibleBars)
      .fill(50)
      .map(() => getRandomNumber(40, 100)),
  );

  const startTime = dayjs().hour(9).minute(0).second(0);
  const [axisData, setAxisData] = useState(
    Array.from({ length: visibleBars }, (_, i) => {
      const start = startTime.add(i * 5, 'minute').format('h:mmA');
      const end = startTime.add((i + 1) * 5, 'minute').format('h:mmA');

      return `${start}-${end}`;
    }),
  );

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        formatter: (params) => {
          return `<div>
            <p style="font-size:12px; text-align:center">${params[0].name}</p>
            <p style="font-size:12px; text-align:center">${params[0].seriesName}: ${params[0].value}%</p>
          </div>`;
        },
      },
      xAxis: {
        type: 'category',
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        data: axisData,
      },
      yAxis: {
        type: 'value',
        scale: true,
        boundaryGap: false,
        axisLabel: { show: false },
        splitLine: { show: false },
        min: 0,
        max: 100,
      },
      series: [
        {
          name: 'Activity',
          type: 'bar',
          barGap: 4,
          data,
          itemStyle: {
            opacity: 0.48,
            color: getThemeColor(vars.palette.common.white),
            borderRadius: [2, 2, 0, 0],
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
              color: getThemeColor(vars.palette.common.white),
            },
          },
          barWidth: 8,
        },
      ],
      grid: { right: 0, left: 0, bottom: 0, top: 0 },
    }),
    [vars.palette, data, axisData, getThemeColor],
  );

  useEffect(() => {
    const updateBars = () => {
      if (chartRef.current) {
        const chartWidth = chartRef.current
          .getEchartsInstance()
          .getDom()
          .getBoundingClientRect().width;
        const newVisibleBars = Math.floor(chartWidth / 11);
        setVisibleBars(newVisibleBars);

        setData((prevData) => {
          if (prevData.length < newVisibleBars) {
            const additionalData = Array(newVisibleBars - prevData.length)
              .fill(0)
              .map(() => getRandomNumber(40, 100));

            return [...prevData, ...additionalData];
          }

          return prevData.slice(0, newVisibleBars);
        });

        setAxisData((prevAxis) => {
          if (prevAxis.length < newVisibleBars) {
            const lastBarTime = dayjs(prevAxis[prevAxis.length - 1].split('-')[1], 'h:mmA');
            const additionalAxisData = Array.from(
              { length: newVisibleBars - prevAxis.length },
              (_, i) => {
                const start = lastBarTime.add(i * 5, 'minute').format('h:mmA');
                const end = lastBarTime.add((i + 1) * 5, 'minute').format('h:mmA');

                return `${start}-${end}`;
              },
            );

            return [...prevAxis, ...additionalAxisData];
          }

          return prevAxis.slice(0, newVisibleBars);
        });
      }
    };

    updateBars();
    window.addEventListener('resize', updateBars);

    return () => window.removeEventListener('resize', updateBars);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1), getRandomNumber(20, 100)];

        return newData;
      });
      setAxisData((prevAxis) => {
        const lastTime = dayjs(prevAxis[prevAxis.length - 1].split('-')[1], 'h:mmA');
        const newStart = lastTime.format('h:mmA');
        const newEnd = lastTime.add(5, 'minute').format('h:mmA');

        return [...prevAxis.slice(1), `${newStart}-${newEnd}`];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return <ReactEchart ref={chartRef} echarts={echarts} option={getOptions} sx={sx} />;
};

export default RealtimeActivityChart;
