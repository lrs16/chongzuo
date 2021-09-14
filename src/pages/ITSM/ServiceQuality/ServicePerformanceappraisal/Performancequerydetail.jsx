import React, { useEffect, useState } from 'react';
import { Form, Button, Collapse } from 'antd';
import router from 'umi/router';
import { contractProvider } from '../services/quality';
import { connect } from 'dva';
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
    if(assessNo) {
      openFlow();
      gethisTask();
    }
  }, [assessNo]);

  const getContrractname = providerId => {
    contractProvider({ id: providerId, status: '1' }).then(res => {
      if (res) {
        const arr = [...res.data];
        setContractArr(arr);
      }
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
      if (
        hisTasks &&
        hisTasks[0] &&
        hisTasks[0]['服务绩效考核登记'] &&
        hisTasks[0]['服务绩效考核登记'].providerId
      ) {
        detailId = hisTasks[0]['服务绩效考核登记'].providerId;
      }
      getContrractname((currentTask && currentTask.providerId) || detailId);
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
                        clauseList={[]}
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
        <Relatedorder orderId={mainId} location={location} search={search} relation />
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
