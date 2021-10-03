import React, { Component } from 'react';
import {
  Chart,
  Interval,
  Axis,
  Tooltip,
  Legend,
  Interaction,
  Coord,
  //  registerShape,
} from 'bizcharts';
import DataSet from '@antv/data-set';

// registerShape('interval', 'border-radius', {
//   draw(cfg, container) {
//     const { points } = cfg;
//     let path = [];
//     path.push(['M', points[0].x, points[0].y]);
//     path.push(['L', points[1].x, points[1].y]);
//     path.push(['L', points[2].x, points[2].y]);
//     path.push(['L', points[3].x, points[3].y]);
//     path.push('Z');
//     path = this.parsePath(path); // 将 0 - 1 转化为画布坐标

//     const group = container.addGroup();
//     group.addShape('rect', {
//       attrs: {
//         x: path[1][1], // 矩形起始点为左上角
//         y: path[1][2],
//         width: path[2][1] - path[1][1],
//         height: path[0][2] - path[1][2],
//         fill: cfg.color,
//         radius: (path[2][1] - path[1][1]) / 2,
//       },
//     });

//     return group;
//   },
// });
class Cylinder extends Component {
  dv = new DataSet().createView();

  render() {
    const { height, colors, padding, symbol, data, scal, onGetVal } = this.props;
    this.dv.source(data);
    //  const end =data[data.length - 1];

    return (
      <div>
        <Chart data={this.dv} padding={padding} scale={scal} height={height} forceFit animate onClick={ev => {
          const linkdata = ev.data;
          if (linkdata && linkdata.data) {
            onGetVal(linkdata.data)
          }
        }}>
          <Axis
            name="rate"
            label={{
              formatter: val => `${val}${symbol}`,
              style: {
                textAlign: 'end', // 文本对齐方向，可取值为： start center end
              },
            }}
            position="left"
          />
          <Axis name="name" />
          <Axis name="expected" visible={false} />
          <Legend visible={false} />
          <Tooltip visible={false} />
          <Interaction type="active-region" />
          <Coord transpose />
          {/* 柱形 */}
          <Interval
            color="#eee"
            size={15}
            //  shape="border-radius"
            position="name*expected"
          />
          <Interval
            position="name*rate"
            color={colors}
            size={15}
            label={[
              'rate',
              rateValue => {
                return {
                  content: `${rateValue}${symbol}`,
                  // style: {
                  //   fill: 'red',
                  // }
                };
              },
            ]}
          // shape={['name*rate', (date, val) => {
          //   if (val === 0) {
          //     return;
          //   }
          //   // eslint-disable-next-line consistent-return
          //   return 'border-radius';
          // }]}
          />
        </Chart>
      </div>
    );
  }
}

export default Cylinder;
