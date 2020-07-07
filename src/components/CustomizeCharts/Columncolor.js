import React, { Component } from 'react';
import {
  Chart,
  Interval,
  Axis,
  Tooltip,
  Annotation,
  Line,
  Legend,
  Point,
  Interaction,
} from 'bizcharts';
import DataSet from '@antv/data-set';

class Columncolor extends Component {
  dv = new DataSet().createView();

  render() {
    const { height, padding, data } = this.props;
    this.dv.source(data);
    //  const end =data[data.length - 1];

    const scale = {
      rate: {
        min: 0,
        max: 100,
        range: [0, 1],
        alias: '完整率',
      },
      alertvalue: {
        min: 0,
        max: 100,
        alias: '警戒值',
      },
    };
    return (
      <div>
        <Chart data={this.dv} padding={padding} scale={scale} height={height} forceFit animate>
          <Axis
            name="rate"
            label={{
              formatter: val => `${val}%`,
            }}
            position="left"
          />
          <Axis name="alertvalue" visible={false} />
          <Axis name="type" />
          <Legend visible={false} />
          <Tooltip shared follow />
          <Interaction type="active-region" />
          {/* 柱形 */}
          <Interval
            position="type*rate"
            color={[
              'rate*alertvalue',
              (rate, alertvalue) => {
                if (rate <= alertvalue) {
                  return '#FF3703';
                }
                if (rate === 100.0) {
                  return '#4ecb73';
                }
                return '#3ba1ff';
              },
            ]}
            label={[
              'rate',
              {
                animate: true,
              },
            ]}
            animate={{
              appear: {
                duration: 1000,
                delay: 1000,
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
            offsetX={70} // x 方向的偏移量
            offsetY={35} // y 方向偏移量
          />
        </Chart>
      </div>
    );
  }
}

export default Columncolor;
