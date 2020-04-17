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
import DataSet from '@antv/data-set';

class Treecompactbox extends Component {
  render() {
    const { datas, height, padding } = this.props;
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
          <Tooltip />
          <View
            data={dv.getAllLinks().map(link => ({
              x: [link.source.x, link.target.x],
              y: [link.source.y, link.target.y],
              source: link.source.id,
              target: link.target.id,
            }))}
          >
            <Geom
              type="edge"
              position="x*y"
              shape="smooth"
              color="grey"
              opacity={0.8}
              tooltip="source*target"
            />
          </View>
          <View
            data={dv.getAllNodes().map(node => ({
              hasChildren: !!(node.children && node.children.length),
              name: node.data.name,
              value: node.value,
              depth: node.depth,
              x: node.x,
              y: node.y,
            }))}
          >
            <Geom type="point" position="x*y" color="hasChildren">
              <Label
                content="name"
                textStyle={(text, item) => {
                  const textAlign = item.point.hasChildren ? 'right' : 'left';
                  return {
                    fill: 'grey',
                    fontSize: 14,
                    textBaseline: 'middle',
                    textAlign,
                  };
                }}
                offset={0}
              />
            </Geom>
          </View>
        </Chart>
      </div>
    );
  }
}

export default Treecompactbox;
