import React, { Component } from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';

const { Html } = Guide;
class LineChart extends Component {
  render() {
    const { height, padding, data } = this.props;
    const cols = {
      value: {
        min: 0,
        range: [0, 0.93],
        alias: '次',
      },
      day: {
        range: [0, 0.9],
        alias: '日期',
      },
    };
    return (
      <div>
        <Chart data={data} padding={padding} scale={cols} forceFit height={height}>
          <Axis
            name="day"
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
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom
            type="line"
            position="day*value"
            size={2}
            tooltip={[
              'day*value',
              (day, value) => {
                return {
                  name: '数值', // 要显示的名字
                  value,
                  title: day,
                };
              },
            ]}
          />
          <Geom
            type="point"
            position="day*value"
            size={4}
            shape="circle"
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
            tooltip={[
              'day*value',
              (day, value) => {
                return {
                  name: '数值', // 要显示的名字
                  value,
                  title: day,
                };
              },
            ]}
          />
          <View data={data}>
            <Geom type="line" position="day*警戒值" color="#ff0000" size={3} />
          </View>
          <Guide>
            <Html
              position={['100%', '9%']}
              html={`<div style="text-align: center;"><span style="color:red;font-size:0.8em;">警戒值</span></div>`}
              alignX="middle"
              alignY="middle"
            />
          </Guide>
          {/* <Guide>
            <Line
              top // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
              start={{ day: '6', value: 27000 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
              end={{ day: '14', value: 27000 }} // 同 start
              lineStyle={{
                stroke: '#ff0000', // 线的颜色
                lineDash: [0, 2, 2], // 虚线的设置
                lineWidth: 3, // 线的宽度
              }} // {object} 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic#线条样式
              text={{
                position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                autoRotate: true, // {boolean} 是否沿线的角度排布，默认为 true
                style: {
                  fill: 'red',
                }, // {object}文本图形样式配置,https://bizcharts.net/products/bizCharts/api/graphic#文本属性
                offsetX:0, // {number} x 方向的偏移量
                offsetY: -10, // {number} y 方向的偏移量
                content: '警戒值：27000', // {string} 文本的内容
              }}
            />
          </Guide> */}
        </Chart>
      </div>
    );
  }
}

export default LineChart;
