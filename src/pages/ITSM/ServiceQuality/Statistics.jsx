import React, { useEffect, useState } from 'react';
import {
  Icon,
  Card,
  Tag,
  DatePicker,
  Avatar,
  Row,
  Col,
  Button
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import StatisticsCard from '@/components/StatisticsCard';
import { ChartCard } from '@/components/Charts';
import Barchart from '@/components/CustomizeCharts/Barchart';
import Donut from '@/components/CustomizeCharts/Donut';
import OrdinaryLine from '@/components/CustomizeCharts/OrdinaryLine';
import styles from './index.less';
// import StatisticsModal from './components/StatisticsModal';

const { CheckableTag } = Tag;
const tagsFromServer = [{ name: '本日', key: '1' }, { name: '本月', key: '2' }];
function Statistics(props) {
  const {
    statisticData,
    statsSumdata,
    dispatch
  } = props;

  const [selectedTags, setSelectedTags] = useState([{ name: '本日', key: '1' }]);
  const [selectTime, setSelectTime] = [{ start: moment(new Date()).format('YYYY-MM-DD 00:00:00'), end: moment(new Date).format('YYYY-MM-DD 23:59:59') }]
  const [time, setTime] = useState({
    startValue: null,
    endValue: null,
    endOpen: false,
  })

  const getlist = (obj) => {
    dispatch({
      type: 'qualityassessment/fetchstatsRatio',
      payload: {
        beginTime: (obj && obj.startValue) ? moment(obj.startValue).format('YYYY-MM-DD HH:mm:ss') : selectTime.start,
        endTime: (obj && obj.endValue) ? moment(obj.endValue).format('YYYY-MM-DD HH:mm:ss') : selectTime.end,
        type: 'LIST'
      }
    })
  }

  const projectAssessment = (obj) => {
    dispatch({
      type: 'qualityassessment/fetchstatsSum',
      payload: {
        beginTime: (obj && obj.startValue) ? moment(obj.startValue).format('YYYY-MM-DD HH:mm:ss') : selectTime.start,
        endTime: (obj && obj.endValue) ? moment(obj.endValue).format('YYYY-MM-DD HH:mm:ss') : selectTime.end,
      }
    })
  }

  const handleChange = (tag, checked) => {
    if (checked) {
      const obj = {
        startValue: tag.name === "本日" ? moment(new Date()).format('YYYY-MM-DD 00:00:00') : moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
        endValue: tag.name === "本月" ? moment().endOf('month').format('YYYY-MM-DD 23:59:59') : moment(new Date()).format('YYYY-MM-DD 23:59:59'),
        endOpen: false,
      }
      getlist(obj)
      projectAssessment(obj);
      setSelectedTags([tag])
    }
  }

  const disabledStartDate = startValue => {
    const { endValue } = time;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  const disabledEndDate = endValue => {
    const { startValue } = time;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  const onChange = (field, value) => {
    const obj = time;
    switch (field) {
      case 'startValue':
        obj.startValue = value;
        setTime(obj);
        break;
      case 'endValue':
        obj.endValue = value;
        setTime(obj);
        break;
      default:
        break;
    }
  };
  const onStartChange = value => {
    onChange('startValue', value);
  };

  const onEndChange = value => {
    onChange('endValue', value);
  };

  const handleEndOpenChange = open => {
    const obj = time;
    obj.endOpen = open
    setTime(obj);
  };

  const handleStartOpenChange = open => {
    if (!open) {
      const obj = time;
      obj.endOpen = true;
      setTime(obj);
    }
  };

  useEffect(() => {
    getlist();
    projectAssessment()
  }, [])

  return (
    <div>
      <Card>
        <span style={{ fontSize: 16, fontWeight: 700, paddingRight: 12 }}>统计周期:</span>
        {
          tagsFromServer.map(obj => (
            <CheckableTag
              key={obj.key}
              checked={selectedTags.indexOf(obj) > -1}
              onChange={checked => handleChange(obj, checked)}
            >{obj.name}</CheckableTag>
          ))
        }
        <DatePicker
          disabledDate={disabledStartDate}
          onChange={onStartChange}
          onOpenChange={handleStartOpenChange}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: moment('00:00:00', 'HH:mm:ss'),
          }}
          value={time.startValue}
          placeholder='开始时间'
        />
        <span style={{ display: 'inline-block', width: 24, textAlign: 'center' }}>-</span>
        <DatePicker
          disabledDate={disabledEndDate}
          onChange={onEndChange}
          open={time.endOpen}
          onOpenChange={handleEndOpenChange}
          value={time.endValue}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: moment('23:59:59', 'HH:mm:ss'),
          }}
          format='YYYY-MM-DD HH:mm:ss'
          placeholder='结束时间'
        />

        <Button
          onClick={() => { getlist(time); projectAssessment(time) }}
          type='primary'
          style={{ marginLeft: 10 }}
        >
          查询
        </Button>
      </Card>

      {(statisticData || []).map((obj) => {
        return (
          <Row key={obj.id} style={{ marginTop: 10 }}>
            <div className={styles.statisticscard}>
              <Avatar icon='desktop' />
              <b>{obj.name}总情况</b>
            </div>

            <Col span={8}>
              <StatisticsCard title='累计扣分' value={obj.minusScore} suffix='累计扣分' des='环比上月' desval={obj.minusRatio} type={Number(obj.minusScore) > Number(obj.prevMinusScore) ? 'up' : 'down'} />
            </Col>
            <Col span={8}>
              <StatisticsCard title='累计加分' value={obj.extraScore} suffix='累计加分' des='环比上月' desval={obj.extraRatio} type={Number(obj.extraScore) > Number(obj.prevExtraScore) ? 'up' : 'down'} />
            </Col>
            <Col span={8}>
              <StatisticsCard title='合计分值' value={obj.totalScore} suffix='合计分值' des='环比上月' desval={obj.totalRatio} type={Number(obj.totalScore) > Number(obj.prevTotalScore) ? 'up' : 'down'} />
            </Col>
          </Row>
        )
      })}

      {statsSumdata && statsSumdata.length >0  && (
        <div style={{ marginTop: 20 }}>
          <ChartCard title='项目考核情况'>
            <Barchart
              data={statsSumdata}
            // height={315}
            // detailParams={newdata => { showDetaillist(newdata, 'barchart') }}
            />
          </ChartCard>
        </div>
      )}
    </div >

  )
}

export default (
  connect(({ qualityassessment }) => ({
    statisticData: qualityassessment.statisticData,
    statsSumdata: qualityassessment.statsSumdata
  }))
)(Statistics);