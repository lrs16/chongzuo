import React, { useEffect, useRef, useState } from 'react';
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
import Previewedit from './components/Previewedit';
import Handleedit from './components/Handleedit';
import Problemconfirmedit from './components/Problemconfirmedit';
import Closeedit from './components/Closeedit';
import Systemoperatoredit from './components/Systemoperatoredit';
import Businessaudit from './components/Businessaudit';
import Specialaudit from './components/Specialaudit';


import Problemsolving from './components/Problemsolving';
import Problemreview from './components/Problemreview';
import Problemconfirmation from './components/Problemconfirmation';
import Problemregistration from './components/Problemregistration';
import Reasonregression from './components/Reasonregression';
import Problemflow from './components/Problemflow';

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
let confirmType;
let closecircu = '关闭';
let handleTime;
let receivingTime;
let problemFlowid;

function Workorder(props) {
  const pagetitle = props.route.name;
  const RegistratRef = useRef();
  const PreviesRef = useRef();
  const HandleRef = useRef();
  const ProblemconfirmRef = useRef();
  const CloseRef = useRef();
  const [flowtype, setFlowtype] = useState('1');
  const [tabActiveKey, setTabActiveKey] = useState('workorder');

  const {
    dispatch,
    todoDetail,
    todoDetail: { check, handle, confirm, close, register, main },
    useInfo,
    newno,
    loading
  } = props;

  const {
    params: { id },
  } = props.match;

  const { problemFlowLogs } = todoDetail;

  const selectNextflow = () => {
    switch (currntStatus) {
      case 5:
        sessionStorage.setItem('Nextflowmane', '审核');
        break;
      case 25:
        sessionStorage.setItem('Nextflowmane', '处理');
        break;
      case 9:
        sessionStorage.setItem('Nextflowmane', '处理');
        break;
      case 29:
        sessionStorage.setItem('Nextflowmane', '确认');
        break;
      case 45:
        sessionStorage.setItem('Nextflowmane', '确认');
        break;
      case 49:
        sessionStorage.setItem('Nextflowmane', '关闭');
        break;
      case 65:
        sessionStorage.setItem('Nextflowmane', '关闭');
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
    problemFlowid = todoDetail.main.id;
    selectNextflow();
    solvingDisbled();
    if ((currntStatus === 69) || (currntStatus === 85)) {
      closecircu = '';
    }
  }

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

  const gotoCirapi = () => {
    const result = 1;
    const taskId = id;
    return dispatch({
      type: 'problemmanage/gotoCirculation',
      payload: { taskId, result },
    }).then(res => {
      if (res.code === 200) {
        router.push(`/ITSM/problemmanage/besolved`)
      }
    })
  };

  const saveApi = (saveData, params2) => {
    return dispatch({
      type: 'problemmanage/tobeSave',
      payload: { saveData },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        getInformation();
        if (params2) {
          gotoCirapi();
        }
      } else {
        message.error(res.msg);
      }
    });
  };

  const saveRegister = (params2) => {
    RegistratRef.current.validateFields((err, values) => {
      if (params2 ? !err : true) {
        const saveData = values;
        saveData.registerTime = (saveData.registerTime).format('YYYY-MM-DD HH:mm:ss');
        saveData.registerOccurTime = (saveData.registerOccurTime).format('YYYY-MM-DD HH:mm:ss');
        saveData.taskId = id;
        if (todoDetail.editState === 'edit') {
          saveData.registerId = todoDetail.register.id;
          saveData.editState = 'edit';
        } else {
          saveData.editState = 'add';
          saveData.registerId = todoDetail.editGuid;
        }

        return dispatch({
          type: 'problemmanage/tobeSave',
          payload: { saveData },
        }).then(res => {
          if (res.code === 200) {
            message.info(res.msg);
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
  const savePrevies = params2 => {
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
        saveApi(saveData, params2);
      }
    });
  };

  const saveHandle = params2 => {
    console.log(HandleRef, 'HandleRef');
    HandleRef.current.validateFields((err, values) => {
      const saveData = values;
      if (values.handleTime) {
        saveData.handleTime = (saveData.handleTime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        saveData.handleTime = '';
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
        saveApi(saveData, params2);
      }
    });
  };

  const saveConfirm = params2 => {
    ProblemconfirmRef.current.validateFields((err, values) => {
      if (params2 ? !err : true) {
        const saveData = values;
        saveData.taskId = id;
        saveData.editState = todoDetail.editState;
        if (todoDetail.editState === 'edit') {
          saveData.confirmId = todoDetail.confirm.id;
        } else {
          saveData.confirmId = todoDetail.editGuid;
        }

        if (todoDetail.flowNodeName === '确认会签') {
          saveData.confirmType = 1;
          saveData.confirmTime = '';
        } else {
          saveData.confirmType = 0;
          saveData.confirmTime = (saveData.confirmTime).format('YYYY-MM-DD HH:mm:ss');
        }
        saveApi(saveData, params2);
      }
    });
  };

  const saveClose = params2 => {
    CloseRef.current.validateFields((err, values) => {
      if (params2 ? !err : true) {
        const saveData = values;
        saveData.taskId = id;
        if (todoDetail.editState === 'edit') {
          saveData.closeId = todoDetail.close.id;
          saveData.editState = 'edit';
        } else {
          saveData.closeId = todoDetail.editGuid;
          saveData.editState = 'add';
        }
        saveApi(saveData, params2);
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

  const handleSubmit = params2 => {
    switch (currntStatus) {
      case 5:
        // circulationSign = currntStatus;
        saveRegister(params2);
        break;
      case 25:
        savePrevies(params2);
        break;
      case 9:
        savePrevies(params2);
        break;
      case 29:
        saveHandle(params2);
        break;
      case 45:
        saveHandle(params2);
        break;
      case 49:
        saveConfirm(params2);
        break;
      case 65:
        saveConfirm(params2);
        break;
      case 69:
        saveClose(params2);
        break;
      case 85:
        saveClose(params2);
        break;
      default:
        break;
    }
  };


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
    sessionStorage.setItem('Nextflowmane', 'ff');
  }, []);

  useEffect(() => {
    sessionStorage.setItem('flowtype', flowtype);
  }, [flowtype]);

  // const transferOrder = () => {
  //   return dispatch({
  //     type:'problemmanage/transferOrder',
  //     payload:{id}
  //   }).then(res => {
  //     if(res.code === 200) {
  //       message.info(res.msg);
  //     }else {
  //       message.error(res.msg);
  //     }
  //   })
  // }



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

            { (currntStatus !== 5 && currntStatus !== 45) && (
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

            {/* {
              currntStatus === 45 &&(
                <SelectUser
                taskId={id}
                currentObj={currntStatus}
                onSubmit={transferOrder}
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
            } */}


            { currntStatus === 29 && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={problemHandleOrder}>
                接单
              </Button>
            )}

            {(currntStatus !== 29) && (currntStatus !== 69) && (currntStatus !== 85) && (
              <SelectUser
                taskId={id}
                currentObj={currntStatus}
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

            { ((currntStatus === 69) || (currntStatus === 85)) && closecircu === '' && (
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSubmit(circaSign)}
              >
                流转
              </Button>
            )
            }

            <Button type="default">
              <Link to="/ITSM/problemmanage/problemquery">返回</Link>
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
        (tabActiveKey === 'workorder' &&
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
                    />
                  </Panel>
                )
              }

              {
                (currntStatus === 9 || currntStatus === 25) && (
                  <Panel
                    header="问题审核"
                    key='1'
                    style={{ backgroundColor: 'white' }}
                  >
                    <Previewedit
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      ref={PreviesRef}
                      useInfo={useInfo}
                      check={check}
                      loading={loading}
                    />
                  </Panel>
                )
              }

              {
                (currntStatus === 29 || currntStatus === 45) && (
                  <Panel
                    header="问题处理"
                    key='1'
                    style={{ backgroundColor: 'white' }}
                  >
                    <Handleedit
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      showEdit={showEdit}
                      ref={HandleRef}
                      useInfo={useInfo}
                      handle={handle}
                      handleTime={handleTime}
                      receivingTime={receivingTime}
                      loading={loading}
                    />
                  </Panel>
                )
              }

              {
                confirmType === '0' && (currntStatus === 65 || currntStatus === 49) && (
                  <Panel
                    header="问题确认"
                    key='1'
                    style={{ backgroundColor: 'white' }}
                  >
                    <Problemconfirmedit
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      useInfo={useInfo}
                      ref={ProblemconfirmRef}
                      confirm={confirm}
                    />
                  </Panel>
                )
              }

              {
                (currntStatus === 69 || currntStatus === 85) && (
                  <Panel
                    header="问题关闭"
                    key='1'
                    style={{ backgroundColor: 'white' }}
                  >
                    <Closeedit
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      ref={CloseRef}
                      useInfo={useInfo}
                      close={close}
                    />
                  </Panel>
                )
              }

              {/* { */}
                {/* <Panel
                  header='系统运维商审核环节'
                  key='1'
                  style={{ backgroundColor:'white'}}
                >
                  <Systemoperatoredit 
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                 />
                </Panel>

                <Panel
                  header='自动化业务人员会签审核环节'
                  key='1'
                  style={{ backgroundColor:'white'}}
                >
                  <Businessaudit 
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                 />
                </Panel>

                <Panel
                  header='自动化科专责会签审核环节'
                  key='1'
                  style={{ backgroundColor:'white'}}
                >
                  <Specialaudit 
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                 />
                </Panel> */}
      {/* } */}
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

              {currntStatus >= 29 && (
                <Problemreview
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

              {currntStatus > 65 && (
                <Problemconfirmation
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
  connect(({ problemmanage, loading }) => ({
    todoDetail: problemmanage.todoDetail,
    reviewInfo: problemmanage.reviewInfo,
    eventtableList: problemmanage.eventtableList,
    solvingInfo: problemmanage.solvingInfo,
    confirmInfo: problemmanage.confirmInfo,
    counterInfo: problemmanage.counterInfo,
    closeInfo: problemmanage.closeInfo,
    newno: problemmanage.newno,
    useInfo: problemmanage.useInfo,
    loading: loading.models.problemmanage,
  }))(Workorder),
);
