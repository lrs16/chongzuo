import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { Button, Popover } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import WorkOrder from './WorkOrder';




function ToDodetails(props) {
  const { location, dispatch, userinfo } = props;
  const { taskName } = location.query;

  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签

  const handleTabChange = key => {
    switch (key) {
      case 'workorder':
        settabActivekey('workorder');
        break;
      case 'process':
        settabActivekey('process');
        break;
      case 'correlation':
        settabActivekey('correlation');
        break;
      default:
        break;
    }
  };
  const tabList = [
    {
      key: 'workorder',
      tab: '发布工单',
    },
    {
      key: 'process',
      tab: '发布流程',
    },
    {
      key: 'correlation',
      tab: '关联工单',
    },
  ];
  const operations = (
    <>
      {taskName === '发布登记' && (
        <Button type="danger" ghost style={{ marginRight: 8 }} >
          删除
        </Button>
      )}
      {taskName !== '发布登记' && (
        <Button type="danger" ghost style={{ marginRight: 8 }} >
          回退
        </Button>
      )}
      <Button type="primary" style={{ marginRight: 8 }} >
        保存
      </Button>
      <Button type="primary" style={{ marginRight: 8 }} >
        流转
      </Button>
      <Button >返回</Button>
    </>
  )

  return (
    <PageHeaderWrapper
      title={taskName}
      extra={operations}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >

      {tabActivekey === 'workorder' && (
        <WorkOrder taskName={taskName} />
      )}
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
}))(ToDodetails);