import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Dropdown, Message, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

function ButtonGroup(props) {
  const { selectedRowKeys, selectRowdata, dispatch } = props;
  const handleConfig = () => {
    if (selectedRowKeys.length === 0) {
      Message.error('至少选择一条告警记录');
    } else {
      dispatch({
        type: 'alarmovervies/alarmsconfig',
        payload: {
          selectedRowKeys,
        },
      });
    }
  };

  const handleMenuClick = e => {
    const alarmlist = selectRowdata.filter(obj => {
      return obj.configstatus === '0' && obj.elimination === '1';
    });
    const { key } = e;
    if (selectedRowKeys.length < 1) {
      Message.error('至少选择一条告警记录');
    } else {
      router.push({
        pathname: ``,
        query: {
          id: selectedRowKeys,
          datas: alarmlist,
          key,
        },
      });
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="0">事件工单</Menu.Item>
      <Menu.Item key="1">问题工单</Menu.Item>
      <Menu.Item key="3">发布工单</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ margin: '10px 0 24px 0' }}>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleConfig()}>
        确认告警
      </Button>
      <Button style={{ marginRight: 8 }}>取消确认</Button>
      <Dropdown overlay={menu}>
        <Button type="primary" style={{ marginRight: 8 }}>
          派发工单 <DownOutlined />
        </Button>
      </Dropdown>
      <Button type="danger" ghost style={{ marginRight: 8 }}>
        手工消除
      </Button>
      <Button style={{ marginRight: 8 }}>导 出</Button>
    </div>
  );
}

export default ButtonGroup;