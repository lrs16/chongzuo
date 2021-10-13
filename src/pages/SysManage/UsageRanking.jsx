import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Avatar,
  Select,
  Empty,
  InputNumber,
  Spin,
} from 'antd';
import styles from '../SysManage/index.less';
import moment from 'moment';
import ColumnarY from '../ITSM/Eventmanage/eventstatistics/ColumnarY';
import SelectTime from '@/components/SelectTime/SelectTime';



function UsageRanking(props) {
  const {
    loginUserToparr,
    tabClickNumToparr,
    dispatch
  } = props;
  console.log(loginUserToparr, 'loginUserToparr')
  console.log(tabClickNumToparr, 'tabClickNumToparr')
  const [values, setValues] = useState({});
  const [topN1, setTopN1] = useState(5) // 排序
  const [topN2, setTopN2] = useState(5) // 排序

  const Issuedscale = {
    total: {
      type: 'linear',
      alias: '返回结果数量',
      min: 0,
      tickInterval: 100,
    },
  };

  const Issuedscale2 = {
    total: {
      type: 'linear',
      alias: '返回结果数量',
      min: 0,
      tickInterval: 1000,
    },
  };
  const dataCylinder = (datas) => { // 柱状图集成数组
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN1 ? i < datas.length : i < topN1; i += 1) {
      const vote = {};
      vote.type = datas[i].type;
      vote.total = datas[i].total;
      vote.expected = datas[0].total;
      newArr.push(vote);
    }
    return newArr.reverse();
  };

  const dataCylinder1 = (datas) => { // 柱状图集成数组
    console.log('datas: ', datas);
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN2 ? i < datas.length : i < topN2; i += 1) {
      const vote = {};
      vote.type = datas[i].type;
      vote.total = datas[i].total;
      vote.expected = datas[0].total;
      newArr.push(vote);
    }
    return newArr.reverse();
  };

  useEffect(() => {
    if (values && values.type) {
      const val = {
        time1: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
        time2: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
        type: values.type === 'M' ? 'MONTH' : 'DAY',
        num: 1000
      }

      dispatch({
        type: 'functionalranking/fetchgetLoginUserTop',
        payload: val
      })

      dispatch({
        type: 'functionalranking/fetchgetTabClickNumTop',
        payload: val
      })
    }
  }, [values]);
  return (
    <div>
      <SelectTime ChangeDate={(v) => setValues(v)} />
      <Row style={{ marginTop: 24 }} gutter={24}>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>功能使用排名情况Top{topN1}</b>
            <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN1(v)} /></div>
          </div>
          <Card>
            {tabClickNumToparr && tabClickNumToparr.length === 0 && <Empty style={{ height: '300px' }} />}
            {tabClickNumToparr && tabClickNumToparr.length > 0 && (
              <ColumnarY
                data={dataCylinder(tabClickNumToparr)}
                height={300}
                padding={[30, 60, 50, 100]}
                cols={Issuedscale2}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
              />
            )}
          </Card>
        </Col>

        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>用户登录排名情况Top{topN2}</b>
            <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN2(v)} /></div>
          </div>
          <Card>
            {loginUserToparr && loginUserToparr.length === 0 && <Empty style={{ height: '300px' }} />}
            {loginUserToparr && loginUserToparr.length > 0 && (
              <ColumnarY
                data={dataCylinder1(loginUserToparr)}
                height={300}
                padding={[30, 60, 50, 100]}
                cols={Issuedscale}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
              />
            )}
          </Card>
        </Col>
      </Row>


    </div >
  )
}

export default connect(({ functionalranking, loading }) => ({
  loginUserToparr: functionalranking.loginUserToparr,
  tabClickNumToparr: functionalranking.tabClickNumToparr,
}))(UsageRanking);