import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';

class Donut extends Component {
  render() {
    const { DataView } = DataSet;
    const { Html, Text } = Guide;
    const { data, content, height, padding } = this.props;
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          return `${(val * 100).toFixed(2)}%`;
        },
      },
    };

    return (
      <div>
        <Chart height={height} data={dv} scale={cols} padding={padding} forceFit>
          <Coord type="theta" radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          {/* <Legend
            position="top"
          /> */}
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Guide>
            <Text />
          </Guide>
          <Guide>
            <Html
              position={['50%', '50%']}
              html={() => {
                return `<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">总处理<br><span style="color:#262626;font-size:2.5em">${content}</span></div>`;
              }}
              alignX="middle"
              alignY="middle"
            />
          </Guide>
          {/* 底部加一个白色的Geom，添加label显示百分比 */}
          <Geom type="intervalStack" position="percent" color={['item', ['#fff', '#fff']]}>
            <Label
              content="percent"
              offset={-30}
              textStyle={{
                rotate: 0,
                fill: '#fff', // 文本的颜色
                textAlign: 'center',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)',
              }}
            />
          </Geom>
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              'item*percent',
              (item, percent) => {
                const percents = `${(percent * 100).toFixed(2)}%`;
                return {
                  name: item,
                  value: percents,
                };
              },
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
          >
            <Label
              content="percent"
              offset={35}
              formatter={(val, item) => {
                // return `${item.point.item}: ${val}  ${item.point.count}`;
                return `${item.point.item}\n${item.point.count}`;
              }}
              textStyle={{
                // textAlign: 'center', // 文本对齐方向，可取值为： start middle end
                fill: '#404040', // 文本的颜色
                fontSize: '14', // 文本大小
                // fontWeight: 'bold', // 文本粗细
                textBaseline: 'top', // 文本基准线，可取 top middle bottom，默认为middle
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default Donut;
