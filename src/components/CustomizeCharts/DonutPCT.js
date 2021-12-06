/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  Chart,
  registerShape,
  Axis,
  Tooltip,
  Interval,
  Interaction,
  Coordinate,
  Legend,
} from "bizcharts";
import DataSet from '@antv/data-set';

const sliceNumber = 0.01; // 自定义 other 的图形，增加两条线

registerShape("interval", "sliceShape", {
  draw(cfg, container) {
    const { points } = cfg;
    let path = [];
    path.push(["M", points[0].x, points[0].y]);
    path.push(["L", points[1].x, points[1].y - sliceNumber]);
    path.push(["L", points[2].x, points[2].y - sliceNumber]);
    path.push(["L", points[3].x, points[3].y]);
    path.push("Z");
    path = this.parsePath(path);
    return container.addShape("path", {
      attrs: {
        fill: cfg.color,
        path
      }
    });
  }
});

class DonutPCT extends Component {
  render() {
    const { data, total, totaltitle, height, padding, onGetVal } = this.props;
    const { DataView } = DataSet;
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'value',
      dimension: 'type',
      groupBy: ['category'],
      as: 'percent',
    });
    return (
      <div>
        <div style={{ position: 'absolute', left: '50%', top: '42%', width: 100, textAlign: 'center', marginLeft: '-50px' }} >
          <span style={{ fontSize: 24, fontWeight: 700 }}>{total}</span><br />
          <span>{totaltitle}</span>
        </div>
        <Chart height={height} data={dv.rows} padding={padding} autoFit onClick={ev => {
          const linkdata = ev.data;
          if (linkdata && linkdata.data) {
            onGetVal(linkdata.data)
          }
        }}>
          {/* <Legend visible={false} /> */}
          <Coordinate type="theta" radius={0.8} innerRadius={0.7} />
          <Axis visible={false} />
          <Tooltip showTitle={false} />
          <Interval
            position="value"
            adjust="stack"
            color="type"
            shape="sliceShape"
            label={[
              'value',
              {
                content: picdata => {
                  return `${picdata.type}: ${(picdata.percent * 100).toFixed(2)}%`;
                },
                offset: '15',
              },
            ]}
          />
          <Interaction type="element-single-selected" />
        </Chart>
      </div>
    );
  }
}

export default DonutPCT;
