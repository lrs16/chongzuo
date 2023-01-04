/* eslint-disable react/prefer-stateless-function */
import React,  { useEffect, useRef, useCallback } from 'react';
import { Chart, Geom, Axis, Coord, Label, Tooltip, Legend } from 'bizcharts';

function ColumnarY(props) {
  const { data, cols, height, padding, onGetVal } = props;
  function useDebounce(fn, delay) {
    const { current } = useRef({ fn, timer: null });
    useEffect(function () {
      current.fn = fn;
    }, [fn]);

    return useCallback(function f(...args) {
      if (current.timer) {
        clearTimeout(current.timer);
      }
      current.timer = setTimeout(() => {
        current.fn.call(this, ...args);
      }, delay);
    })
  }

  const handleValue = useDebounce(v => {
    onGetVal(v)
  }, 300);
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
          const linkdata = ev.data;
          if (linkdata && (linkdata.data || linkdata._origin) && onGetVal) {
            handleValue(linkdata.data || linkdata._origin)
          }
        }}
      >
        <Coord transpose />
        <Axis
          name="total"
          label={{
            formatter: val => {
              if (val > 10000) {
                return `${(val / 10000).toFixed(1)}w`
              }
              return val
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
    </div>
  );
}

export default ColumnarY;
