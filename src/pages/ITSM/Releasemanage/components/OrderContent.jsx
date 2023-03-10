import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Tabs, Spin } from 'antd';
import HistoryOrderInfo from './HistoryOrderInfo';
import Process from '../Process';
import TaskLinks from './TaskLinks';

const { TabPane } = Tabs;

function OrderContent(props) {
  const { dispatch, visible, handleChange, data, historyinfo, tasklinks, loading, taskName } = props;

  useEffect(() => {
    if (data.releaseNo) {
      dispatch({
        type: 'releaseview/fetchview',
        payload: {
          releaseNo: data.releaseNo,
        },
      });
    };
    if (data.processInstanceId) {
      // 获取流程图
      dispatch({
        type: 'releaseview/flowimg',
        payload: {
          processInstanceId: data.processInstanceId,
        },
      });
    };
  }, [data])

  const onClose = () => {
    handleChange(false)
  }

  return (
    <Drawer
      title={`工单详情（工单编号：${data.releaseNo}）`}
      closable
      mask
      placement='left'
      visible={visible}
      width={1200}
      onClose={onClose}
    >
      <Spin tip="正在加载数据..." spinning={!!loading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="发布工单" key="1">
            <div className='ordercollapse'>
              <TaskLinks records={tasklinks || []} taskName={taskName} />
            </div>
            <HistoryOrderInfo records={historyinfo} selectdata={[]} view />
          </TabPane>
          <TabPane tab="发布流程" key="2"><Process /></TabPane>
        </Tabs>
      </Spin>
    </Drawer>
  );
}

export default connect(({ releaseview, loading }) => ({
  historyinfo: releaseview.historyinfo,
  tasklinks: releaseview.tasklinks,
  currentTaskStatus: releaseview.currentTaskStatus,
  loading: loading.effects['releaseview/fetchview'],
}))(OrderContent);