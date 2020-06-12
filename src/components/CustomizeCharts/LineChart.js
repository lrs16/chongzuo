import React, { Component } from 'react';
import {
  // G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  // Coord,
  // Label,
  // Legend,
  View,
  Guide,
  // Shape,
  // Facet,
  // Util,
} from 'bizcharts';

const { Text } = Guide;
// 单曲线，单警戒线，图例：关口0点采集
class LineChart extends Component {
  render() {
    const { height, padding, data, cols } = this.props;
    const end = data[data.length - 1];
    return (
      <div>
        <Chart data={data} padding={padding} scale={cols} forceFit height={height}>
          {/* 时间刻度 */}
          <Axis
            name="clock"
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
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          {/* 折线图里的线 */}
          <Geom
            type="line"
            position="clock*value"
            size={2}
            tooltip={[
              'clock*value',
              (clock, value) => {
                return {
                  name: '数值', // 要显示的名字
                  value,
                  title: clock,
                };
              },
            ]}
          />
          {/* 折线图里的圆点 */}
          <Geom
            type="point"
            position="clock*value"
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
            tooltip={[
              'clock*value',
              (clock, value) => {
                return {
                  name: '数值', // 要显示的名字
                  value,
                  title: clock,
                };
              },
            ]}
          />
          {/* 高警戒值 */}
          <View data={data}>
            <Geom type="line" position="clock*Max警戒值" color="#ff0000" size={2} />
            <Guide>
              <Text
                top
                position={{ clock: end.clock, Max警戒值: end.Max警戒值 }}
                // position={[50%,50%]}
                content="警戒值"
                style={{
                  fill: '#f00',
                  fontSize: '12',
                }}
                offsetX={20}
                offsetY={0}
              />
            </Guide>
          </View>
          {/* 低警戒值 */}
          <View data={data}>
            <Geom type="line" position="clock*Min警戒值" color="#ff0000" size={2} />
            <Guide>
              <Text
                top
                position={{ clock: end.clock, Min警戒值: end.Min警戒值 }}
                // position={[50%,50%]}
                content="警戒值"
                style={{
                  fill: '#f00',
                  fontSize: '12',
                }}
                offsetX={20}
                offsetY={0}
              />
            </Guide>
          </View>
          {/* 警戒值 */}
          <View data={data}>
            <Geom type="line" position="clock*警戒值" color="#ff0000" size={2} />
            <Guide>
              <Text
                top
                position={{ clock: end.clock, 警戒值: end.警戒值 }}
                // position={[50%,50%]}
                content="警戒值"
                style={{
                  fill: '#f00',
                  fontSize: '12',
                }}
                offsetX={20}
                offsetY={0}
              />
            </Guide>
          </View>
        </Chart>
      </div>
    );
  }
}

export default LineChart;
