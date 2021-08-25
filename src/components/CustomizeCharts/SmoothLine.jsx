import React from 'react';
import { Chart, Line, Point, Tooltip, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';

function SmoothLine(props) {
  const { data, cols, height, padding, onGetVal } = props;
  const dv = new DataSet.View().source(data);
  dv.transform({
    type: 'sort-by',
    fields: ['name'], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
    order: 'ASC', // 默认为 ASC，DESC 则为逆序
  });

  return (
    <Chart padding={padding} scale={cols} autoFit height={height} data={dv.rows} onClick={ev => {
      const linkdata = ev.data;
      if (linkdata) {
        onGetVal(linkdata.data.name)
      }
    }}>
      <Line shape="smooth" position="date*value" color="name" />
      <Point position="date*value" color="name" shape="circle" />
      <Tooltip shared showCrosshairs />
      <Axis />
    </Chart>
  );
}

export default SmoothLine;
