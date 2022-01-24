import React from 'react';
import {
  Chart,
  Coordinate,
  Interval,
} from "bizcharts";

function Barchart(props) {
  const {
    detailParams,
    data,
    position
  } = props;
  
  return (
    <>
      <Chart
        height={380}
        data={data}
        autoFit
        onClick={ev => {
          const dataparams = ev.data;
          if (detailParams) {
            detailParams(dataparams);
          }
        }
        }
      >
        <Coordinate transpose />
        <Interval
          position={position}
          color={['contractName*分值', (date, val) => {
            if (val < 80) {
              return 'l(180) 0:#ffbb02 0.5:#fe7402 1:#fe7402'
            }
            return 'l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe';
          }]}
        />
      </Chart>
    </>
  )
}

export default Barchart;