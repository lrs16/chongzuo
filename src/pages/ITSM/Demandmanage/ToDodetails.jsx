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
  const [changorder, setChangeOrder] = useState(undefined);
  const [Popvisible, setVisible] = useState(false);
  const [iscolse, setIsClose] = useState('');
  const [butandorder, setButandOrder] = useState('');    // 暂存按钮类型
  const [modalvisible, setModalVisible] = useState(false);
  const [releaseTaskName, setReleaseTaskName] = useState('');

  const ChangeReleaseTaskName = (v) => {
    setReleaseTaskName(v)
  }

  const handleHold = (type) => {
    setUserChoice(false);
    setButtonType(type);
  };
  const handleclose = () => {
    console.log(location);
    router.push({
      pathname: location && location.state && location.state.runpath ? location.state.runpath : `/ITSM/demandmanage/to-do`,
      query: { pathpush: true },
      state: { ...location.state, cache: false, }
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
  const handleClick = (type, order) => {
    setUserChoice(false);
    sessionStorage.removeItem('NextflowUserId');
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('该需求单已超时，请填写超时原因...')
        setModalVisible(true);
        // setButtonType('goback');
        setButandOrder({ type, order });
      };
      if (res.code === 200 && ((res.status === 'yes' && res.timeoutMsg !== '') || res.status === 'no')) {
        handleHold(type);
        setChangeOrder(order);
      };
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
            setChangeOrder(butandorder.order);
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
        result: 5,
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
      if (res.code === -1) {
        message.error(res.msg)
      };
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
      {tabActivekey === 'workorder' && !allloading && (
        <>
          {taskName === '需求登记' && iscolse === 0 && (
            <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handledelete()} disabled={olduploadstatus}>
              删除
            </Button>
          )}
          {taskName === '需求登记' && iscolse === 1 && (
            <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleregisterclose()} disabled={olduploadstatus}>
              结束
            </Button>
          )}
          {(taskName === '业务科室领导审核' ||
            taskName === '系统开发商审核' ||
            taskName === '自动化科业务人员确认' ||
            taskName === '需求登记人员确认') && histroytaskid !== null && (
              <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleGoback()} disabled={olduploadstatus}>
                回退
              </Button>
            )}
          {taskName !== '系统开发商处理' && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('save')} disabled={olduploadstatus}>
              保存
            </Button>
          )}
          {result === '1' && (taskName === '需求登记' || taskName === '业务科室领导审核' || taskName === '系统开发商审核') && (
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => { handleClick('flow'); setButandOrder('flow') }}
              disabled={olduploadstatus}
            >
              流转
            </Button>
          )}
          {result === '1' && taskName === '系统开发商处理' && (
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => { handleClick('flow'); setButandOrder('flow') }}
            // disabled={releaseTaskName !== '结束' && releaseTaskName !== ''}
            >
              流转
            </Button>
          )}
          {taskName === '自动化科专责审核' && result !== '0' && result !== '1' && workLoad && (workLoad === '一般' || (workLoad === '重大' && result !== '4')) && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => { handleClick('flow'); setButandOrder('flow') }} disabled={olduploadstatus}>
              流转
            </Button>
          )}
          {result === '1' && ((taskName === '自动化科专责审核' && workLoad === '一般') || taskName === '市场部领导审核' || taskName === '科室领导审核' || taskName === '中心领导审核') && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => { handleClick('toflow') }} disabled={olduploadstatus}>
              流转
            </Button>
          )}
          {result === '1' && taskName === '自动化科业务人员审核' && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleClick('flow')} disabled={olduploadstatus}>
              流转
            </Button>
          )}
          {result === '1' && taskName === '自动化科业务人员确认' && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleClick('confirm')} disabled={olduploadstatus}>
              登记人确认
            </Button>
          )}
          {result === '0' && (taskName === '自动化科业务人员确认' || taskName === '需求登记人员确认') && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => { handleClick('flow'); setButandOrder('flow') }} disabled={olduploadstatus}>
              重新处理
            </Button>
          )}
          {((result === '2' && taskName === '自动化科业务人员确认') ||
            (result === '1' && taskName === '需求登记人员确认')) && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleClick('over')} disabled={olduploadstatus}>
                结束
              </Button>
            )}
          {result === '0' &&
            (taskName === '业务科室领导审核' ||
              taskName === '市场部领导审核' ||
              taskName === '科室领导审核' ||
              taskName === '系统开发商审核' ||
              taskName === '自动化科专责审核' ||
              taskName === '自动化科业务人员审核') && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('regist')} disabled={olduploadstatus}>
                重新登记
              </Button>
            )}
        </>
      )}
      <Button onClick={handleclose} disabled={loading}>返回</Button>
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
        <User
          taskId={taskId}
          visible={uservisible}
          ChangeUserVisible={v => setUserVisible(v)}
          changorder={changorder}
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
