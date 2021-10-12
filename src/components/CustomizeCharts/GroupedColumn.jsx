import React from 'react';
import {
  G2,
  Chart,
  Tooltip,
  Interval,
  Line,
  Point,
  Annotation
} from "bizcharts";

function GroupedColumn(props) {
  const { height, padding, data, scale } = props;
  return (
    <Chart padding={padding} height={height} data={data} scale={scale} autoFit>
      <Interval
        adjust={[
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]}
        color="name"
        position="type*value"
        label={[
          'value',
          {
            animate: true,
          },
        ]}
      // color={[
      //   'value*alertvalue',
      //   (value, alertvalue) => {
      //     if (value <= alertvalue) {
      //       return '#FF3703';
      //     }
      //     return '#3ba1ff';
      //   },
      // ]}
      />
      {/* 线形 */}
      <Line
        position="type*alertvalue"
        color="#ff0000"
        size={2}
        shape="line"
        animate={{
          appear: {
            duration: 1000,
            delay: 600,
          },
          enter: {
            duration: 1000, // enter 动画执行时间
            delay: 600,
          },
          update: {
            duration: 1000, // enter 动画执行时间
            delay: 600,
          },
          leave: false, // 关闭 leave 销毁动画
        }}
      />
      <Point
        position="type*alertvalue"
        color="#ff0000"
        size={2}
        shape="circle"
        animate={{
          appear: {
            duration: 1000,
            delay: 2000,
          },
          enter: {
            duration: 1000, // enter 动画执行时间
            delay: 2000,
          },
          update: {
            duration: 1000, // enter 动画执行时间
            delay: 2000,
          },
          leave: true, // 关闭 leave 销毁动画
        }}
      />
      {/* 没有 <Annotation.Line />Text不显示原因待查 */}
      <Annotation.Line />
      <Annotation.Text
        position={['max', 'max']}
        content="警戒值"
        style={{
          fill: '#ff0000',
          fontSize: 14,
          textAlign: 'end',
          textBaseline: 'center',
        }}
        offsetX={60} // x 方向的偏移量
        offsetY={0} // y 方向偏移量
      />
      <Tooltip shared />
    </Chart>
  );
}

export default GroupedColumn;