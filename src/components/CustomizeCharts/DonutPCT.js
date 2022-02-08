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

const indexcolors = ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E86452', '#6DC8EC', '#945FB9', '#FF9845', '#1E9493', '#FF99C3'];
class DonutPCT extends Component {
  render() {
    const { data, total, totaltitle, height, padding, onGetVal, onGetTotal, totalType, TooltipHide, colors } = this.props;
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
        <div style={{ position: 'absolute', left: '50%', top: '40%', width: 100, textAlign: 'center', marginLeft: '-50px', zIndex: 98 }} >
          <span style={{ fontSize: 24, fontWeight: 700 }}>
            {onGetTotal && totalType ? (
              <a
                onClick={() => { setTimeout(() => { onGetTotal(totalType) }, 200) }}
                onDoubleClick={() => onGetTotal(totalType)}
              >{total}</a>) : (<>{total}</>
            )}
          </span><br />
          <span>{totaltitle}</span>
        </div>
        <Chart pure height={height} data={dv.rows} padding={padding} autoFit
          onClick={ev => {
            const linkdata = ev.data;
            if (linkdata && (linkdata.data || linkdata._origin) && onGetVal) {
              setTimeout(() => {
                onGetVal(linkdata.data || linkdata._origin)
              }, 100)
            }
          }}
          onDoubleClick={ev => {
            const linkdata = ev.data;
            if (linkdata && (linkdata.data || linkdata._origin) && onGetVal) {
              onGetVal(linkdata.data || linkdata._origin)
            }
          }}
        >
          <Legend visible />
          <Coordinate type="theta" radius={0.8} innerRadius={0.7} />
          <Axis visible={false} />
          <Tooltip showTitle={false} visible={!TooltipHide} />
          <Interval
            position="value"
            adjust="stack"
            color={["type", (val) => {
              const i = data.findIndex(obj => obj.type === val)
              if (colors && colors.length && colors[i]) {
                return colors[i]
              }
              return indexcolors[i]
            }]}
            shape="sliceShape"
            label={[
              'value',
              {
                type: 'pie',
                content: picdata => {
                  return `${picdata.type}：${picdata.value}（ ${(picdata.percent * 100).toFixed(2)}% ）`;
                },
                offset: 20,
                offsetY: 5,
                labelLine: true,
                overlap: 'label'
              },
            ]}
          />
          <Interaction type="element-highlight" />
          {/* <Interaction type="active-region" /> */}
        </Chart>
      </div >
    );
  }
}

export default DonutPCT;
