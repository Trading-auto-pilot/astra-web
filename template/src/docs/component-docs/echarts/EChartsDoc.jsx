import { folderBaseLink } from 'lib/constants';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';
import BasicRadarChart from './BasicRadarChart';
import DoughnutPieChart from './DoughnutPieChart';
import GeoLocationMap from './GeoLocationMap';
import HorizontalBarChart from './HorizontalBarChart';
import SimpleBarChart from './SimpleBarChart';
import SimpleLineChart from './SimpleLineChart';

const simpleLineChartCode = `import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import dayjs from 'dayjs';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent } from 'echarts/components';
import { useTheme } from '@mui/material';
import { getPastDates, rgbaColor } from 'lib/utils';
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
      valueFormatter: (value) => ${'`'}$${'{'}Number(value) / 1000}K${'`'},
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
            borderColor: cssVarRgba(getThemeColor(vars.palette.chBlue[500]), 0.2),
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
            borderColor: cssVarRgba(getThemeColor(vars.palette.text.primary), 0.2),
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
`;

const simpleBarChartCode = `import { useTheme } from '@mui/material';
import { BarChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useMemo } from 'react';

import ReactEchart from 'components/base/ReactEchart';
import useNumberFormat from 'hooks/useNumberFormat';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';

const data = [
  { name: 'Japan', value: 44000 },
  { name: 'Greenland', value: 41000 },
  { name: 'India', value: 38000 },
  { name: 'Egypt', value: 27000 },
  { name: 'Mexico', value: 19000 },
  { name: 'Angola', value: 13000 },
  { name: 'Colombia', value: 11000 },
  { name: 'Finland', value: 7000 },
];

echarts.use([TooltipComponent, BarChart, CanvasRenderer]);

const SimpleBarChart = () => {
  const { vars, typography } = useTheme();
  const { up, currentBreakpoint } = useBreakpoints();
  const upMd = up('md');
  const { numberFormat } = useNumberFormat();
  const { getThemeColor } = useSettingsContext();

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.name),
        axisLabel: {
          color: getThemeColor(vars.palette.text.secondary),
          fontSize: 12,
          fontFamily: typography.fontFamily,
          interval: currentBreakpoint === 'md' ? 'auto' : 0,
          rotate: upMd ? 0 : 70,
        },
        min: 'dataMin',
        max: 'dataMax',

        axisLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.chGrey[300]),
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.chGrey[200]),
          },
        },
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      series: [
        {
          type: 'bar',
          data: data.map((item) => item.value),
          itemStyle: {
            borderRadius: [2, 2, 0, 0],
            color: getThemeColor(vars.palette.chBlue[300]),
          },
          barWidth: currentBreakpoint === 'md' ? 8 : 24,
          label: {
            show: true,
            position: 'outside',
            formatter: (params) =>
              numberFormat(Number(params.value), {
                notation: 'compact',
              }),
            color: getThemeColor(vars.palette.chBlue[500]),
            fontWeight: 700,
            fontSize: 12,
          },
        },
      ],
      grid: {
        outerBoundsMode: 'same',
        outerBoundsContain: 'axisLabel', 
        right: 0,
        left: 0,
        bottom: 2,
        top: 15,
      },
    }),
    [currentBreakpoint, vars, data, upMd, numberFormat, getThemeColor],
  );

  return <ReactEchart echarts={echarts} option={getOptions} />;
};
`;

const horizontalBarChartCode = `import { useTheme } from '@mui/material';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useMemo } from 'react';

import ReactEchart from 'components/base/ReactEchart';
import useNumberFormat from 'hooks/useNumberFormat';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';

const data = [
  { name: 'Japan', value: 44000 },
  { name: 'Greenland', value: 41000 },
  { name: 'India', value: 38000 },
  { name: 'Egypt', value: 27000 },
  { name: 'Mexico', value: 19000 },
  { name: 'Angola', value: 13000 },
  { name: 'Colombia', value: 11000 },
  { name: 'Finland', value: 7000 },
];

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
]);

const HorizontalBarChart = () => {
  const { vars, typography } = useTheme();
  const { getThemeColor } = useSettingsContext();
  const { up, currentBreakpoint } = useBreakpoints();
  const { numberFormat } = useNumberFormat();

  const upMd = up('md');

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'category',
        data: data.map((item) => item.name),
        axisLabel: {
          color: getThemeColor(vars.palette.text.secondary),
          fontSize: 12,
          fontFamily: typography.fontFamily,
          interval: currentBreakpoint === 'md' ? 'auto' : 0,
          rotate: upMd ? 0 : 70,
        },
        min: 'dataMin',
        max: 'dataMax',

        axisLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.chGrey[300]),
          },
        },
        axisTick: {
          show: false,
        },
      },
      xAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: getThemeColor(vars.palette.chGrey[200]),
          },
        },
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      series: [
        {
          type: 'bar',
          data: data.map((item) => item.value),
          itemStyle: {
            borderRadius: [2, 2, 0, 0],
            color: getThemeColor(vars.palette.chBlue[300]),
          },
          barWidth: currentBreakpoint === 'md' ? 8 : 24,
          label: {
            show: true,
            position: 'outside',
            formatter: (params) =>
              numberFormat(Number(params.value), {
                notation: 'compact',
              }),
            color: getThemeColor(vars.palette.chBlue[500]),
            fontWeight: 700,
            fontSize: 12,
          },
        },
      ],
      grid: {
        outerBoundsMode: 'same',
        outerBoundsContain: 'axisLabel', 
        right: 0,
        left: 0,
        bottom: 2,
        top: 15,
      },
    }),
    [currentBreakpoint, vars, data, upMd, numberFormat, getThemeColor],
  );

  return <ReactEchart echarts={echarts} option={getOptions} />;
};`.trim();

const doughnutPieChartCode = `import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent } from 'echarts/components';
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
        formatter: (params) =>
          ${'`'}<strong>${'{'}params.name}:</strong> ${'{'}params.percent}%${'`'},
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
      grid: { 
        outerBoundsMode: 'same',
        outerBoundsContain: 'axisLabel',
      },
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
`;

const radarChartCode = `import { useTheme } from '@mui/material';
import ReactEchart from 'components/base/ReactEchart';
import { RadarChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useSettingsContext } from 'providers/SettingsProvider';
import { useMemo } from 'react';

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
        radius: '10%',
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
`;

const geoMapCode = `import { Box, Button, ButtonGroup, buttonGroupClasses, useTheme } from '@mui/material';
import world from 'assets/json/world.json';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { MapChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useEffect, useMemo, useRef, useState } from 'react';
import ZoomInIcon from 'components/icons/ZoomInIcon';
import ZoomOutIcon from 'components/icons/ZoomOutIcon';
import ReactEchart from 'components/base/ReactEchart';

const data = [
  { name: 'Japan', value: 44000 },
  { name: 'Greenland', value: 41000 },
  { name: 'India', value: 38000 },
  { name: 'Egypt', value: 27000 },
  { name: 'Mexico', value: 19000 },
  { name: 'Angola', value: 13000 },
  { name: 'Colombia', value: 11000 },
  { name: 'Finland', value: 7000 },
];

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  MapChart,
  CanvasRenderer,
  ToolboxComponent,
  LegendComponent,
  VisualMapComponent,
]);

echarts.registerMap('world', { geoJSON: world });

const GeoLocationMap = () => {
  const chartRef = useRef(null);
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();
  const { currentBreakpoint } = useBreakpoints();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [maxZoomLevel] = useState(5);
  const [minZoomLevel] = useState(1);

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: (param) =>
          ${'`'}${'{'}param.name} : ${'{'}isNaN(Number(param.value)) ? 0 : param.value}${'`'},
      },
      toolbox: {
        show: false,
        feature: {
          restore: {},
        },
      },
      visualMap: {
        show: false,
        inRange: {
          color: [getThemeColor(vars.palette.chBlue[500])],
        },
      },
      series: [
        {
          type: 'map',
          map: 'world',
          data,
          selectedMode: false,
          zoom: zoomLevel,
          center:
            currentBreakpoint === 'xs'
              ? ['20%', '5%']
              : currentBreakpoint === 'sm'
                ? ['10%', '5%']
                : [0, 0],
          roam: 'move',
          scaleLimit: {
            min: 1,
          },
          left: 0,
          right: 0,
          label: {
            show: false,
          },
          itemStyle: {
            borderColor: 'transparent',
            areaColor: getThemeColor(vars.palette.chGrey[200]),
          },
          emphasis: {
            disabled: true,
          },
        },
      ],
    }),
    [currentBreakpoint, zoomLevel, vars, data, getThemeColor],
  );

  const handleZoomIn = () => {
    if (zoomLevel < maxZoomLevel) {
      setZoomLevel(zoomLevel + 1);
    }
    chartRef.current?.getEchartsInstance().setOption({
      series: {
        zoom: zoomLevel + 1,
      },
    });
  };

  const handleZoomOut = () => {
    if (zoomLevel > minZoomLevel) {
      setZoomLevel(zoomLevel - 1);
    }
    chartRef.current?.getEchartsInstance().setOption({
      series: {
        zoom: zoomLevel - 1,
      },
    });
  };

  useEffect(() => {
    switch (currentBreakpoint) {
      case 'xs':
        setZoomLevel(3);
        break;
      case 'sm':
        setZoomLevel(2);
        break;
      default:
        setZoomLevel(1);
        break;
    }
  }, [currentBreakpoint]);

  return (
    <Box sx={{ position: 'relative' }}>
      <ReactEchart
        className="echart-map"
        ref={chartRef}
        echarts={echarts}
        option={getOptions}
        sx={{ height: '320px !important' }}
      />
      <ButtonGroup
        orientation="vertical"
        aria-label="vertical outlined button group"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          [${'`'}& .${'{'}buttonGroupClasses.grouped}${'`'}]: {
            minWidth: 36,
          },
        }}
      >
        <Button
          variant="soft"
          color="neutral"
          key="one"
          shape="square"
          sx={{ fontSize: 20, border: 1, borderColor: 'background.elevation2' }}
          onClick={handleZoomIn}
          disabled={maxZoomLevel === zoomLevel}
        >
          <ZoomInIcon />
        </Button>
        <Button
          variant="soft"
          color="neutral"
          key="two"
          shape="square"
          sx={{ fontSize: 20, border: 1, borderColor: 'background.elevation2' }}
          onClick={handleZoomOut}
          disabled={minZoomLevel === zoomLevel}
        >
          <ZoomOutIcon />
        </Button>
      </ButtonGroup>
    </Box>
  );
};
`;

const EChartsDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'ECharts',
        description:
          'The simplest, and the best React wrapper for Apache ECharts. Apache ECharts is a free, powerful charting and visualization library offering an easy way of adding intuitive, interactive, and highly customizable charts to your commercial products.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'ECharts',
          },
        ],
        folderLink: `${folderBaseLink}/echarts/EChartsDoc.jsx`,
        docLink: 'https://github.com/hustcc/echarts-for-react',
        docLinkLabel: 'ECharts Docs',
      }}
    >
      <DocSection title="Simple Line Chart">
        <DocCard code={simpleLineChartCode} hidePreview>
          <SimpleLineChart />
        </DocCard>
      </DocSection>

      <DocSection title="Simple Bar Chart">
        <DocCard code={simpleBarChartCode} hidePreview>
          <SimpleBarChart />
        </DocCard>
      </DocSection>

      <DocSection title="Horizontal Bar Chart">
        <DocCard code={horizontalBarChartCode} hidePreview>
          <HorizontalBarChart />
        </DocCard>
      </DocSection>

      <DocSection title="Doughnut Pie Chart">
        <DocCard code={doughnutPieChartCode} hidePreview>
          <DoughnutPieChart />
        </DocCard>
      </DocSection>

      <DocSection title="Radar Chart">
        <DocCard code={radarChartCode} hidePreview>
          <BasicRadarChart />
        </DocCard>
      </DocSection>

      <DocSection title="Geo Map">
        <DocCard code={geoMapCode} hidePreview>
          <GeoLocationMap />
        </DocCard>
      </DocSection>
    </DocPageLayout>
  );
};

export default EChartsDoc;
