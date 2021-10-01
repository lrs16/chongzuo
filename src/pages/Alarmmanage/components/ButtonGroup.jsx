import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Dropdown, Message, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { createOrder } from '../services/api';

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
    const { key } = e;
    if (selectedRowKeys && selectedRowKeys.length === 1) {
      const confirmStatus = selectRowdata[0]?.confirmStatus;
      if (confirmStatus === '已确认') {
        const warnId = selectRowdata[0].id;
        createOrder({ orderType: key, warnId }).then(res => {
          if (res.code === 200) {
            Message.success(res.msg);
            switch (key) {
              case 'event':
                router.push({
                  pathname: `/ITSM/eventmanage/to-do`,
                  query: { pathpush: true },
                  state: { cache: false }
                });
                break;
              case 'problem':
                router.push({
                  pathname: `/ITSM/problemmanage/besolved`,
                  query: { pathpush: true },
                  state: { cache: false }
                });
                break;
              case 'trouble':
                router.push({
                  pathname: `/ITSM/faultmanage/todolist`,
                  query: { pathpush: true },
                  state: { cache: false }
                });
                break;
              default:
                break;
            }
          } else {
            Message.error('操作失败');
          }
        })
      } else {
        Message.error('请选择确认状态为 ‘已确认’ 的数据');
      }

    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="event">事件工单</Menu.Item>
      <Menu.Item key="problem">问题工单</Menu.Item>
      <Menu.Item key="trouble">故障工单</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ margin: '10px 0 24px 0' }}>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleConfig('待确认', '已确认')}>
        确认告警
      </Button>
      <Button style={{ marginRight: 8 }} onClick={() => handleConfig('已确认', '待确认')}>取消确认</Button>
      <Dropdown overlay={menu} disabled={selectedRowKeys && selectedRowKeys.length !== 1}>
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