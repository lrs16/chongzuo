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

        <Button type='primary' style={{ marginLeft: 12 }} onClick={getList}>??? ???</Button>
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
                  <span style={{fontWeight:900}}>???????????????</span>
                  <Cycletag
                    tagList={obj.phases || []}
                    arrIndex={index}
                    changeData={(objs,arrIndex) => {handleSelectChange(objs,arrIndex)}}
                  />
                </div>

              </div>
              <Col span={8}>
                <StatisticsCard
                  title='????????????'
                  value={obj.minusScore}
                  suffix='????????????'
                  des='??????'
                  desval={obj.minusRatio}
                  type={Number(obj.minusScore) > Number(obj.prevMinusScore) ? 'up' : 'down'}
                  onGetVal={() => {
                    setPicVal({
                      assessBeginTime: obj.beginTime,
                      assessEndTime: obj.endTime,
                      contractId: obj.id,
                      scoreType: '???'
                    });
                    setVisible(obj.beginTime);
                    if (!obj.beginTime) {
                      message.info('?????????????????????????????????')
                    }
                    setTitle('????????????:' + obj.contractName + ';' + '????????????:' + (obj.active ? obj.active + '(' + moment(obj.beginTime).format('YYYY-MM-DD') + '-' + moment(obj.endTime).format('YYYY-MM-DD') + ')' : ''))
                  }}
                />
              </Col>
              <Col span={8}>
                <StatisticsCard
                  title='????????????'
                  value={obj.extraScore}
                  suffix='????????????'
                  des='??????'
                  desval={obj.extraRatio}
                  type={Number(obj.extraScore) > Number(obj.prevExtraScore) ? 'up' : 'down'}
                  onGetVal={() => {
                    setPicVal({
                      assessBeginTime: obj.beginTime,
                      assessEndTime: obj.endTime,
                      contractId: obj.id,
                      scoreType: '???'
                    });
                    setVisible(obj.beginTime);
                    if (!obj.beginTime) {
                      message.info('?????????????????????????????????')
                    }
                    setTitle('????????????:' + obj.contractName + ';' + '????????????:' + (obj.active ? obj.active + '(' + moment(obj.beginTime).format('YYYY-MM-DD') + '-' + moment(obj.endTime).format('YYYY-MM-DD') + ')' : ''))
                  }}
                />
              </Col>
              <Col span={8}>
                <StatisticsCard
                  title='????????????'
                  value={obj.totalScore}
                  suffix='????????????'
                  des='??????'
                  desval={obj.totalRatio}
                  type={Number(obj.totalScore) > Number(obj.prevTotalScore) ? 'up' : 'down'}
                  onGetVal={() => {
                    setPicVal({
                      assessBeginTime: obj.beginTime,
                      assessEndTime: obj.endTime,
                      contractId: obj.id,
                      scoreType: '??????'
                    });
                    setVisible(obj.beginTime);
                    if (!obj.beginTime) {
                      message.info('?????????????????????????????????')
                    }
                    setTitle('????????????:' + obj.contractName + ';' + '????????????:' + (obj.active ? obj.active + '(' + moment(obj.beginTime).format('YYYY-MM-DD') + '-' + moment(obj.endTime).format('YYYY-MM-DD') + ')' : ''))
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