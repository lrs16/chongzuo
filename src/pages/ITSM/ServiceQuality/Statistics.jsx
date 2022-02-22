import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Row,
  Col,
  Card,
  DatePicker,
  Select,
  Button
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import StatisticsCard from './StatisticsCard';
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

  const handleSelectChange = (value, option, index) => {
    const replaceObj = JSON.parse(option.key);
    const searchObj = listdata[index];
    searchObj.extraScore = replaceObj.extraScore;
    searchObj.minusScore = replaceObj.minusScore;
    searchObj.totalScore = replaceObj.totalScore;
    searchObj.extraRatio = replaceObj.extraRatio;
    searchObj.minusRatio = replaceObj.minusRatio;

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
                  <span>考核周期：</span>
                  <Select
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    style={{ width: 150 }}
                    defaultValue={obj.active}
                    onChange={(value, option) => handleSelectChange(value, option, index)}
                  >
                    {
                      (obj.phases || []).map(objs => [
                        <Option key={JSON.stringify(objs)} value={objs.assessCycle}>{objs.assessCycle}</Option>
                      ])
                    }
                  </Select>
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
    </>
  )
}

export default (
  connect(({ qualityassessment, loading }) => ({
    contractArr: qualityassessment.contractArr,
    loading: loading.models.qualityassessment
  }))
)(Statistics);