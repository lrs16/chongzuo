import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Empty, Button, Dropdown, Menu, Table, Message, Badge } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import { DownOutlined } from '@ant-design/icons';
import { ChartCard } from '@/components/Charts';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import FromOverVies from './components/FromOverVies';

const eliminationsMap = ['default', 'error'];
const eliminations = ['已消除', '未消除'];
const statusMap = ['success', 'error'];
const configstatus = ['已确认', '未确认'];
const cols = {
  value: {
    min: 100,
    range: [0, 0.95],
    alias: '',
    tickCount: 5,
  },
  date: {
    // max: 24,
    range: [0.02, 0.95],
    alias: '',
  },
};

const columns = [
  {
    title: '级别',
    dataIndex: 'leve',
    key: 'leve',
    width: 60,
  },
  {
    title: '监控项',
    dataIndex: 'type',
    key: 'type',
    width: 140,
  },
  {
    title: '监控内容',
    dataIndex: 'monitorco',
    key: 'monitorco',
    width: 200,
  },
  {
    title: '确认状态',
    dataIndex: 'configstatus',
    key: 'configstatus',
    width: 90,
    render: (text, record) => (
      <span>
        <Badge status={statusMap[record.configstatus]} text={configstatus[record.configstatus]} />
      </span>
    ),
  },
  {
    title: '消除状态',
    dataIndex: 'elimination',
    key: 'elimination',
    width: 90,
    render: (text, record) => (
      <span>
        <Badge
          status={eliminationsMap[record.elimination]}
          text={eliminations[record.elimination]}
        />
      </span>
    ),
  },
  {
    title: '告警内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '确认告警时间',
    dataIndex: 'contenttime',
    key: 'contenttime',
    width: 180,
  },
  {
    title: '本次告警时间',
    dataIndex: 'thistime',
    key: 'thistime',
    width: 180,
  },
  {
    title: '上次告警时间',
    dataIndex: 'lasttime',
    key: 'lasttime',
    width: 180,
  },
];

const DropdownMenu = props => {
  const { selectedRowKeys, match, datas } = props;

  const handleMenuClick = e => {
    const alarmlist = datas.filter(obj => {
      return obj.configstatus === '0' && obj.elimination === '1';
    });
    const { key } = e;
    if (selectedRowKeys.length < 1) {
      Message.error('至少选择一条告警记录');
    } else {
      router.push({
        pathname: `${match.url}/workorder`,
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
      <Menu.Item key="2">变更工单</Menu.Item>
      <Menu.Item key="3">发布工单</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button type="primary" style={{ marginRight: 8 }}>
        派发工单 <DownOutlined />
      </Button>
    </Dropdown>
  );
};

function OverVies(props) {
  const {
    loading,
    dispatch,
    list,
    Donutdata,
    Smoothdata,
    match,
    location: { query },
  } = props;
  const dataSource = list.data;
  const { key } = query;
  const [selectedRowKeys, setSelectionRow] = useState('');
  const [selectRowdata, setSelectdata] = useState('');
  const getdatas = pagekey => {
    dispatch({
      type: 'alarmovervies/fetchlist',
      payload: { key: pagekey },
    });
    dispatch({
      type: 'alarmovervies/fetchoverdonut',
      payload: { key: pagekey },
    });
    dispatch({
      type: 'alarmovervies/fetchoversmooth',
      payload: { key: pagekey },
    });
  };
  useEffect(() => {
    getdatas(key);
  }, [key]);

  const rowSelection = {
    onChange: (selectRowKey, selectedRows) => {
      setSelectionRow(selectRowKey);
      setSelectdata(selectedRows);
    },
  };

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

  return (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <ChartCard title="告警概览">
            <Spin spinning={false} style={{ background: '#ffffff' }}>
              {Donutdata === undefined && <Empty style={{ height: '250px' }} />}
              {Donutdata !== undefined && (
                <DonutPCT data={Donutdata} cols={cols} height={350} padding={[10, 0, 50, 0]} />
              )}
            </Spin>
          </ChartCard>
        </Col>
        <Col span={12}>
          <ChartCard title="月度告警数量">
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: -18,
                textAlign: 'right',
              }}
            >
              时间：{moment().format('YYYY-MM')}
            </div>
            <Spin spinning={false} style={{ background: '#ffffff' }}>
              {Smoothdata === undefined && <Empty style={{ height: '250px' }} />}
              {Smoothdata !== undefined && (
                <SmoothLine data={Smoothdata} height={350} padding={[30, 0, 50, 60]} />
              )}
            </Spin>
          </ChartCard>
        </Col>
      </Row>
      <h3 style={{ fontWeight: 'bold', margin: '12px 0' }}>当前告警</h3>
      <Card>
        <FromOverVies />
        <div style={{ margin: '10px 0 24px 0' }}>
          <Button type="primary" style={{ marginRight: 8 }} onClick={handleConfig}>
            确认告警
          </Button>
          <Button style={{ marginRight: 8 }}>取消确认</Button>
          <DropdownMenu selectedRowKeys={selectedRowKeys} match={match} datas={selectRowdata} />
          <Button type="danger" ghost style={{ marginRight: 8 }}>
            手工消除
          </Button>
          <Button style={{ marginRight: 8 }}>导 出</Button>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record.id}
          scroll={{ x: 1400 }}
        />
      </Card>
    </>
  );
}

export default connect(({ alarmovervies, loading }) => ({
  list: alarmovervies.list,
  Donutdata: alarmovervies.Donutdata,
  Smoothdata: alarmovervies.Smoothdata,
  loading: loading.models.alarmovervies,
}))(OverVies);
