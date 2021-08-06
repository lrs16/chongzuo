import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Collapse
} from 'antd';
import moment from 'moment';
import { contractProvider } from '../services/quality'
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

function TobedealtForm(props) {
  const pagetitle = props.route.name;
  const {
    location: { query: { taskId } },
    target1,
    target2,
    clauseList,
    userinfo,
    taskData,
    loading,
    dispatch,
  } = props;
  const formRef = useRef();
  const [contractArr, setContractArr] = useState([]);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [tabActiveKey, setTabActiveKey] = useState('workorder')

  const { taskName } = taskData;
  const handleSubmit = () => {
    console.log(formRef, 'formRef')
  }

  const getUserinfo = () => {
    dispatch({
      type: 'itsmuser/fetchuser'
    })
  }

  const openFlow = () => {
    dispatch({
      type: 'performanceappraisal/getTaskData',
      payload: taskId
    })
  }

  //  根据考核类型查询一级指标
  const getTarget1 = (type) => {
    dispatch({
      type: 'performanceappraisal/scoreGetTarget1',
      payload: type
    })
  }
  //  根据考核类型查询二级指标
  const getTarget2 = (id) => {
    dispatch({
      type: 'performanceappraisal/scoreGetTarget2',
      payload: id
    })
  }

  //  获取详细条款数据
  const getclausedetail = (targetId, scoreId) => {
    dispatch({
      type: 'qualityassessment/clauseListpage',
      payload: {
        targetId,
        scoreId,
        pageNum: 1,
        pageSize: 1000
      }
    })
  }

  const getContrractname = (providerId) => {
    contractProvider(providerId).then(res => {
      if (res) {
        const arr = [...(res.data)];
        setContractArr(arr);
      }
    });
  }


  useEffect(() => {
    getUserinfo();
    openFlow()
  }, []);

  useEffect(() => {
    const { providerId } = taskData;
    if (providerId) {
      getContrractname(providerId)
    }

  }, [taskData]);




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


  return (
    <PageHeaderWrapper
      title={taskName}
      extra={
        <>
          <Button type='primary' onClick={handleSubmit}>保存</Button>
          <Button type='primary'>流转</Button>
          <Button type='primary'>关闭</Button>
        </>
      }
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      {
        loading === false && tabActiveKey === 'workorder' && (
          <div className={styles.collapse}>
            <Collapse
              expandIconPosition='right'
              defaultActiveKey={['1']}
              bordered={false}
            >
              <Panel
                header='服务绩效考核登记'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                {taskName === '服务绩效考核登记' && (
                  <Register
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    ref={formRef}
                    userinfo={userinfo}
                    getTarget1={getTarget1}
                    getTarget2={getTarget2}
                    target1={target1}
                    target2={target2}
                    getclausedetail={getclausedetail}
                    clauseList={clauseList}
                    register={taskData}
                    contractArr={contractArr}
                    getContrractname={getContrractname}
                    files={[]}
                    ChangeFiles={newvalue => {
                      setFiles(newvalue);
                    }}
                    loading={loading}
                  />
                )}
              </Panel>

              {/* <Panel
                header='业务负责人审核'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                <BusinessAudit
                  ref={formRef}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel> */}

              {/* <Panel
                header='自动化科专责审核'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                <BusinessAudit
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel> */}

              {/* <Panel
                header='服务商确认'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                <ProviderConfirmation
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel> */}

              {/* <Panel
                header='业务负责人复核'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                <BusinessAudit
                  repeatAudit='true'
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel> */}

              {/* <Panel
                header='服务绩效考核确认'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                <AssessmentConfirmation
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel> */}
            </Collapse>

          </div>
        )
      }

      {
        tabActiveKey === 'process' && (
          <Achievementsflow />
        )
      }

      {
        tabActiveKey === 'associatedWorkorder' && (
          <Relatedorder />
        )
      }

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ performanceappraisal, itsmuser, qualityassessment, loading }) => ({
    taskData: performanceappraisal.taskData,
    clauseList: qualityassessment.clauseList,
    userinfo: itsmuser.userinfo,
    target2: performanceappraisal.target2,
    target1: performanceappraisal.target1,
    loading: loading.models.performanceappraisal
  }))(TobedealtForm)
)

