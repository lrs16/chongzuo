import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Card, Tag, DatePicker, Button } from 'antd';

const { CheckableTag } = Tag;
const { RangePicker } = DatePicker;
const tagsFromServer = [{ name: '按日', key: '1' }, { name: '按月', key: '2' }];

function SelectTime(props) {
  const { ChangeDate } = props;
  const [selectedTags, setSelectedTags] = useState('');
  const [startdates, setStartDates] = useState(undefined);
  const [enddates, setEndDates] = useState(undefined);

  const disastartbledDate = (current) => {
    return current && current > moment();
  }
  const disaendbledDate = (current) => {
    return current && current < moment() && startdates && current < startdates;
  }

  const handleChang = (tag, checked) => {
    if (checked) {
      setSelectedTags(tag.key);
    }
  };

  useEffect(() => {
    handleChang({ name: '按月', key: '2' }, true)
    return () => {
      handleChang(undefined);
      setStartDates(undefined);
      setEndDates(undefined);
    };
  }, [])

  const onStartChange = (dateString) => {
    setStartDates(dateString)
  };

  const onEndChange = (dateString) => {
    setEndDates(dateString)
  };

  const handlePanelChange = (value) => {
    console.log(value)
  }

  const handleOpenChange = (status) => {
    console.log(status)
  }

  const handelSearch = () => {
    if (startdates || enddates) {
      setSelectedTags('3');
      ChangeDate({ beginWarnTime: startdates, endWarnTime: enddates })
    }
  }

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
      {selectedTags === '1' && (<>
        <DatePicker
          value={startdates}
          placeholder="开始时间"
          onChange={onStartChange}
          style={{ marginLeft: 24 }}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: moment('00:00:00', 'HH:mm:ss'),
          }}
          format='YYYY-MM-DD HH:mm:ss'
          disabledDate={disastartbledDate}
        />
        <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
        <DatePicker
          value={enddates}
          placeholder="结束时间"
          onChange={onEndChange}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: moment('23:59:59', 'HH:mm:ss'),
          }}
          format='YYYY-MM-DD HH:mm:ss'
          disabledDate={disaendbledDate} />
      </>)}
      {selectedTags === '2' && (
        <RangePicker
          allowClear={false}
          placeholder={['起始月份', '结束月份']}
          format="YYYY-MM"
          mode={['month', 'month']}
          onPanelChange={handlePanelChange}
          onOpenChange={handleOpenChange}
        />
      )}
      <Button
        type={selectedTags === '3' ? 'primary' : 'default'}
        onClick={() => handelSearch()}
        style={{ display: 'inline-block', marginLeft: 12 }}
      >
        查询
      </Button>
    </Card>
  );
}

export default SelectTime;