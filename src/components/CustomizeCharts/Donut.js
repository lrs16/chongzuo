import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';

class Donut extends Component {
  render() {
    const { DataView } = DataSet;
    const { Html } = Guide;
    const data = [
      {
        item: '配网入库',
        count: 40,
      },
      {
        item: '采集指标',
        count: 21,
      },
      {
        item: '接口程序',
        count: 17,
      },
      {
        item: '主站系统运行',
        count: 13,
      },
      {
        item: 'KAFKA中间件',
        count: 9,
      },
    ];
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
          val = `${val * 100}%`;
          return val;
        },
      },
    };
    const { height, padding } = this.props;
    return (
      <div>
        <Chart height={height} data={dv} scale={cols} padding={padding} forceFit>
          <Coord type="theta" radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Legend position="right" offsetY={-120} offsetX={80} />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Guide>
            <Html
              position={['50%', '50%']}
              html='<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">主机<br><span style="color:#262626;font-size:2.5em">200</span>台</div>'
              alignX="middle"
              alignY="middle"
            />
          </Guide>
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              'item*percent',
              (item, percent) => {
                percent = `${percent * 100}%`;
                return {
                  name: item,
                  value: percent,
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
              formatter={(val, item) => {
                return `${item.point.item}: ${val}`;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default Donut;
