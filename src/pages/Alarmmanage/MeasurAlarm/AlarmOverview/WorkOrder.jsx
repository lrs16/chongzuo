import React from 'react';
import { Button, Card, Row, Col, Tabs, Badge, Table } from 'antd';

const { TabPane } = Tabs;

const ordertypeMap = ['事件工单', '问题工单', '变更工单', '发布工单'];
const eliminationsMap = ['default', 'error'];
const eliminations = ['已消除', '未消除'];
const statusMap = ['success', 'error'];
const configstatus = ['已确认', '未确认'];
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

function WorkOrder(props) {
  const {
    location: { query },
  } = props;

  const closeOrder = () => {
    window.history.back(-1);
  };

  return (
    <Card>
      <Row gutter={24}>
        <Col span={8}>
          <Button type="primary">{ordertypeMap[query.key]}</Button>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
          <Button type="primary" style={{ marginRight: 8 }}>
            {' '}
            保 存
          </Button>
          <Button type="primary" style={{ marginRight: 8 }}>
            流 转
          </Button>
          <Button type="danger" ghost style={{ marginRight: 8 }} onClick={closeOrder}>
            关 闭
          </Button>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane tab="事件登记" key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="告警信息" key="2">
          <Table
            columns={columns}
            dataSource={query.datas}
            rowKey={record => record.id}
            scroll={{ x: 1400 }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default WorkOrder;
