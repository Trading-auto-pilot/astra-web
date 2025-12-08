import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

const data = [
  {
    name: 'Alligator',
    value: 29.7,
  },
  {
    name: 'CheckMark',
    value: 31.9,
  },
  {
    name: 'Stripes',
    value: 23.0,
  },
  {
    name: 'Head & Mead',
    value: 14.4,
  },
];

echarts.use([TooltipComponent, PieChart, CanvasRenderer]);

const DoughnutPieChart = () => {
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(
    () => ({
      color: [
        getThemeColor(vars.palette.chGrey[500]),
        getThemeColor(vars.palette.chBlue[400]),
        getThemeColor(vars.palette.chGrey[300]),
        getThemeColor(vars.palette.chBlue[300]),
      ],
      tooltip: {
        trigger: 'item',
        formatter: (params) => `<strong>${params.name}:</strong> ${params.percent}%`,
      },
      legend: { show: false },
      series: [
        {
          type: 'pie',
          padAngle: 1,
          radius: ['100%', '94%'],
          avoidLabelOverlap: false,
          emphasis: {
            scale: false,
            itemStyle: {
              color: 'inherit',
            },
          },
          itemStyle: {
            borderRadius: 2,
            borderWidth: 1,
            borderColor: 'transparent',
          },
          label: {
            show: false,
            emphasis: {
              show: true,
            },
            position: 'center',
            formatter: '{x|{d}%} \n {y|{b}}',
            rich: {
              x: {
                fontSize: 32,
                fontWeight: 700,
                color: getThemeColor(vars.palette.text.primary),
                padding: [0, 0, 5, 15],
              },
              y: {
                fontSize: 12,
                color: getThemeColor(vars.palette.text.secondary),
                fontWeight: 400,
              },
            },
          },
          data: data,
        },
      ],
      grid: { outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
    }),
    [vars, data, getThemeColor],
  );

  return (
    <ReactEchart
      echarts={echarts}
      option={getOptions}
      sx={{ width: 216, height: '216px !important', mx: 'auto' }}
    />
  );
};

export default DoughnutPieChart;
