import React, { useState } from 'react';
import { Card, Tag, DatePicker } from 'antd';

const { CheckableTag } = Tag;
const tagsFromServer = [{ name: '本日', key: '1' }, { name: '本月', key: '2' }];

function All(props) {
  const [selectedTags, setSelectedTags] = useState([]);
  const handleChang = (tag, checked) => {
    if (checked) {
      setSelectedTags([tag])
    }
  };

  return (
    <Card>
      <span style={{ fontSize: 16, fontWeight: 700, paddingRight: 12 }}>统计周期：</span>
      {tagsFromServer.map(obj => (
        <CheckableTag
          key={obj.key}
          checked={selectedTags.indexOf(obj) > -1}
          onChange={checked => handleChang(obj, checked)}
        >
          {obj.name}
        </CheckableTag>
      ))}
      <DatePicker placeholder="开始时间" />
      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
      <DatePicker placeholder="结束时间" />
    </Card>
  );
}

export default All;