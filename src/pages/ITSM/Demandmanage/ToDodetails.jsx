import React, { useState, useEffect, useContext } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Popover, message, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import User from '@/components/SelectUser/User';
import EditContext from '@/layouts/MenuContext';
import WorkOrder from './WorkOrder';
import Process from './Process';
import Backoff from './components/Backoff';
import TimeoutModal from '../components/TimeoutModal';
import RelationOrder from './RelationOrder';
import { judgeTimeoutStatus, saveTimeoutMsg } from '../services/api';


function ToDoregist(props) {
  const { location, dispatch, workLoad, loading, allloading, olduploadstatus } = props;
  const { taskName, taskId, result, mainId } = location.query;
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [buttontype, setButtonType] = useState('');
  const [registerId, setRegisterId] = useState('');
  const [histroytaskid, setHistroyTaskId] = useState('');
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [Popvisible, setVisible] = useState(false);
  const [iscolse, setIsClose] = useState('');
  const [butandorder, setButandOrder] = useState('');    // 暂存按钮类型
  const [modalvisible, setModalVisible] = useState(false);
  const [releaseTaskName, setReleaseTaskName] = useState('');


  const nextnodemap = new Map([
    ['需求登记', '业务科室领导审核'],
    ['业务科室领导审核', '系统开发商审核'],
    ['系统开发商审核', '自动化科审核'],
    ['市场部领导审核', '系统开发商处理'],
    ['科室领导审核', '系统开发商处理'],
    ['中心领导审核', '系统开发商处理'],
    ['自动化科业务人员审核', '自动化科审核'],
    ['系统开发商处理', '自动化科业务人员及登记人员确认'],
  ]);

  const autonodemap = new Map([
    ['1', '系统开发商处理'],
    ['2', '市场部、科室及中心领导审核'],
    ['3', '市场部领导审核'],
    ['4', '科室领导审核'],
    ['5', '中心领导审核'],
    ['6', '市场部及科室领导审核'],
    ['7', '科室及中心领导审核'],
    ['8', '市场部及中心领导审核'],
  ]);

  const backnodemap = new Map([
    ['业务科室领导审核', '需求登记'],
    ['系统开发商审核', '业务科室领导审核'],
  ])

  const ChangeReleaseTaskName = (v) => {
    setReleaseTaskName(v)
  }

  const handleHold = (type) => {
    setUserChoice(false);
    setButtonType(type);
  };
  const handleclose = () => {
    const tabid = sessionStorage.getItem('tabid');
    router.push({
      pathname: location.pathname,
      query: { tabid, closecurrent: true }
    });
  };

  const handledelete = () => {
    dispatch({
      type: 'demandtodo/demanddelete',
      payload: {
        processId: mainId,
      },
    });
  };

  const handleregisterclose = () => {
    dispatch({
      type: 'demandtodo/close',
      payload: {
        taskId,
        userId: sessionStorage.getItem('userauthorityid'),
        mainId,
      },
    });
  };

  // 点击流转，审核，转回访，回退按钮
  const handleClick = (type) => {
    setUserChoice(false);
    sessionStorage.removeItem('NextflowUserId');
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('该需求单已超时，请填写超时原因...')
        setModalVisible(true);
        // setButtonType('goback');
        setButandOrder({ type });
      };
      if (res.code === 200 && ((res.status === 'yes' && res.timeoutMsg !== '') || res.status === 'no')) {
        handleHold(type);
      };
      if (res.code !== 200) {
        message.error(res.msg || '操作失败！');
        const closetabid = sessionStorage.getItem('tabid');
        router.push({
          pathname: `/ITSM/demandmanage/to-do`,
          query: { pathpush: true },
          state: { cache: false, closetabid }
        })
      }
    })
  };

  // 保存超时信息,成功校验表单
  const postTimeOutMsg = (v) => {
    saveTimeoutMsg({
      taskId,
      msgType: 'timeout',
      orderId: mainId,
      orderType: 'demand',
      ...v
    }).then(res => {
      switch (buttontype) {
        case 'goback':
          setVisible(true);
          break;
        case 'save':
          break;
        default:
          if (res.code === 200) {
            handleHold(butandorder.type);
          }
          break;
      }
    });
  }

  // 回退接口
  const postRollBackmsg = (values) => {
    dispatch({
      type: 'demandtodo/demanback',
      payload: {
        result: 99,
        taskId,
        taskName,
        registerId,
        processId: mainId,
        userId: sessionStorage.getItem('userauthorityid'),
        attachment: '[]',
        ...values,
        mainId,
      },
    });
  }

  const handleGoback = () => {
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('该需求单已超时，请填写超时原因...')
        setModalVisible(true);
        setButtonType('goback');
        setUserVisible(false);
      };
      if (res.code === 200 && ((res.status === 'yes' && res.timeoutMsg !== '') || res.status === 'no')) {
        setVisible(true);
      };
      if (res.code !== 200) {
        message.error(res.msg || '操作失败！');
        const closetabid = sessionStorage.getItem('tabid');
        router.push({
          pathname: `/ITSM/demandmanage/to-do`,
          query: { pathpush: true },
          state: { cache: false, closetabid }
        })
      }
    })
  };

  const selectChoice = (v) => {
    setUserChoice(v);
    if (v) {
      setButtonType(butandorder)
    }
  }

  useEffect(() => {
    if (location.state && location.state.reset) {
      settabActivekey('workorder');
    }
  }, [location.state]);

  const operations = (
    <>
      {tabActivekey === 'workorder' && (
        <>
          {taskName === '需求登记' && iscolse === 0 && (
            <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handledelete()} disabled={olduploadstatus || allloading}>
              删除
            </Button>
          )}
          {taskName === '需求登记' && iscolse === 1 && (
            <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleregisterclose()} disabled={olduploadstatus || allloading}>
              结束
            </Button>
          )}
          {(taskName === '业务科室领导审核' ||
            taskName === '系统开发商审核'
            // taskName === '自动化科业务人员确认' ||
            // taskName === '需求登记人员确认'
          ) && histroytaskid !== null && (
              <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleGoback()} disabled={olduploadstatus || allloading}>
                回退
              </Button>
            )}
          {taskName !== '系统开发商处理' && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('save')} disabled={olduploadstatus || allloading}>
              保存
            </Button>
          )}
          {(taskName === '系统开发商处理' || (result === '1' && (taskName !== '自动化科审核' && taskName !== '需求登记人员确认' && taskName !== '自动化科业务人员确认'))) && (
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onMouseDown={() => { setUserChoice(false); }}
              onClick={() => { handleClick('flow'); setButandOrder('flow') }}
              disabled={olduploadstatus || allloading}
            >
              {taskName === '自动化科业务人员审核' ? '流转' : `流转至${nextnodemap.get(taskName)}`}
            </Button>
          )}
          {taskName === '自动化科审核' && result !== '0' && (
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => { handleClick('flow'); setButandOrder('flow') }}
              disabled={olduploadstatus || allloading}
            >
              流转至{autonodemap.get(result)}
            </Button>
          )}
          {/* {taskName === '自动化科审核' && result !== '0' && result !== '1' && workLoad && (workLoad === '一般' || (workLoad === '重大' && result !== '4')) && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => { handleClick('flow'); setButandOrder('flow') }} disabled={olduploadstatus}>
              流转
            </Button>
          )} */}
          {/* {result === '1' && (taskName === '市场部领导审核' || taskName === '科室领导审核' || taskName === '中心领导审核') && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => { handleClick('toflow') }} disabled={olduploadstatus || allloading}>
              流转至系统开发商处理
            </Button>
          )} */}
          {result === '0' && (taskName === '自动化科业务人员确认' || taskName === '需求登记人员确认') && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => { handleClick('flow'); setButandOrder('flow') }} disabled={olduploadstatus || allloading}>
              重新处理
            </Button>
          )}
          {((result === '1' || result === '2') && (taskName === '需求登记人员确认' || taskName === '自动化科业务人员确认')) && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleClick('over')} disabled={olduploadstatus || allloading}>
              结束
            </Button>
          )}
          {result === '0' &&
            (taskName === '业务科室领导审核' ||
              taskName === '市场部领导审核' ||
              taskName === '科室领导审核' ||
              taskName === '中心领导审核' ||
              taskName === '系统开发商审核' ||
              taskName === '自动化科审核' ||
              taskName === '自动化科业务人员审核') && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('regist')} disabled={olduploadstatus || allloading}>
                重新登记
              </Button>
            )}
        </>
      )}
      <Button onClick={handleclose} disabled={loading}>关闭</Button>
    </>
  );
  const handleTabChange = key => {
    settabActivekey(key);
  };

  const tabList = [
    {
      key: 'workorder',
      tab: '需求工单',
    },
    {
      key: 'process',
      tab: '需求流程',
    },
    {
      key: 'relevancy',
      tab: '关联工单',
    },
  ];

  return (
    <Spin tip="正在加载数据..." spinning={!!loading}>
      <PageHeaderWrapper
        title={taskName}
        extra={operations}
        tabList={tabList}
        tabActiveKey={tabActivekey}
        onTabChange={handleTabChange}
      >
        <div className='noexplain'>
          {tabActivekey === 'workorder' && (
            <EditContext.Provider value={{
              ChangeReleaseTaskName,
            }}>
              <WorkOrder
                location={location}
                type={buttontype}
                ChangeType={newvalue => setButtonType(newvalue)}
                changRegisterId={newvalue => setRegisterId(newvalue)}
                ChangeHistroyTaskId={newvalue => setHistroyTaskId(newvalue)}
                ChangeISClose={v => setIsClose(v)}
                userchoice={userchoice}
                ChangeChoice={v => setUserChoice(v)}
                ChangeUserVisible={v => setUserVisible(v)}
              />
            </EditContext.Provider>
          )}
          {tabActivekey === 'process' && <Process location={location} />}
          {tabActivekey === 'relevancy' && <RelationOrder location={location} relation />}
        </div>
        <User
          taskId={taskId}
          visible={uservisible}
          ChangeUserVisible={v => setUserVisible(v)}
          ChangeChoice={v => selectChoice(v)}
          ChangeType={v => setButtonType(v)}
        />
        <TimeoutModal
          modalvisible={modalvisible}
          ChangeModalVisible={v => setModalVisible(v)}
          ChangeTimeOutMsg={v => postTimeOutMsg(v)}
        />
        <Backoff
          title="填写回退意见"
          visible={Popvisible}
          ChangeVisible={v => setVisible(v)}
          rollbackSubmit={v => postRollBackmsg(v)}
          lastNode={backnodemap.get(taskName)}
        />

      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ demandtodo, viewcache, loading }) => ({
  workLoad: demandtodo.workLoad,
  olduploadstatus: viewcache.olduploadstatus,
  loading: loading.effects['demandtodo/demandopenflow'],
  allloading: loading.models.demandtodo,
}))(ToDoregist);
