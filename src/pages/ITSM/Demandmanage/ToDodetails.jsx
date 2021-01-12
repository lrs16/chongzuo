import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import WorkOrder from './WorkOrder';
import Process from './Process';
import SelectUser from '@/components/SelectUser';

function ToDoregist(props) {
  const { match, children, location } = props;
  const { taskName, taskId, mainId } = location.query;
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [validate, setValidate] = useState(false); // 初始化校验状态
  const [buttontype, setButtonType] = useState('');

  const handleHold = type => {
    setValidate(true);
    setButtonType(type);
  };

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/demandmanage/to-do`,
    });
  };
  useEffect(() => {
    sessionStorage.setItem('NextflowUserId', '1310135708685438978');
  }, []);

  const operations = (
    <>
      <Button type="danger" ghost style={{ marginRight: 8 }}>
        删除
      </Button>
      {taskName !== '需求跟踪' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('save')}>
          保存
        </Button>
      )}
      <SelectUser handleSubmit={() => handleHold('flow')} changorder="审核" taskId={taskId}>
        <Button type="primary" style={{ marginRight: 8 }}>
          流转
        </Button>
      </SelectUser>
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
      {tabActivekey === 'workorder' && (
        <WorkOrder
          location={location}
          changValidate={value => {
            setValidate(value);
          }}
          validate={validate}
          type={buttontype}
        />
      )}
      {tabActivekey === 'process' && <Process location={location} />}
    </PageHeaderWrapper>
  );
}

export default ToDoregist;
