import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Collapse,
  Steps
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';
import User from '@/components/SelectUser/User';
import { contractProvider } from '../services/quality'
import { connect } from 'dva';
import BusinessAudit from './components/BusinessAudit';
import Register from './components/Register';
import ProviderConfirmation from './components/ProviderConfirmation';
import AssessmentConfirmation from './components/AssessmentConfirmation';
import Achievementsflow from './Achievementsflow';
import Relatedorder from './Relatedorder';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { judgeTimeoutStatus, saveTimeoutMsg } from '../../services/api'
import TimeoutModal from '../../components/TimeoutModal';
import Reasonregression from '../../Problemmanage/components/Reasonregression'
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
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
}

const { Panel } = Collapse;
const { Step } = Steps;

function Performancequerydetail(props) {
  const pagetitle = props.route.name;
  const {
    location: { query: { taskId, assessNo, mainId, search, myOrder, tobelist } },
    location,
    target1,
    target2,
    clauseList,
    userinfo,
    taskData,
    taskData: { hisTasks, currentTask },
    hisTaskArr,
    loading,
    dispatch,
  } = props;
  const { title } = props.route;
  const formRef = useRef();
  const [noselect, setNoselect] = useState('1');
  const [uservisible, setUserVisible] = useState(false);
  const [contractArr, setContractArr] = useState([]);
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [butandorder, setButandOrder] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [tabActiveKey, setTabActiveKey] = useState('workorder');
  const [buttontype, setButtonType] = useState('');
  const [modalvisible, setModalVisible] = useState(false);
  const [modalrollback, setModalRollBack] = useState(false);   // 回退信息modle

  sessionStorage.setItem('Processtype', 'achievements');

  const gethisTask = () => {
    dispatch({
      type: 'performanceappraisal/hisTask',
      payload: {
        instanceId: mainId
      }
    })
  }

  const openFlow = () => {
    dispatch({
      type: 'performanceappraisal/getTaskData',
      payload: assessNo
    })
  }

  useEffect(() => {
    openFlow();
    gethisTask();
  }, [assessNo]);

  const getContrractname = (providerId) => {
    console.log('providerId: ', providerId);
    
    contractProvider(providerId).then(res => {
      if (res) {
        const arr = [...(res.data)];
        setContractArr(arr);
      }
    });
  }

  useEffect(() => {
    if((currentTask && currentTask.taskName === '服务绩效考核登记') || (hisTasks && hisTasks.length > 0 &&  hisTasks[0]['服务绩效考核登记'] && hisTasks[0]['服务绩效考核登记'].providerId)) {
      let detailId;
      if(hisTasks && hisTasks[0] && hisTasks[0]['服务绩效考核登记'] && (hisTasks[0] ['服务绩效考核登记']).providerId) {
        detailId = hisTasks[0]['服务绩效考核登记'].providerId;
        console.log('detailId: ', detailId);
      }
      getContrractname( (currentTask && currentTask.providerId) || detailId);
    }
  },[taskData])

  console.log(contractArr,'contractArr')

  const tabList = [
    {
      key: 'workorder',
      tab: '服务绩效考核工单'
    },
    {
      key: 'process',
      tab: '服务绩效考核流程'
    },
    {
      key: 'associatedWorkorder',
      tab: '关联工单'
    },
  ]

  const handleTabChange = (key) => {
    setTabActiveKey(key)
  }

  const handleBack = () => {
    if (search) {
      router.push({
        pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/search',
        query: { pathpush: true },
        state: { cache: false }
      }
      );
    }

    if (myOrder) {
      router.push({
        pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/assessment',
        query: { pathpush: true },
        state: { cache: false }
      }
      );
    }

    if (tobelist) {
      router.push({
        pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtlist',
        query: { pathpush: true },
        state: { cache: false }
      }
      );
    }


  }

  return (
    <PageHeaderWrapper
      title={title}
      extra={
        <>
          <Button type='default' onClick={handleBack}>
            返回
          </Button>

        </>
      }
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >

      {
        loading === false && taskData && tabActiveKey === 'workorder' && (
          <>
            {
              hisTasks && hisTasks.length > 0 && (
                <div className={styles.collapse}>
                  <Collapse
                    expandIconPosition="right"
                    bordered={false}
                    defaultActiveKey={['0']}
                  >
                    {
                      hisTasks.map((obj, index) => {
                        const Paneldesmap = new Map([
                          ['服务绩效考核登记', <Register
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            // getTarget1={getTarget1}
                            // getTarget2={getTarget2}
                            target1={[]}
                            target2={[]}
                            // getclausedetail={getclausedetail}
                            clauseList={[]}
                            register={Object.values(obj)[0]}
                            contractArr={contractArr}
                            // getContrractname={getContrractname}
                            // files={currentTask.attachment ? JSON.parse(currentTask.attachment) : []}
                            ChangeFiles={newvalue => {
                              setFiles(newvalue);
                            }}
                            loading={loading}
                            key='0'
                            noEdit='true'
                          />],
                          [`业务负责人审核`, <BusinessAudit
                            businessAudit={Object.values(obj)[0]}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            selectPersonstate={newvalue => setNoselect(newvalue)}
                            noEdit='true'
                          />],
                          [`自动化科专责审核`, <BusinessAudit
                            businessAudit={Object.values(obj)[0]}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            selectPersonstate={newvalue => setNoselect(newvalue)}
                            noEdit='true'
                          />],
                          [`业务负责人复核`, <BusinessAudit
                            businessAudit={Object.values(obj)[0]}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            selectPersonstate={newvalue => setNoselect(newvalue)}
                            noEdit='true'
                          />],
                          [`服务商确认`, <ProviderConfirmation
                            providerConfirmation={Object.values(obj)[0]}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            ChangeFiles={newvalue => {
                              setFiles(newvalue);
                            }}
                            selectPersonstate={newvalue => setNoselect(newvalue)}
                            noEdit='true'
                          />],
                          [`服务绩效考核确认`, <AssessmentConfirmation
                            assessmentConfirmation={Object.values(obj)[0]}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            getclausedetail={[]}
                            target1={[]}
                            target2={[]}
                            clauseList={clauseList}
                            selectPersonstate={newvalue => setNoselect(newvalue)}
                            editSign='true'
                          />],
                        ]);
                        return (
                          <Panel Panel header={Object.keys(obj)[0]} key={index}>
                            {Paneldesmap.get(Object.keys(obj)[0])}
                          </Panel>
                        )
                      })
                    }
                  </Collapse>
                </div>
              )
            }

            {
              hisTasks && hisTasks.length === 0 && (
                <div className={styles.collapse}>
                  <Collapse
                    expandIconPosition="right"
                    bordered={false}
                    defaultActiveKey={['0']}
                  >
                    <Panel Panel header='服务绩效考核登记'>
                      <Register
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        userinfo={userinfo}
                        // getTarget1={getTarget1}
                        // getTarget2={getTarget2}
                        target1={[]}
                        target2={[]}
                        // getclausedetail={getclausedetail}
                        clauseList={[]}
                        register={currentTask}
                        contractArr={contractArr}
                        // getContrractname={getContrractname}
                        // files={currentTask.attachment ? JSON.parse(currentTask.attachment) : []}
                        ChangeFiles={newvalue => {
                          setFiles(newvalue);
                        }}
                        loading={loading}
                        key='0'
                        noEdit='true'
                      />
                    </Panel>

                  </Collapse>
                </div>
              )
            }
          </>
        )
      }

      {
        tabActiveKey === 'process' && (
          <Achievementsflow
            taskId={mainId}
            flowhisTaskArr={hisTaskArr}
          />
        )
      }

      {
        tabActiveKey === 'associatedWorkorder' && (
          <Relatedorder
            orderId={mainId}
            location={location}
            search={search}
            relation
          />
        )
      }
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ performanceappraisal, itsmuser, qualityassessment, loading }) => ({
    taskData: performanceappraisal.taskData || { currentTask: { taskName: '', id: '', instanceId: '' }, hisTasks: [] },
    hisTaskArr: performanceappraisal.hisTaskArr,
    clauseList: qualityassessment.clauseList,
    userinfo: itsmuser.userinfo,
    target2: qualityassessment.target2,
    target1: qualityassessment.target1,
    loading: loading.models.performanceappraisal
  }))(Performancequerydetail)
)

