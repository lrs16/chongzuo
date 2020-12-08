import React from 'react';
import { Tabs, Card, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { TabPane } = Tabs;
const operations = (
  <>
    <Button type="danger" ghost style={{ marginRight: 8 }}>
      删除
    </Button>
    <Button type="primary" style={{ marginRight: 8 }}>
      保存
    </Button>
    <Button type="primary" style={{ marginRight: 8 }}>
      流转
    </Button>
    <Button>关闭</Button>
  </>
);

function ToDoregist(props) {
  const pagetitle = props.route.name;
  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
          <TabPane tab="事件工单" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="事件流程" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="跟进信息" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  );
}

export default ToDoregist;
