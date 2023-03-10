import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { Steps, Collapse, Spin, Button, Icon, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Process from './Process';
import Registratdes from './components/Registratdes';
import Examinedes from './components/Examinedes';
import Tracklist from './components/Tracklist';
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

function Details(props) {
  const { location, dispatch, records, info, loading } = props;
  const { taskName, taskId, mainId } = location.query;
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [activeKey, setActiveKey] = useState(['registdes']);

  const handleclose = () => {
    const tabid = sessionStorage.getItem('tabid');
    router.push({
      pathname: location.pathname,
      query: { tabid, closecurrent: true },
    });
  };
  const handleTabChange = key => {
    settabActivekey(key);
  };
  const tabList = [
    {
      key: 'workorder',
      tab: '需求工单',
    },
    {
      key: 'process',
      tab: '需求流程',
    },
    {
      key: 'relevancy',
      tab: '关联工单',
    },
  ];

  const callback = key => {
    setActiveKey(key);
  };

  // 加载流程记录，加载编辑历史
  useEffect(() => {
    if (mainId !== undefined) {
      settabActivekey('workorder');
      dispatch({
        type: 'demandtodo/demandrecords',
        payload: {
          processId: mainId,
        },
      });
      dispatch({
        type: 'demandquery/detail',
        payload: {
          processInstanceId: mainId,
        },
      });
    }
    return () => {
      setActiveKey('workorder');
    };
  }, [mainId]);

  useEffect(() => {
    if (loading) {
      setActiveKey(['registdes']);
    }
    if (info && info.historys && info.historys.length >= 0 && !loading) {
      for (let i = 0; i < info.historys.length; i += 1) {
        activeKey.push(i);
      }
    }
  }, [loading]);

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      settabActivekey('workorder');
      dispatch({
        type: 'demandtodo/demandrecords',
        payload: {
          processId: mainId,
        },
      });
      dispatch({
        type: 'demandquery/detail',
        payload: {
          processInstanceId: mainId,
        },
      });
    }
  }, [location.state]);

  const pheadertitle = (obj, index) => {
    return (
      <>
        <Badge
          count={index}
          style={{
            backgroundColor: '#C1EB08',
            color: '#10C510',
            boxShadow: '0 0 0 1px #10C510 inset',
            marginRight: 4,
            marginBottom: 2,
          }}
        />
        <span>{obj.taskName}</span>
      </>
    );
  };

  return (
    <PageHeaderWrapper
      title={taskName}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
      extra={<Button onClick={handleclose}>关闭</Button>}
    >
      {tabActivekey === 'workorder' && (
        <div className="ordercollapse">
          {records && (
            <Steps
              current={records.length - 1}
              size="small"
              style={{
                background: '#fff',
                padding: 24,
                border: '1px solid #e8e8e8',
                overflowX: 'auto',
              }}
            >
              {records.map((obj, index) => {
                const desc = (
                  <div>
                    <div>处理人：{obj.userName}</div>
                    <div>开始时间：{obj.startTime}</div>
                    <div>结束时间：{obj.endTime}</div>
                  </div>
                );
                return (
                  <Step
                    title={obj.taskName}
                    description={desc}
                    key={index.toString()}
                    icon={
                      !obj.endTime ? (
                        <Icon type="loading" spin style={{ color: '#0124c5' }} />
                      ) : (
                        <Icon type="check-circle" />
                      )
                    }
                  />
                );
              })}
              {/* {(taskName === '已关闭' || taskName === '已完成') && (
                <Step
                  title='结束'
                  description=''
                  key={records.length.toString()}
                  icon={<Icon type="check" />}
                />
              )} */}
            </Steps>
          )}
          <div className="noexplain">
            <Spin spinning={loading}>
              {info && (
                <Collapse
                  expandIconPosition="right"
                  activeKey={activeKey}
                  bordered={false}
                  onChange={callback}
                >
                  <Panel header={pheadertitle({ taskName: '需求登记' }, 1)} key="registdes">
                    <Registratdes
                      info={info.demandForm}
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                    />
                  </Panel>

                  {info.historys.map((obj, index) => {
                    // panel详情组件
                    if (obj.taskName === '系统开发商处理') {
                      return (
                        <Panel header={pheadertitle(obj, index + 2)} key={index.toString()}>
                          <Tracklist demandId={info.demandForm.demandId} />
                        </Panel>
                      );
                    }
                    return (
                      <Panel header={pheadertitle(obj, index + 2)} key={index.toString()}>
                        <Examinedes
                          info={obj}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                        />
                      </Panel>
                    );
                  })}
                </Collapse>
              )}
            </Spin>
          </div>
        </div>
      )}
      {tabActivekey === 'process' && <Process location={location} />}
      {tabActivekey === 'relevancy' && <RelationOrder location={location} />}
    </PageHeaderWrapper>
  );
}

export default connect(({ demandtodo, demandquery, loading }) => ({
  records: demandtodo.records,
  info: demandquery.info,
  loading: loading.models.demandquery,
}))(Details);
