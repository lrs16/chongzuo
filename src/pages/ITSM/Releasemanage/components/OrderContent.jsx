import React from 'react';
import { Drawer, Tabs } from 'antd';

const { TabPane } = Tabs;

function OrderContent(props) {
  const { visible, handleChange } = props;
  const onClose = () => {
    handleChange(false)
  }
  const callback = (k) => {
    console.log(k)
  }
  return (
    <Drawer
      title='工单详情（工单编号：1132）'
      closable
      mask={false}
      placement='left'
      visible={visible}
      width={720}
      onClose={onClose}
    >
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="发布工单" key="1">Content of Tab Pane 1</TabPane>
        <TabPane tab="发布流程" key="2">Content of Tab Pane 2</TabPane>
        <TabPane tab="关联工单" key="3">Content of Tab Pane 3</TabPane>
      </Tabs>
    </Drawer>
  );
}

export default OrderContent;