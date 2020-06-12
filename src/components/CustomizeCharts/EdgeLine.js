import React, { Component } from 'react';

import {
  //  G2,
  Chart,
  Geom,
  //  Axis,
  Tooltip,
  Coord,
  Label,
  //  Legend,
  View,
  //  Guide,
  //  Shape,
  //  Facet,
  //  Util,
} from 'bizcharts';
import DataSet from '@antv/data-set';

class EdgeLine extends Component {
  render() {
    const { datas, height, padding } = this.props;
    // 创建 DataView G2语法
    const dv = new DataSet.View().source(datas, {
      type: 'hierarchy',
      pureData: true,
    });
    dv.transform({
      type: 'hierarchy.compact-box',
      // this layout algorithm needs to use pure data
      direction: 'TB',

      getHGap() {
        return 10;
      },

      getVGap() {
        return 10;
      },

      getHeight() {
        return 18;
      },

      getWidth() {
        return 18;
      },
    });
    return (
      <div>
        <Chart forceFit padding={padding} height={height}>
          <Coord transpose />
          <View
            data={dv.getAllLinks().map(link => ({
              x: [link.source.x, link.target.x],
              y: [link.source.y, link.target.y],
              source: link.source.id,
              target: link.target.id,
              // colordata :link.source.children,
            }))}
          >
            <Geom
              type="edge"
              position="x*y"
              shape="line"
              color="source"
              // color={['colordata', (colordata) => {
              //   console.log(colordata);
              // //   if (alert) {
              // //     return 'red';
              // //   }
              // //  return '#fff';
              // }]}
              size={2}
            />
          </View>
          <View
            data={dv.getAllNodes().map(node => ({
              hasChildren: !!(node.children && node.children.length),
              valuetrue: !!(node.data.value === 1),
              name: node.data.name,
              value: node.data.value,
              depth: node.depth,
              x: node.x,
              y: node.y,
            }))}
          >
            <Geom type="point" position="x*y" color="valuetrue">
              <Label
                content="name"
                offset={10}
                htmlTemplate={(text, item) => {
                  if (!item.point.hasChildren) {
                    if (item.point.value === 1) {
                      return `<span style="color:#ff0000; white-space:nowrap;">${item.point.name}（招测失败）</span>`;
                    }
                    return `<span style="color:#404040;white-space:nowrap;">${item.point.name}（招测失成功）</span>`;
                  }
                  return `<span style="color:#404040;white-space:nowrap;">${item.point.name}</span>`;
                }}
              />
            </Geom>
          </View>
        </Chart>
      </div>
    );
  }
}

export default EdgeLine;
