import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Spin, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SubmitTypeContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import { expPracticePre, deleteFlow } from './services/api';
import WorkOrder from './WorkOrder';
import Process from './Process';

function ToDodetails(props) {
  const { location, dispatch, loading, loadingopen, allloading, currentTaskStatus, info } = props;
  const { taskName, taskId, releaseType, Id, } = location.query;
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
  };

  const deleteflow = () => {
    const tabid = sessionStorage.getItem('tabid');
    deleteFlow({ releaseNo: Id }).then(res => {
      if (res.code === 200) {
        router.push({
          pathname: `/ITSM/releasemanage/to-do`,
          query: { pathpush: true },
          state: { cach: false, closetabid: tabid }
        });
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    })
  }

  const flowGoback = () => {
    dispatch({
      type: 'releasetodo/releaseflow',
      payload: {
        taskId,
        type: 2,
        userIds: '',
      },
    });
  }

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/releasemanage/to-do`,
      query: { pathpush: true },
      state: { cach: false }
    });
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
      {taskName === '出厂测试' && info && info.submitTimes === 0 && info.relationCount === 0 && (
        <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => deleteflow()}>
          删除
        </Button>
      )}
      {!saved && taskName !== '出厂测试' && taskName !== '发布实施准备' && taskName !== '发布实施' && (
        <Button type="danger" ghost style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => { flowGoback() }} >
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
          {taskName === '业务复核' ? '结束' : '流转'}
        </Button>
      )}
      {taskName === '出厂测试' && info && info.submitTimes !== 0 && (
        <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => setButtype('over')} >
          结束
        </Button>
      )}
      {submittype === 0 && (taskName === '平台验证' || taskName === '业务验证') && (
        <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => setButtype('noPass')} >
          出厂测试
        </Button>
      )}
      {submittype === 0 && (taskName === '科室负责人审核' || taskName === '中心领导审核') && (
        <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => setButtype('noPass')} >
          版本管理员审核
        </Button>
      )}
      <Button onClick={() => handleClose()}>返回</Button>
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
  }, [allloading])

  useEffect(() => {
    if (currentTaskStatus) {
      setSaved(currentTaskStatus.saved);
      // 获取流程图
      dispatch({
        type: 'releaseview/flowimg',
        payload: {
          processInstanceId: currentTaskStatus.processInstanceId,
        },
      });
    }
  }, [currentTaskStatus])

  return (
    <Spin tip="正在加载数据..." spinning={!!loading || !!loadingopen}>
      <PageHeaderWrapper
        title={taskName}
        extra={operations}
        tabList={taskName === '版本管理员审核' ? editiontabList : tabList}
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
            ChangeaddAttaches: (v => setAddAttaches(v)),
            saved,
            releaseType,
          }}>
            <WorkOrder location={location} buttype={buttype} />
          </SubmitTypeContext.Provider>
        )}
        {tabActivekey === 'process' && (<Process />)}
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ itsmuser, releasetodo, loading }) => ({
  userinfo: itsmuser.userinfo,
  tasklinks: releasetodo.tasklinks,
  info: releasetodo.info,
  currentTaskStatus: releasetodo.currentTaskStatus,
  loading: loading.effects['releasetodo/releaseflow'],
  loadingopen: loading.effects['releasetodo/openflow'],
  // loadingcheckrelese: loading.effects['releasetodo/checkversion'],
  allloading: loading.models.releasetodo,
}))(ToDodetails);