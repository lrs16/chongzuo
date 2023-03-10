import React, { useEffect, useState, createContext, useRef } from 'react';
import TaskworkContext from '@/layouts/MenuContext';
import { connect } from 'dva';
import { Button, Collapse, Form, message, Spin, Badge } from 'antd';

import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
import { openNotification } from '@/utils/utils';
import styles from './index.less';
import TimeoutModal from './components/TimeoutModel';
import { judgeTimeoutStatus, saveTimeoutMsg } from '../services/api';
import SuperviseList from './components/SuperviseList';
// import Back from './components/Back';

// 编辑页
import TaskworkEditfillin from './components/TaskworkEditfillin'; // 工作任务
import ExecuteworkEditfillin from './components/ExecuteworkEditfillin'; // 工作执行
import CheckdelayworkEditfillin from './components/CheckdelayworkEditfillin'; // 工作审核

// 详情页
import TaskworkEditfillins from './components/TaskworkEditfillins'; // 工作任务
import ExecuteworkEditfillins from './components/ExecuteworkEditfillins'; // 工作执行
import CheckdelayworkEditfillins from './components/CheckdelayworkEditfillins'; // 工作审核

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
function WorkplanDetail(props) {
  const [selectdata, setSelectData] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [show, setShow] = useState(false);
  const SaveRef = useRef();
  const [tabActivekey, settabActivekey] = useState('taskwork'); // 打开标签
  const [modalvisible, setModalVisible] = useState(false);
  const [taskworkUploadStatus, setTaskworkUploadStatus] = useState(false);

  const {
    location: {
      query: { mainId, flowNodeName, status, delay, workUser },
    },
    userinfo,
    openFlowList,
    getSuperviseLists,
    superviseworkPersonArr,
    dispatch,
    loading,
    location,
  } = props;

  let superviseworkPersonSelect;

  const { data, edit, main } = openFlowList;

  if (loading === false) {
    if (openFlowList.code === -1) {
      message.error(openFlowList.msg);
      router.push({
        pathname: `/ITSM/supervisework/mycreatework`,
        query: { pathpush: true },
        state: { cache: false, closetabid: mainId },
      });
    }
  }

  // panel详情
  const Panelheadermap = new Map([
    ['main', '工作任务'],
    ['check', '工作延期审核'],
    ['execute', '工作执行'],
  ]);

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const executeResult = getTypebyTitle('执行结果');

  const queryDept = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };

  //  获取作业负责人
  const getsuperviseworkPerson = () => {
    dispatch({
      type: 'supervisemodel/getWorkUserList',
    });
  };

  const getInformation = () => {
    // 打开待办
    dispatch({
      type: 'supervisemodel/openFlow',
      payload: mainId,
    });
  };

  useEffect(() => {
    if (mainId) {
      queryDept();
      getsuperviseworkPerson();
      getInformation();
      sessionStorage.setItem('Processtype', 'task');
    }
  }, [mainId]);

  useEffect(() => {
    if (mainId !== undefined) {
      dispatch({
        type: 'supervisemodel/openFlow',
        payload: mainId,
      });
    }
    settabActivekey('taskwork');
  }, [mainId]);

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      dispatch({
        type: 'supervisemodel/openFlow',
        payload: mainId,
      });
    }
  }, [location.state]);

  // 处理工作负责人数据
  if (superviseworkPersonArr.length) {
    superviseworkPersonSelect = superviseworkPersonArr.map(item => {
      return {
        key: item.userId,
        value: item.userName,
      };
    });
  }

  const formerr = err => {
    // message.error('请将信息填写完整');
    openNotification(Object.values(err));
  };

  //  保存统一接口
  const tosave = params => {
    dispatch({
      type: 'supervisemodel/formSave',
      payload: params,
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        getInformation();
      } else {
        message.error(res.msg);
      }
    });
  };

  //  登记保存
  const fillinSave = params => {
    SaveRef.current.validateFields((err, values) => {
      if (params ? !err : true) {
        const newvalues = {
          ...values,
          main_workUser: JSON.stringify(values.main_workUser),
          main_workUserId: JSON.stringify(values.main_workUserId),
          main_addTime: values.main_addTime
            ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss')
            : '',
          main_plannedStartTime: values.main_plannedStartTime
            ? values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss')
            : '',
          main_plannedEndTime: values.main_plannedEndTime
            ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss')
            : '',
          main_fileIds: files.ischange ? JSON.stringify(files.arr) : values.main_fileIds,
          flowNodeName: '工作登记',
          editState: openFlowList.editState,
          main_status: '1',
          main_addUserId: userinfo.userId,
          main_addUser: userinfo.userName,
          main_id: edit.main.id,
          mainId,
        };
        tosave(newvalues);
      }
      if (params && err) {
        const allerr = Object.values(err);
        return formerr(allerr);
      }
    });
  };

  //  执行保存
  const executeSave = () => {
    SaveRef.current.validateFields((_, value) => {
      const newvalues = {
        ...value,
        execute_startTime: value.execute_startTime.format('YYYY-MM-DD HH:mm:ss'),
        execute_endTime: value.execute_endTime.format('YYYY-MM-DD HH:mm:ss'),
        execute_executeTime: value.execute_executeTime.format('YYYY-MM-DD HH:mm:ss'),
        execute_fileIds: files.ischange ? JSON.stringify(files.arr) : value.execute_fileIds,
        flowNodeName: '工作执行',
        editState: openFlowList.editState,
        execute_executeUser: userinfo.userName,
        execute_executeUserId: userinfo.userId,
        execute_id: edit.execute.id,
        mainId,
      };
      tosave(newvalues);
    });
  };

  //  审核保存
  const checkSave = () => {
    SaveRef.current.validateFields((err, value) => {
      if (!err) {
        const newvalues = {
          ...value,
          check_checkTime: value.check_checkTime.format('YYYY-MM-DD HH:mm:ss'),
          flowNodeName: '工作审核',
          editState: openFlowList.editState,
          mainId,
          check_id: edit.check.id,
          check_checkUserId: userinfo.userId,
          check_checkUnitId: userinfo.unitId,
        };
        tosave(newvalues);
      }
    });
  };

  //  判断是属于那个保存状态下
  const handleSave = params => {
    switch (flowNodeName) {
      case '工作登记':
        fillinSave(params);
        break;
      case '工作执行':
        executeSave(params);
        break;
      case '工作审核':
        checkSave(params);
        break;
      default:
        break;
    }
  };

  const delaySave = () => {
    // 延期保存
    SaveRef.current.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'supervisemodel/todelaySave',
          payload: {
            plannedEndTime: values.plannedEndTime
              ? values.plannedEndTime.format('YYYY-MM-DD HH:mm:ss')
              : '',
            mainId,
          },
        }).then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            router.push({
              pathname: `/ITSM/supervisework/myresponwork`,
              query: { pathpush: true },
              state: { cache: false },
            });
          } else {
            message.error(res.msg);
          }
        });
      }
    });
  };

  const handleclose = () => {
    if (flowNodeName === '工作登记') {
      router.push({
        // pathname: `/ITSM/supervisework/mycreatework`,
        pathname: location.pathname,
        query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
      });
    }
    if (flowNodeName === '工作执行') {
      router.push({
        // pathname: `/ITSM/supervisework/myresponwork`,
        pathname: location.pathname,
        query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
      });
    }
    if (flowNodeName === '工作审核') {
      router.push({
        // pathname: `/ITSM/supervisework/todelayexamine`,
        pathname: location.pathname,
        query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
      });
    }
  };

  const handlesubmit = () => {
    // 待办工作登记提交
    SaveRef.current.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'supervisemodel/tosubmitForm1',
          payload: {
            ...values,
            main_workUser: JSON.stringify(values.main_workUser),
            main_workUserId: JSON.stringify(values.main_workUserId),
            main_addTime: values.main_addTime
              ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss')
              : '',
            main_plannedStartTime: values.main_plannedStartTime
              ? values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss')
              : '',
            main_plannedEndTime: values.main_plannedEndTime
              ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss')
              : '',
            main_fileIds: files.ischange ? JSON.stringify(files.arr) : values.main_fileIds,
            flowNodeName: '工作登记',
            editState: 'edit',
            main_status: '1',
            main_addUserId: userinfo.userId,
            main_addUnitId: userinfo.unitId,
            main_id: edit.main.id,
            mainId,
          },
        }).then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            router.push({
              pathname: `/ITSM/supervisework/mycreatework`,
              query: { pathpush: true },
              state: { cache: false, closetabid: mainId },
            });
          } else {
            message.error(res.msg);
          }
        });
      }
      const allerr = Object.values(err);
      return formerr(allerr);
    });
  };

  const handleafterconfirm = () => {
    // 未超时去执行
    SaveRef.current.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'supervisemodel/tosubmitForm1',
          payload: {
            ...values,
            execute_startTime: values.execute_startTime.format('YYYY-MM-DD HH:mm:ss'),
            execute_endTime: values.execute_endTime.format('YYYY-MM-DD HH:mm:ss'),
            execute_executeTime: values.execute_executeTime.format('YYYY-MM-DD HH:mm:ss'),
            execute_fileIds: files.ischange ? JSON.stringify(files.arr) : values.execute_fileIds,
            flowNodeName: '工作执行',
            editState: openFlowList.editState,
            main_status: '1',
            execute_executeUser: userinfo.userName,
            execute_executeUserId: userinfo.userId,
            mainId,
            execute_id: edit.execute.id,
          },
        }).then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            router.push({
              pathname: `/ITSM/supervisework/myresponwork`,
              query: { pathpush: true },
              state: { cache: false, closetabid: mainId },
            });
          } else {
            message.error(res.msg);
          }
        });
      }
      const allerr = Object.values(err);
      return formerr(allerr);
    });
  };

  const handlebeforeconfirm = () => {
    // 待办工作执行确认提交---执行前是否超时
    judgeTimeoutStatus(mainId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('已超时，请填写超时原因...');
        setModalVisible(true);
      } else {
        handleafterconfirm();
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
        handleafterconfirm();
      }
    });
  };

  useEffect(() => {
    if (main && main.responseStatus) {
      if (
        !delay &&
        flowNodeName === '工作执行' &&
        workUser &&
        workUser.split(',').length > 1 &&
        main &&
        main.responseStatus === '0'
      ) {
        message.info('请接单..', 1);
        setShow(false);
      }
      if (!delay && flowNodeName === '工作执行' && main && main.responseStatus === '1') {
        setShow(true);
      }
      if (
        !delay &&
        flowNodeName === '工作执行' &&
        workUser &&
        workUser.split(',').length === 1 &&
        main &&
        main.responseStatus === '0'
      ) {
        setShow(true);
      }
    }
  }, [main && main.responseStatus]);

  const responseaccpt = () => {
    // 接单
    return dispatch({
      type: 'supervisemodel/responseAccpts',
      payload: {
        mainId,
      },
    }).then(res => {
      if (res.code === 200) {
        getInformation();
        setShow(true);
        message.success(res.msg);
      } else {
        message.error(res.msg);
      }
    });
  };

  const handledelayToCheck = () => {
    // 延期送审
    SaveRef.current.validateFields((err, value) => {
      return dispatch({
        type: 'supervisemodel/delayToChecks',
        payload: {
          mainId,
          plannedEndTime: value.plannedEndTime.format('YYYY-MM-DD HH:mm:ss'),
        },
      }).then(res => {
        router.push({
          pathname: `/ITSM/supervisework/myresponwork`,
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

  // 审核
  const tohandleCheck = () => {
    SaveRef.current.validateFields((err, value) => {
      if (!err) {
        return dispatch({
          type: 'supervisemodel/toChecks',
          payload: {
            ...value,
            mainId,
            check_checkTime: value.check_checkTime.format('YYYY-MM-DD HH:mm:ss'),
            flowNodeName: '工作审核',
            editState: openFlowList.editState,
            check_id: edit.check.id,
            check_checkUserId: userinfo.userId,
          },
        }).then(res => {
          router.push({
            pathname: `/ITSM/supervisework/todelayexamine`,
            query: { pathpush: true },
            state: { cache: false, closetabid: mainId },
          });
          if (res.code === 200) {
            message.info(res.msg);
          } else {
            message.error(res.msg);
          }
        });
      }
      const allerr = Object.values(err);
      return formerr(allerr);
    });
  };

  //  删除
  const handleDelete = () => {
    return dispatch({
      type: 'supervisemodel/taskDelete',
      payload: {
        mainIds: mainId,
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        router.push({
          pathname: `/ITSM/supervisework/mycreatework`,
          query: { pathpush: true },
          state: { cache: false, closetabid: mainId },
        });
      } else {
        message.error(res.msg);
      }
    });
  };

  // const reasonSubmit = values => { // 回退
  //     dispatch({
  //         type: 'supervisemodel/fallback',
  //         payload: {
  //             mainIds: mainId,
  //             ...values,
  //         },
  //     }).then(res => {
  //         if (res.code === 200) {
  //             message.info(res.msg);
  //         } else {
  //             message.error(res.msg);
  //         }
  //     });
  // };

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handleSave();
    }
  }, [files]);

  const handleTabChange = key => {
    settabActivekey(key);
  };

  // 督办内容
  useEffect(() => {
    if (tabActivekey === 'supervise') {
      dispatch({
        type: 'supervisemodel/togetSuperviseList',
        payload: mainId,
      });
    }
  }, [tabActivekey]);

  const tabList = [
    {
      key: 'taskwork',
      tab: '工作任务',
    },
    {
      key: 'supervise',
      tab: '督办内容',
    },
  ];

  const pheadertitle = (obj, index) => {
    return (
      <>
        <Badge
          count={index + 1}
          style={{
            backgroundColor: '#C1EB08',
            color: '#10C510',
            boxShadow: '0 0 0 1px #10C510 inset',
            marginRight: 4,
            marginBottom: 2,
          }}
        />
        <span>{Panelheadermap.get(Object.keys(obj)[0])}</span>
      </>
    );
  };

  return (
    <PageHeaderWrapper
      title={flowNodeName}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
      extra={
        <>
          {flowNodeName && !delay && flowNodeName === '工作登记' && (
            <Button
              type="danger"
              ghost
              style={{ marginRight: 8 }}
              onClick={() => handleDelete()}
              disabled={taskworkUploadStatus}
            >
              删除
            </Button>
          )}
          {/* {flowNodeName === '工作审核' && !delay && (
                        <Back
                            title="填写回退意见"
                            reasonSubmit={values => reasonSubmit(values)}
                        >
                            <Button type="danger" ghost style={{ marginRight: 8 }} >回退</Button>
                        </Back>)} */}
          {loading === false && !delay && flowNodeName !== '工作执行' && (
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => handleSave()}
              disabled={taskworkUploadStatus}
            >
              保存
            </Button>
          )}

          {loading === false &&
            !delay &&
            flowNodeName === '工作执行' &&
            ((workUser && workUser.split(',').length > 1 && main && main.responseStatus === '1') ||
              (workUser &&
                workUser.split(',').length === 1 &&
                main &&
                main.responseStatus === '0')) && (
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSave()}
                disabled={taskworkUploadStatus}
              >
                保存
              </Button>
            )}

          {// 延期送审保存按钮
          loading === false && delay && flowNodeName === '工作执行' && (
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => delaySave()}
              disabled={taskworkUploadStatus}
            >
              保存
            </Button>
          )}

          {loading === false && !delay && flowNodeName === '工作登记' && (
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => handlesubmit()}
              disabled={taskworkUploadStatus}
            >
              提交
            </Button>
          )}

          {flowNodeName === '工作执行' &&
            !delay &&
            ((workUser && workUser.split(',').length > 1 && main && main.responseStatus === '1') ||
              (workUser &&
                workUser.split(',').length === 1 &&
                main &&
                main.responseStatus === '0')) && (
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handlebeforeconfirm()}
                disabled={taskworkUploadStatus}
              >
                确认
              </Button>
            )}

          {main &&
            main.responseStatus === '0' &&
            loading === false &&
            workUser &&
            workUser.split(',').length > 1 &&
            flowNodeName === '工作执行' &&
            !delay && (
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => responseaccpt()}
                disabled={taskworkUploadStatus}
              >
                接单
              </Button>
            )}
          {loading === false && executeResult && executeResult.length > 0 && delay && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => handledelayToCheck()}>
              延期送审
            </Button>
          )}
          {flowNodeName === '工作审核' && !delay && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => tohandleCheck()}>
              审核
            </Button>
          )}
          <Button onClick={() => handleclose()} disabled={taskworkUploadStatus}>
            关闭
          </Button>
        </>
      }
    >
      <SysDict
        typeid="624"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <div className="noexplain">
        {tabActivekey === 'taskwork' && (
          <Spin spinning={loading}>
            {loading === false && executeResult && executeResult.length > 0 && data && (
              <div className={styles.collapse}>
                <TaskworkContext.Provider
                  value={{
                    getUploadStatus: v => {
                      setTaskworkUploadStatus(v);
                    },
                  }}
                >
                  <Collapse
                    expandIconPosition="right"
                    defaultActiveKey={['1', '2', '3']}
                    bordered={false}
                  >
                    <>
                      {loading === false &&
                        ((edit && edit.main !== undefined && flowNodeName === '工作登记') ||
                          delay) && (
                          <Panel
                            header={status || flowNodeName}
                            key="1"
                            bordered
                            style={{ backgroundColor: 'white' }}
                          >
                            <TaskworkEditfillin
                              formItemLayout={formItemLayout}
                              forminladeLayout={forminladeLayout}
                              main={openFlowList.main ? openFlowList.main : edit.main}
                              type={delay}
                              status={status}
                              useInfo={userinfo}
                              ref={SaveRef}
                              superviseworkPersonSelect={superviseworkPersonSelect}
                              files={
                                openFlowList !== [] &&
                                openFlowList.main.fileIds !== '' &&
                                openFlowList.main.fileIds
                                  ? JSON.parse(openFlowList.main.fileIds)
                                  : []
                              }
                              ChangeFiles={newvalue => {
                                setFiles(newvalue);
                              }}
                              timeVisivle="true"
                              location={location}
                            />
                          </Panel>
                        )}
                      {loading === false &&
                        !delay &&
                        edit &&
                        edit.execute !== undefined &&
                        flowNodeName === '工作执行' && (
                          <Panel
                            header="工作执行"
                            key="2"
                            style={{ backgroundColor: 'white' }}
                            bordered
                          >
                            <ExecuteworkEditfillin
                              formItemLayout={formItemLayout}
                              forminladeLayout={forminladeLayout}
                              userinfo={userinfo}
                              executeResult={executeResult}
                              ref={SaveRef}
                              showEdit={show}
                              execute={edit.execute}
                              files={
                                edit.execute.fileIds && edit.execute.fileIds !== null
                                  ? JSON.parse(edit.execute.fileIds)
                                  : []
                              }
                              ChangeFiles={newvalue => {
                                setFiles(newvalue);
                              }}
                              location={location}
                            />
                          </Panel>
                        )}
                      {loading === false &&
                        !delay &&
                        edit &&
                        edit.check !== undefined &&
                        flowNodeName === '工作审核' && (
                          <Panel
                            header="工作延期审核"
                            key="3"
                            style={{ backgroundColor: 'white' }}
                            bordered
                          >
                            <CheckdelayworkEditfillin
                              formItemLayout={formItemLayout}
                              forminladeLayout={forminladeLayout}
                              check={edit.check}
                              userinfo={userinfo}
                              ref={SaveRef}
                            />
                          </Panel>
                        )}
                    </>
                  </Collapse>
                </TaskworkContext.Provider>
              </div>
            )}
            <div className={styles.collapse}>
              {loading === false && executeResult && executeResult.length > 0 && data && (
                <Collapse
                  expandIconPosition="right"
                  defaultActiveKey={['0', '1', '2']}
                  bordered={false}
                >
                  <>
                    {data.map((obj, index) => {
                      // panel详情组件
                      const Paneldesmap = new Map([
                        ['main', <TaskworkEditfillins info={Object.values(obj)[0]} key="0" />],
                        [
                          'check',
                          <CheckdelayworkEditfillins info={Object.values(obj)[0]} key="2" />,
                        ],
                        [
                          'execute',
                          <ExecuteworkEditfillins info={Object.values(obj)[0]} key="1" />,
                        ],
                      ]);
                      return (
                        <Panel
                          // header={Panelheadermap.get(Object.keys(obj)[0])}
                          header={pheadertitle(obj, index)}
                          key={index.toString()}
                        >
                          {Paneldesmap.get(Object.keys(obj)[0])}
                        </Panel>
                      );
                    })}
                  </>
                </Collapse>
              )}
            </div>
            <TimeoutModal
              modalvisible={modalvisible}
              ChangeModalVisible={v => setModalVisible(v)}
              ChangeTimeOutMsg={v => postTimeOutMsg(v)}
            />
          </Spin>
        )}
        {tabActivekey === 'supervise' && (
          <SuperviseList data={getSuperviseLists} loading={loading} />
        )}
      </div>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ supervisemodel, itsmuser, loading }) => ({
    userinfo: itsmuser.userinfo,
    openFlowList: supervisemodel.openFlowList,
    getSuperviseLists: supervisemodel.getSuperviseLists,
    superviseworkPersonArr: supervisemodel.superviseworkPersonArr,
    loading: loading.models.supervisemodel,
  }))(WorkplanDetail),
);
