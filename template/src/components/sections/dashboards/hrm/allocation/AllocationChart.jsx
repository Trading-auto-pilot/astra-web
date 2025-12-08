import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { RadarChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([LegendComponent, TooltipComponent, RadarChart, CanvasRenderer]);

const getLineColor = (category, vars, getThemeColor) => {
  switch (category) {
    case 'Gross Salary':
      return getThemeColor(vars.palette.chGreen[400]);
    case 'Tangible Assets':
      return getThemeColor(vars.palette.chBlue[400]);
    case 'Direct Revenue':
      return getThemeColor(vars.palette.chOrange[400]);
  }
};

const AllocationChart = ({ ref, sx, data }) => {
  const { vars, typography } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const depts = data.workforce.map((item) => item.department);

          if (Array.isArray(params.value)) {
            const tooltipItems = params.value
              .map((item, index) => {
                return `<div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; min-width: 120px">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <span style="width: 8px; height: 8px; background: ${params.color}; border-radius: 50%;"></span>
                    <span>${depts[index]}</span>
                  </div>
                  <span>${item}</span>
                </div>`;
              })
              .join('');

            return `<div style="margin-left: 8px;">
                <p>${params.name}</p>
                ${tooltipItems}
              </div>`;
          }

          return '';
        },
      },
      legend: {
        show: false,
      },
      radar: {
        radius: '80%',
        axisNameGap: 8,
        splitNumber: 6,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisName: {
          fontSize: 12,
          fontWeight: 700,
          color: getThemeColor(vars.palette.text.secondary),
          fontFamily: typography.fontFamily,
        },
        splitArea: {
          areaStyle: {
            color: [
              getThemeColor(vars.palette.background.paper),
              getThemeColor(vars.palette.background.elevation2),
            ],
            shadowBlur: 0,
          },
        },
        indicator: data.workforce.map((item) => ({
          name: item.department.toUpperCase(),
        })),
      },
      series: [
        {
          name: 'allocation',
          type: 'radar',
          lineStyle: {
            width: 1,
          },
          symbol: 'circle',
          symbolSize: 3,
          data: data.expenses.map((item) => ({
            name: item.category,
            value: item.budgets,
            itemStyle: {
              color: getLineColor(item.category, vars, getThemeColor),
            },
          })),
        },
      ],
    }),
    [vars.palette, getThemeColor, data],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={option} sx={sx} />;
};

export default AllocationChart;
