import React from 'react';
import { Chart, Line, Point, Tooltip } from 'bizcharts';

function SmoothLine(props) {
  const { data, height, padding } = props;
  return (
    <Chart
      scale={{ temperature: { min: 0 } }}
      padding={padding}
      autoFit
      height={height}
      data={data}
      interactions={['element-active']}
    >
      <Line shape="smooth" position="month*temperature" color="city" label="temperature" />
      <Point position="month*temperature" color="city" shape="circle" />
      <Tooltip shared showCrosshairs />
    </Chart>
  );
}

export default SmoothLine;
