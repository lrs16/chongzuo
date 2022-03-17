import React, { useState } from 'react';
import { Chart, Geom, Axis, Coord, Label, Tooltip, Legend } from 'bizcharts';
import ChartDrawer from '../ChartDrawer';

function ColumnarY(props) {
  const { data, cols, height, padding, onGetVal, staticName } = props;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [drawerval, onGetDrawerVal] = useState('');

  const handleGetDrawerVal = val => {
    setVisible(!visible);
    onGetDrawerVal(val);
  };

  return (
    <div>
      <Chart
        renderer="canvas"
        height={height}
        data={data}
        scale={cols}
        padding={padding}
        forceFit
        onClick={ev => {
          setTimeout(() => {
            const clickdata = ev.data;
            if (clickdata && clickdata.data) {
              onGetVal(clickdata.data);
              handleGetDrawerVal({
                ...clickdata.data,
                staticName,
                drawtitle: `${staticName}：${clickdata.data.type}`,
              });
            }
          }, 100);
        }}
        onDoubleClick={ev => {
          const clickdata = ev.data;
          if (clickdata && clickdata.data) {
            onGetVal(clickdata.data);
            handleGetDrawerVal({
              ...clickdata.data,
              staticName,
              drawtitle: `${staticName}：${clickdata.data.type}`,
            });
          }
        }}
      >
        <Coord transpose />
        <Axis
          name="total"
          label={{
            formatter: val => {
              if (val > 10000) {
                return `${(val / 10000).toFixed(1)}w`;
              }
              return val;
            },
            autoRotate: false,
          }}
        />
        <Axis
          name="type"
          label={{
            autoRotate: false,
            autoEllipsis: true,
          }}
        />
        <Tooltip showTitle={false} />
        <Legend visible={false} />
        <Geom type="interval" position="type*total" color="type">
          <Label
            content="total"
            offset={10} // 设置坐标轴文本 label 距离坐标轴线的距离
            htmlTemplate={(text, item) => {
              if (item.point.flag === true) {
                return `<div style="color:#ff0000; ">${item.point.total}</div>`;
              }
              return `<div style="color:#404040;">${item.point.total}</div>`;
            }}
          />
        </Geom>
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

export default ColumnarY;
