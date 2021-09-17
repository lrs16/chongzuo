import React from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coordinate,
  Label,
  Legend,
  Interval,
  Util
} from "bizcharts";

function Barchart(props) {
  const {
    detailParams,
    data
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
        <Interval position="contractName*assessScore" />
      </Chart>
    </>
  )
}

export default Barchart;