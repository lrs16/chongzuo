import React, { Component } from 'react';
import { Chart, Interval, Axis, Tooltip, Legend, Interaction } from 'bizcharts';
import DataSet from '@antv/data-set';

class Columnar extends Component {
  dv = new DataSet().createView();

  render() {
    const { height, padding, data, scale } = this.props;
    this.dv.source(data);
    //  const end =data[data.length - 1];
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
              'rate',
              rate => {
                if (rate <= 80) {
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
        </Chart>
      </div>
    );
  }
}

export default Columnar;
