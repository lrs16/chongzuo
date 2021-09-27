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
const { RangePicker, MonthPicker } = DatePicker;
const format = 'YYYY-MM-DD 00:00:00'
const tagsFromServer = ['本日', '本月'];
function Statistics(props) {
  const {
    statisticData,
    statsSumdata,
    location,
    dispatch,
    loading
  } = props;

  console.log(loading,'loading')

  const [selectedTags, setSelectedTags] = useState(['本月']);
  // .format('YYYY-MM-DD 00:00:00')
  // .format('YYYY-MM-DD 23:59:59')
  const [selectTime, setSelectTime] = [{ start: moment(new Date()).format('YYYY-MM-DD 00:00:00'), end: moment(new Date).format('YYYY-MM-DD 23:59:59') }]
  const [time, setTime] = useState({
    startValue: moment(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00'))),
    endValue: moment(new Date(moment(new Date()).format('YYYY-MM-DD 23:59:59'))),
    endOpen: false,
  })


  const [monthTime, setMonthTime] = useState({
    mode: ['month', 'month'],
    // value:[]
    value: [moment(moment().startOf('month').format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment().endOf('month').format('YYYY-MM-DD'), 'YYYY-MM-DD')]
  })

  const [currentDatatype, setCurrentDatatype] = useState('本月');
  const [bardata,setBardata] = useState([])
  const getlist = (obj, tag) => {
    if (tag === '本日') {
      dispatch({
        type: 'qualityassessment/fetchstatsRatio',
        payload: {
          beginTime: (obj && obj.startValue) ? moment(obj.startValue).format('YYYY-MM-DD HH:mm:ss') : selectTime.start,
          endTime: (obj && obj.endValue) ? moment(obj.endValue).format('YYYY-MM-DD HH:mm:ss') : selectTime.end,
          type: 'LIST'
        }
      })
    } else {
      dispatch({
        type: 'qualityassessment/fetchstatsRatio',
        payload: {
          beginTime: (obj && obj[0]) ? moment(obj[0]).startOf('month').format('YYYY-MM-DD 00:00:00') : moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
          endTime: (obj && obj[1]) ? moment(obj[1]).endOf('month').format('YYYY-MM-DD 23:59:59') : moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
          type: 'LIST'
        }
      })
    }

  }

  const projectAssessment = (obj, tag) => {
    if (tag === '本日') {
      dispatch({
        type: 'qualityassessment/fetchstatsSum',
        payload: {
          beginTime: (obj && obj.startValue) ? moment(obj.startValue).format('YYYY-MM-DD HH:mm:ss') : selectTime.start,
          endTime: (obj && obj.endValue) ? moment(obj.endValue).format('YYYY-MM-DD HH:mm:ss') : selectTime.end,
        }
      })
    }
    if (tag === '本月') {
      console.log('tag: ', tag);
      dispatch({
        type: 'qualityassessment/fetchstatsSum',
        payload: {
          beginTime: (obj && obj[0]) ? moment(obj[0]).startOf('month').format('YYYY-MM-DD HH:mm:ss') : moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
          endTime: (obj && obj[1]) ? moment(obj[1]).endOf('month').format('YYYY-MM-DD 23:59:59') : moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
        }
      })
    }
  }


  const monthhandlePanelChange = (value, mode) => {
    console.log('value: ', value);
    setMonthTime({
      value,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
  };

  const monthhandleChange = value => {
    setMonthTime({ value });
  };

  const handleChange = (tag, checked) => {
    console.log('tag: ', tag);
    if (checked) {
      const obj = {
        startValue: tag === "本日" ? moment(new Date()).format('YYYY-MM-DD 00:00:00') : moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
        endValue: tag === "本月" ? moment().endOf('month').format('YYYY-MM-DD 23:59:59') : moment(new Date()).format('YYYY-MM-DD 23:59:59'),
        endOpen: false,
      }
      if( tag === "本日") {
        setMonthTime({
          mode: ['month', 'month'],
          value: [moment(moment().startOf('month').format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment().endOf('month').format('YYYY-MM-DD'), 'YYYY-MM-DD')]
        })
      } else {
        setTime({
          startValue: moment(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00'))),
          endValue: moment(new Date(moment(new Date()).format('YYYY-MM-DD 23:59:59'))),
          endOpen: false,
        })
      }
     
      getlist(obj, tag)
      setCurrentDatatype(tag);
      projectAssessment(obj, tag);
      setSelectedTags([tag])
    }
  }

  const disabledStartDate = startValue => {
    const { endValue } = time;
    if (!startValue || !endValue) {
      console.log(1)
      return false;
    }
    console.log(2)
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
    getlist('', currentDatatype);
    projectAssessment('', currentDatatype)
  }, [])

  useEffect(() => {
    if (location.state && location.state.reset) {
      getlist()
    }
  }, [location.state]);

  useEffect(() => {
    const result =JSON.parse(JSON.stringify(statsSumdata).replace(/assessScore/g, '分值'))
    console.log('result: ', result);
    setBardata(result)
  },[loading])

  return (
    <div>
      <Card>
        <span style={{ fontSize: 16, fontWeight: 700, paddingRight: 12 }}>统计周期:</span>
        {
          tagsFromServer.map((obj, index) => (
            <CheckableTag
              key={index}
              checked={selectedTags.indexOf(obj) > -1}
              onChange={checked => handleChange(obj, checked)}
            >{obj}</CheckableTag>
          ))
        }

        {
          currentDatatype === '本日' && (
            <>
              <DatePicker
                // value={moment(new Date(), format)}
                allowClear={false}
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
                allowClear
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
            </>
          )
        }

        {
          currentDatatype === '本月' && (
            <RangePicker
              allowClear={false}
              // defaultValue={[moment(moment().startOf('month').format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment().endOf('month').format('YYYY-MM-DD'), 'YYYY-MM-DD')]}
              placeholder={['Start month', 'End month']}
              format="YYYY-MM"
              value={monthTime.value}
              mode={monthTime.mode}
              onChange={monthhandleChange}
              onPanelChange={monthhandlePanelChange}
            />
          )
        }


        {currentDatatype === '本日' && (
          <Button
            onClick={() => { getlist(time, currentDatatype); projectAssessment(time, currentDatatype) }}
            type='primary'
            style={{ marginLeft: 10 }}
          >
            查询
          </Button>
        )}

        {currentDatatype === '本月' && (
          <Button
            onClick={() => { getlist(monthTime.value, currentDatatype); projectAssessment(monthTime.value, currentDatatype) }}
            type='primary'
            style={{ marginLeft: 10 }}
          >
            查询
          </Button>
        )}

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

      { loading ===  false && bardata && bardata.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <ChartCard title='项目考核情况'>
            <Barchart
              data={bardata}
              position='contractName*分值'
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
  connect(({ qualityassessment,loading }) => ({
    statisticData: qualityassessment.statisticData,
    statsSumdata: qualityassessment.statsSumdata,
    loading:loading.models.qualityassessment
  }))
)(Statistics);