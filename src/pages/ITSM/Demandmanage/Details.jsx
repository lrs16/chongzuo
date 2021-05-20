import React, { useState, useEffect } from 'react';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { Steps, Collapse, Spin, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import Process from './Process';
import Registratdes from './components/Registratdes';
import Examinedes from './components/Examinedes';
import Tracklist from './components/Tracklist';

const { Panel } = Collapse;
const { Step } = Steps;

function Details(props) {
  const { location, dispatch, records, info, loading } = props;
  const { taskName, taskId, mainId } = location.query;
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [activeKey, setActiveKey] = useState(['registdes']);
  const handleclose = () => {
    router.push({
      pathname: `/ITSM/demandmanage/query`,
      query: { pathpush: true }
    });
  };
  const handleTabChange = key => {
    switch (key) {
      case 'workorder':
        settabActivekey('workorder');
        break;
      case 'process':
        settabActivekey('process');
        break;
      default:
        break;
    }
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
  ];

  const callback = key => {
    setActiveKey(key);
  };

  // 加载流程记录，加载编辑历史
  useEffect(() => {
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
  }, [mainId]);

  return (
    <PageHeaderWrapper
      title={taskName}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
      extra={<Button onClick={handleclose}>返回</Button>}
    >
      {tabActivekey === 'workorder' && (
        <div className={styles.collapse}>
          {records !== '' && (
            <Steps
              current={records.length - 1}
              progressDot
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
                return <Step title={obj.taskName} description={desc} key={index.toString()} />;
              })}
            </Steps>
          )}
          <Spin spinning={loading}>
            {loading === false && info !== '' && (
              <Collapse
                expandIconPosition="right"
                activeKey={activeKey}
                bordered={false}
                onChange={callback}
              >
                <Panel header="需求登记" key="registdes">
                  <Registratdes info={info.demandForm} />
                </Panel>

                {info.historys.map((obj, index) => {
                  // panel详情组件
                  if (obj.taskName !== '系统开发商处理')
                    return (
                      <Panel header={obj.taskName} key={index.toString()}>
                        <Examinedes info={obj} />
                      </Panel>
                    );
                  if (obj.taskName === '系统开发商处理')
                    return (
                      <Panel header={obj.taskName} key={index.toString()}>
                        <Tracklist demandId={info.demandForm.demandId} />
                      </Panel>
                    );
                })}
              </Collapse>
            )}
          </Spin>
        </div>
      )}
      {tabActivekey === 'process' && <Process location={location} />}
    </PageHeaderWrapper>
  );
}

export default connect(({ demandtodo, demandquery, loading }) => ({
  records: demandtodo.records,
  info: demandquery.info,
  loading: loading.models.demandtodo,
}))(Details);
