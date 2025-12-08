import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { tooltipFormatterList } from 'helpers/echart-utils';
import { cssVarRgba, getPastDates } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer, LegendComponent]);

const ActiveUsersChart = ({ ref, sx, data }) => {
  const { vars, typography } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: cssVarRgba(getThemeColor(vars.palette.chGrey['100Channel']), 0.5),
          },
          z: 1,
        },
        formatter: (params) => tooltipFormatterList(params),
      },
      xAxis: {
        type: 'category',
        data: getPastDates(15).map((date) => {
          return dayjs(date).format('MMM DD');
        }),
        axisLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.divider),
          },
        },
        axisTick: {
          alignWithLabel: true,
          length: 9,
          lineStyle: {
            color: vars.palette.divider,
          },
        },
        axisLabel: {
          show: true,
          interval: 6,
          fontFamily: typography.fontFamily,
          color: getThemeColor(vars.palette.text.secondary),
          fontWeight: 400,
          fontSize: typography.overline.fontSize,
          margin: 13,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          margin: 40,
          align: 'left',
          formatter: (value) => `${Number(value) / 1000}k`,
          fontWeight: 500,
          color: getThemeColor(vars.palette.text.secondary),
        },
        splitLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.dividerLight),
          },
        },
      },
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent',
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent',
            },
          },
          data: data.placeholder,
          tooltip: {
            show: false,
          },
        },
        {
          name: 'Active Users',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'inside',
            color: getThemeColor(vars.palette.chBlue[950]),
            formatter: (params) => `${Number(params.value) / 1000}k`,
          },
          itemStyle: {
            color: getThemeColor(vars.palette.chBlue[200]),
            borderRadius: 4,
          },
          emphasis: {
            itemStyle: {
              color: getThemeColor(vars.palette.chBlue[200]),
            },
          },
          data: data.users,
        },
      ],
      grid: { left: 40, right: 0, top: 30, bottom: 25, outerBoundsMode: 'none' },
    }),
    [vars.palette, getThemeColor, data],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={getOptions} sx={sx} />;
};

export default ActiveUsersChart;
