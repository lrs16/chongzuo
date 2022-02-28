import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Card, Tag, DatePicker, Button } from 'antd';

const { CheckableTag } = Tag;
const { MonthPicker } = DatePicker;
const tagsFromServer = ['按日', '按月', '按年'];

function SelectTime(props) {
  const { ChangeDate, OtherSelect } = props;
  const [selectedTags, setSelectedTags] = useState('');
  const [startdates, setStartDates] = useState(undefined);
  const [enddates, setEndDates] = useState(undefined);
  const [isopen, setIsOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [yearstartdates, setYearStartDates] = useState(null);
  const [yearenddates, setYearEndtDates] = useState(null);

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
        ChangeDate({
          beginTime: moment(beginTime).format('YYYY-MM-DD 00:00:00'),
          endTime: moment(endTime).format('YYYY-MM-DD 23:59:59'),
          type: 'D'
        });
      }
      if (tag === '按月') {
        setStartDates(beginTime);
        setEndDates(endTime);
        ChangeDate({
          beginTime: moment(beginTime).startOf('month').format('YYYY-MM-DD 00:00:00'),
          endTime: moment(endTime).endOf('month').format('YYYY-MM-DD 23:59:59'),
          type: 'M'
        })
      }
      if (tag === '按年') {
        setYearStartDates(beginTime);
        setYearEndtDates(endTime);
        ChangeDate({
          beginTime: moment(beginTime).startOf('year').format('YYYY-MM-DD 00:00:00'),
          endTime: moment(endTime).endOf('year').format('YYYY-MM-DD 23:59:59'),
          type: 'Y'
        })
      }
    }
  };

  useEffect(() => {
    handleChang('按月', true)
    return () => {
      handleChang(undefined);
      setStartDates(undefined);
      setEndDates(undefined);
      setYearStartDates(null);
      setYearEndtDates(null);
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
          beginTime: moment(startdates || undefined).format('YYYY-MM-DD 00:00:00'),
          endTime: moment(enddates || undefined).format('YYYY-MM-DD 23:59:59'),
          type: 'D'
        })
      }
      if (selectedTags === '按月') {
        ChangeDate({
          beginTime: moment(startdates || undefined).startOf('month').format('YYYY-MM-DD 00:00:00'),
          endTime: moment(enddates || undefined).endOf('month').format('YYYY-MM-DD 23:59:59'),
          type: 'M'
        })
      }
    }
    if (yearstartdates || yearenddates) {
      if (selectedTags === '按年') {
        ChangeDate({
          beginTime: moment(yearstartdates || null).startOf('year').format('YYYY-MM-DD 00:00:00'),
          endTime: moment(yearenddates || null).endOf('year').format('YYYY-MM-DD 23:59:59'),
          type: 'Y'
        })
      }
    }
  }

  return (
    <Card>
      {OtherSelect && OtherSelect()}
      <span style={{ fontSize: 16, fontWeight: 700, paddingRight: 12 }}>统计周期：</span>
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
            allowClear={false}
          />
          <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
          <DatePicker
            value={enddates}
            placeholder="结束时间"
            onChange={onEndChange}
            format='YYYY-MM-DD'
            disabledDate={disaendbledDate}
            allowClear={false}
          />
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
            allowClear={false}
          />
          <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
          <MonthPicker
            value={enddates}
            placeholder="结束时间"
            onChange={onEndChange}
            format='YYYY-MM'
            disabledDate={disaendbledDate}
            allowClear={false}
          />
        </>
      )}
      {selectedTags === '按年' && (
        <>
          <DatePicker
            value={yearstartdates}
            open={isopen}
            mode="year"
            placeholder="开始时间"
            onPanelChange={(v) => {
              setIsOpen(false);
              setYearStartDates(v);
            }}
            onOpenChange={(status) => {
              if (status) {
                setIsOpen(true);
              } else {
                setIsOpen(false);
              }
            }}
            onChange={() => {
              setYearStartDates(null);
            }}
            style={{ marginLeft: 24 }}
            format='YYYY'
            disabledDate={disastartbledDate}
          />
          <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
          <DatePicker
            value={yearenddates}
            open={isEndOpen}
            mode="year"
            placeholder="结束时间"
            onPanelChange={(v) => {
              setIsEndOpen(false);
              setYearEndtDates(v);
            }}
            onOpenChange={(status) => {
              if (status) {
                setIsEndOpen(true);
              } else {
                setIsEndOpen(false);
              }
            }}
            onChange={() => {
              setYearEndtDates(null);
            }}
            format='YYYY'
            disabledDate={disaendbledDate}
          />
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

export default SelectTime;