import React, { useEffect, useState } from 'react';
import { Form, Button, Collapse, Steps } from 'antd';
import router from 'umi/router';
import { contractProvider } from '../services/quality';
import { connect } from 'dva';
import moment from 'moment';
import BusinessAudit from './components/BusinessAudit';
import Register from './components/Register';
import ProviderConfirmation from './components/ProviderConfirmation';
import AssessmentConfirmation from './components/AssessmentConfirmation';
import Achievementsflow from './Achievementsflow';
import Relatedorder from './Relatedorder';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';

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

const { Panel } = Collapse;
const { Step } = Steps;

function Performancequerydetail(props) {
  const {
    location: {
      query: { assessNo, mainId, search, myOrder, tobelist },
    },
    location,
    clauseList,
    userinfo,
    taskData,
    taskData: { hisTasks, currentTask },
    hisTaskArr,
    loading,
    dispatch,
  } = props;
  const { title } = props.route;
  const [noselect, setNoselect] = useState('1');
  const [contractArr, setContractArr] = useState([]);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [tabActiveKey, setTabActiveKey] = useState('workorder');

  sessionStorage.setItem('Processtype', 'achievements');

  const gethisTask = () => {
    dispatch({
      type: 'performanceappraisal/hisTask',
      payload: {
        instanceId: mainId,
      },
    });
  };

  const openFlow = () => {
    dispatch({
      type: 'performanceappraisal/getTaskData',
      payload: { assessNo },
    });
  };

  useEffect(() => {
    if (assessNo) {
      openFlow();
      gethisTask();
    }
  }, [assessNo]);

  useEffect(() => {
    if (location.state && location.state.reset && assessNo) {
      openFlow();
      gethisTask();
      sessionStorage.setItem('Processtype', 'achievements');
      setTabActiveKey('workorder');
    }
  }, [location.state])


  const getContrractname = providerId => {
    contractProvider({ id: providerId, status: '1' }).then(res => {
      if (res) {
        const arr = [...res.data];
        setContractArr(arr);
      }
    });
  };

  //  获取详细条款数据
  const getclausedetail = (targetId, scoreId) => {
    dispatch({
      type: 'qualityassessment/clauseListpage',
      payload: {
        targetId,
        scoreId,
        pageNum: 1,
        pageSize: 1000,
      },
    });
  };

  useEffect(() => {
    if (
      (loading === false &&
        currentTask &&
        currentTask.taskName &&
        currentTask.taskName === '服务绩效考核登记') ||
      (hisTasks &&
        hisTasks.length > 0 &&
        hisTasks[0]['服务绩效考核登记'] &&
        hisTasks[0]['服务绩效考核登记'].providerId)
    ) {
      let detailId;
      let target2Id;
      let scoreId;
      if (
        hisTasks &&
        hisTasks[0] &&
        hisTasks[0]['服务绩效考核登记'] &&
        hisTasks[0]['服务绩效考核登记'].providerId
      ) {
        detailId = hisTasks[0]['服务绩效考核登记'].providerId;
        target2Id = hisTasks[0]['服务绩效考核登记'].target2Id;
        scoreId = hisTasks[0]['服务绩效考核登记'].scoreId;
      }
      getContrractname((currentTask && currentTask.providerId) || detailId);
      getclausedetail(target2Id, scoreId);
    }
  }, [taskData]);

  const tabList = [
    {
      key: 'workorder',
      tab: '服务绩效考核工单',
    },
    {
      key: 'process',
      tab: '服务绩效考核流程',
    },
    {
      key: 'associatedWorkorder',
      tab: '关联工单',
    },
  ];

  const handleTabChange = key => {
    setTabActiveKey(key);
  };

  const handleBack = () => {
    if (search) {
      router.push({
        pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/search',
        query: { pathpush: true },
        state: { cache: false },
      });
    }

    if (myOrder) {
      router.push({
        pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/assessment',
        query: { pathpush: true },
        state: { cache: false },
      });
    }

    if (tobelist) {
      router.push({
        pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtlist',
        query: { pathpush: true },
        state: { cache: false },
      });
    }
  };

  return (
    <PageHeaderWrapper
      title={title}
      extra={
        <>
          <Button type="default" onClick={handleBack}>
            返回
          </Button>
        </>
      }
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >

      {
        loading === false && hisTasks && hisTasks.length > 0 && (
          <div className={styles.collapse}>
            {hisTaskArr && (
              <Steps
                current={hisTaskArr.length - 1}
                size="small"
                style={{
                  background: '#fff',
                  padding: 24,
                  border: '1px solid #e8e8e8',
                  overflowX: 'auto',
                  marginBottom: 24,
                }}
              >
                {hisTaskArr &&
                  hisTaskArr.map(
                    ({ key, name, taskStatus, totalTime, assignee, startTime, endTime }) => [
                      name !== '开始节点' && name !== '结束节点' && (
                        <Step
                          key={key}
                          title={`${name}${'\xa0'}${'\xa0'}(${taskStatus})${'\xa0'}${'\xa0'}${totalTime ||
                            ''}`}
                          description={
                            <div className={styles.stepDescription}>
                              处理人：{assignee}
                              <div>开始时间：{moment(startTime).format('YYYY-MM-DD HH:mm')}</div>
                              <div>
                                结束时间：
                                {endTime ? moment(endTime).format('YYYY-MM-DD HH:mm') : ''}
                              </div>
                            </div>
                          }
                        />
                      ),
                    ],
                  )}
              </Steps>
            )}
          </div>

        )
      }
      {loading === false && taskData && taskData.hisTasks && tabActiveKey === 'workorder' && (
        <>
          {hisTasks && hisTasks.length > 0 && (
            <div className={styles.collapse}>
              <Collapse expandIconPosition="right" bordered={false} defaultActiveKey={['0']}>
                {hisTasks.map((obj, index) => {
                  const Paneldesmap = new Map([
                    [
                      '服务绩效考核登记',
                      <Register
                        key={index}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        userinfo={userinfo}
                        target1={[]}
                        target2={[]}
                        clauseList={clauseList}
                        register={Object.values(obj)[0]}
                        contractArr={contractArr}
                        ChangeFiles={newvalue => {
                          setFiles(newvalue);
                        }}
                        loading={loading}
                        noEdit="true"
                      />,
                    ],
                    [
                      `业务负责人审核`,
                      <BusinessAudit
                        key={index}
                        businessAudit={Object.values(obj)[0]}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        userinfo={userinfo}
                        selectPersonstate={newvalue => setNoselect(newvalue)}
                        noEdit="true"
                      />,
                    ],
                    [
                      `自动化科专责审核`,
                      <BusinessAudit
                        key={index}
                        businessAudit={Object.values(obj)[0]}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        userinfo={userinfo}
                        selectPersonstate={newvalue => setNoselect(newvalue)}
                        noEdit="true"
                      />,
                    ],
                    [
                      `业务负责人复核`,
                      <BusinessAudit
                        key={index}
                        businessAudit={Object.values(obj)[0]}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        userinfo={userinfo}
                        selectPersonstate={newvalue => setNoselect(newvalue)}
                        noEdit="true"
                      />,
                    ],
                    [
                      `服务商确认`,
                      <ProviderConfirmation
                        key={index}
                        providerConfirmation={Object.values(obj)[0]}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        userinfo={userinfo}
                        ChangeFiles={newvalue => {
                          setFiles(newvalue);
                        }}
                        selectPersonstate={newvalue => setNoselect(newvalue)}
                        noEdit="true"
                      />,
                    ],
                    [
                      `服务绩效考核确认`,
                      <AssessmentConfirmation
                        key={index}
                        assessmentConfirmation={Object.values(obj)[0]}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        userinfo={userinfo}
                        getclausedetail={[]}
                        target1={[]}
                        target2={[]}
                        clauseList={clauseList}
                        selectPersonstate={newvalue => setNoselect(newvalue)}
                        editSign="true"
                        noEdit={search}
                      />,
                    ],
                  ]);
                  return (
                    <Panel Panel header={Object.keys(obj)[0]} key={index}>
                      {Paneldesmap.get(Object.keys(obj)[0])}
                    </Panel>
                  );
                })}
              </Collapse>
            </div>
          )}

          {hisTasks && hisTasks.length === 0 && (
            <div className={styles.collapse}>
              <Collapse expandIconPosition="right" bordered={false} defaultActiveKey={['0']}>
                <Panel Panel header="服务绩效考核登记">
                  <Register
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    userinfo={userinfo}
                    target1={[]}
                    target2={[]}
                    clauseList={[]}
                    register={currentTask}
                    contractArr={contractArr}
                    ChangeFiles={newvalue => {
                      setFiles(newvalue);
                    }}
                    loading={loading}
                    key='0'
                    noEdit="true"
                  />
                </Panel>
              </Collapse>
            </div>
          )}
        </>
      )}

      {hisTaskArr && tabActiveKey === 'process' && (
        <Achievementsflow taskId={mainId} flowhisTaskArr={hisTaskArr} />
      )}

      {tabActiveKey === 'associatedWorkorder' && (
        <Relatedorder
          orderId={mainId}
          location={location}
          search={search}
          assessNo={assessNo}
          relation
        />
      )}
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ performanceappraisal, itsmuser, qualityassessment, loading }) => ({
    taskData: performanceappraisal.taskData || {
      currentTask: { taskName: '', id: '', instanceId: '' },
      hisTasks: [],
    },
    hisTaskArr: performanceappraisal.hisTaskArr,
    clauseList: qualityassessment.clauseList,
    userinfo: itsmuser.userinfo,
    target2: qualityassessment.target2,
    target1: qualityassessment.target1,
    loading: loading.models.performanceappraisal,
  }))(Performancequerydetail),
);
