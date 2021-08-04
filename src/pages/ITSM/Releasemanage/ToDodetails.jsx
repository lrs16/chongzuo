import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { Button, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SubmitTypeContext from '@/layouts/MenuContext';              // 引用上下文管理组件

import WorkOrder from './WorkOrder';

function ToDodetails(props) {
  const { location, dispatch, loading } = props;
  const { taskName } = location.query;
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [buttype, setButtype] = useState('');                    // 点击的按钮类型
  const [submittype, setSubmitType] = useState(1);

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
  const editiontabList = [
    {
      key: 'workorder',
      tab: '发布工单',
    },
  ];
  const operations = (
    <>
      {taskName === '出厂测试' && (
        <Button type="danger" ghost style={{ marginRight: 8 }} >
          删除
        </Button>
      )}
      {taskName !== '出厂测试' && (
        <Button type="danger" ghost style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => setButtype('goback')} >
          回退
        </Button>
      )}
      <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => setButtype('save')}  >
        保存
      </Button>
      {submittype === 1 && (
        <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => setButtype('flow')} >
          流转
        </Button>
      )}
      {submittype === 0 && (
        <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => setButtype('noPass')} >
          出厂测试
        </Button>
      )}
      <Button >返回</Button>
    </>
  )

  return (
    <Spin tip="正在加载数据..." spinning={!!loading}>
      <PageHeaderWrapper
        title={taskName}
        extra={operations}
        tabList={taskName === '版本管理员审批' ? editiontabList : tabList}
        tabActiveKey={tabActivekey}
        onTabChange={handleTabChange}
      >

        {tabActivekey === 'workorder' && (
          <SubmitTypeContext.Provider value={{
            submittype,
            ChangeSubmitType: (v => setSubmitType(v)),
            ChangeButtype: (v => setButtype(v))
          }}>
            <WorkOrder location={location} buttype={buttype} />
          </SubmitTypeContext.Provider>
        )}
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
  loading: loading.effects['releasetodo/releaseflow'],
}))(ToDodetails);