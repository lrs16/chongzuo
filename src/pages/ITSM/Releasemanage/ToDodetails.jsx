import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SubmitTypeContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import { expPracticePre } from './services/api';

import WorkOrder from './WorkOrder';

function ToDodetails(props) {
  const { location, dispatch, loading, loadingopen, allloading, loadingcheckrelese } = props;
  const { taskName, taskId } = location.query;
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [buttype, setButtype] = useState('');                    // 点击的按钮类型
  const [submittype, setSubmitType] = useState(1);
  const [addAttaches, setAddAttaches] = useState('');
  const [saved, setSaved] = useState(false);                    // 工单保存状态

  const dowloadPre = () => {
    expPracticePre(taskId).then(res => {
      const filename = `发布实施准备${moment().format('YYYY-MM-DD HH:mm')}.docx`;
      const blob = new Blob([res], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  const handleTabChange = key => {
    settabActivekey(key)
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
      {!saved && taskName !== '出厂测试' && taskName !== '发布实施准备' && (
        <Button type="danger" ghost style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => setButtype('goback')} >
          回退
        </Button>
      )}
      {taskName === '发布实施准备' && (
        <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => dowloadPre()} >
          导出
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

  useEffect(() => {
    if (location.state) {
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        settabActivekey('workorder');
        setButtype('');
        setSubmitType(1)
      };
    }
  }, [location.state]);

  useEffect(() => {
    setButtype('');
    setSubmitType(1);
  }, [allloading])

  return (
    <Spin tip="正在加载数据..." spinning={!!loading || !!loadingopen || !!loadingcheckrelese}>
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
            taskId,
            ChangeSubmitType: (v => setSubmitType(v)),
            ChangeButtype: (v => setButtype(v)),
            addAttaches,                                   // 清单临时添加，fasle文档列表不需要加列，true文档列表需要加列
            ChangeaddAttaches: (v => setAddAttaches(v))
          }}>
            <WorkOrder location={location} buttype={buttype} ChangeSaved={(v) => setSaved(v)} />
          </SubmitTypeContext.Provider>
        )}
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
  loading: loading.effects['releasetodo/releaseflow'],
  loadingopen: loading.effects['releasetodo/openflow'],
  loadingcheckrelese: loading.effects['releasetodo/checkversion'],
  allloading: loading.models.releasetodo,
}))(ToDodetails);