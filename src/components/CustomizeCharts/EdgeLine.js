import React, { Component } from 'react';

import {
  //  G2,
  Chart,
  Geom,
  Axis,
  // Tooltip,
  Coord,
  Legend,
  View,
  //  Guide,
  //  Shape,
  //  Facet,
  //  Util,
  Point,
} from 'bizcharts';
import DataSet from '@antv/data-set';

class EdgeLine extends Component {
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
    // console.log(dv);
    return (
      <div>
        <Chart padding={padding} height={height} forceFit>
          <Axis visible={false} />
          <Coord transpose />
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
              shape="line"
              color="#3399ff"
              opacity={0.8}
              tooltip="area*state"
            />
          </View>
          <View
            data={dv.getAllNodes().map(node => ({
              hasChildren: !!(node.children && node.children.length),
              statetrue: !!(node.data.state === '失败'),
              area: node.data.area,
              ip: node.data.ip,
              state: node.data.state,
              x: node.x,
              y: node.y,
            }))}
          >
            <Point
              position="x*y"
              color="statetrue"
              label={[
                'area*state*hasChildren',
                (area, state, hasChildren) => {
                  if (hasChildren === false) {
                    if (state === '失败') {
                      return {
                        content: `${area}(招测${state})`,
                        style: {
                          fill: 'red',
                        },
                      };
                    }
                    return {
                      content: `${area}(招测${state})`,
                      style: {
                        fill: '#444',
                      },
                    };
                  }
                  return {
                    content: `${area}`,
                    style: {
                      fill: '#444',
                    },
                    offset: '-10',
                  };
                },
              ]}
              tooltip={false}
            />
          </View>
          <Legend visible={false} />
        </Chart>
      </div>
    );
  }
}

export default EdgeLine;
