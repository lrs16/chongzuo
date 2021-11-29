import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SubmitTypeContext from '@/layouts/MenuContext';
import DictLower from '@/components/SysDict/DictLower';
import HistoryOrderInfo from './components/HistoryOrderInfo';
import Process from './Process';
import TaskLinks from './components/TaskLinks';
import RelationOrder from './RelationOrder';
import styles from './index.less';

function Details(props) {
  const { location, dispatch, currentTaskStatus, historyinfo, tasklinks, loading } = props;
  const { Id, taskName } = location.query;

  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值

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
      key: 'relevancy',
      tab: '关联工单',
    },
  ];

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/releasemanage/query`,
      query: { pathpush: true },
      state: { cach: false }
    });
  }
  const operations = (<Button onClick={() => handleClose()}>返回</Button>)

  useEffect(() => {
    if (location.state) {
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        settabActivekey('workorder');
      };
    }
  }, [location.state]);

  useEffect(() => {
    if (Id) {
      // 获取工单历史信息
      dispatch({
        type: 'releaseview/fetchview',
        payload: {
          releaseNo: Id,
        },
      });
    }
  }, [Id])

  useEffect(() => {
    if (currentTaskStatus) {
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
    <Spin tip="正在加载数据..." spinning={!!loading}>
      <PageHeaderWrapper
        title={taskName}
        extra={operations}
        tabList={tabList}
        tabActiveKey={tabActivekey}
        onTabChange={handleTabChange}
      >
        <DictLower
          typeid="443"
          ChangeSelectdata={newvalue => setSelectData(newvalue)}
          style={{ display: 'none' }}
        />
        {tabActivekey === 'workorder' && historyinfo && (
          <>
            <TaskLinks records={tasklinks || []} taskName={taskName} />
            <SubmitTypeContext.Provider value={{
              addAttaches: '',                                   // 清单临时添加，fasle文档列表不需要加列，true文档列表需要加列
              ChangeaddAttaches: (() => { }),
            }}>
              <HistoryOrderInfo records={historyinfo} selectdata={selectdata} view taskName={taskName} />
            </SubmitTypeContext.Provider>
          </>
        )}
        {tabActivekey === 'process' && (<Process />)}
        {tabActivekey === 'relevancy' && currentTaskStatus && currentTaskStatus.processInstanceId && <RelationOrder mainId={currentTaskStatus.processInstanceId} />}
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ releaseview, loading }) => ({
  historyinfo: releaseview.historyinfo,
  tasklinks: releaseview.tasklinks,
  currentTaskStatus: releaseview.currentTaskStatus,
  loading: loading.effects['releaseview/fetchview'],
}))(Details);