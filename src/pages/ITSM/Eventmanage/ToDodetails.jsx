import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Popover, Popconfirm, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import User from '@/components/SelectUser/User';
import Backoff from './components/Backoff';
import WorkOrder from './WorkOrder';
import Process from './Process';
import TimeoutModal from '../components/TimeoutModal';
import { judgeTimeoutStatus, saveTimeoutMsg } from '../services/api';

const pagetitlemaps = new Map([
  ['已登记', '事件登记'],
  ['待审核', '事件审核'],
  ['已审核', '事件审核'],
  ['待处理', '事件处理'],
  ['处理中', '事件处理'],
  ['待确认', '事件确认'],
  ['已确认', '事件确认'],
  ['重分派', '事件处理'],
  ['已关闭', '事件详情'],
]);

function ToDodetails(props) {
  const { location, dispatch } = props;
  const { taskName, taskId, mainId, check, next } = location.query;
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [buttontype, setButtonType] = useState('');
  const [backvalue, setBackvalue] = useState('');
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [changorder, setChangeOrder] = useState(undefined);
  const [Popvisible, setVisible] = useState(false);
  const [modalvisible, setModalVisible] = useState(false);
  const [butandorder, setButandOrder] = useState('');    // 流转，转回访，转单，审核，再处理时已经超时暂存按钮类型及选人order类型

  console.log(butandorder)

  const handleHold = type => {
    setButtonType(type);
  };

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/eventmanage/to-do`,
    });
  };
  const content = (
    <Backoff
      ChangeBackvalue={v => setBackvalue(v)}
      ChangeVisible={v => setVisible(v)}
    />
  );

  const handleVisibleChange = visible => {
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('该事件单已超时，请填写超时原因...')
        setModalVisible(true);
        setButtonType('goback');
        setUserVisible(false);
      };
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg !== '') {
        setVisible(visible);
      };
      if (res.code === 200 && res.status === 'no') {
        setVisible(visible);
      }
    })
  };

  useEffect(() => {
    if (taskName === '待处理') {
      message.info('请接单..', 1);
    }
  }, []);

  useEffect(() => {
    if (backvalue !== '') {
      dispatch({
        type: 'eventtodo/eventback',
        payload: {
          id: taskId,
          userIds: sessionStorage.getItem('userauthorityid'),
          type: '2',
          ...backvalue,
        },
      });
    }
  }, [backvalue]);

  // 接单
  const eventaccpt = () => {
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('该事件单已超时，请填写超时原因...')
        setModalVisible(true);
        setButtonType('accpt');
      };
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg !== '') {
        dispatch({
          type: 'eventtodo/eventaccept',
          payload: {
            id: taskId,
            userIds: sessionStorage.getItem('userauthorityid'),
            type: '1',
          },
        });
      };
      if (res.code === 200 && res.status === 'no') {
        dispatch({
          type: 'eventtodo/eventaccept',
          payload: {
            id: taskId,
            userIds: sessionStorage.getItem('userauthorityid'),
            type: '1',
          },
        });
      }
    })
  };

  // 删除
  const deleteflow = () => {
    dispatch({
      type: 'eventtodo/deleteflow',
      payload: {
        mainId,
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
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg !== '') {
        handleHold(type);
        setChangeOrder(order);
      }
      if (res.code === 200 && res.status === 'no') {
        handleHold(type);
        setChangeOrder(order);
      }
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
            handleHold(butandorder.type);
            setChangeOrder(butandorder.order);
          }
          break;
      }
    });
  }

  const operations = (
    <>
      {/* 测试下载功能 */}
      {/* <Button onClick={()=>test()}>下载</Button> */}
      {taskName === '已登记' && (
        <Popconfirm title="确定删除此事件单吗？" onConfirm={() => deleteflow()}>
          <Button type="danger" ghost style={{ marginRight: 8 }}>
            删除
          </Button>
        </Popconfirm>
      )}
      {(taskName === '待审核' ||
        (taskName === '待处理' && check === null) ||
        (taskName === '待确认' && check === null)) && (
          <Popover content={content} visible={Popvisible} onVisibleChange={handleVisibleChange} trigger="click">
            <Button type="danger" ghost style={{ marginRight: 8 }}>
              回退
          </Button>
          </Popover>
        )}
      {taskName !== '待处理' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('save')}>
          保存
        </Button>
      )}
      {taskName === '已登记' && next === '审核' && (
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          onClick={() => { handleClick('other') }}
        >
          审核
        </Button>
      )}
      {taskName === '待处理' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={eventaccpt}>
          接单
        </Button>
      )}
      {((taskName === '已登记' && next === '处理') ||
        (next === '处理' && taskName === '待审核') ||
        (next === '处理' && taskName === '审核中')) && (
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => { handleClick('flow') }
            }
          >
            流转
          </Button>
        )}
      {next === '确认' && taskName !== '处理中' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('check')}>
          转回访
        </Button>
      )}
      {taskName === '处理中' && (
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => { handleHold('flowcheck') }}>
            转回访
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => { handleClick('other'); setChangeOrder('处理') }}
          >
            转单
          </Button>
        </>
      )}
      {(taskName === '待确认' || taskName === '确认中') && next === '处理' && (
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          onClick={() => { handleClick('other') }}
        >
          重分派
        </Button>
      )}
      {(taskName === '待确认' || taskName === '确认中') && next === '结束' && (
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          onClick={() => { handleHold('over') }}>
          结束
        </Button>
      )}
      <Button onClick={handleclose}>返回</Button>
    </>
  );
  const handleTabChange = key => {
    switch (key) {
      case 'workorder':
        settabActivekey('workorder');
        break;
      case 'process':
        settabActivekey('process');
        break;
      default:
        break;
    }
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
  ];
  return (
    <PageHeaderWrapper
      title={pagetitlemaps.get(taskName)}
      extra={operations}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      {tabActivekey === 'workorder' && (
        <WorkOrder
          location={location}
          type={buttontype}
          ChangeType={v => setButtonType(v)}
          userchoice={userchoice}
          ChangeChoice={v => setUserChoice(v)}
          ChangeUserVisible={v => setUserVisible(v)}
        />
      )}
      {tabActivekey === 'process' && <Process location={location} />}
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
    </PageHeaderWrapper>
  );
}

export default connect(({ eventtodo, loading }) => ({
  eventtodo,
  loading: loading.effects['eventtodo/eventback'],
}))(ToDodetails);
