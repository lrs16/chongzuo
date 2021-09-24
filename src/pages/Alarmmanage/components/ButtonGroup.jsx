import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Dropdown, Message, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

function ButtonGroup(props) {
  const { selectedRowKeys, selectRowdata, values, ChangeSelects, dispatch } = props;

  const handleConfig = (status, updatastatus) => {
    if (selectedRowKeys.length === 0) {
      Message.error('至少选择一条告警');
    } else {
      const target = selectRowdata.filter(item => item.confirmStatus === status && item.clearStatus === '待消除');
      if (target.length === 0) {
        Message.error(`请选择确认状态为 ‘${status}’且消除状态为‘待消除’的数据`);
        ChangeSelects([]);
      } else {
        ChangeSelects([]);
        const ids = target.map(item => (item.id));
        dispatch({
          type: 'measuralarm/alarmsconfig',
          payload: {
            configval: {
              ids: ids.toString(),
              status: updatastatus,
            },
            values,
          },
        });
      }
    }
  };

  const handleClearConfig = () => {
    if (selectedRowKeys.length === 0) {
      Message.error('至少选择一条告警');
    } else {
      const target = selectRowdata.filter(item => item.confirmStatus === '已确认' && item.clearStatus === '待消除');
      if (target.length === 0) {
        Message.error('请选择确认状态为 ‘已确认’ 且消除状态为‘待消除’的数据');
        ChangeSelects([]);
      } else {
        ChangeSelects([]);
        const ids = target.map(item => (item.id));
        dispatch({
          type: 'measuralarm/clearconfig',
          payload: {
            configval: {
              ids: ids.toString(),
            },
            values: {
              ...values,
            }
          },
        });
        ChangeSelects(false);
      }

    }
  }

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
      <Menu.Item key="3">故障工单</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ margin: '10px 0 24px 0' }}>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleConfig('待确认', '已确认')}>
        确认告警
      </Button>
      <Button style={{ marginRight: 8 }} onClick={() => handleConfig('已确认', '待确认')}>取消确认</Button>
      <Dropdown overlay={menu}>
        <Button type="primary" style={{ marginRight: 8 }}>
          派发工单 <DownOutlined />
        </Button>
      </Dropdown>
      <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleClearConfig()}>
        手工消除
      </Button>
      <Button style={{ marginRight: 8 }}>导 出</Button>
    </div>
  );
}

export default connect(({ measuralarm, loading }) => ({
  measuralarm,
  loading: loading.models.measuralarm,
}))(ButtonGroup);