import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { TabPane } = Tabs;
class SystemManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabPosition: 'left',
    };
  }

  render() {
    return (
      <PageHeaderWrapper title="系统配置">
        <Card>
          <Tabs tabPosition={this.state.tabPosition}>
            <TabPane tab="系统管理" key="1" />
            <TabPane tab="自动化运维" key="2">
              Content of Tab 2
            </TabPane>
            <TabPane tab="采控管理" key="3">
              Content of Tab 3
            </TabPane>
            <TabPane tab="普通用户" key="4">
              Content of Tab 4
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SystemManage;
