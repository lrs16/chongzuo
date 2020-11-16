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
const Donutdata = [
  {
    type: '业务指标告警',
    count: 600,
  },
  {
    type: '终端在线和入库告警',
    count: 200,
  },
  {
    type: '接口数据告警',
    count: 100,
  },
  {
    type: 'KAFKA中间件告警',
    count: 390,
  },
  {
    type: '主站系统运行告警',
    count: 400,
  },
];
// 数据源
const smoothdata = [
  {
    month: 'Jan',
    city: 'Tokyo',
    temperature: 7,
  },
  {
    month: 'Jan',
    city: 'London',
    temperature: 3.9,
  },
  {
    month: 'Feb',
    city: 'Tokyo',
    temperature: 6.9,
  },
  {
    month: 'Feb',
    city: 'London',
    temperature: 4.2,
  },
  {
    month: 'Mar',
    city: 'Tokyo',
    temperature: 9.5,
  },
  {
    month: 'Mar',
    city: 'London',
    temperature: 5.7,
  },
  {
    month: 'Apr',
    city: 'Tokyo',
    temperature: 14.5,
  },
  {
    month: 'Apr',
    city: 'London',
    temperature: 8.5,
  },
  {
    month: 'May',
    city: 'Tokyo',
    temperature: 18.4,
  },
  {
    month: 'May',
    city: 'London',
    temperature: 11.9,
  },
  {
    month: 'Jun',
    city: 'Tokyo',
    temperature: 21.5,
  },
  {
    month: 'Jun',
    city: 'London',
    temperature: 15.2,
  },
  {
    month: 'Jul',
    city: 'Tokyo',
    temperature: 25.2,
  },
  {
    month: 'Jul',
    city: 'London',
    temperature: 17,
  },
  {
    month: 'Aug',
    city: 'Tokyo',
    temperature: 26.5,
  },
  {
    month: 'Aug',
    city: 'London',
    temperature: 16.6,
  },
  {
    month: 'Sep',
    city: 'Tokyo',
    temperature: 23.3,
  },
  {
    month: 'Sep',
    city: 'London',
    temperature: 14.2,
  },
  {
    month: 'Oct',
    city: 'Tokyo',
    temperature: 18.3,
  },
  {
    month: 'Oct',
    city: 'London',
    temperature: 10.3,
  },
  {
    month: 'Nov',
    city: 'Tokyo',
    temperature: 13.9,
  },
  {
    month: 'Nov',
    city: 'London',
    temperature: 6.6,
  },
  {
    month: 'Dec',
    city: 'Tokyo',
    temperature: 9.6,
  },
  {
    month: 'Dec',
    city: 'London',
    temperature: 4.8,
  },
];

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
  const { loading, dispatch, list, match } = props;
  const dataSource = list.data;
  const [selectedRowKeys, setSelectionRow] = useState('');
  const [selectRowdata, setSelectdata] = useState('');
  useEffect(() => {
    dispatch({
      type: 'alarmovervies/fetchlist',
    });
  }, []);

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
                <DonutPCT data={Donutdata} height={350} padding={[10, 0, 30, 0]} />
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
              {Donutdata === undefined && <Empty style={{ height: '250px' }} />}
              {Donutdata !== undefined && (
                <SmoothLine data={smoothdata} height={350} padding={[30, 0, 50, 0]} />
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
  loading: loading.models.alarmovervies,
}))(OverVies);
