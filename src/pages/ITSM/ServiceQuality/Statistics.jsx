import React, { useEffect, useState } from 'react';
import {
  Icon,
  Card,
  Tag,
  DatePicker,
  Avatar,
  Row,
  Col
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

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectTime, setSelectTime] = [{ start: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), end: moment(new Date).format('YYYY-MM-DD 23:59:59') }]

  const handleChange = (tag, checked) => {
    if (checked) {
      setSelectedTags([tag])
    }
  }

  console.log(statsSumdata, 'statsSumdata')

  const getlist = () => {
    dispatch({
      type: 'qualityassessment/fetchstatsRatio',
      payload: {
        beginTime: selectTime.start,
        endTime: selectTime.end,
        type: 'LIST'
      }
    })
  }

  const projectAssessment = () => {
    dispatch({
      type:'qualityassessment/fetchstatsSum',
      payload:{
        beginTime: selectTime.start,
        endTime: selectTime.end,
      }
    })
  }

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
        <DatePicker placeholder='开始时间' />
        <span style={{ display: 'inline-block', width: 24, textAlign: 'center' }}>-</span>
        <DatePicker placeholder='结束时间' />
      </Card>

      {(statisticData || []).map((obj, index) => {
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
              <StatisticsCard title='累计加分' value={obj.extraScore} suffix='累计加分' des='环比上月' desval={obj.extraRatio} type='up' />
            </Col>
            <Col span={8}>
              <StatisticsCard title='合计分值' value={obj.totalScore} suffix='合计分值' des='环比上月' desval={obj.totalRatio} type='up' />
            </Col>
          </Row>
        )
      })}

      <ChartCard title='项目考核情况'>
        <Barchart
          // height={315}
          // detailParams={newdata => { showDetaillist(newdata, 'barchart') }}
        />
      </ChartCard>
    </div >

  )
}

export default (
  connect(({ qualityassessment, loading }) => ({
    statisticData: qualityassessment.statisticData,
    statsSumdata:qualityassessment.statsSumdata
  }))
)(Statistics);