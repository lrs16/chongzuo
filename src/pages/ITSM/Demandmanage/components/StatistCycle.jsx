import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Card, Tag, DatePicker, Button } from 'antd';

const { CheckableTag } = Tag;
const { MonthPicker } = DatePicker;
const tagsFromServer = ['按日', '按月'];

function StatistCycle(props) {
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
      setSelectedTags(tag);
      const beginTime = moment();
      const endTime = moment();
      if (tag === '按日') {
        setStartDates(beginTime);
        setEndDates(endTime);
        ChangeDate({ beginTime: moment(beginTime).format('YYYY-MM-DD'), endTime: moment(endTime).format('YYYY-MM-DD') });
      }
      if (tag === '按月') {
        setStartDates(beginTime);
        setEndDates(endTime);
        ChangeDate({ beginTime: moment(beginTime).format('YYYY-MM'), endTime: moment(endTime).format('YYYY-MM') })
      }
    }
  };

  useEffect(() => {
    handleChang('按月', true)
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

  const handelSearch = () => {
    if (startdates || enddates) {
      if (selectedTags === '按日') {
        ChangeDate({
          beginTime: moment(startdates).format('YYYY-MM-DD'),
          endTime: moment(enddates).format('YYYY-MM-DD')
        })
      }
      if (selectedTags === '按月') {
        ChangeDate({
          beginTime: moment(startdates).format('YYYY-MM'),
          endTime: moment(enddates).format('YYYY-MM')
        })
      }
    }
  }

  return (
    <Card>
      <span style={{ fontSize: 16, fontWeight: 900, paddingRight: 12 }}>统计周期：</span>
      {tagsFromServer.map(obj => {
        return (
          <CheckableTag
            key={obj}
            checked={selectedTags === obj}
            onChange={checked => handleChang(obj, checked)}
          >
            {obj}
          </CheckableTag>
        )
      })}
      {selectedTags === '按日' && (
        <>
          <DatePicker
            value={startdates}
            placeholder="开始时间"
            onChange={onStartChange}
            style={{ marginLeft: 24 }}
            format='YYYY-MM-DD'
            disabledDate={disastartbledDate}
          />
          <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
          <DatePicker
            value={enddates}
            placeholder="结束时间"
            onChange={onEndChange}
            format='YYYY-MM-DD'
            disabledDate={disaendbledDate} />
        </>
      )}
      {selectedTags === '按月' && (
        <>
          <MonthPicker
            value={startdates}
            placeholder="开始时间"
            onChange={onStartChange}
            style={{ marginLeft: 24 }}
            format='YYYY-MM'
            disabledDate={disastartbledDate}
          />
          <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
          <MonthPicker
            value={enddates}
            placeholder="结束时间"
            onChange={onEndChange}
            format='YYYY-MM'
            disabledDate={disaendbledDate} />
        </>
      )}
      <Button
        type='primary'
        onClick={() => handelSearch()}
        style={{ display: 'inline-block', marginLeft: 12 }}
      >
        查询
      </Button>
    </Card>
  );
}

export default StatistCycle;