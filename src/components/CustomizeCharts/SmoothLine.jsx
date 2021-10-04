import React from 'react';
import { Chart, Line, Point, Tooltip, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';

const axisConfig = {
  label: {
    style: {
      textAlign: 'center',
    }, // 设置坐标轴文本样式
  },
  line: {
    style: {
      stroke: '#ccc',
      lineDash: [3, 3],
    }, // 设置坐标轴线样式
  },
  grid: {
    line: {
      style: {
        stroke: '#ccc',
        lineDash: [3, 3],
      },
    }, // 设置坐标系栅格样式
  },
};

const tickLine = {
  style: {
    lineWidth: 1, // 刻度线宽
    stroke: '#bbb', // 刻度线的颜色
  },
  length: 12, // 刻度线的长度, **原来的属性为 line**,可以通过将值设置为负数来改变其在轴上的方向
}

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
      if (linkdata && linkdata.data && !Array.isArray(linkdata.data)) {
        onGetVal(linkdata.data)
      }
    }}>
      <Line shape="smooth" position="date*value" color="name" />
      <Point position="date*value" color="name" shape="circle" />
      <Tooltip shared showCrosshairs />
      <Axis name="date"  {...axisConfig} tickLine={tickLine} label={{ offset: 25 }} />
      <Axis name="value"   {...axisConfig} label={{ offset: 10 }} />
    </Chart>
  );
}

export default SmoothLine;
