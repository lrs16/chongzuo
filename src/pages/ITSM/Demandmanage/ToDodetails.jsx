import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { Button, Popover } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import WorkOrder from './WorkOrder';
import Process from './Process';
import Backoff from './components/Backoff';
import SelectUser from '@/components/SelectUser';

function ToDoregist(props) {
  const { location, dispatch } = props;
  const { taskName, taskId, result } = location.query;
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [buttontype, setButtonType] = useState('');
  const [backvalue, setBackvalue] = useState('');
  const [Popvisible, setVisible] = useState(false);

  const handleHold = type => {
    setButtonType(type);
  };
  const handleclose = () => {
    router.push({
      pathname: `/ITSM/demandmanage/to-do`,
    });
  };
  // 回退
  const content = (
    <Backoff
      ChangeBackvalue={value => setBackvalue(value)}
      ChangeVisible={visi => setVisible(visi)}
    />
  );
  const handleVisibleChange = visible => {
    setVisible(visible);
  };

  const operations = (
    <>
      {taskName === '需求登记' && (
        <Button type="danger" ghost style={{ marginRight: 8 }}>
          删除
        </Button>
      )}
      {/* {taskName !== '需求登记' && (
        <Popover content={content} visible={Popvisible} onVisibleChange={handleVisibleChange}>
          <Button type="primary" ghost style={{ marginRight: 8 }}>
            回退上一步
          </Button>
        </Popover>
      )} */}
      {taskName !== '系统开发商处理' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('save')}>
          保存
        </Button>
      )}
      {result !== '0' && (
        <SelectUser handleSubmit={() => handleHold('flow')} taskId={taskId}>
          <Button type="primary" style={{ marginRight: 8 }}>
            流转
          </Button>
        </SelectUser>
      )}
      {result === '0' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('regist')}>
          登记
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
      tab: '需求工单',
    },
    {
      key: 'process',
      tab: '需求流程',
    },
  ];
  return (
    <PageHeaderWrapper
      title={taskName}
      extra={operations}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      {tabActivekey === 'workorder' && <WorkOrder location={location} type={buttontype} />}
      {tabActivekey === 'process' && <Process location={location} />}
    </PageHeaderWrapper>
  );
}

export default ToDoregist;
