import React, { useEffect, useRef, useState,createContext } from 'react';
import {
  Form,
  Button,
  message,
  Collapse,
  Steps,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SelectUser from '@/components/SelectUser';
import Registrat from './components/Registrat';
import Systemoperatoredit from './components/Systemoperatoredit';
import Developerprocessdit from './components/Developerprocessdit';
import Operatorconfirmaedit from './components/Operatorconfirmaedit';

import Problemsolving from './components/Problemsolving';
import Problemreview from './components/Problemreview';
import Businessaudes from './components/Businessaudes';
import Operatorconfirmades from './components/Operatorconfirmades';
import Problemregistration from './components/Problemregistration';
import Automaticconfirmdes from './components/Automaticconfirmdes';
import Reasonregression from './components/Reasonregression';
import Problemflow from './components/Problemflow';

import AutomationCirculation from './components/AutomationCirculation';


import styles from './index.less';


const { Panel } = Collapse;
const { Step } = Steps;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
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


let currntStatus = '';
let showEdit = false;
const saveSign = '';
const circaSign = 'problem';
let handleTime;
let receivingTime;
let problemFlowid;
let checkType;
let flowNodeName;
let confirmType;
let fileSign;
// let flowtype = 1;

export const FatherContext = createContext();
function Workorder(props) {
  const pagetitle = props.route.name;
  const RegistratRef = useRef();
  const PreviesRef = useRef();
  const HandleRef = useRef();
  const ProblemconfirmRef = useRef();
  const [flowtype, setFlowtype] = useState('1');
  const [tabActiveKey, setTabActiveKey] = useState('workorder');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  // sessionStorage.setItem('NextflowUserId','1301703398013276161');

  const {
    dispatch,
    todoDetail,
    todoDetail: { check, handle, confirm, register, main },
    useInfo,
    newno,
    loading
  } = props;

  const {
    params: { id },
  } = props.match;

  const { problemFlowLogs,problemFlowNodeRows } = todoDetail;


  const selectNextflow = () => {
    switch (flowNodeName) {
      case '问题登记':
        sessionStorage.setItem('Nextflowmane', '系统运维商审核');
        break;
      case '系统运维商审核':
        sessionStorage.setItem('Nextflowmane', '自动化科审核');
        break;
      case '自动化科审核':
        sessionStorage.setItem('Nextflowmane', '系统开发商处理');
        break;
      case '系统开发商处理':
        sessionStorage.setItem('Nextflowmane', '系统运维商确认');
        break;
      case '系统运维商确认':
        sessionStorage.setItem('Nextflowmane', '自动化科业务负责人确认');
        break;
      case '自动化科业务负责人确认':
        sessionStorage.setItem('Nextflowmane', '问题登记人员确认');
        break;
      default:
        break;
    }
  }

  const solvingDisbled = () => {
    if ((currntStatus === 29) || (currntStatus === 9)) {
      showEdit = true;
    } else {
      showEdit = false;
    }
  };

  if (todoDetail.main) {
    currntStatus = Number(todoDetail.main.status);
    confirmType = Number(todoDetail.confirmType);
    problemFlowid = todoDetail.main.id;
    flowNodeName = todoDetail.flowNodeName;
    selectNextflow();
    solvingDisbled();
  }
  // console.log(flowtype);


  if (todoDetail.hasOwnProperty('confirmType')) {
    confirmType = todoDetail.confirmType;
  } else if (confirm) {
    confirmType = confirm.confirmType;
  }

  if (handle) {
    if (handle.handleTime) {
      handleTime = moment(handle.handleTime)
    }
  } else {
    handleTime = moment(new Date());
  }

  if (handle) {
    if (handle.addtime) {
      receivingTime = moment(handle.addtime)
    }
  } else {
    receivingTime = moment(new Date());
  }

  if(currntStatus === 45) {
    // setFlowtype(9);
  }

  const getNewno = () => {
    dispatch({
      type: 'problemmanage/getregisterNo',
    });
  };

  const getInformation = () => {
    dispatch({
      type: 'problemmanage/ToDodetails',
      payload: { id },
    })
  };

  const gotoCirapi = (closessign) => {
    let result;
    if(closessign) {
      result = 255
    }else {
     result = flowtype;
    }

    if(flowNodeName === '系统开发商处理') {
      result = 1;
    }
    const taskId = id;
    return dispatch({
      type: 'problemmanage/gotoCirculation',
      payload: {
        flow:{ taskId,
               result,
               userIds:sessionStorage.getItem('NextflowUserId'),
         }
      },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        router.push(`/ITSM/problemmanage/besolved`)
      } else {
        message.info(res.error);
      }
    })
  };

  const closeOrder = () => {
     const closeWork = '关闭';
    gotoCirapi(closeWork);
  }

  const saveApi = (saveData, params2,uploadSive) => {
    console.log('params2: ', params2);
    return dispatch({
      type: 'problemmanage/tobeSave',
      payload: { saveData },
    }).then(res => {
      if (res.code === 200) {
        if(!params2){
          message.info(res.msg);
        } 
        getInformation();
        if(uploadSive) {
          props.history.go(0);
        }
        if (params2) {
          gotoCirapi();
        }
      } else {
        message.error(res.msg);
      }
    });
  };


  const saveRegister = (params2,uploadSive) => {
    RegistratRef.current.validateFields((err, values) => {
      if (params2 ? !err : true) {
        const saveData = values;
        saveData.registerTime = (saveData.registerTime).format('YYYY-MM-DD HH:mm:ss');
        saveData.registerOccurTime = (saveData.registerOccurTime).format('YYYY-MM-DD HH:mm:ss');
        saveData.registerExpectTime = (saveData.registerExpectTime).format('YYYY-MM-DD HH:mm:ss');
        saveData.taskId = id;
        if (todoDetail.editState === 'edit') {
          saveData.registerId = todoDetail.register.id;
          saveData.editState = 'edit';
        } else {
          saveData.editState = 'add';
          saveData.registerId = todoDetail.editGuid;
        }

        if(files.ischange) {
          saveData.registerAttachments = JSON.stringify(files.arr);
        }

        return dispatch({
          type: 'problemmanage/tobeSave',
          payload: { saveData },
        }).then(res => {
          if (res.code === 200) {
              message.info(res.msg);
        
            getInformation();
            if(uploadSive) {
              props.history.go(0);
            }
            if (params2) {
              gotoCirapi();
            }
          } else {
            message.error(res.msg);
          }
        });
      }
    });
  };

  //  审核保存
  const savePrevies =(params2,uploadSive)  => {
    PreviesRef.current.validateFields((err, values) => {
      const saveData = values;
      if (values.checkTime) {
        saveData.checkTime = (saveData.checkTime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        saveData.checkTime = '';
      }
      if (params2 ? !err : true) {
        saveData.taskId = id;
        if (todoDetail.editState === 'edit') {
          saveData.checkId = todoDetail.check.id;
          saveData.editState = todoDetail.editState;
        } else {
          saveData.checkId = todoDetail.editGuid;
          saveData.editState = 'add';
        }
        if(flowNodeName === '系统运维商审核'){
          saveData.checkType = '1';
        } else {
          saveData.checkType = '2';
        }
        if(files.ischange) {
          saveData.checkAttachments = JSON.stringify(files.arr);
        }

        saveApi(saveData, params2,uploadSive);
      }
    });
  };

  const saveHandle = (params2,uploadSive) => {
    HandleRef.current.validateFields((err, values) => {
      const saveData = values;
      if (values.handleTime) {
        saveData.handleTime = (saveData.handleTime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        saveData.handleTime = '';
      }

      if (values.orderReceivingtime) {
        saveData.orderReceivingtime = (saveData.orderReceivingtime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        saveData.orderReceivingtime = '';
      }

      if (params2 ? !err : true) {
        saveData.taskId = id;
        saveData.editState = todoDetail.editState;
        if (todoDetail.editState === 'edit') {
          saveData.handleId = todoDetail.handle.id;
          saveData.editState = todoDetail.editState;
        } else {
          saveData.handleId = todoDetail.editGuid;
          saveData.editState = 'add';
        }

        if(files.ischange) {
          saveData.handleAttachments = JSON.stringify(files.arr);
        }

        saveApi(saveData, params2,uploadSive);
      }
    });
  };

  const saveConfirm = (params2,uploadSive) => {
    ProblemconfirmRef.current.validateFields((err, values) => {
      if (params2 ? !err : true) {
        const saveData = values;
        saveData.taskId = id;
        saveData.editState = todoDetail.editState;
        saveData.confirmTime = (values.confirmTime).format('YYYY-MM-DD HH:mm:ss');
        if (todoDetail.editState === 'edit') {
          saveData.confirmId = todoDetail.confirm.id;
          saveData.editState = 'edit';
        } else {
          saveData.confirmId = todoDetail.editGuid;
          saveData.editState = 'add';
        }
        switch (todoDetail.flowNodeName){
          case '系统运维商确认':
            saveData.confirmType = 1;
            break;
          case '自动化科业务负责人确认':
            saveData.confirmType = 2;
            break;
          case '问题登记人员确认':
            saveData.confirmType = 3;
            break;
          default:
            break
        }
        if(files.ischange) {
          saveData.confirmAttachments = JSON.stringify(files.arr);
        }
        saveApi(saveData, params2,uploadSive);
      }
    });
  };

  const reasonSubmit = values => {
    dispatch({
      type: 'problemmanage/tobeBack',
      payload: { id, values },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        router.push(`/ITSM/problemmanage/besolved`)
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleDelete = () => {
    const deleteid = todoDetail.main.id;
    dispatch({
      type: 'problemmanage/delete',
      payload: { deleteid },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        router.push({ pathname: `/ITSM/problemmanage/besolved` })
      } else {
        message.error(res.msg);
      }
    });
  };

  const problemHandleOrder = () => {
    return dispatch({
      type: 'problemmanage/problemHandleOrder',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        showEdit = false;
        currntStatus = 45;
        getInformation();
      } else {
        message.error(res.msg);
      }
    });
  };


  const handleSubmit = (params2,uploadSive) => {
    switch (flowNodeName) {
      case '问题登记':
        saveRegister(params2,uploadSive);
        break;
      case '系统运维商审核':
        savePrevies(params2,uploadSive);
        break;
      case '自动化科审核':
        savePrevies(params2,uploadSive);
        break;
      case '系统开发商处理':
        saveHandle(params2,uploadSive);
        break;
      case '系统运维商确认':
        saveConfirm(params2,uploadSive);
        break;
      case '自动化科业务负责人确认':
        saveConfirm(params2,uploadSive);
        break;
      case '问题登记人员确认':
        saveConfirm(params2,uploadSive);
        break;
      default:
        break;
    }
  };

  // 上传删除附件触发保存
  useEffect(() => {
     fileSign = '附件';
    if (files.ischange) {
      handleSubmit(saveSign,fileSign);
    }
  }, [files]);

  const getUserinfo = () => {
    dispatch({
      type: 'problemmanage/fetchUseinfo',
    });
  };

  useEffect(() => {
    getInformation();
    getUserinfo();
    getNewno();
    sessionStorage.setItem('Processtype', 'problem');
    sessionStorage.setItem('Nextflowmane', '');
  }, []);

  useEffect(() => {
    sessionStorage.setItem('flowtype', flowtype);
  }, [flowtype]);

  useEffect(() => {
    if(currntStatus === 45) {
      setFlowtype(9);
    }
    sessionStorage.setItem('flowtype', flowtype);
  }, [currntStatus]);

  const tabList = [
    {
      key: 'workorder',
      tab: '问题工单',
    },
    {
      key: 'process',
      tab: '问题流程',
    },
  ];

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
  };

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <>
            { currntStatus === 5 && (
              <Button type="danger" ghost style={{ marginRight: 8 }} onClick={handleDelete}>
                删除
              </Button>
            )}

            { 
            (flowNodeName === '系统运维商审核'  || flowNodeName === '系统运维商确认'
            || flowNodeName === '自动化科业务负责人确认' || flowNodeName === '问题登记人员确认') 
             && (
              <Reasonregression reasonSubmit={values => reasonSubmit(values)}>
                <Button type="primary" ghost style={{ marginRight: 8 }}>
                  回退
                </Button>
              </Reasonregression>
            )}

            { currntStatus !== 29 && (
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSubmit(saveSign)}
              >
                保存
              </Button>
            )}

            {
              currntStatus === 45 &&(
                <SelectUser
                taskId={id}
                currentObj={currntStatus}
                handleSubmit={gotoCirapi}
              >
                <Button
                  type="primary"
                  style={{ marginRight: 8 }}
                  // onClick={() => handleSubmit(circaSign)}
                >
                  转单
                </Button>
              </SelectUser>

              )
            }


            { currntStatus === 29 && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={problemHandleOrder}>
                接单
              </Button>
            )}

            {
            // flowNodeName !== '问题登记人员确认' && 
            flowtype ==='1' &&
            // flowNodeName !== '系统开发商处理' &&
            // flowNodeName !== '自动化科业务负责人确认' &&
            // flowNodeName !== '系统运维商审核' &&
            (flowNodeName === '系统运维商确认' || 
            flowNodeName === '自动化科审核' ||
            flowNodeName === '系统运维商确认' ||
            flowNodeName === '问题登记'
            )&&
            
            currntStatus !== 29 &&
             (
              <SelectUser
                taskId={id}
                // result={}
                handleSubmit={() => handleSubmit(circaSign)}
              >
                <Button
                  type="primary"
                  style={{ marginRight: 8 }}
                // onClick={() => handleSubmit(circaSign)}
                >
                  流转
                </Button>
              </SelectUser>

            )
            }

            {
        
            flowNodeName === '系统运维商审核' &&
             (
              <AutomationCirculation
                taskId={id}
                handleSubmit={() => handleSubmit(circaSign)}
              >
                <Button
                  type="primary"
                  style={{ marginRight: 8 }}
                // onClick={() => handleSubmit(circaSign)}
                >
                  流转
                </Button>
              </AutomationCirculation>

            )
            

            }


            {
              flowNodeName === '问题登记' && problemFlowNodeRows.length > 2 && (
                <Button 
                type='primary'
                onClick={closeOrder}
                >
                  关闭工单
                </Button>
              )
            }

            { 
            (flowNodeName === '问题登记人员确认' || 
            flowtype === '0' ||
            flowNodeName === '系统开发商处理' ||
            flowNodeName === '自动化科业务负责人确认'
            ) && currntStatus !== 29  && (
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSubmit(flowNodeName)}
              >
                流转
              </Button>
            )
            }

       

            <Button type="default">
              <Link to="/ITSM/problemmanage/besolved">返回</Link>
            </Button>
          </>
        </>
      }
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      {/* 编辑页 */}
      {
        (tabActiveKey === 'workorder' && todoDetail && 
          <>
            <div className={styles.collapse}>
              {problemFlowLogs && (
                <Steps
                  current={problemFlowLogs.length - 1}
                  size="small"
                  // progressDot
                  style={{
                    background: '#fff',
                    padding: 24,
                    border: '1px solid #e8e8e8',
                    overflowX: 'auto',
                  }}
                >
                  {problemFlowLogs.map(obj => {
                    const desc = (
                      <div className={styles.stepDescription}>
                        处理人：{obj.formHandler}
                        <div>开始时间：{obj.startTime}</div>
                      </div>
                    );
                    return <Step title={obj.name} description={desc} />;
                  })}
                </Steps>

              )
              }

            </div>
            <Collapse
              expandIconPosition="right"
              defaultActiveKey={['1']}
            >
              {
                currntStatus === 5 && (
                  <Panel
                    header="问题登记"
                    key='1'
                    style={{ backgroundColor: 'white' }}
                  >
                    <Registrat
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      ref={RegistratRef}
                      newno={newno}
                      useInfo={useInfo}
                      register={register}
                      main={main}
                      files={
                        todoDetail.register !== undefined && todoDetail.register.registerAttachments?JSON.parse(todoDetail.register.registerAttachments):[]
                      }
                      ChangeFiles={newvalue => {
                        setFiles(newvalue);
                      }}
                    />
                  </Panel>
                )
              }

              {
                flowNodeName === '系统运维商审核' && (
                  <Panel
                    header="系统运维商审核环节"
                    key='1'
                    style={{ backgroundColor: 'white' }}
                  >
                    <FatherContext.Provider value = {{ flowtype ,setFlowtype}}>
                      <Systemoperatoredit
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        ref={PreviesRef}
                        useInfo={useInfo}
                        check={check}
                        loading={loading}
                        flowNodeName={flowNodeName}
                        // files={listData}
                        files={
                          todoDetail.check !== undefined && todoDetail.check.checkAttachments?JSON.parse(todoDetail.check.checkAttachments):[]
                        }
                        ChangeFiles={newvalue => {
                          setFiles(newvalue);
                        }}
                      />
                    </FatherContext.Provider>
                   
                  </Panel>
                )
              }
            
              {
                 flowNodeName === '自动化科审核'&& (
                  <Panel
                    header="自动化科审核"
                    key='1'
                    style={{ backgroundColor: 'white' }}
                  >
                    <FatherContext.Provider value = {{ flowtype ,setFlowtype}}>
                      <Systemoperatoredit
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        showEdit={showEdit}
                        ref={PreviesRef}
                        useInfo={useInfo}
                        check={check}
                        loading={loading}
                        flowNodeName={flowNodeName}
                        // files={listData}
                        files={
                          todoDetail.check !== undefined && todoDetail.check.checkAttachments?JSON.parse(todoDetail.check.checkAttachments):[]
                        }
                        ChangeFiles={newvalue => {
                          setFiles(newvalue);
                        }}
                      />

                    </FatherContext.Provider>
                   
                  </Panel>
                )
              }

              {
                  flowNodeName === '系统开发商处理' && (
                  <Panel
                  header='系统开发商处理'
                  key='1'
                  style={{ backgroundColor:'white'}}
                >
                  <Developerprocessdit 
                     formItemLayout={formItemLayout}
                     forminladeLayout={forminladeLayout}
                     showEdit={showEdit}
                     ref={HandleRef}
                     useInfo={useInfo}
                     handle={handle}
                     handleTime={handleTime}
                     receivingTime={receivingTime}
                     files={
                      todoDetail.handle !== undefined && todoDetail.handle.handleAttachments?JSON.parse(todoDetail.handle.handleAttachments):[]
                    }
                     ChangeFiles={newvalue => {
                        setFiles(newvalue);
                      }}
                     loading={loading}
                 />
                </Panel>
                )
              }

              {
                flowNodeName === '系统运维商确认'  && (
                  <Panel
                  header='系统运维商确认'
                  key='1'
                  style={{ backgroundColor:'white'}}
                >
                  <FatherContext.Provider value = {{ flowtype ,setFlowtype}}>
                    <Operatorconfirmaedit 
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      showEdit={showEdit}
                      ref={ProblemconfirmRef}
                      useInfo={useInfo}
                      handle={confirm}
                      handleTime={handleTime}
                      receivingTime={receivingTime}
                      flowNodeName={flowNodeName}
                      files={
                        todoDetail.confirm !== undefined && todoDetail.confirm.confirmAttachments?JSON.parse(todoDetail.confirm.confirmAttachments):[]
                      }
                      ChangeFiles={newvalue => {
                         setFiles(newvalue);
                       }}
                      loading={loading}
                  />
                  </FatherContext.Provider>
              
                </Panel>
                )
              }

              {
                flowNodeName === '自动化科业务负责人确认' && (
                  <Panel
                  header='自动化科业务负责人确认'
                  key='1'
                  style={{ backgroundColor:'white'}}
                >
                  <FatherContext.Provider value={{ flowtype ,setFlowtype}}>
                    <Operatorconfirmaedit 
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      showEdit={showEdit}
                      ref={ProblemconfirmRef}
                      useInfo={useInfo}
                      confirm={confirm}
                      handleTime={handleTime}
                      receivingTime={receivingTime}
                      flowNodeName={flowNodeName}
                      files={
                        todoDetail.confirm !== undefined && todoDetail.confirm.confirmAttachments?JSON.parse(todoDetail.confirm.confirmAttachments):[]
                      }
                      ChangeFiles={newvalue => {
                         setFiles(newvalue);
                       }}
                      loading={loading}
                  />
                  </FatherContext.Provider>
               
                </Panel>
                )
              }

             {
                 flowNodeName === '问题登记人员确认'  && (
                  <Panel
                  header='问题登记人员确认'
                  key='1'
                  style={{ backgroundColor:'white'}}
                >
                  <FatherContext.Provider value={{ flowtype ,setFlowtype}}>
                    <Operatorconfirmaedit 
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      showEdit={showEdit}
                      ref={ProblemconfirmRef}
                      useInfo={useInfo}
                      handle={confirm}
                      handleTime={handleTime}
                      receivingTime={receivingTime}
                      flowNodeName={flowNodeName}
                      files={
                        todoDetail.confirm !== undefined && todoDetail.confirm.confirmAttachments?JSON.parse(todoDetail.confirm.confirmAttachments):[]
                      }
                      ChangeFiles={newvalue => {
                         setFiles(newvalue);
                       }}
                      loading={loading}
                  />
                  </FatherContext.Provider>
                </Panel>
                )
              }
            </Collapse>
            
           
            <div>
              {currntStatus !== 5 && (
                <Problemregistration
                  registrationDetail={todoDetail}
                  statue={currntStatus}
                  register={register}
                  main={main}
                  loading={loading}
                />
              )}

              {  flowNodeName !== '系统运维商审核' && currntStatus >= 25 && (
                <Problemreview
                  reviesDetail={todoDetail}
                  loading={loading}
                />
              )}

              { (flowNodeName !== '自动化科审核' && flowNodeName !== '系统运维商审核') && currntStatus >= 25 && (
                <Businessaudes
                  reviesDetail={todoDetail}
                  loading={loading}
                />
              )}

              {currntStatus > 45 && (
                <Problemsolving
                  solvingDetail={todoDetail}
                  loading={loading}
                />
              )}

              {confirmType > 1 && currntStatus >= 65 && (
                <Operatorconfirmades
                  confirmationDetail={todoDetail}
                  loading={loading}
                />
              )}

              {confirmType > 2 && currntStatus >= 65 && (
                <Automaticconfirmdes
                  confirmationDetail={todoDetail}
                  loading={loading}
                />
              )}
            </div>
   

          </>
        )
      }

      {
        (tabActiveKey === 'process' && (
          <Problemflow id={problemFlowid} />
        ))
      }

      {/* {currntStatus > 65 && (
        <Confirmationcountersignature countersignatureDetail={todoDetail} />
      )} */}

    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ problemmanage, demandtodo, loading }) => ({
    todoDetail: problemmanage.todoDetail,
    reviewInfo: problemmanage.reviewInfo,
    eventtableList: problemmanage.eventtableList,
    solvingInfo: problemmanage.solvingInfo,
    confirmInfo: problemmanage.confirmInfo,
    counterInfo: problemmanage.counterInfo,
    closeInfo: problemmanage.closeInfo,
    newno: problemmanage.newno,
    useInfo: problemmanage.useInfo,
    info: demandtodo.info,
    loading: loading.models.problemmanage,
  }))(Workorder),
);
