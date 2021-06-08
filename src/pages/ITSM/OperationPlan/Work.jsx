import React, { useEffect, useState, createContext, useRef } from 'react';
import { connect } from 'dva';
import {
  Button,
  Collapse,
  Form,
  message
} from 'antd';
import User from '@/components/SelectUser/User';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
import TaskCheck from './components/TaskCheck';
import OperationPlanfillin from './components/OperationPlanfillin';
import TaskExecute from './components/TaskExecute';
import OperationPlanfillindes from './components/OperationPlanfillindes';
import TaskCheckdes from './components/TaskCheckdes';
import TaskExecutedes from './components/TaskExecutedes';
import Back from './components/Back';
import styles from './index.less';
import TimeoutModal from './components/TimeoutModel';
import { judgeTimeoutStatus, saveTimeoutMsg } from '../services/api';

const { Panel } = Collapse;

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



export const FatherContext = createContext();
function Work(props) {
  const [flowtype, setFlowtype] = useState('001');
  const [selectdata, setSelectData] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const SaveRef = useRef();
  const [activeKey, setActiveKey] = useState([]);

  //  选人组件
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [changorder, setChangeOrder] = useState(undefined);
  const [modalvisible, setModalVisible] = useState(false);


  const {
    location: { query: { mainId, status, checkStatus, auditLink, delay } },
    userinfo,
    openFlowList,
    operationPersonArr,
    dispatch,
    loading
  } = props;
  let operationPersonSelect;
  let headTitle = '作业计划填写';

  const { data } = openFlowList;
  const { edit } = openFlowList;


  if (loading === false) {
    if (openFlowList.code === -1) {
      message.error(openFlowList.msg);
      router.push({
        pathname: `/ITSM/operationplan/myoperationplan/`,
      });
    }

  }

  if (loading === false && openFlowList.code !== -1) {
    if ((data && data.length && edit.main !== undefined) || delay) {
      headTitle = '作业计划填报'
    }
  }

  // panel详情
  const Panelheadermap = new Map([
    ['main', '作业登记'],
    ['check', '作业审核'],
    ['execute', '作业执行'],
  ]);

  const callback = key => {
    setActiveKey(key);
  };

  const queryDept = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };

  const getoperationPerson = () => {
    dispatch({
      type: 'processmodel/operationPerson',
    });
  }

  const getInformation = () => {
    dispatch({
      type: 'processmodel/openFlow',
      payload: mainId
    })
  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const taskResult = getTypebyTitle('作业结果');

  useEffect(() => {
    queryDept();
    getoperationPerson()
    sessionStorage.setItem('Processtype', 'task');
    headTitle = '';
  }, [])

  useEffect(() => {
    if (mainId !== undefined) {
      dispatch({
        type: 'processmodel/openFlow',
        payload: mainId
      })
    }
  }, [mainId])

  // 处理作业负责人数据
  if (operationPersonArr.length) {
    operationPersonSelect = operationPersonArr.map(item => {
      return {
        key: item.id,
        value: item.userName
      }
    })
  }


  const formerr = () => {
    message.error('请将信息填写完整')
  }

  //  保存统一接口
  const saveApi = (params, tobatch) => {
    return dispatch({
      type: 'processmodel/formSave',
      payload: params
    }).then(res => {
      if (res.code === 200) {
        if (tobatch) {
          getInformation();
        } else {
          message.info(res.msg);
          getInformation();
        }
      } else {
        message.error(res.msg);
      }
    });
  }

  //  执行保存
  const executeSave = () => {
    SaveRef.current.validateFields((err, value) => {
      if (true) {
        const result = {
          ...value,
          mainId,
          execute_id: edit.execute.id,
          flowNodeName: '计划执行',
          execute_fileIds: files.ischange ? JSON.stringify(files.arr) : value.execute_fileIds,
          editState: openFlowList.editState,
          execute_startTime: value.execute_startTime.format('YYYY-MM-DD HH:mm:ss'),
          execute_endTime: value.execute_endTime.format('YYYY-MM-DD HH:mm:ss'),
          execute_operationTime: value.execute_operationTime.format('YYYY-MM-DD HH:mm:ss'),
        }
        delete result.execute_operationUnit;
        saveApi(result);
      }
    })
  }

  //  登记保存
  const fillinSave = (params, tobatch) => {
    SaveRef.current.validateFields((err, values) => {
      if (params ? !err : true) {
        const result = {
          ...values,
          main_addTime: values.main_addTime ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss') : '',
          main_plannedStartTime: values.main_plannedStartTime ? values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss') : '',
          main_plannedEndTime: values.main_plannedEndTime ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss') : '',
          main_fileIds: files.ischange ? JSON.stringify(files.arr) : values.main_fileIds,
          flowNodeName: '计划登记',
          editState: openFlowList.editState,
          main_status: '1',
          main_addUserId: userinfo.userId,
          main_addUser: userinfo.userName,
          main_id: edit.main.id,
          mainId,
        }
        saveApi(result, tobatch);
        if (params) {
          setUserVisible(true);
        }
      }
      if (params && err) {
        formerr()
      }

    })
  }

  //  审核保存
  const checkSave = () => {
    SaveRef.current.validateFields((err, value) => {
      const result = {
        ...value,
        check_checkTime: (value.check_checkTime).format('YYYY-MM-DD HH:mm:ss'),
        flowNodeName: '计划审核',
        editState: openFlowList.editState,
        mainId,
        check_id: edit.check.id,
        check_checkUserId: userinfo.userId,
      }
      saveApi(result)
    })
  }

  //  判断是属于那个保存状态下
  const handleSave = (params, tobatch) => {
    if (openFlowList && openFlowList.edit.execute !== undefined && checkStatus === '已审核') {
      executeSave();
    }

    if (openFlowList && openFlowList.edit.main !== undefined) {
      fillinSave(params, tobatch);
    }

    if (auditLink) {
      checkSave();
    }
  }

  // 送审提交 
  const gotoCensorship = () => {
    return dispatch({
      type: 'processmodel/censorshipSubmit',
      payload: {
        mainIds: mainId,
        userId: sessionStorage.getItem('NextflowUserId')
      }
    }).then(res => {
      if (res.code === 200) {
        message.info('送审成功');
        router.push({
          pathname: `/ITSM/operationplan/operationplanform`,
          query: { mainId, closetab: true },
          state: { cache: false }
        });
        router.push({
          pathname: `/ITSM/operationplan/myoperationplan/`,
          query: { pathpush: true },
          state: { cache: false }
        }
        )
      } else {
        message.error('送审失败 ');
        // router.push(`/ITSM/operationplan/myoperationplan/`)
      }
    })
  }

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handleSave(false);
    }
  }, [files]);


  //  送审选人
  useEffect(() => {
    if (userchoice) {
      gotoCensorship()
    }
  }, [userchoice])

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/operationplan/operationplanform`,
      query: { mainId, closetab: true },
      state: { cache: false }
    });
    if (auditLink) {
      router.push({
        pathname: `/ITSM/operationplan/operationplancheck`,
        query: { pathpush: true },
        state: { cache: false }
      })
    } else {
      router.push({
        pathname: `/ITSM/operationplan/myoperationplan/`,
        query: { pathpush: true },
        state: { cache: false }
      })
    }
  }

  //  回退
  const reasonSubmit = values => {
    dispatch({
      type: 'processmodel/fallback',
      payload: {
        mainIds: mainId,
        ...values,
      },
    }).then(res => {
      router.push({
        pathname: `/ITSM/operationplan/operationplanform`,
        query: { mainId, closetab: true },
        state: { cache: false }
      });
      if (res.code === 200) {
        message.info(res.msg);
        router.push({
          pathname: `/ITSM/operationplan/operationplancheck`,
          query: { pathpush: true },
          state: { cache: false }
        })
      } else {
        message.error(res.msg);
      }
    });
  };

  // 审核
  const handleExamine = () => {
    SaveRef.current.validateFields((err, value) => {
      if (!err) {
        return dispatch({
          type: 'processmodel/batchCheck',
          payload: {
            mainIds: mainId,
            ...value,
            check_checkTime: (value.check_checkTime).format('YYYY-MM-DD HH:mm:ss'),
            flowNodeName: '计划审核',
            editState: openFlowList.editState,
            check_id: edit.check.id,
            check_checkUserId: userinfo.userId,
          }
        }).then(res => {
          router.push({
            pathname: `/ITSM/operationplan/operationplanform`,
            query: { mainId, closetab: true },
            state: { cache: false }
          });
          router.push({
            pathname: `/ITSM/operationplan/operationplancheck`,
            query: { pathpush: true },
            state: { cache: false }
          });
          if (res.code === 200) {
            message.info(res.msg);
          } else {
            message.error(res.msg);
          }
        });
      }
      return null;
    }
    )
  }

  // 执行
  const handleSaveexecute = () => {
    SaveRef.current.validateFields((err, value) => {
      const params = value;
      delete params.execute_operationUnit;

      if (!err) {
        return dispatch({
          type: 'processmodel/submit',
          payload: {
            ...params,
            mainId,
            userId: edit.execute.operationUserId,
            execute_id: edit.execute.id,
            flowNodeName: '计划执行',
            editState: openFlowList.editState,
            execute_startTime: value.execute_startTime.format('YYYY-MM-DD HH:mm:ss'),
            execute_endTime: value.execute_endTime.format('YYYY-MM-DD HH:mm:ss'),
            execute_operationTime: value.execute_operationTime.format('YYYY-MM-DD HH:mm:ss'),
          }
        }).then(res => {
          router.push({
            pathname: `/ITSM/operationplan/operationplanform`,
            query: { mainId, closetab: true },
            state: { cache: false }
          });
          router.push({
            pathname: `/ITSM/operationplan/myoperationplan/`,
            query: { pathpush: true },
            state: { cache: false }
          });
          if (res.code === 200) {
            message.info(res.msg);
          } else {
            message.error(res.msg);
          }
        });
      }
    })
  }

  // 点击执行前判断是否超时
  const handleExecute = () => {
    judgeTimeoutStatus(edit.execute.id).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('已超时，请填写超时原因...')
        setModalVisible(true);
      } else {
        handleSaveexecute();
      }
    })
  }

  //  保存超时信息
  const postTimeOutMsg = (v) => {
    saveTimeoutMsg({
      taskId: edit.execute.id,
      msgType: 'timeout',
      orderId: mainId,
      orderType: 'operation',
      ...v
    }).then(res => {
      handleSaveexecute();
    });
  }

  //  延期
  const handleDelay = () => {
    SaveRef.current.validateFields((err, value) => {
      return dispatch({
        type: 'processmodel/delay',
        payload: {
          mainId,
          plannedEndTime: value.plannedEndTime.format('YYYY-MM-DD HH:mm:ss')
        }
      }).then(res => {
        router.push({
          pathname: `/ITSM/operationplan/operationplanform`,
          query: { mainId, closetab: true },
          state: { cache: false }
        });
        router.push({
          pathname: `/ITSM/operationplan/myoperationplan/`,
          query: { pathpush: true },
          state: { cache: false }
        });
        if (res.code === 200) {
          message.info(res.msg);
        } else {
          message.error(res.msg);
        }
      });
    })
  }

  //  删除
  const handleDelete = () => {
    return dispatch({
      type: 'processmodel/taskDelete',
      payload: {
        mainIds: mainId
      }
    }).then(res => {
      router.push({
        pathname: `/ITSM/operationplan/operationplanform`,
        query: { mainId, closetab: true },
        state: { cache: false }
      });
      router.push({
        pathname: `/ITSM/operationplan/myoperationplan/`,
        query: { pathpush: true },
        state: { cache: false }
      });
      if (res.code === 200) {
        message.info(res.msg);
      } else {
        message.info(res.msg);
      }
    })
  }

  return (
    <PageHeaderWrapper
      title={headTitle}
      extra={
        <>
          {
            loading === false && taskResult && taskResult.length > 0 && !delay && (openFlowList && edit.main !== undefined && data.length === 1) && (
              <Button
                type="danger"
                ghost
                style={{ marginRight: 8 }}
                onClick={handleDelete}
              >
                删除
              </Button>
            )
          }

          {
            loading === false && taskResult && taskResult.length > 0 && !delay && (
              <Button type='primary' onClick={() => handleSave(false)}>保存</Button>
            )
          }

          {
            loading === false && taskResult && taskResult.length > 0 && !delay && (openFlowList && edit.main !== undefined) && taskResult && taskResult.length > 0 && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSave(true, 'tobatch')}>
                送审
              </Button>
            )
          }

          {
            auditLink && taskResult && taskResult.length > 0 && !delay && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleExamine()}>
                审核
              </Button>
            )
          }

          {
            loading === false && taskResult && taskResult.length > 0 && auditLink && !delay && edit.check && edit.check.result === null && taskResult && taskResult.length > 0 && (
              <Back
                reasonSubmit={values => reasonSubmit(values)}
                detailPage='true'
              >
                <Button type="primary" style={{ marginRight: 8 }}>
                  回退
                </Button>
              </Back>
            )
          }

          {
            loading === false && taskResult && taskResult.length > 0 && !delay && (openFlowList && edit.execute !== undefined) && checkStatus === '已审核' && taskResult && taskResult.length > 0 && (
              <Button
                type="primary"
                onClick={() => handleExecute()}>确认执行</Button>
            )
          }

          {
            loading === false && taskResult && taskResult.length > 0 && delay && (
              <Button type='primary' onClick={handleDelay}>确定延期</Button>
            )
          }

          <Button onClick={handleClose}>返回</Button>
        </>
      }
    >
      <SysDict
        typeid="1385513049263181825"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />

      {
        loading === false && taskResult && taskResult.length > 0 && data && (
          <Collapse
            expandIconPosition="right"
            defaultActiveKey={['1']}
            onChange={callback}
            bordered='true'
          >
            <>
              {auditLink && !delay && edit.check && (
                <Panel Panel
                  header='作业计划审核'
                  key='1'
                  style={{ backgroundColor: 'white' }}
                >
                  <FatherContext.Provider value={{ flowtype, setFlowtype }}>
                    <TaskCheck
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      check={edit.check}
                      userinfo={userinfo}
                      checkStatus={checkStatus}
                      ref={SaveRef}
                    />
                  </FatherContext.Provider>
                </Panel>
              )}

              {
                loading === false && !delay && (openFlowList && openFlowList.edit.execute !== undefined) && checkStatus === '已审核' && (
                  <Panel
                    header='作业计划执行'
                    key='1'
                    style={{ backgroundColor: 'white' }}
                    bordered
                  >
                    <TaskExecute
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      type=''
                      userinfo={userinfo}
                      taskResult={taskResult}
                      ref={SaveRef}
                      execute={edit.execute}
                      files={
                        (edit.execute.fileIds) && (edit.execute.fileIds) ? JSON.parse(edit.execute.fileIds) : []
                      }
                      ChangeFiles={newvalue => {
                        setFiles(newvalue);
                      }}
                    />
                  </Panel>
                )
              }

              {
                loading === false && (edit && edit.main !== undefined || delay) && (
                  <Panel
                    header={status}
                    key='1'
                    bordered
                    style={{ backgroundColor: 'white' }}
                  >
                    <OperationPlanfillin
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      main={delay ? openFlowList.main : edit.main}
                      type={delay}
                      status={status}
                      useInfo={userinfo}
                      ref={SaveRef}
                      operationPersonSelect={operationPersonSelect}
                      files={
                        (openFlowList.main.fileIds) !== '' && (openFlowList.main.fileIds) ? JSON.parse(openFlowList.main.fileIds) : []
                      }
                      ChangeFiles={newvalue => {
                        setFiles(newvalue);
                      }}
                    />
                  </Panel>
                )}
            </>
          </Collapse>
        )
      }

      <div className={styles.collapse}>
        {loading === false && taskResult && taskResult.length > 0 && data && (
          <Collapse
            expandIconPosition="right"
            defaultActiveKey={['0']}
            bordered={false}
          >
            {data.map((obj, index) => {
              // panel详情组件
              const Paneldesmap = new Map([
                ['main', <OperationPlanfillindes
                  info={Object.values(obj)[0]}
                  main={data[0].main}
                />],
                ['check', <TaskCheckdes
                  info={Object.values(obj)[0]}
                  main={data[0].main}
                />],
                ['execute', <TaskExecutedes
                  info={Object.values(obj)[0]}
                  main={data[0].main}

                />],
              ]);
              return (
                <Panel
                  header={Panelheadermap.get(Object.keys(obj)[0])}
                  key={index}>
                  {Paneldesmap.get(Object.keys(obj)[0])}
                </Panel>
              );
            })}
          </Collapse>
        )}
      </div>

      {/* 选人组件 */}
      <User
        visible={uservisible}
        ChangeUserVisible={v => setUserVisible(v)}
        changorder={changorder}
        ChangeChoice={v => setUserChoice(v)}
        ChangeType={() => 0}
      />

      <TimeoutModal
        modalvisible={modalvisible}
        ChangeModalVisible={v => setModalVisible(v)}
        ChangeTimeOutMsg={v => postTimeOutMsg(v)}
      />
    </PageHeaderWrapper >
  )
}

export default Form.create({})(
  connect(({ processmodel, itsmuser, loading }) => ({
    userinfo: itsmuser.userinfo,
    openFlowList: processmodel.openFlowList,
    operationPersonArr: processmodel.operationPersonArr,
    loading: loading.models.processmodel,
  }))(Work)
)