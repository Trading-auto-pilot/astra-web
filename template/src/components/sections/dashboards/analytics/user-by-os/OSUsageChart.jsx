import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { cssVarRgba } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, PieChart, CanvasRenderer, LegendComponent]);

const OSUsageChart = ({ ref, data, sx }) => {
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const categoryColors = {
    Desktop: {
      main: cssVarRgba(getThemeColor(vars.palette.chBlue['200Channel']), 0.8),
      children: [
        cssVarRgba(getThemeColor(vars.palette.chBlue['400Channel']), 0.8),
        cssVarRgba(getThemeColor(vars.palette.chBlue['300Channel']), 0.8),
        cssVarRgba(getThemeColor(vars.palette.chBlue['200Channel']), 0.8),
        cssVarRgba(getThemeColor(vars.palette.chBlue['100Channel']), 0.8),
      ],
    },
    Tablet: {
      main: cssVarRgba(getThemeColor(vars.palette.chLightBlue['200Channel']), 0.8),
      children: [
        cssVarRgba(getThemeColor(vars.palette.chLightBlue['300Channel']), 0.8),
        cssVarRgba(getThemeColor(vars.palette.chLightBlue['200Channel']), 0.8),
      ],
    },
    Mobile: {
      main: cssVarRgba(getThemeColor(vars.palette.chOrange['200Channel']), 0.8),
      children: [
        cssVarRgba(getThemeColor(vars.palette.chOrange['100Channel']), 0.8),
        cssVarRgba(getThemeColor(vars.palette.chOrange['200Channel']), 0.8),
      ],
    },
  };

  const processedData = {
    outer: data.map(({ name, value }) => {
      const color =
        categoryColors[name]?.main ??
        cssVarRgba(getThemeColor(vars.palette.grey['400Channel']), 0.8);

      return {
        name,
        value,
        itemStyle: {
          color,
        },
        emphasis: {
          itemStyle: {
            color,
          },
        },
      };
    }),
    inner: data.flatMap(({ name, value, children = [] }) =>
      children.map((child, idx) => {
        const color =
          categoryColors[name]?.children[idx] ??
          cssVarRgba(getThemeColor(vars.palette.grey['300Channel']), 0.7);

        return {
          ...child,
          parentName: name,
          parentValue: value,
          itemStyle: {
            color,
          },
          emphasis: {
            itemStyle: {
              color,
            },
          },
        };
      }),
    ),
  };

  const getOptions = useMemo(
    () => ({
      tooltip: {
        formatter: (params) => {
          const { seriesIndex, name, value } = params;

          if (seriesIndex === 0) {
            return `${name}: ${value}%`;
          }

          const parentValue = params.data.parentValue;
          const relativePercentage = ((value / parentValue) * 100).toFixed(1);

          return `${name}: ${relativePercentage}% of ${params.data.parentName} users`;
        },
      },

      legend: {
        data: ['Desktop', 'Tablet', 'Mobile'],
        show: false,
      },

      series: [
        {
          name: 'User by OS',
          type: 'pie',
          radius: ['55%', '85%'],
          selectedMode: 'single',
          padAngle: 2,
          itemStyle: {
            borderRadius: 4,
          },
          emphasis: {
            scaleSize: 2,
          },
          label: {
            show: false,
          },
          labelLine: { show: false },
          data: processedData.outer,
          select: {
            disabled: true,
          },
        },
        {
          name: 'Usersss by OS',
          type: 'pie',
          radius: ['90%', '96%'],
          barWidth: 10,
          padAngle: 1,
          itemStyle: {
            borderRadius: 2,
          },
          emphasis: {
            scaleSize: 2,
          },
          label: {
            show: false,
          },
          labelLine: { show: false },
          data: processedData.inner,
          select: {
            disabled: true,
          },
        },
      ],
      grid: { top: 0, bottom: 0, left: 0, right: 0 },
    }),
    [processedData],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={getOptions} sx={sx} />;
};

export default OSUsageChart;
