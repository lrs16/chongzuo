import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Row,
  Col,
  Empty
} from 'antd';
import { connect } from 'dva';
import SelectTime from '@/components/SelectTime/SelectTime';
import moment from 'moment';
import StatisticsCard from '@/components/StatisticsCard';
import { ChartCard } from '@/components/Charts';
import Barchart from '@/components/CustomizeCharts/Barchart';
import styles from './index.less';

function Statistics(props) {
  const {
    statisticData,
    statsSumdata,
    dispatch,
    loading
  } = props;

  const [values, setValues] = useState({});

  const [bardata, setBardata] = useState([])

  const getlist = () => {
    dispatch({
      type: 'qualityassessment/fetchstatsRatio',
      payload: {
        beginTime: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
        type: 'LIST'
      }
    })
  }

  const projectAssessment = () => {
    dispatch({
      type: 'qualityassessment/fetchstatsSum',
      payload: {
        beginTime: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
      }
    })
  }

  useEffect(() => {
    setBardata([])
    if (values && values.type) {
      getlist();
      projectAssessment()
    }

  }, [values])

  useEffect(() => {
    const result = JSON.parse(JSON.stringify(statsSumdata).replace(/assessScore/g, '分值'))
    setBardata(result)
  }, [loading])

  return (
    <>
      <SelectTime ChangeDate={(v) => setValues(v)} />

      {
        (statisticData || []).map((obj) => {
          return (
            <Row key={obj.id} style={{ marginTop: 10 }}>
              <div className={styles.statisticscard}>
                <Avatar icon='desktop' />
                <b>{obj.name}总情况</b>
              </div>

              <Col span={8}>
                <StatisticsCard title='累计扣分' value={obj.minusScore} suffix='累计扣分' des='环比' desval={obj.minusRatio} type={Number(obj.minusScore) > Number(obj.prevMinusScore) ? 'up' : 'down'} />
              </Col>
              <Col span={8}>
                <StatisticsCard title='累计加分' value={obj.extraScore} suffix='累计加分' des='环比' desval={obj.extraRatio} type={Number(obj.extraScore) > Number(obj.prevExtraScore) ? 'up' : 'down'} />
              </Col>
              <Col span={8}>
                <StatisticsCard title='合计分值' value={obj.totalScore} suffix='合计分值' des='环比' desval={obj.totalRatio} type={Number(obj.totalScore) > Number(obj.prevTotalScore) ? 'up' : 'down'} />
              </Col>
            </Row>
          )
        })
      }

      <div style={{ marginTop: 20 }}>
        <ChartCard title='项目考核情况'>
          {
            loading === false && bardata && bardata.length === 0 && (
              <Empty />
            )
          }
          {
            loading === false && bardata && bardata.length > 0 && (
              <Barchart
                data={bardata}
                position='contractName*分值'
              />
            )
          }
        </ChartCard>
      </div>
    </>
  )
}

export default (
  connect(({ qualityassessment, loading }) => ({
    statisticData: qualityassessment.statisticData,
    statsSumdata: qualityassessment.statsSumdata,
    loading: loading.models.qualityassessment
  }))
)(Statistics);