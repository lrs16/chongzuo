import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Row,
  Col,
  Card,
  DatePicker,
  Select,
  Button,
  message
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import StatisticsCard from '../Eventmanage/Eventstatistics/StatisticsCard';
import AnalysisPopup from './AnalysisPopup';
import Cycletag from './components/Cycletag';
import styles from './index.less';

const { Option } = Select;

function Statistics(props) {
  const {
    contractArr,
    dispatch,
    loading
  } = props;
  const [listdata, setListdata] = useState([]);
  const [datapack, setDatapack] = useState({
    isopen: false,
    time: moment().format('YYYY')
  });
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [picval, setPicVal] = useState({});

  const getList = () => {
    dispatch({
      type: 'qualityassessment/fetchstatsContract',
      payload: moment(datapack.time).format('YYYY')
    })
  }

  useEffect(() => {
    getList()
  }, []);

  useEffect(() => {
    setListdata(contractArr)
  }, [contractArr]);

  const handleSelectChange = (option, index) => {
    const searchObj = listdata[index];
    searchObj.extraScore = option.extraScore;
    searchObj.minusScore = option.minusScore;
    searchObj.totalScore = option.totalScore;
    searchObj.extraRatio = option.extraRatio;
    searchObj.minusRatio = option.minusRatio;
    searchObj.beginTime = option.beginTime;
    searchObj.endTime = option.endTime;
    searchObj.active = option.assessCycle;

    const newArr = listdata;
    newArr.splice(index, 1, searchObj);
    setListdata(newArr)
  }

  return (
    <>
      <Card>
        <DatePicker
          allowClear={false}
          mode='year'
          value={moment(datapack.time)}
          open={datapack.isopen}
          format="YYYY"
          onFocus={() => { setDatapack({ time: moment(datapack.time).format('YYYY'), isopen: true }) }}
          onPanelChange={(v) => {
            setDatapack({
              time: moment(v).format('YYYY'),
              isopen: false
            })
          }} />

        <Button type='primary' style={{ marginLeft: 12 }} onClick={getList}>查 询</Button>
      </Card>

      {
        loading === false && (listdata || []).map((obj, index) => {
          return (
            <Row key={obj.id} style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div className={styles.statisticscard}>
                  <Avatar icon='desktop' />
                  <b>{obj.contractName}</b>
                </div>

                <div>
                  <span style={{fontWeight:900}}>考核周期：</span>
                  <Cycletag
                    tagList={obj.phases || []}
                    arrIndex={index}
                    changeData={(objs,arrIndex) => {handleSelectChange(objs,arrIndex)}}
                  />
                </div>

              </div>
              <Col span={8}>
                <StatisticsCard
                  title='累计扣分'
                  value={obj.minusScore}
                  suffix='累计扣分'
                  des='环比'
                  desval={obj.minusRatio}
                  type={Number(obj.minusScore) > Number(obj.prevMinusScore) ? 'up' : 'down'}
                  onGetVal={() => {
                    setPicVal({
                      assessBeginTime: obj.beginTime,
                      assessEndTime: obj.endTime,
                      contractId: obj.id,
                      scoreType: '减'
                    });
                    setVisible(obj.beginTime);
                    if (!obj.beginTime) {
                      message.info('没有考核周期的点击无效')
                    }
                    setTitle('合同名称:' + obj.contractName + ';' + '考核周期:' + (obj.active ? obj.active + '(' + moment(obj.beginTime).format('YYYY-MM-DD') + '-' + moment(obj.endTime).format('YYYY-MM-DD') + ')' : ''))
                  }}
                />
              </Col>
              <Col span={8}>
                <StatisticsCard
                  title='累计加分'
                  value={obj.extraScore}
                  suffix='累计加分'
                  des='环比'
                  desval={obj.extraRatio}
                  type={Number(obj.extraScore) > Number(obj.prevExtraScore) ? 'up' : 'down'}
                  onGetVal={() => {
                    setPicVal({
                      assessBeginTime: obj.beginTime,
                      assessEndTime: obj.endTime,
                      contractId: obj.id,
                      scoreType: '加'
                    });
                    setVisible(obj.beginTime);
                    if (!obj.beginTime) {
                      message.info('没有考核周期的点击无效')
                    }
                    setTitle('合同名称:' + obj.contractName + ';' + '考核周期:' + (obj.active ? obj.active + '(' + moment(obj.beginTime).format('YYYY-MM-DD') + '-' + moment(obj.endTime).format('YYYY-MM-DD') + ')' : ''))
                  }}
                />
              </Col>
              <Col span={8}>
                <StatisticsCard
                  title='合计分值'
                  value={obj.totalScore}
                  suffix='合计分值'
                  des='环比'
                  desval={obj.totalRatio}
                  type={Number(obj.totalScore) > Number(obj.prevTotalScore) ? 'up' : 'down'}
                  onGetVal={() => {
                    setPicVal({
                      assessBeginTime: obj.beginTime,
                      assessEndTime: obj.endTime,
                      contractId: obj.id,
                      scoreType: '合计'
                    });
                    setVisible(obj.beginTime);
                    if (!obj.beginTime) {
                      message.info('没有考核周期的点击无效')
                    }
                    setTitle('合同名称:' + obj.contractName + ';' + '考核周期:' + (obj.active ? obj.active + '(' + moment(obj.beginTime).format('YYYY-MM-DD') + '-' + moment(obj.endTime).format('YYYY-MM-DD') + ')' : ''))
                  }}
                />
              </Col>
            </Row>

          )
        })
      }
      <AnalysisPopup
        visible={visible}
        title={title}
        popupParameters={picval}
        closePop={() => { setVisible(false) }}
      />
    </>
  )
}

export default (
  connect(({ qualityassessment, loading }) => ({
    contractArr: qualityassessment.contractArr,
    loading: loading.models.qualityassessment
  }))
)(Statistics);