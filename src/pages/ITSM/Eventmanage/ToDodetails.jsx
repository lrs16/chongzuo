import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Popconfirm, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import UploadContext from '@/layouts/MenuContext';
import User from '@/components/SelectUser/User';
import Backoff from './components/Backoff';
import WorkOrder from './WorkOrder';
import Process from './Process';
import RelationOrder from './RelationOrder';
import TimeoutModal from '../components/TimeoutModal';
import { judgeTimeoutStatus, saveTimeoutMsg } from '../services/api';

const backnodemap = new Map([
  ['事件响应', '事件登记'],
  ['运维商经理审核', '事件登记'],
  ['数据科审核', '事件登记'],
  ['自动化科审核', '事件登记'],
  ['事件确认', '事件处理'],
]);

function ToDodetails(props) {
  const { location, dispatch, allloading, olduploadstatus, info } = props;
  const { taskName, taskId, mainId, orderNo } = location.query;
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [buttontype, setButtonType] = useState('');
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [changorder, setChangeOrder] = useState(undefined);
  const [Popvisible, setVisible] = useState(false);
  const [modalvisible, setModalVisible] = useState(false);
  const [submittype, setSubmitType] = useState('');           // 流轉類型，无效属性没有用到暂保留
  const [buttonName, setButtonName] = useState('');
  const [butandorder, setButandOrder] = useState('');    // 流转，转回访，转单，审核，再处理时已经超时暂存按钮类型及选人order类型
  const [registUploadStatus, setRegistUploadStatus] = useState(false);

  const handleclose = () => {
    if (olduploadstatus || registUploadStatus) {
      message.info('页签切换，中止文件上传...')
    };
    const tabid = sessionStorage.getItem('tabid');
    router.push({
      pathname: location.pathname,
      query: { tabid, closecurrent: true }
    });
  };

  // 回退接口
  const postRollBackmsg = (values) => {
    dispatch({
      type: 'eventtodo/eventback',
      payload: {
        id: taskId,
        userIds: sessionStorage.getItem('userauthorityid'),// 相同的回退方式，审核回退不成功，旧流程回退成功
        type: '2',
        ...values,
      },
    });
  }

  const handleGoback = () => {
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('该事件单已超时，请填写超时原因...')
        setModalVisible(true);
        setButtonType('回退');
        setUserVisible(false);
      };
      if (res.code === 200 && ((res.status === 'yes' && res.timeoutMsg !== '') || res.status === 'no')) {
        setVisible(true);
      };
    })
  };

  useEffect(() => {
    if (mainId) {
      settabActivekey('workorder');
    }
  }, [mainId]);

  useEffect(() => {
    if (location.state && location.state.reset) {
      settabActivekey('workorder');
    };
    if (location.state && location.state.cache && registUploadStatus) {
      message.info('页签切换，中止文件上传...')
    }
  }, [location.state]);

  // 接单
  const eventaccpt = () => {
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('该事件单已超时，请填写超时原因...')
        setModalVisible(true);
        setButtonType('accpt');
      };
      if (res.code === 200 && ((res.status === 'yes' && res.timeoutMsg !== '') || res.status === 'no')) {
        const userIds = [{ nodeName: '事件响应', userIds: [sessionStorage.getItem('userauthorityid')] }];
        dispatch({
          type: 'eventtodo/eventaccept',
          payload: {
            id: taskId,
            userIds: JSON.stringify(userIds),
            type: '1',
            orderNo,
          },
        });
      };
      if (res.code === -1) {
        message.error(res.msg)
      }
    })
  };

  // 删除
  const deleteflow = () => {
    dispatch({
      type: 'eventtodo/deleteflow',
      payload: {
        mainId,
        taskId,
        userIds: sessionStorage.getItem('userauthorityid'),
        type: '2',
      },
    });
  };

  // 点击流转，审核，转回访，回退按钮
  const handleClick = (type, order) => {
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('该事件单已超时，请填写超时原因...')
        setModalVisible(true);
        setButandOrder({ type, order });
      };
      if (res.code === 200 && ((res.status === 'yes' && res.timeoutMsg !== '') || res.status === 'no')) {
        setButtonType(type);
        setChangeOrder(order);
      };
      if (res.code === -1) {
        message.error(res.msg)
      };
    })
  };

  // 保存超时信息,成功校验表单
  const postTimeOutMsg = (v) => {
    saveTimeoutMsg({
      taskId,
      msgType: 'timeout',
      orderId: mainId,
      orderType: 'event',
      ...v
    }).then(res => {
      switch (buttontype) {
        case 'accpt':
          dispatch({
            type: 'eventtodo/eventaccept',
            payload: {
              id: taskId,
              userIds: sessionStorage.getItem('userauthorityid'),
              type: '1',
            },
          });
          break;
        case 'goback':
          setVisible(true);
          break;
        case 'save':
          break;
        default:
          if (res.code === 200) {
            setButtonType(butandorder.type);
            setChangeOrder(butandorder.order);
          }
          break;
      }
    });
  };

  const operations = (
    <>
      {tabActivekey === 'workorder' && (
        <>
          {/* 测试下载功能 */}
          {/* <Button onClick={()=>test()}>下载</Button> */}
          {taskName === '事件登记' && !olduploadstatus && info && info.data && info.data[info.data.length - 1]?.register && (
            <Popconfirm title="确定删除此事件单吗？" onConfirm={() => deleteflow()}>
              <Button type="danger" ghost style={{ marginRight: 8 }} disabled={olduploadstatus || registUploadStatus || allloading}>
                删除
              </Button>
            </Popconfirm>
          )}
          {((taskName === '事件响应' && info && info.data && info.data[info.data.length - 1]?.register)
            || (info && info.edit && (
              (taskName === '事件确认' && !info.edit.finish) ||
              ((info.flowNodeName === '运维商经理审核' || info.flowNodeName === '数据科审核' || info.flowNodeName === '自动化科审核') && !info.edit.check)))) && (
              <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleGoback()} disabled={olduploadstatus || allloading}>
                回退
              </Button>
            )}
          {taskName !== '事件响应' && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => setButtonType('save')} disabled={olduploadstatus || registUploadStatus || allloading}>
              保存
            </Button>
          )}
          {taskName === '事件响应' ? (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => eventaccpt()}>
              接单
            </Button>
          ) : (
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onMouseDown={() => { setUserChoice(false); setButtonType('') }}
              onClick={() => { handleClick(buttonName) }}
              disabled={olduploadstatus || registUploadStatus || allloading}
            >
              {taskName === '事件确认' ? '' : '流转至'}{buttonName}
            </Button>
          )}
          {taskName === '事件处理' && (
            <>
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => { handleClick('转单'); setChangeOrder('处理') }}
                disabled={olduploadstatus || allloading}
              >
                转单
              </Button>
            </>
          )}
          {taskName === '事件登记' && (
            <>
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => { handleClick('结束') }}
                disabled={olduploadstatus || allloading}
              >
                结束
              </Button>
            </>
          )}
        </>)}
      <Button onClick={handleclose} disabled={allloading}>关闭</Button>
    </>
  );
  const handleTabChange = key => {
    settabActivekey(key);
    setButtonType('');
  };

  const tabList = [
    {
      key: 'workorder',
      tab: '事件工单',
    },
    {
      key: 'process',
      tab: '事件流程',
    },
    {
      key: 'relevancy',
      tab: '关联工单',
    }
  ];
  return (
    <PageHeaderWrapper
      title={info.flowNodeName}
      extra={operations}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      {tabActivekey === 'workorder' && (
        <UploadContext.Provider value={{
          handleUploadStatus: olduploadstatus,
          getRegistUploadStatus: (v) => { setRegistUploadStatus(v) },
          submittype,                                              // 流轉類型
          ChangeSubmitType: (v => setSubmitType(v)),               // 根據選項返回流轉類型
          ChangeButtonName: (v => setButtonName(v))                // 自行處理返回按鈕名稱
        }}>
          <WorkOrder
            location={location}
            type={buttontype}
            ChangeType={v => setButtonType(v)}
            userchoice={userchoice}
            ChangeChoice={v => setUserChoice(v)}
            ChangeUserVisible={v => setUserVisible(v)}
            registUploadStatus={registUploadStatus}
          />
        </UploadContext.Provider>
      )}
      {tabActivekey === 'process' && <Process location={location} />}
      {tabActivekey === 'relevancy' && <RelationOrder location={location} relation />}
      <User
        taskId={taskId}
        visible={uservisible}
        ChangeUserVisible={v => setUserVisible(v)}
        changorder={changorder}
        ChangeChoice={v => setUserChoice(v)}
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
  );
}

export default connect(({ eventtodo, viewcache, loading }) => ({
  info: eventtodo.info,
  olduploadstatus: viewcache.olduploadstatus,
  loading: loading.effects['eventtodo/eventback'],
  allloading: loading.models.eventtodo,
}))(ToDodetails);
