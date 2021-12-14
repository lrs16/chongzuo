import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Collapse, Steps } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import Process from './Process';
import Registratdes from './components/Registratdes';
import Checkdes from './components/Checkdes';
import Handledes from './components/Handledes';
import ReturnVisitdes from './components/ReturnVisitdes';
import RelationOrder from './RelationOrder';

const { Panel } = Collapse;
const { Step } = Steps;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

// panel详情
const Panelheadermap = new Map([
  ['register', '事件登记'],
  ['handle', '事件处理'],
  ['check', '事件审核'],
  ['finish', '事件确认'],
]);
const pagetitlemaps = new Map([
  ['1', '事件登记'],
  ['2', '事件审核'],
  ['3', '事件审核'],
  ['4', '事件处理'],
  ['5', '事件处理'],
  ['6', '事件确认'],
  ['7', '事件确认'],
  ['8', '事件处理'],
  ['9', '事件详情'],
]);

function EventDetails(props) {
  const { location, dispatch, recordsloading, info, records, loading } = props;
  const { pangekey, id, mainId } = location.query;
  const [activeKey, setActiveKey] = useState([]);
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const handleclose = () => {
    const tabid = sessionStorage.getItem('tabid');
    router.push({
      pathname: location.pathname,
      query: { tabid, closecurrent: true }
    });
  };
  const handleTabChange = key => {
    settabActivekey(key)
  };
  const tabList = [
    {
      key: 'workorder',
      tab: '事件工单',
    },
    {
      key: 'process',
      tab: '事件流程',
    },
    {
      key: 'relevancy',
      tab: '关联工单',
    }
  ];

  const callback = key => {
    setActiveKey(key);
  };

  // 初始化打开
  useEffect(() => {
    dispatch({
      type: 'eventquery/fetchopenview',
      payload: {
        mainId,
      },
    });
    dispatch({
      type: 'eventtodo/eventrecords',
      payload: {
        processId: mainId,
      },
    });
    settabActivekey('workorder');
  }, [mainId]);

  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      dispatch({
        type: 'eventquery/fetchopenview',
        payload: {
          mainId,
        },
      });
      dispatch({
        type: 'eventtodo/eventrecords',
        payload: {
          processId: mainId,
        },
      });
      settabActivekey('workorder');
    };
  }, [location.state])

  // 初始化值panel
  useEffect(() => {
    setActiveKey([1]);
  }, [info]);

  return (
    <PageHeaderWrapper
      title={pagetitlemaps.get(pangekey)}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      extra={<Button onClick={() => handleclose()}>关闭</Button>}
      onTabChange={handleTabChange}
    >
      {tabActivekey === 'workorder' && (
        <div className={styles.collapse}>
          {recordsloading === false && (
            <Steps
              current={records.length - 1}
              size="small"
              // progressDot
              style={{
                background: '#fff',
                padding: 24,
                border: '1px solid #e8e8e8',
                overflowX: 'auto',
              }}
            >
              {records.map((obj, index) => {
                let tempTime = '';
                if (obj.addTime && obj.endTime) {
                  const addtime = moment(obj.addTime);
                  const endtime = moment(obj.endTime);
                  const dura = endtime.format('x') - addtime.format('x');
                  tempTime = moment.duration(dura);
                }
                const desc = (
                  <div className={styles.stepDescription}>
                    处理人：{obj.user}
                    {/* <DingdingOutlined /> */}
                    <div>开始时间：{obj.addTime}</div>
                    <div>结束时间：{obj.endTime}</div>
                    {tempTime && (<div style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '16px' }}>用时：
                      {tempTime.days() !== 0 && (<>{tempTime.days()}天</>)}
                      {tempTime.hours() !== 0 && (<>{tempTime.hours()}小时</>)}
                      {tempTime.minutes() !== 0 && (<>{tempTime.minutes()}分</>)}
                      {((tempTime.days() === 0 && tempTime.hours() === 0 && tempTime.minutes() === 0 && tempTime.seconds() === 0) || tempTime.seconds() !== 0) && (<>{tempTime.seconds()}秒</>)}
                    </div>)}
                  </div>
                );
                return <Step title={obj.nodeName} description={desc} key={index.toString()} />;
              })}
            </Steps>
          )}
          {info !== '' && info !== undefined && loading === false && (
            <Collapse
              expandIconPosition="right"
              activeKey={activeKey}
              bordered={false}
              onChange={callback}
            >
              {info.map((obj, index) => {
                // panel详情组件
                const Paneldesmap = new Map([
                  ['register', <Registratdes info={Object.values(obj)[0]} main={info[0].main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                  ['handle', <Handledes info={Object.values(obj)[0]} main={info[0].main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                  ['check', <Checkdes info={Object.values(obj)[0]} main={info[0].main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                  ['finish', <ReturnVisitdes info={Object.values(obj)[0]} main={info[0].main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                ]);

                if (index > 0)
                  return (
                    <Panel Panel header={Panelheadermap.get(Object.keys(obj)[0])} key={index.toString()}>
                      {Paneldesmap.get(Object.keys(obj)[0])}
                    </Panel>
                  );
              })}
            </Collapse>
          )}
        </div>
      )}
      {tabActivekey === 'process' && <Process location={location} />}
      {tabActivekey === 'relevancy' && <RelationOrder location={location} relation={false} />}
    </PageHeaderWrapper>
  );
}

export default connect(({ eventquery, eventtodo, loading }) => ({
  info: eventquery.info,
  records: eventtodo.records,
  loading: loading.models.eventquery,
  recordsloading: loading.effects['eventtodo/eventrecords'],
}))(EventDetails);
