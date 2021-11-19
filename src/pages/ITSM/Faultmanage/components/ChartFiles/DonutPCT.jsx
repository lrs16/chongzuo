import React, { useState } from 'react';
import {
  Chart,
  registerShape,
  Axis,
  Tooltip,
  Interval,
  Interaction,
  Coordinate,
} from "bizcharts";
import DataSet from '@antv/data-set';
import ChartDrawer from '../ChartDrawer';

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

function DonutPCT(props) {
  const { data, total, totaltitle, height, padding, onGetVal, staticName, time1, time2 } = props;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [drawerval, onGetDrawerVal] = useState('');
  const { DataView } = DataSet;
  const dv = new DataView();
  dv.source(data).transform({
    type: 'percent',
    field: 'value',
    dimension: 'type',
    groupBy: ['category'],
    as: 'percent',
  });

  const handleGetDrawerVal = val => {
    setVisible(!visible);
    onGetDrawerVal(val);
  };

  return (
    <div>
      <div
        style={{ position: 'absolute', left: '50%', top: '42%', width: 100, textAlign: 'center', marginLeft: '-50px', cursor: 'pointer', zIndex: 9999 }}
        onClick={() => {
          switch (staticName) {
            case '故障责任单位情况':
              handleGetDrawerVal({ staticName: 'blametotal', time1, time2 });
              break;
            case '故障类型总情况':
              handleGetDrawerVal({ staticName: 'typetotal', time1, time2 });
              break;
            case '硬件故障情况':
              handleGetDrawerVal({ staticName: 'hardwaretotal', time1, time2 });
              break;
            case '软件故障情况':
              handleGetDrawerVal({ staticName: 'softwaretotal', time1, time2 });
              break;
            case '故障系统模块情况':
              handleGetDrawerVal({ staticName: 'worksystemtotal', time1, time2 });
              break;
            case '故障工单超时情况':
              handleGetDrawerVal({ staticName: 'timeouttotal', time1, time2 });
              break;
            default:
              break;
          }
          // if (onGettotalVal) {
          //   onGettotalVal(staticName)
          // }
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 700 }}>{total}</span><br />
        <span>{totaltitle}</span>
      </div>
      <Chart height={height} data={dv.rows} padding={padding} autoFit onClick={ev => {
        const linkdata = ev.data;
        if (linkdata && linkdata.data) {
          onGetVal(linkdata.data);
          handleGetDrawerVal({ ...linkdata.data, staticName });
        }
      }}>
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
                return `${picdata.type}: ${(picdata.percent * 100).toFixed(0)}%`;
              },
              offset: '25',
            },
          ]}
        />
        <Interaction type="element-single-selected" />
      </Chart>
      {/* 抽屉 */}
      <ChartDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        drawerdata={drawerval}
        destroyOnClose
      />
    </div>
  );
}

export default DonutPCT;
