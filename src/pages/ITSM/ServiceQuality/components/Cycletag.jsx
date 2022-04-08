import React, { useState } from 'react';
import {
  Tag
} from 'antd';

const { CheckableTag } = Tag;

function Cycletag(props) {
  const {
    tagList
  } = props;
  const [selectedTags,setSelectedTags] = useState('')

  const handleChange = (tag, checked) => {
    if(checked) {
      setSelectedTags(checked)
    }
  }

  return (
    tagList.map(obj => {
      return (
        <CheckableTag
          key={obj.id}
          checked={obj.active}
          onChange={checked => handleChange(obj,checked)}
        >
          {obj.assessCycle}
        </CheckableTag>
      )
    })
  )
}

export default Cycletag;