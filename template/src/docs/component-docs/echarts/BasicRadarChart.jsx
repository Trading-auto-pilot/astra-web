import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { RadarChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([LegendComponent, TooltipComponent, RadarChart, CanvasRenderer]);

const BasicRadarChart = () => {
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
      },
      radar: {
        radius: '80%',
        splitNumber: 6,
        splitArea: {
          areaStyle: {
            color: [
              getThemeColor(vars.palette.background.paper),
              getThemeColor(vars.palette.background.elevation2),
            ],
            shadowBlur: 0,
          },
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisName: {
          color: getThemeColor(vars.palette.text.secondary),
          fontWeight: 700,
        },
        indicator: [
          { name: 'DESIGN', max: 15000 },
          { name: 'MARKETING', max: 16000 },
          { name: 'ACCOUNTS', max: 30000 },
          { name: 'LOGISTICS', max: 38000 },
          { name: 'MANAGEMENT', max: 52000 },
          { name: 'DEVELOPMENT', max: 25000 },
        ],
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [9200, 3000, 20000, 35000, 50000, 18000],
              name: 'Tangible Assets',
              lineStyle: {
                color: getThemeColor(vars.palette.chBlue[200]),
              },
            },
            {
              value: [14000, 14000, 28000, 26000, 42000, 11000],
              name: 'Gross Salary',
              lineStyle: {
                color: getThemeColor(vars.palette.chGreen[200]),
              },
            },
            {
              value: [8000, 11000, 18000, 22000, 22000, 23000],
              name: 'Direct Revenue',
              lineStyle: {
                color: getThemeColor(vars.palette.chOrange[200]),
              },
            },
          ],
        },
      ],
    }),
    [vars, getThemeColor],
  );

  return <ReactEchart echarts={echarts} option={getOptions} />;
};

export default BasicRadarChart;
