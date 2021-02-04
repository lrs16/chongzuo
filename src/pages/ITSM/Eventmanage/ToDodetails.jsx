import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Popover, Popconfirm, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Backoff from './components/Backoff';
import SelectUser from '@/components/SelectUser';

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
  const { match, children, location, dispatch } = props;
  const { taskName, id, mainId, check, next } = location.query;
  const [backvalue, setBackvalue] = useState('');
  const [Popvisible, setVisible] = useState(false);
  const handleHold = type => {
    router.push({
      pathname: `${props.match.url}/workorder`,
      query: {
        taskName,
        id,
        mainId,
        validate: true,
        type,
      },
    });
  };

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/eventmanage/to-do`,
    });
  };
  const content = (
    <Backoff
      ChangeBackvalue={value => setBackvalue(value)}
      ChangeVisible={visi => setVisible(visi)}
    />
  );

  const handleVisibleChange = visible => {
    setVisible(visible);
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
          id,
          userIds: sessionStorage.getItem('userauthorityid'),
          type: '2',
          ...backvalue,
        },
      });
    }
  }, [backvalue]);

  // 接单
  const eventaccpt = () => {
    dispatch({
      type: 'eventtodo/eventaccept',
      payload: {
        id,
        userIds: sessionStorage.getItem('userauthorityid'),
        type: '1',
      },
    });
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
        (taskName === '待处理' && check === '') ||
        (taskName === '待确认' && check === '')) && (
        // <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleHold('back')}>
        //   回退
        // </Button>
        <Popover content={content} visible={Popvisible} onVisibleChange={handleVisibleChange}>
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
        <SelectUser handleSubmit={() => handleHold('other')} taskId={id}>
          <Button type="primary" style={{ marginRight: 8 }}>
            审核
          </Button>
        </SelectUser>
      )}
      {taskName === '待处理' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={eventaccpt}>
          接单
        </Button>
      )}
      {((taskName === '已登记' && next === '处理') ||
        (next === '处理' && taskName === '待审核') ||
        (next === '处理' && taskName === '审核中')) && (
        <SelectUser handleSubmit={() => handleHold('flow')} taskId={id}>
          <Button type="primary" style={{ marginRight: 8 }}>
            流转
          </Button>
        </SelectUser>
      )}
      {next === '确认' && taskName !== '处理中' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('check')}>
          确认
        </Button>
      )}
      {taskName === '处理中' && (
        <>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('flowcheck')}>
            确认
          </Button>
          <SelectUser handleSubmit={() => handleHold('other')} changorder="处理" taskId={id}>
            <Button ghost type="primary" style={{ marginRight: 8 }}>
              转单
            </Button>
          </SelectUser>
        </>
      )}
      {(taskName === '待确认' || taskName === '确认中') && next === '处理' && (
        <SelectUser handleSubmit={() => handleHold('other')} taskId={id}>
          <Button type="primary" style={{ marginRight: 8 }}>
            重分派
          </Button>
        </SelectUser>
      )}
      {(taskName === '待确认' || taskName === '确认中') && next === '结束' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('flow')}>
          结束
        </Button>
      )}
      <Button onClick={handleclose}>返回</Button>
    </>
  );
  const handleTabChange = key => {
    switch (key) {
      case 'workorder':
        router.push({
          pathname: `${match.url}/workorder`,
          query: {
            taskName,
            id,
            mainId,
            validate: false,
          },
        });
        break;
      case 'process':
        router.push({
          pathname: `${match.url}/process`,
          query: {
            taskName,
            id,
            mainId,
            validate: false,
          },
        });
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
      tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
      onTabChange={handleTabChange}
    >
      {children}
    </PageHeaderWrapper>
  );
}

export default connect(({ eventtodo, loading }) => ({
  eventtodo,
  loading: loading.effects['eventtodo/eventback'],
}))(ToDodetails);
