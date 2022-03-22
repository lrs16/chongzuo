import React, { useEffect, useState, createContext, useRef } from 'react';
import { connect } from 'dva';
import {
  Button,
  Collapse,
  Form,
  message,
  Badge
} from 'antd';
import User from '@/components/SelectUser/User';
import HadleContext from '@/layouts/MenuContext';
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
import RelationOrder from './components/RelationOrder';
import { openNotification } from '@/utils/utils';

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
  const [uploadStatus, setUploadStatus] = useState(false);
  const [handleUploadStatus, setHandleUploadStatus] = useState(false);
  const [tabActiveKey, setTabActiveKey] = useState('workorder');

  const {
    location: {
      query: { mainId, status, checkStatus, auditLink, delay, flowNodeName },
    },
    userinfo,
    openFlowList,
    operationPersonArr,
    dispatch,
    loading,
    location,
    olduploadstatus
  } = props;
  let operationPersonSelect;

  const { data } = openFlowList;
  const { edit } = openFlowList;

  if (loading === false) {
    if (openFlowList.code === -1) {
      message.error(openFlowList.msg);
      router.push({
        pathname: `/ITSM/operationplan/myoperationplan`,
        query: { pathpush: true },
        state: { cache: false, closetabid: mainId },
      });
    }
  }

  // if (loading === false && openFlowList.code !== -1) {
  //   const resgister = data && data.length && edit.main !== undefined;
  //   if (resgister) {
  //     headTitle = status || taskName;
  //   }

  //   const checkParams = data && data.length && (edit.check || taskName === '计划审核')
  //   if (checkParams) {
  //   }
  // }

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
  };

  const getInformation = () => {
    dispatch({
      type: 'processmodel/openFlow',
      payload: mainId,
    });
  };

  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      getInformation();
    }
  }, [location.state]);

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const taskResult = getTypebyTitle('作业结果');

  useEffect(() => {
    sessionStorage.setItem('Nextflowmane', '送审');
    queryDept();
    getoperationPerson();
    sessionStorage.setItem('Processtype', 'task');
  }, []);

  useEffect(() => {
    if (mainId !== undefined) {
      dispatch({
        type: 'processmodel/openFlow',
        payload: mainId,
      });
    }
    setTabActiveKey('workorder')
  }, [mainId]);

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      dispatch({
        type: 'processmodel/openFlow',
        payload: mainId,
      });
    }
  }, [location.state]);

  // 处理作业负责人数据
  if (operationPersonArr && operationPersonArr.length) {
    operationPersonSelect = operationPersonArr.map(item => {
      return {
        key: item.id,
        value: item.userName,
      };
    });
  }

  //  保存统一接口
  const saveApi = (params, tobatch) => {
    return dispatch({
      type: 'processmodel/formSave',
      payload: params,
    }).then(res => {
      if (res.code === 200) {
        if (tobatch) {
          getInformation();
        } else {
          message.success(res.msg);
          getInformation();
        }
      } else {
        message.error(res.msg);
      }
    });
  };

  //  执行保存
  const executeSave = (params) => {
    const saveParams = (value) => {
      const result = {
        ...value,
        mainId,
        execute_id: edit.execute.id,
        flowNodeName: '计划执行',
        execute_fileIds: JSON.stringify(files.arr),
        editState: openFlowList.editState,
        execute_startTime: value.execute_startTime.format('YYYY-MM-DD HH:mm:ss'),
        execute_endTime: value.execute_endTime.format('YYYY-MM-DD HH:mm:ss'),
        execute_operationTime: value.execute_operationTime.format('YYYY-MM-DD HH:mm:ss'),
      };
      delete result.execute_operationUnit;
      saveApi(result);
    }
    if (params) {
      SaveRef.current.validateFields((err, value) => {
        if (!err) {
          saveParams(value)
        }
      });
    } else {
      const values = SaveRef.current.getFieldsValue();
      if ((values.execute_startTime).valueOf() > (values.execute_endTime).valueOf()) {
        message.info('实际开始时间必须小于实际结束时间');
        return false;
      }
      saveParams(values)
    }
    return []
  };

  //  登记保存
  const fillinSave = (params, tobatch) => {
    if (!params) {
      const values = SaveRef.current.getFieldsValue();
      if ((values.main_plannedStartTime).valueOf() > (values.main_plannedEndTime).valueOf()) {
        message.error('计划开始时间必须小于计划结束时间')
      } else {
        const result = {
          ...values,
          main_addTime: values.main_addTime
            ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss')
            : '',
          main_plannedStartTime: values.main_plannedStartTime
            ? values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss')
            : '',
          main_plannedEndTime: values.main_plannedEndTime
            ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss')
            : '',
          main_fileIds: JSON.stringify(files.arr),
          flowNodeName: '计划登记',
          editState: openFlowList.editState,
          main_status: '1',
          main_addUserId: userinfo.userId,
          main_addUser: userinfo.userName,
          main_id: edit.main.id,
          mainId,
        };
        saveApi(result, tobatch);
        if (params) {
          setUserVisible(true);
        }
      }
    } else {
      SaveRef.current.validateFields((err, values) => {
        if (params ? !err : true) {
          if ((values.main_plannedStartTime).valueOf() > (values.main_plannedEndTime).valueOf()) {
            message.error('计划开始时间必须小于计划结束时间');
          } else {
            const result = {
              ...values,
              main_addTime: values.main_addTime
                ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss')
                : '',
              main_plannedStartTime: values.main_plannedStartTime
                ? values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss')
                : '',
              main_plannedEndTime: values.main_plannedEndTime
                ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss')
                : '',
              main_fileIds: files.ischange ? JSON.stringify(files.arr) : null,
              flowNodeName: '计划登记',
              editState: openFlowList.editState,
              main_status: '1',
              main_addUserId: userinfo.userId,
              main_addUser: userinfo.userName,
              main_id: edit.main.id,
              mainId,
            };
            saveApi(result, tobatch);
            if (params) {
              setUserVisible(true);
            }
          }
        }

        if (params && err) {
          openNotification(Object.values(err))
        }
      });
    }
  };

  //  审核保存
  const checkSave = () => {
    SaveRef.current.validateFields((err, value) => {
      const result = {
        ...value,
        check_checkTime: value.check_checkTime.format('YYYY-MM-DD HH:mm:ss'),
        flowNodeName: '计划审核',
        editState: openFlowList.editState,
        mainId,
        check_id: edit.check.id,
        check_checkUserId: userinfo.userId,
      };
      saveApi(result);
    });
  };

  //  判断是属于那个保存状态下
  const handleSave = (params, tobatch) => {
    switch (flowNodeName) {
      case '计划登记':
        fillinSave(params, tobatch);
        break;
      case '计划审核':
        checkSave();
        break;
      case '计划执行':
        executeSave(params);
        break;
      default:
        break;
    }
  };

  // 送审提交
  const gotoCensorship = () => {
    return dispatch({
      type: 'processmodel/censorshipSubmit',
      payload: {
        mainIds: mainId,
        userId: sessionStorage.getItem('NextflowUserId'),
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        router.push({
          pathname: `/ITSM/operationplan/myoperationplan`,
          query: { pathpush: true },
          state: { cache: false, closetabid: mainId },
        });
      } else {
        message.error(res.msg);
        router.push({
          pathname: `/ITSM/operationplan/myoperationplan`,
          query: { pathpush: true },
          state: { cache: false, closetabid: mainId },
        });
      }
    });
  };

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handleSave(false);
    }
  }, [files]);

  //  送审选人
  useEffect(() => {
    if (userchoice) {
      gotoCensorship();
    }
  }, [userchoice]);

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/operationplan/operationplanform`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true }
    });
  };

  //  回退
  const reasonSubmit = values => {
    dispatch({
      type: 'processmodel/fallback',
      payload: {
        mainIds: mainId,
        ...values,
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        router.push({
          pathname: `/ITSM/operationplan/operationplancheck`,
          query: { pathpush: true },
          state: { cache: false, closetabid: mainId },
        });
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
            check_checkTime: value.check_checkTime.format('YYYY-MM-DD HH:mm:ss'),
            flowNodeName: '计划审核',
            editState: openFlowList.editState,
            check_id: edit.check.id,
            check_checkUserId: userinfo.userId,
          },
        }).then(res => {
          router.push({
            pathname: `/ITSM/operationplan/operationplancheck`,
            query: { pathpush: true },
            state: { cache: false, closetabid: mainId },
          });
          if (res.code === 200) {
            message.success(res.msg);
          } else {
            message.error(res.msg);
          }
        });
      }

      if (err) {
        openNotification(Object.values(err))
      }
      return null;
    });
  };

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
          },
        }).then(res => {
          router.push({
            pathname: `/ITSM/operationplan/myoperationplan`,
            query: { pathpush: true },
            state: { cache: false, closetabid: mainId },
          });
          if (res.code === 200) {
            message.success(res.msg);
          } else {
            message.error(res.msg);
          }
        });
      }

      if (err) {
        openNotification(Object.values(err))
      }

      return [];
    });
  };

  // 点击执行前判断是否超时
  const handleExecute = () => {
    judgeTimeoutStatus(edit.execute.id).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('已超时，请填写超时原因...');
        setModalVisible(true);
      } else {
        handleSaveexecute();
      }
    });
  };

  //  保存超时信息
  const postTimeOutMsg = v => {
    saveTimeoutMsg({
      taskId: edit.execute.id,
      msgType: 'timeout',
      orderId: mainId,
      orderType: 'operation',
      ...v,
    }).then(res => {
      if (res.code === 200) {
        handleSaveexecute();
      }
    });
  };

  //  延期
  const handleDelay = () => {
    SaveRef.current.validateFields((err, value) => {
      return dispatch({
        type: 'processmodel/delay',
        payload: {
          mainId,
          plannedEndTime: value.plannedEndTime.format('YYYY-MM-DD HH:mm:ss'),
        },
      }).then(res => {
        router.push({
          pathname: `/ITSM/operationplan/myoperationplan`,
          query: { pathpush: true },
          state: { cache: false, closetabid: mainId },
        });
        if (res.code === 200) {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      });
    });
  };

  //  删除
  const handleDelete = () => {
    return dispatch({
      type: 'processmodel/taskDelete',
      payload: {
        mainIds: mainId,
      },
    }).then(res => {
      router.push({
        pathname: `/ITSM/operationplan/myoperationplan`,
        query: { pathpush: true },
        state: { cache: false, closetabid: mainId },
      });
      if (res.code === 200) {
        message.success(res.msg);
      } else {
        message.error(res.msg);
      }
    });
  };

  // 初始化附件
  useEffect(() => {
    if (flowNodeName === '计划登记' && openFlowList && openFlowList.main && openFlowList.main.fileIds) {
      setFiles({
        ...files,
        arr: JSON.parse(openFlowList.main.fileIds),
        ischange: false,
      });
    }

    if (flowNodeName === '计划执行' && openFlowList && openFlowList.execute && openFlowList.execute.fileIds) {
      setFiles({
        ...files,
        arr: JSON.parse(openFlowList.execute.fileIds),
        ischange: false,
      });
    }

  }, [openFlowList])

  const pheadertitle = (obj, index) => {
    return (
      <>
        <Badge
          count={index}
          style={{
            backgroundColor: '#C1EB08',
            color: '#10C510',
            // boxShadow: '0 0 0 1px #10C510 inset',
            marginRight: 4,
            marginBottom: 2,
          }}
        />
        <span>
        {Panelheadermap.get(Object.keys(obj)[0])}
        </span>
      </>
    );
  };

  const tabList = [
    {
      key: 'workorder',
      tab: '作业计划工单',
    },
    {
      key: 'relevancy',
      tab: '关联工单',
    },
  ];

  const handleTabChange = key => {
    // tab切换
    setTabActiveKey(key);
  };

  return (
    <PageHeaderWrapper
      title={flowNodeName}
      extra={tabActiveKey === 'workorder' && (
        <>
          {loading === false &&
            flowNodeName === '计划登记' && (
              <Button
                type="danger"
                ghost
                style={{ marginRight: 8 }}
                onClick={handleDelete}
                disabled={uploadStatus || handleUploadStatus || loading || olduploadstatus}
              >
                删除
              </Button>
            )}

          {loading === false &&
            taskResult &&
            taskResult.length > 0 &&
            !delay &&
            edit.check &&
            edit.check.result === null &&
            taskResult &&
            taskResult.length > 0 && (
              <Back
                reasonSubmit={values => reasonSubmit(values)}
                detailPage="true"
                backProcessname='作业计划填报'
              >
                <Button
                  type="danger"
                  ghost
                  style={{ marginRight: 8 }}
                  disabled={uploadStatus || handleUploadStatus || loading || olduploadstatus}
                >
                  回退
                </Button>
              </Back>
            )}

          {loading === false && taskResult && taskResult.length > 0 && !delay && (
            <Button
              type="primary"
              onClick={() => handleSave(false)}
              disabled={uploadStatus || handleUploadStatus || loading || olduploadstatus}
            >
              保存
            </Button>
          )}

          {loading === false &&
            taskResult &&
            taskResult.length > 0 &&
            !delay &&
            openFlowList &&
            edit.main !== undefined &&
            taskResult &&
            taskResult.length > 0 && (
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSave(true, 'tobatch')}
                disabled={uploadStatus || handleUploadStatus || loading || olduploadstatus}
              >
                送审
              </Button>
            )}

          {loading === false &&
            taskResult &&
            taskResult.length > 0 &&
            flowNodeName === '计划审核' &&
            !delay && (
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleExamine()}
                disabled={uploadStatus || handleUploadStatus || loading || olduploadstatus}
              >
                审核
              </Button>
            )}



          {loading === false &&
            taskResult &&
            taskResult.length > 0 &&
            !delay &&
            openFlowList &&
            edit.execute !== undefined &&
            flowNodeName === '计划执行' &&
            taskResult &&
            taskResult.length > 0 && (
              <Button
                type="primary"
                onClick={() => handleExecute()}
                disabled={uploadStatus || handleUploadStatus || loading || olduploadstatus}
              >
                确认执行
              </Button>
            )}

          {loading === false && taskResult && taskResult.length > 0 && delay && (
            <Button type="primary" onClick={handleDelay}>
              确定延期
            </Button>
          )}

          <Button onClick={handleClose}>关闭</Button>
        </>
      )
      }

      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      <SysDict
        typeid="481"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />

      {
        tabActiveKey === 'workorder' && (
          <div className='noexplain'>
            {loading === false && taskResult && taskResult.length > 0 && data && (
              <div className={styles.collapse}>
                <Collapse
                  expandIconPosition="right"
                  defaultActiveKey={['1']}
                  onChange={callback}
                  bordered="true"
                >
                  <>
                    {!delay && (edit.check || flowNodeName === '计划审核') && (
                      <Panel header="作业计划审核" key="1" style={{ backgroundColor: 'white' }}>
                        <FatherContext.Provider value={{ flowtype, setFlowtype }}>
                          <TaskCheck
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            check={edit.check}
                            userinfo={userinfo}
                            checkStatus={checkStatus}
                            ref={SaveRef}
                            key='1'
                          />
                        </FatherContext.Provider>
                      </Panel>
                    )}

                    {loading === false &&
                      !delay &&
                      openFlowList &&
                      openFlowList.edit.execute !== undefined &&
                      (checkStatus === '已审核' || flowNodeName === '计划执行') && (
                        <Panel
                          header="作业计划执行"
                          key="1"
                          style={{ backgroundColor: 'white' }}
                          bordered
                        >
                          <TaskExecute
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            type=""
                            userinfo={userinfo}
                            taskResult={taskResult}
                            ref={SaveRef}
                            execute={edit.execute}
                            files={
                              edit.execute.fileIds && edit.execute.fileIds
                                ? JSON.parse(edit.execute.fileIds)
                                : []
                            }
                            ChangeFiles={newvalue => {
                              setFiles(newvalue);
                            }}
                            key='1'
                          />
                        </Panel>
                      )}

                    {loading === false && ((edit && edit.main !== undefined) || delay) && (
                      <Panel
                        header={status || flowNodeName}
                        key="1"
                        bordered
                        style={{ backgroundColor: 'white' }}
                      >
                        <HadleContext.Provider value={{
                          handleUploadStatus,
                          getUploadStatus: (v) => { setHandleUploadStatus(v) },
                          getRegistUploadStatus: (v) => { setUploadStatus(v) }
                        }}>
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
                              openFlowList.main.fileIds !== '' && openFlowList.main.fileIds
                                ? JSON.parse(openFlowList.main.fileIds)
                                : []
                            }
                            ChangeFiles={newvalue => {
                              setFiles(newvalue);
                            }}
                            key='1'
                          />
                        </HadleContext.Provider>
                      </Panel>
                    )}
                  </>
                </Collapse>
              </div>
            )}

            <div className={styles.collapse}>
              {loading === false && taskResult && taskResult.length > 0 && data && (
                <Collapse expandIconPosition="right" bordered={false} defaultActiveKey={['0', '1', '2']}>
                  {data.map((obj, index) => {
                    // panel详情组件
                    const Paneldesmap = new Map([
                      [
                        'main',
                        <OperationPlanfillindes
                          info={Object.values(obj)[0]}
                          main={data[0].main}
                          key="0"
                        />,
                      ],
                      [
                        'check',
                        <TaskCheckdes
                          info={Object.values(obj)[0]}
                          main={data[0].main}
                          key="0"
                        />,
                      ],
                      [
                        'execute',
                        <TaskExecutedes
                          info={Object.values(obj)[0]}
                          main={data[0].main}
                          key="0"
                        />,
                      ],
                    ]);
                    return (
                      <Panel
                        // header={Panelheadermap.get(Object.keys(obj)[0])}
                        header={pheadertitle(obj, index + 1)}
                        key={index.toString()}>
                        {Paneldesmap.get(Object.keys(obj)[0])}
                      </Panel>
                    );
                  })}
                </Collapse>
              )}
            </div>
          </div>
        )
      }

      {
        tabActiveKey === 'relevancy' && <RelationOrder orderId={location.query.mainId} relation />
      }


      {/* 选人组件 */}
      <User
        visible={uservisible}
        ChangeUserVisible={v => setUserVisible(v)}
        changorder={changorder}
        ChangeChoice={v => setUserChoice(v)}
        ChangeType={() => 0}
        describe=""
      />

      <TimeoutModal
        modalvisible={modalvisible}
        ChangeModalVisible={v => setModalVisible(v)}
        ChangeTimeOutMsg={v => postTimeOutMsg(v)}
      />
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ processmodel, itsmuser, viewcache, loading }) => ({
    userinfo: itsmuser.userinfo,
    openFlowList: processmodel.openFlowList,
    operationPersonArr: processmodel.operationPersonArr,
    loading: loading.models.processmodel,
    olduploadstatus: viewcache.olduploadstatus,
  }))(Work),
);
