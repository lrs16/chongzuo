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
    detailParams
  } = props;

  const data = [
    {
      country: "中国",
      population: 131744
    },
    {
      country: "印度",
      population: 104970
    },
    {
      country: "美国",
      population: 29034
    },
    {
      country: "印尼",
      population: 23489
    },
    {
      country: "巴西",
      population: 18203
    }
  ];
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
        <Interval position="country*population" />
      </Chart>
    </>
  )
}

export default Barchart;