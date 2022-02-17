import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Row,
  Col,
  Empty,
  DatePicker,
  Tag
} from 'antd';
import { connect } from 'dva';
import SelectTime from '@/components/SelectTime/SelectTime';
import moment from 'moment';
import StatisticsCard from '@/components/StatisticsCard';
import { ChartCard } from '@/components/Charts';
import Barchart from '@/components/CustomizeCharts/Barchart';
import styles from './index.less';

const { CheckableTag } = Tag;
const tagcycle = ['第一周期', '第二周期', '第三周期', '第四周期', '全部'];

function Statistics(props) {
  const {
    statisticData,
    statsSumdata,
    dispatch,
    loading
  } = props;

  const [values, setValues] = useState({});
  const [selectedTags0, setSelectedTags0] = useState('第一周期');
  const [selectedTags1, setSelectedTags1] = useState('第一周期');
  const [selectedTags2, setSelectedTags2] = useState('第一周期');
  const [selectedTags3, setSelectedTags3] = useState('第一周期');
  const [yearTime0, setYearTime0] = useState(moment(new Date()).format('YYYY'))
  const [yearTime1, setYearTime1] = useState(moment(new Date()).format('YYYY'))
  const [yearTime2, setYearTime2] = useState(moment(new Date()).format('YYYY'))
  const [yearTime3, setYearTime3] = useState(moment(new Date()).format('YYYY'))

  const [bardata, setBardata] = useState([]);

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
      projectAssessment();
    }

  }, [values])

  useEffect(() => {
    const result = JSON.parse(JSON.stringify(statsSumdata).replace(/assessScore/g, '分值'))
    setBardata(result);
  }, [loading])

  const handleChange = (tag, checked, type) => {
    let startCycle;
    let endCycle;
    if (checked) {
      switch (type) {
        case '功能开发':
          switch (tag) {
            case '第一周期':
              startCycle = moment(moment(yearTime0).format('YYYY-01-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime0).format('YYYY-01-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第二周期':
              startCycle = moment(moment(yearTime0).format('YYYY-04-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime0).format('YYYY-04-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第三周期':
              startCycle = moment(moment(yearTime0).format('YYYY-07-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime0).format('YYYY-07-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第四周期':
              startCycle = moment(moment(yearTime0).format('YYYY-10-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime0).format('YYYY-10-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '全部':
              startCycle = moment(yearTime0).startOf('year').format("YYYY-MM-DD")
              endCycle = moment(yearTime0).endOf('year').format("YYYY-MM-DD")
              break;
            default:
              break;
          }
          setSelectedTags0(tag);
          break;
        case '软件运维':
          switch (tag) {
            case '第一周期':
              startCycle = moment(moment(yearTime1).format('YYYY-01-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime1).format('YYYY-01-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第二周期':
              startCycle = moment(moment(yearTime1).format('YYYY-04-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime1).format('YYYY-04-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第三周期':
              startCycle = moment(moment(yearTime1).format('YYYY-07-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime1).format('YYYY-07-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第四周期':
              startCycle = moment(moment(yearTime1).format('YYYY-10-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime1).format('YYYY-10-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '全部':
              startCycle = moment(yearTime1).startOf('year').format("YYYY-MM-DD")
              endCycle = moment(yearTime1).endOf('year').format("YYYY-MM-DD")
              break;
            default:
              break;
          }
          setSelectedTags1(tag);
          break;
        case '硬件运维':
          switch (tag) {
            case '第一周期':
              startCycle = moment(moment(yearTime2).format('YYYY-01-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime2).format('YYYY-01-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第二周期':
              startCycle = moment(moment(yearTime2).format('YYYY-04-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime2).format('YYYY-04-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第三周期':
              startCycle = moment(moment(yearTime2).format('YYYY-07-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime2).format('YYYY-07-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第四周期':
              startCycle = moment(moment(yearTime2).format('YYYY-10-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime2).format('YYYY-10-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '全部':
              startCycle = moment(yearTime2).startOf('year').format("YYYY-MM-DD")
              endCycle = moment(yearTime2).endOf('year').format("YYYY-MM-DD")
              break;
            default:
              break;
          }
          setSelectedTags2(tag);
          break;
        case '数据库运维':
          switch (tag) {
            case '第一周期':
              startCycle = moment(moment(yearTime3).format('YYYY-01-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime3).format('YYYY-01-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第二周期':
              startCycle = moment(moment(yearTime3).format('YYYY-04-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime3).format('YYYY-04-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第三周期':
              startCycle = moment(moment(yearTime3).format('YYYY-07-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime3).format('YYYY-07-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '第四周期':
              startCycle = moment(moment(yearTime3).format('YYYY-10-01')).startOf('quarter').format("YYYY-MM-DD")
              endCycle = moment(moment(yearTime3).format('YYYY-10-01')).endOf('quarter').format("YYYY-MM-DD")
              break;
            case '全部':
              startCycle = moment(yearTime3).startOf('year').format("YYYY-MM-DD")
              endCycle = moment(yearTime3).endOf('year').format("YYYY-MM-DD")
              break;
            default:
              break;
          }
          setSelectedTags3(tag);
          break;
        default:
          break;
      }


    }
  }

  const handleYearChange = (yearvalue, type) => {
    switch (type) {
      case '功能开发':
        setYearTime0(yearvalue);
        break;
      case '软件运维':
        setYearTime1(yearvalue);
        break;
      case '硬件运维':
        setYearTime2(yearvalue);
        break;
      case '数据库运维':
        setYearTime3(yearvalue);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <SelectTime ChangeDate={(v) => setValues(v)} />

      {
        (statisticData || []).map((obj, index) => {
          // const timeMap = new Map([
          //   ['功能开发',
          //     <DatePicker
          //       format='YYYY'
          //       mode="year"
          //       value={moment(yearTime0)}
          //       onPanelChange={value => handleYearChange(value.format('YYYY'), '功能开发')}
          //       style={{ marginRight: 10 }}
          //     />
          //   ],
          //   ['软件运维',
          //     <DatePicker
          //       format='YYYY'
          //       mode="year"
          //       value={moment(yearTime1)}
          //       onPanelChange={value => handleYearChange(value.format('YYYY'), '软件运维')}
          //       style={{ marginRight: 10 }}
          //     />
          //   ],
          //   ['硬件运维',
          //     <DatePicker
          //       format='YYYY'
          //       mode="year"
          //       value={moment(yearTime2)}
          //       onPanelChange={value => handleYearChange(value.format('YYYY'), '硬件运维')}
          //       style={{ marginRight: 10 }}
          //     />
          //   ],
          //   ['数据库运维',
          //     <DatePicker
          //       format='YYYY'
          //       mode="year"
          //       value={moment(yearTime3)}
          //       onPanelChange={value => handleYearChange(value.format('YYYY'), '数据库运维')}
          //       style={{ marginRight: 10 }}
          //     />
          //   ],
          // ]);
          return (
            <Row key={obj.id} style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div className={styles.statisticscard}>
                  <Avatar icon='desktop' />
                  <b>{obj.name}总情况</b>
                </div>

                <div>
                  {/* {timeMap.get(obj.name)} */}

                  {/* {tagcycle.map((objs) => {
                    const checkMap = new Map([
                      ['功能开发',
                        <CheckableTag
                          key={objs}
                          checked={selectedTags0 === objs}
                          onChange={checked => handleChange(objs, checked, '功能开发')}
                        >
                          {objs}
                        </CheckableTag>
                      ],
                      ['软件运维',
                        <CheckableTag
                          key={objs}
                          checked={selectedTags1 === objs}
                          onChange={checked => handleChange(objs, checked, '软件运维')}
                        >
                          {objs}
                        </CheckableTag>
                      ],
                      ['硬件运维',
                        <CheckableTag
                          key={objs}
                          checked={selectedTags2 === objs}
                          onChange={checked => handleChange(objs, checked, '硬件运维')}
                        >
                          {objs}
                        </CheckableTag>
                      ],
                      ['数据库运维',
                        <CheckableTag
                          key={objs}
                          checked={selectedTags3 === objs}
                          onChange={checked => handleChange(objs, checked, '数据库运维')}
                        >
                          {objs}
                        </CheckableTag>
                      ],
                    ]);
                    return (
                      checkMap.get(obj.name)
                    )
                  })} */}
                </div>
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