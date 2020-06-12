/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Guide, View } from 'bizcharts';

const { Text } = Guide;
class Columncolor extends Component {
  render() {
    const { height, padding, data } = this.props;
    const end = data[data.length - 1];
    const scale = {
      完成率: {
        min: 0,
        max: 100,
        range: [0, 1],
        alias: '完成率',
      },
      警戒值: {
        min: 0,
        max: 100,
        alias: '警戒值',
      },
    };
    return (
      <div>
        <Chart data={data} padding={padding} scale={scale} forceFit height={height}>
          <Axis
            name="完成率"
            label={{
              formatter: val => `${val}%`,
            }}
          />
          <Axis name="警戒值" visible={false} />
          <View data={data}>
            <Geom type="line" position="name*警戒值" color="#ff0000" size={3} />
          </View>
          <Geom
            type="interval"
            position="name*完成率"
            // color={["name", ["#7f8da9", "#fec514", "#db4c3c", "#daf0fd"]]}
            color={[
              '完成率',
              value => {
                if (value <= 90.0) {
                  return '#FF3703';
                }
                if (value > 90.0 && value < 100.0) {
                  return '#faa51a';
                }
                if (value === 100) {
                  return '#3ba1ff';
                }
              },
            ]}
          />
          <Tooltip />
          <Geom type="line" position="label*警戒值" color="#ff0000" size={3} />

          <Guide>
            <Text
              top // 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
              // position={{ name: '变电站', 警戒值: 90 }} // 文本的起始位置，值为原始数据值，支持 callback
              position={{ name: end.name, 警戒值: end.警戒值 }}
              content="警戒值" // 显示的文本内容
              style={{
                fill: '#f00', // 文本颜色
                fontSize: '12', // 文本大小
                // fontWeight: 'bold' // 文本粗细
              }} // 文本的图形样式属性
              offsetX={25} // x 方向的偏移量
              offsetY={0} // y 方向偏移量
            />
          </Guide>
        </Chart>
      </div>
    );
  }
}

export default Columncolor;
