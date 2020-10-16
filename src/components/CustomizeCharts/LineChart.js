import React, { Component } from 'react';
import { Chart, Legend, Axis, Tooltip, Line, Point, Annotation } from 'bizcharts';
import DataSet from '@antv/data-set';

// 单曲线，多警戒线，图例：关口0点采集
class LineChart extends Component {
  render() {
    const { height, padding, data, cols } = this.props;
    const end = data[data.length - 1];
    const dv = new DataSet.View().source(data);
    dv.transform({
      type: 'sort-by',
      fields: ['date'], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
      order: 'ASC', // 默认为 ASC，DESC 则为逆序
    });
    return (
      <div>
        <Chart data={dv.rows} padding={padding} scale={cols} forceFit height={height} animate>
          {/* 时间刻度 */}
          <Axis
            name="date"
            title={{
              position: 'end',
              offset: 15,
              textStyle: {
                fontSize: '12',
                textAlign: 'center',
                fill: '#999',
                fontWeight: 'bold',
                rotate: 0,
                autoRotate: true,
              },
            }}
          />
          {/* 波动百分比刻度 */}
          <Axis
            name="value"
            title={{
              position: 'center',
              offset: 55,
              textStyle: {
                fontSize: '12',
                textAlign: 'center',
                fill: '#999',
                // fontWeight: 'bold',
                rotate: 90,
                autoRotate: true,
              },
            }}
          />
          <Axis name="alertvalue" visible={false} />
          <Axis name="Max警戒值" visible={false} />
          <Axis name="Min警戒值" visible={false} />
          <Legend visible={false} />
          <Tooltip
            shared
            follow
            showCrosshairs
            crosshairs={{
              type: 'x',
            }}
          />
          {/* 折线图里的线 */}
          <Line
            shape="line"
            position="date*value"
            size={2}
            animate={{
              appear: {
                duration: 1000,
                delay: 1000,
              },
              enter: {
                duration: 1000, // enter 动画执行时间
                delay: 1000,
              },
              update: {
                duration: 1000, // enter 动画执行时间
                delay: 1000,
              },
              leave: false, // 关闭 leave 销毁动画
            }}
          />
          {/* 折线图里的圆点 */}
          <Point
            position="date*value"
            size={[
              'alert',
              alert => {
                if (alert === true) {
                  return 4;
                }
                return 0;
              },
            ]}
            shape="circle"
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
            color={[
              'value*alert',
              (value, alert) => {
                if (alert) {
                  return 'red';
                }
                return '#1890ff';
              },
            ]}
          />
          {end.Max警戒值 !== undefined && (
            <Line
              shape="line"
              position="date*Max警戒值"
              size={2}
              color="#ff0000"
              animate={{
                appear: {
                  duration: 1000,
                  delay: 1000,
                },
                enter: {
                  duration: 1000, // enter 动画执行时间
                  delay: 1000,
                },
                update: {
                  duration: 1000, // enter 动画执行时间
                  delay: 1000,
                },
                leave: false, // 关闭 leave 销毁动画
              }}
            />
          )}
          {end.Min警戒值 !== undefined && (
            <Line
              shape="line"
              position="date*Min警戒值"
              size={2}
              color="#ff0000"
              animate={{
                appear: {
                  duration: 1000,
                  delay: 1000,
                },
                enter: {
                  duration: 1000, // enter 动画执行时间
                  delay: 1000,
                },
                update: {
                  duration: 1000, // enter 动画执行时间
                  delay: 1000,
                },
                leave: false, // 关闭 leave 销毁动画
              }}
            />
          )}
          {end.alertvalue !== undefined && (
            <Line
              shape="line"
              position="date*alertvalue"
              size={2}
              color="#ff0000"
              animate={{
                appear: {
                  duration: 1000,
                  delay: 1000,
                },
                enter: {
                  duration: 1000, // enter 动画执行时间
                  delay: 1000,
                },
                update: {
                  duration: 1000, // enter 动画执行时间
                  delay: 1000,
                },
                leave: false, // 关闭 leave 销毁动画
              }}
            />
          )}
          <Annotation.Line />
          {end.Max警戒值 !== undefined && (
            <Annotation.Text
              position={{ date: end.date, Max警戒值: end.Max警戒值 }}
              content="高警戒值"
              style={{
                fill: '#ff0000',
                fontSize: 14,
                textAlign: 'end',
                textBaseline: 'center',
              }}
              offsetX={30} // x 方向的偏移量
              offsetY={0} // y 方向偏移量
            />
          )}
          {end.Max警戒值 !== undefined && (
            <Annotation.Text
              position={{ date: end.date, Min警戒值: end.Min警戒值 }}
              content="低警戒值"
              style={{
                fill: '#ff0000',
                fontSize: 14,
                textAlign: 'end',
                textBaseline: 'center',
              }}
              offsetX={30} // x 方向的偏移量
              offsetY={0} // y 方向偏移量
            />
          )}
          {end.alertvalue !== undefined && (
            <Annotation.Text
              position={{ date: end.date, alertvalue: end.alertvalue }}
              content="警戒值"
              style={{
                fill: '#ff0000',
                fontSize: 14,
                textAlign: 'end',
                textBaseline: 'center',
              }}
              offsetX={0} // x 方向的偏移量
              offsetY={0} // y 方向偏移量
            />
          )}
        </Chart>
      </div>
    );
  }
}

export default LineChart;
