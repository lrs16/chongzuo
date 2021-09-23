import React, { useEffect, useState } from 'react';
import { Card, Tag, DatePicker, Radio } from 'antd';

const { CheckableTag } = Tag;
const tagsFromServer = [{ name: '本日', key: '1' }, { name: '本月', key: '2' }];

function All(props) {
  const [selectedTags, setSelectedTags] = useState('2');
  const handleChang = (tag, checked) => {
    if (checked) {
      setSelectedTags(tag.key)
    }
  };
  useEffect(() => {

  }, [])

  return (
    <Card>
      <span style={{ fontSize: 16, fontWeight: 700, paddingRight: 12 }}>统计周期：</span>
      {tagsFromServer.map(obj => {
        return (
          <CheckableTag
            key={obj.key}
            checked={selectedTags === obj.key}
            onChange={checked => handleChang(obj, checked)}
          >
            {obj.name}
          </CheckableTag>
        )
      })}
      <DatePicker placeholder="开始时间" />
      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
      <DatePicker placeholder="结束时间" />
    </Card>
  );
}

export default All;