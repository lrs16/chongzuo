import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, } from 'antd';

function RangeTime(props) {
  const { startVal, endVal, getTimes } = props;
  const [startTime, setStartTime] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);

  useEffect(() => {
    if (startVal) {
      setStartTime(startVal)
    };
    if (endVal) {
      setEndTime(endVal)
    }
  }, [])

  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  const timeformat = 'YYYY-MM-DD HH:mm:ss';
  return (
    <>
      <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
        <DatePicker
          defaultValue={startVal ? moment(startVal, timeformat) : null}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: moment('00:00:00', 'HH:mm:ss'),
          }}
          placeholder="开始时间"
          format='YYYY-MM-DD HH:mm:ss'
          style={{ minWidth: 120, width: '100%' }}
          onChange={(_, dateString) => {
            setStartTime(dateString);
            if (getTimes) {
              getTimes({ startTime: dateString, endTime: endTime || '' });
            }
          }}
          disabledDate={(v) => {
            return endTime && v && moment(v) > moment(endTime);
          }}
          disabledTime={() => {
            const Hours = moment(endTime).format('HH');
            const Minutes = moment(endTime).format('mm');
            const Seconds = moment(endTime).format('ss');
            if (startTime && endTime && moment(startTime).format('YYYY-MM-DD') === moment(endTime).format('YYYY-MM-DD')) {
              return {
                disabledHours: () => range(Hours, 24),
                disabledMinutes: () => {
                  if (moment(startTime).format('YYYY-MM-DD HH') === moment(endTime).format('YYYY-MM-DD HH')) {
                    return range(Minutes, 60)
                  }
                  return []
                },
                disabledSeconds: () => {
                  if (moment(startTime).format('YYYY-MM-DD HH:mm') === moment(endTime).format('YYYY-MM-DD HH:mm')) {
                    return range(Seconds, 60)
                  }
                  return []
                },
              };
            }
            return null
          }}
        />
      </div>
      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
      <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
        <DatePicker
          defaultValue={endVal ? moment(endVal, timeformat) : null}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: moment('23:59:59', 'HH:mm:ss'),
          }}
          placeholder="结束时间"
          format='YYYY-MM-DD HH:mm:ss'
          style={{ minWidth: 120, width: '100%' }}
          onChange={(_, dateString) => {
            setEndTime(dateString);
            if (getTimes) {
              getTimes({ startTime: startTime || '', endTime: dateString });
            }
          }}
          disabledDate={(v) => {
            return startTime && v && moment(v) < moment(startTime);
          }}
          disabledTime={() => {
            const Hours = moment(startTime).format('HH');
            const Minutes = moment(startTime).format('mm');
            const Seconds = moment(startTime).format('ss');
            if (startTime && endTime && moment(startTime).format('YYYY-MM-DD') === moment(endTime).format('YYYY-MM-DD')) {
              return {
                disabledHours: () => range(0, Hours),
                disabledMinutes: () => {
                  if (moment(startTime).format('YYYY-MM-DD HH') === moment(endTime).format('YYYY-MM-DD HH')) {
                    return range(0, Minutes)
                  }
                  return []
                },
                disabledSeconds: () => {
                  if (moment(startTime).format('YYYY-MM-DD HH:mm') === moment(endTime).format('YYYY-MM-DD HH:mm')) {
                    return range(0, Seconds)
                  }
                  return []
                },
              };
            }
            return null
          }}
        />
      </div>
    </>
  );
}

export default RangeTime;