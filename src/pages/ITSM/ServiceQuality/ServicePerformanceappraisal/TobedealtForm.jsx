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

function TobedealtForm(props) {
  const pagetitle = props.route.name;
  const {
    location: { query: { taskId, assessNo, mainId, search,myOrder,tobelist } },
    location,
    target1,
    target2,
    clauseList,
    userinfo,
    taskData,
    taskData: { currentTask: { taskName, id, instanceId }, currentTask, hisTasks, },
    hisTaskArr,
    loading,
    dispatch,
  } = props;

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

  const getUserinfo = () => {
    dispatch({
      type: 'itsmuser/fetchuser'
    })
  }

  const openFlow = () => {
    dispatch({
      type: 'performanceappraisal/getTaskData',
      payload: assessNo
    })
  }

  //  根据考核类型查询一级指标
  const getTarget1 = (type) => {
    dispatch({
      type: 'qualityassessment/scoreGetTarget1',
      payload: type
    })
  }

  //  根据考核类型查询二级指标
  const getTarget2 = (id) => {
    dispatch({
      type: 'qualityassessment/scoreGetTarget2',
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

  const gethisTask = () => {
    dispatch({
      type: 'performanceappraisal/hisTask',
      payload: {
        instanceId: mainId
      }
    })
  }

  switch (taskName) {
    case '服务绩效考核登记':
      sessionStorage.setItem('Nextflowmane', '业务负责人审核人');
      break;
    case '业务负责人审核':
      sessionStorage.setItem('Nextflowmane', '自动化科专责审核');
      break;
    case '自动化科专责审核':
      sessionStorage.setItem('Nextflowmane', '系统开发商处理');
      break;
    case '服务商确认':
      sessionStorage.setItem('Nextflowmane', `${noselect === '0' ? '服务绩效考核确认' : '业务负责人复核'}`);
      break;
    case '业务负责人复核':
      sessionStorage.setItem('Nextflowmane', '服务绩效考核确认人');
      break;
    case '自动化科业务负责人确认':
      sessionStorage.setItem('Nextflowmane', '问题登记人员确认');
      break;
    default:
      break;
  }

  useEffect(() => {
    getUserinfo();
    openFlow();
    gethisTask();
  }, [assessNo]);


  useEffect(() => {
    if (taskData && currentTask) {
      const { providerId, scoreId, target1Id, target2Id, assessType } = currentTask;
      let comfirmScoreid;
      if (taskData && taskData.clause && taskData.clause.scoreId) {
        comfirmScoreid = taskData.clause.scoreId;
      }

      if (providerId) {
        getContrractname(providerId);
      }

      if (scoreId || assessType) {
        getTarget1(scoreId);
      }

      if (target1Id) {
        getTarget2(target1Id);
      }

      if (target2Id && (scoreId || comfirmScoreid)) {
        getclausedetail(target2Id, (scoreId || comfirmScoreid))
      }
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

  //  登记保存流转
  const registerSubmit = (circulation) => {
    formRef.current.validateFields((err, values) => {
      if (circulation ? !err : true) {
        const submitIfnfo = values;
        delete submitIfnfo.provider;
        delete submitIfnfo.score;
        delete submitIfnfo.contract;
        return dispatch({
          type: 'performanceappraisal/tobeassessRegister',
          payload: {
            ...submitIfnfo,
            assessNo,
            id: currentTask.id,
            instanceId,
            taskId,
            assessTime: moment(values.assessTime).format('YYYY-MM-DD HH:mm:ss'),
            applyTime: moment(values.applyTime).format('YYYY-MM-DD HH:mm:ss'),
            attachment: files.ischange ? JSON.stringify(files.arr) : ''
          }
        }).then(res => {
          if (res.code === 200) {
            message.info(res.msg);
            if (circulation) {
              openFlow();
              setUserVisible(true);
            } else {
              openFlow();
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    })
  }

  //  审核保存流转
  const auditSave = (flowType, circulation) => {
    let requestUrl;
    if (flowType === '业务负责人审核') {
      requestUrl = 'performanceappraisal/saveDirectorVerify';
    } else if (flowType === '自动化科专责审核') {
      requestUrl = 'performanceappraisal/saveExpertVerify';
    } else {
      requestUrl = 'performanceappraisal/saveDirectorReview';
    }
    const obj = {};
    formRef.current.validateFields((err, values) => {
      if (taskName === '业务负责人复核') {
        obj["reviewContent"] = values.verifyContent || values.verifyContent2 || '';
        obj["reviewer"] = values.verifier;
        obj["reviewTime"] = moment(values.verifyTime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        obj["verifyContent"] = values.verifyContent || values.verifyContent2 || '';
        obj["verifier"] = values.verifier;
        obj["verifyTime"] = moment(values.verifyTime).format('YYYY-MM-DD HH:mm:ss');
      }
      if (!err) {
        return dispatch({
          type: requestUrl,
          payload: {
            ...values,
            assessNo,
            id,
            instanceId,
            taskId,
            ...obj
          }
        }).then(res => {
          if (res.code === 200) {
            switch (circulation) {
              case undefined:
                message.info(res.msg);
                openFlow();
                break;
              case 'circula':
                openFlow();
                setUserVisible(true);
                break;
              case '流转不选人':
                gotoCirapi();
                break;
              default:
                break;
            }
          }
        })
      }
    })
  }

  //  服务商确认
  const providerConfirmsave = (circulation) => {
    formRef.current.validateFields((err, values) => {
      if (circulation ? !err : true) {
        return dispatch({
          type: 'performanceappraisal/saveProviderConfirm',
          payload: {
            assessNo,
            id,
            instanceId,
            taskId,
            ...values,
            confirmTime: moment(values.confirmTime).format('YYYY-MM-DD HH:mm:ss'),
            annex: files.ischange ? JSON.stringify(files.arr) : ''
          }
        }).then(res => {
          if (res.code === 200) {
            if (circulation) {
              openFlow();
              setUserVisible(true);
            } else {
              message.info(res.msg);
              openFlow()
            }
          }
        })
      }
    })
  }

  //  服务绩效考核确认
  const performanceConfirmation = (circulation) => {
    formRef.current.validateFields((err, values) => {
      const saveParams = values;
      delete saveParams.clause;
      if (!err) {
        return dispatch({
          type: 'performanceappraisal/saveFinallyConfirm',
          payload: {
            ...saveParams,
            assessNo,
            id,
            instanceId,
            taskId,
            confirmTime: moment(values.confirmTime).format('YYYY-MM-DD HH:mm:ss')
          }
        }).then(res => {
          if (res.code === 200) {
            if (circulation) {
              gotoCirapi()
            } else {
              openFlow();
              message.info(res.msg);
            }
          } else {
            message.error('保存失败')
          }
        })
      }
    })
  }

  const gotoCirapi = () => {
    return dispatch({
      type: 'performanceappraisal/assessComplete',
      payload: {
        taskId,
        users: sessionStorage.getItem('NextflowUserId')
      }
    }).then(res => {
      if (res.code === 200) {
        router.push({
          pathname: `/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform`,
          query: {
            mainId,
            closetab: true,
          }
        });

        router.push({
          pathname: `/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtlist`,
          query: { pathpush: true },
          state: { cache: false }
        })
      }
    })
  }

  const reasonSubmit = () => {
    return dispatch({
      type: 'performanceappraisal/rollback',
      payload: taskId
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        router.push({
          pathname: `/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform`,
          query: { mainId, closetab: true, }
        });
        router.push({
          pathname: `/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtlist`,
          query: { pathpush: true },
          state: { cache: false }
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  useEffect(() => {
    if (userchoice || butandorder) {
      gotoCirapi();
    }
  }, [userchoice, butandorder])

  const onClickSubmit = (flowType, requestType) => {
    switch (flowType) {
      case '服务绩效考核登记':
        registerSubmit(requestType)
        break;
      case '业务负责人审核':
      case '自动化科专责审核':
      case '业务负责人复核':
        auditSave(flowType, requestType)
        break;
      case '服务商确认':
        providerConfirmsave(requestType)
        break;
      case '服务绩效考核确认':
        performanceConfirmation(requestType)
        break;
      default:
        break;
    }
  }

  //  上传附件
  useEffect(() => {
    if (files.ischange) {
      onClickSubmit(taskName, '')
    }
  }, [files])

  let buttonContent;
  if (taskName) {
    switch (taskName) {
      case '服务绩效考核确认':
        buttonContent = '确认考核';
        break;
      case '自动化科专责审核':
      case '业务负责人审核':
        buttonContent = '流转';
        break;
      default:
        break;
    }
  }

  const handleDelete = () => {
    return dispatch({
      type: 'performanceappraisal/assessDelete',
      payload: assessNo
    }).then(res => {
      if (res.code === 200) {
        router.push({
          pathname: `/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform`,
          query: {
            mainId,
            closetab: true,
          }
        });

        router.push({
          pathname: `/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtlist`,
          query: { pathpush: true },
          state: { cache: false }
        })
      }
      message.info(res.msg)
    })
  }

  const backProcess = () => {
    return dispatch({
      type: 'performanceappraisal/rollback'
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
      } else {
        message.error('回退失败')
      }
    })
  }

  const handleBacksubmit = () => {
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.success('该绩效单已超时，请填写超时原因...')
        setModalVisible(true);
      } else {
        setModalRollBack(true);
      }
    })
  }

  const postTimeOutMsg = (v) => {
    saveTimeoutMsg({
      taskId: id,
      msgType: 'timeout',
      orderId: mainId,
      orderType: 'problem',
      ...v
    }).then(res => {
      if (res.code === 200) {
        setModalRollBack(true);
      }
    })
  }

  const handleBack = () => {
    if(search) {
      router.push({
        pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/search',
        query: { pathpush: true },
        state: { cache: false }
      }
      );
    }

    if(myOrder) {
      router.push({
        pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/assessment',
        query: { pathpush: true },
        state: { cache: false }
      }
      );
    }

    if(tobelist) {
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
      title={taskName}
      extra={
        <>
          {
            !search && (
              <>
                {
                  taskName === '服务绩效考核登记' && hisTasks && hisTasks.length <= 3 && (
                    <Button
                      type="danger"
                      ghost
                      style={{ marginRight: 8 }}
                      onClick={handleDelete}
                    >删除</Button>
                  )
                }

                {
                  taskName === '业务负责人审核' && currentTask && !currentTask.verifyValue && (
                    <Button
                      type="danger"
                      ghost
                      onClick={handleBacksubmit}>回退</Button>
                  )
                }

                <Button type='primary' onClick={() => onClickSubmit(taskName)}>保存</Button>

                {
                  (noselect === '1') && taskName !== '自动化科专责审核' && taskName !== '服务绩效考核确认' && taskName !== '业务负责人复核' && (
                    <Button type='primary' onClick={() => onClickSubmit(taskName, 'circula')}>
                      {taskName === '业务负责人复核' ? '确认复核' : '流转'}
                    </Button>
                  )
                }

                {
                  (noselect === '0' && taskName !== '业务负责人复核' && taskName !== '服务商确认') && (taskName === '业务负责人审核' || taskName === '服务绩效考核确认') && (
                    <Button type='primary' onClick={() => onClickSubmit(taskName, '流转不选人')}>
                      {buttonContent}
                    </Button>
                  )
                }

                {
                  (taskName === '自动化科专责审核' || taskName === '服务绩效考核确认') && (
                    <Button type='primary' onClick={() => onClickSubmit(taskName, '流转不选人')}>
                      {taskName === '服务绩效考核确认'? '确认考核':'流转'}
                    </Button>
                  )
                }

                {
                  taskName === '业务负责人复核' && (
                    <Button type='primary' onClick={() => onClickSubmit(taskName, 'circula')}>
                      确认复核
                    </Button>
                  )
                }

                {
                  (noselect === '0' && taskName === '服务商确认') && (
                    <Button type='primary' onClick={() => onClickSubmit(taskName, 'circula')}>
                      流转
                    </Button>
                  )
                }

              </>
            )
          }

          <Button type='default' onClick={handleBack}>
            {/* <Link
              to={{
                pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtlist',
                query: { pathpush: true },
                state: { cache: false }
              }}
            >
              返回
            </Link> */}
            返回
          </Button>

        </>
      }
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >

      {
        loading === false && tabActiveKey === 'workorder' && hisTaskArr && hisTaskArr.length > 0 &&  (
          <div className={styles.collapse}>
            {
              hisTaskArr && (
                <Steps
                  current={hisTaskArr.length - 1}
                  size="small"
                  style={{
                    background: '#fff',
                    padding: 24,
                    border: '1px solid #e8e8e8',
                    overflowX: 'auto',
                    marginBottom: 24
                  }}
                >
                  {
                    hisTaskArr && hisTaskArr.map(({ key, name, taskStatus, totalTime, assignee, startTime, endTime }) => [
                      name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${taskStatus})${'\xa0'}${'\xa0'}${totalTime || ''}`} description={
                        <div className={styles.stepDescription}>
                          处理人：{assignee}
                          <div>开始时间：{moment(startTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                          <div>结束时间：{endTime ? moment(endTime).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
                        </div>
                      } />
                    ])}
                </Steps>
              )
            }
          </div>
        )
      }

      {
        loading === false && taskData && tabActiveKey === 'workorder' && (
          <>
            {
              taskData && currentTask && (
                <div className={styles.collapse}>
                  <Collapse
                    expandIconPosition='right'
                    defaultActiveKey={['1']}
                    bordered={false}
                  >
                    {
                      taskName === '服务绩效考核登记' && (
                        <Panel
                          header='服务绩效考核登记'
                          key='1'
                          style={{ backgroundColor: 'white' }}
                        >
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
                            register={currentTask}
                            contractArr={contractArr}
                            getContrractname={getContrractname}
                            files={currentTask.attachment ? JSON.parse(currentTask.attachment) : []}
                            ChangeFiles={newvalue => {
                              setFiles(newvalue);
                            }}
                            loading={loading}
                            noEdit={search}
                          />
                        </Panel>

                      )
                    }

                    {
                      taskName === '业务负责人审核' && (
                        <Panel
                          header='业务负责人审核'
                          key='1'
                          style={{ backgroundColor: 'white' }}
                        >
                          <BusinessAudit
                            ref={formRef}
                            businessAudit={currentTask}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            selectPersonstate={newvalue => setNoselect(newvalue)}
                            noEdit={search}
                          />
                        </Panel>
                      )
                    }

                    {
                      taskName === '自动化科专责审核' && (
                        <Panel
                          header='自动化科专责审核'
                          key='1'
                          style={{ backgroundColor: 'white' }}
                        >
                          <BusinessAudit
                            ref={formRef}
                            businessAudit={currentTask}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            selectPersonstate={newvalue => setNoselect(newvalue)}
                            noEdit={search}
                          />
                        </Panel>
                      )
                    }

                    {
                      taskName === '服务商确认' && (
                        <Panel
                          header='服务商确认'
                          key='1'
                          style={{ backgroundColor: 'white' }}
                        >
                          <ProviderConfirmation
                            ref={formRef}
                            providerConfirmation={currentTask}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            selectPersonstate={newvalue => setNoselect(newvalue)}
                            files={currentTask.annex ? JSON.parse(currentTask.annex) : []}
                            ChangeFiles={newvalue => {
                              setFiles(newvalue);
                            }}
                          />
                        </Panel>
                      )
                    }


                    {
                      taskName === '业务负责人复核' && (
                        <Panel
                          header='业务负责人复核'
                          key='1'
                          style={{ backgroundColor: 'white' }}
                        >
                          <BusinessAudit
                            repeatAudit='true'
                            ref={formRef}
                            businessAudit={currentTask}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            selectPersonstate={newvalue => setNoselect(newvalue)}
                          />
                        </Panel>
                      )
                    }

                    {
                      taskName === '服务绩效考核确认' && (
                        <Panel
                          header='服务绩效考核确认'
                          key='1'
                          style={{ backgroundColor: 'white' }}
                        >
                          <AssessmentConfirmation
                            ref={formRef}
                            assessmentConfirmation={currentTask}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            getTarget1={getTarget1}
                            getTarget2={getTarget2}
                            getclausedetail={getclausedetail}
                            target1={target1}
                            target2={target2}
                            clauseList={clauseList}
                            editSign={Number(currentTask.isEdit)}
                          />
                        </Panel>
                      )
                    }
                  </Collapse>
                </div>

              )
            }

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
                            getTarget1={getTarget1}
                            getTarget2={getTarget2}
                            target1={target1}
                            target2={target2}
                            getclausedetail={getclausedetail}
                            clauseList={clauseList}
                            register={Object.values(obj)[0]}
                            contractArr={contractArr}
                            getContrractname={getContrractname}
                            files={currentTask.attachment ? JSON.parse(currentTask.attachment) : []}
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
                            businessAudit={Object.values(obj)[0]}
                            providerConfirmation={currentTask}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            userinfo={userinfo}
                            noEdit='true'
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
            relation
          />
        )
      }

      <User
        taskId={taskId}
        visible={uservisible}
        ChangeUserVisible={v => setUserVisible(v)}
        changorder={undefined}
        ChangeChoice={v => setUserChoice(v)}
        currentPeocess={taskName}
        ChangeType={() => 0}
      />

      <TimeoutModal
        modalvisible={modalvisible}
        ChangeModalVisible={v => setModalVisible(v)}
        ChangeTimeOutMsg={v => postTimeOutMsg(v)}
      />

      <Reasonregression
        title="填写回退意见"
        visible={modalrollback}
        ChangeVisible={v => setModalRollBack(v)}
        rollbackSubmit={v => reasonSubmit(v)}
      />
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
  }))(TobedealtForm)
)

