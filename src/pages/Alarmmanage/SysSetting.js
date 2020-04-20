import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

@connect()
class Setting extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'quotas':
        router.push(`${match.url}/quotas`);
        break;
      case 'connector':
        router.push(`${match.url}/connector`);
        break;
      case 'KAFKA':
        router.push(`${match.url}/KAFKA`);
        break;
      case 'sysrun':
        router.push(`${match.url}/sysrun`);
        break;
      default:
        break;
    }
  };

  render() {
    const { match, children, location } = this.props;
    const tabList = [
      {
        key: 'quotas',
        tab: '业务指标警告设置',
      },
      {
        key: 'connector',
        tab: '接口告警设置',
      },
      {
        key: 'KAFKA',
        tab: 'KAFKA中间件告警设置',
      },
      {
        key: 'sysrun',
        tab: '主站系统运行',
      },
    ];
    return (
      <PageHeaderWrapper
        title="系统警告设定"
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default Setting;
