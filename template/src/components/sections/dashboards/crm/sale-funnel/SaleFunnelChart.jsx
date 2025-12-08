import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer, LegendComponent]);

const SaleFunnelChart = ({ ref, sx, data }) => {
  const { vars, typography } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: (params) => tooltipFormatterList(params),
      },
      legend: {
        data: Object.keys(data).flat(),
        show: false,
      },
      xAxis: {
        type: 'value',
        show: false,
        inverse: true,
      },
      yAxis: {
        type: 'category',
        data: Object.keys(data)
          .flat()
          .map((item) => item[0].toUpperCase() + item.slice(1)),
        axisLabel: {
          show: true,
          align: 'left',
          margin: 100,
          color: getThemeColor(vars.palette.text.secondary),
          fontFamily: typography.fontFamily,
          fontSize: typography.subtitle2.fontSize,
          fontWeight: 500,
        },
        axisTick: false,
        axisLine: false,
        inverse: true,
        boundaryGap: true,
      },
      series: [
        {
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            borderRadius: 4,
            color: getThemeColor(vars.palette.background.elevation2),
          },
          data: Object.values(data).flat(),
          label: {
            show: true,
            fontSize: typography.subtitle2.fontSize,
            fontWeight: 500,
            formatter: (params) => `${Number(params.value)}%`,
          },
          emphasis: {
            disabled: true,
          },
          itemStyle: {
            borderRadius: 4,
            color: (params) => {
              const colors = [
                getThemeColor(vars.palette.chBlue[100]),
                getThemeColor(vars.palette.chBlue[200]),
                getThemeColor(vars.palette.chBlue[300]),
                getThemeColor(vars.palette.chBlue[400]),
                getThemeColor(vars.palette.chBlue[500]),
              ];

              return colors[params.dataIndex] || getThemeColor(vars.palette.chGreen[500]);
            },
          },
          barWidth: 28,
          barGap: 16,
        },
      ],
      grid: { left: 100, right: 0, top: 0, bottom: 0, outerBoundsMode: 'none' },
    }),
    [vars.palette, getThemeColor, data],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={getOptions} sx={sx} />;
};

export default SaleFunnelChart;
