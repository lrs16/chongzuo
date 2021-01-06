import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

@connect()
class Tobesetting extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'notifygroup':
        router.push(`${match.url}/notifygroup`);
        break;
      case 'notifyperson':
        router.push(`${match.url}/notifyperson`);
        break;
      default:
        break;
    }
  };

  render() {
    const { match, children, location } = this.props;
    const tabList = [
      {
        key: 'notifygroup',
        tab: '告警通知组设置',
      },
      {
        key: 'notifyperson',
        tab: '告警联系人设置',
      },
    ];
    return (
      <PageHeaderWrapper
        title="告警通知设定"
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default Tobesetting;
