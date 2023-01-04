import React, { useEffect, useState } from 'react';
import {
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';

const { CheckableTag } = Tag;

function Cycletag(props) {
  const {
    tagList,
    arrIndex,
    changeData
  } = props;

  const [data, setdata] = useState([])


  useEffect(() => {
    setdata(tagList)
  }, [])

  const handleChange = (objs, checked) => {
    if (checked) {
      let objindex;
      data.find((obj, index) => {
        if (obj.id === objs.id) {
          objindex = index;
          return objindex
        }
        ;
        return null;
      })

      const resultData1 = tagList.map((obj) => {
        // return Object.assign({}, obj,{active:false})
        return {...obj,active:false}
      })
      const newObj = JSON.stringify(objs);
      const newObj2 = JSON.parse(newObj)
      newObj2.active = true;
      resultData1.splice(objindex, 1, newObj2);
      changeData(objs,arrIndex)
      setdata(resultData1)

    }
  }

  return (
    data.map(obj => {
      return (
        <Tooltip
        placement="topLeft"
        title={`${moment(obj.beginTime).format('YYYY-MM-DD')}-${moment(obj.endTime).format('YYYY-MM-DD')}`}
      >
        <CheckableTag
          key={obj.id}
          checked={obj.active}
          onChange={checked => handleChange(obj, checked)}
        >
          {obj.assessCycle}
        </CheckableTag>
      </Tooltip>
      
      )
    })
  )
}

export default Cycletag;