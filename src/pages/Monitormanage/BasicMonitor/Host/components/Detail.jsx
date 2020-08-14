import React from 'react';
import {
  Drawer,
  Radio,
  Card,
  Descriptions,
  Tabs,
  Table,
  Collapse,
  Tag,
  Avatar,
  Row,
  Col,
  Statistic,
} from 'antd';
import { LiquidChart, BarChart } from 'bizcharts';

const { Item } = Descriptions;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const alertStatus = ['告警', '严重'];

const detail = props => {
  const { data, visible, onClose } = props;
  //   const [show, setShow] = useState('system');

  const columns = [
    {
      dataIndex: 'alertLevel',
      render: val => (
        <span>
          <font color={val === 0 ? 'yellow' : 'red'}>{alertStatus[val]} </font>
          <Avatar style={{ backgroundColor: val === 0 ? 'yellow' : 'red' }} size="small" />
        </span>
      ),
    },
    {
      dataIndex: 'label',
      render: val => (
        <span>
          <Tag style={{ marginBottom: 2, marginTop: 2 }}>{val}</Tag>
        </span>
      ),
    },
    { dataIndex: 'alerContent' },
    { dataIndex: 'time' },
  ];
  const listData = [
    {
      key: '1',
      alertLevel: 1,
      label: 'system',
      alerContent: 'xxx使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
      time: '12-10 09:02:39',
    },
    {
      key: '2',
      alertLevel: 0,
      label: 'system',
      alerContent: 'xxx使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
      time: '12-10 09:02:39',
    },
  ];

  // const data = [
  //     {x: '50', y: '/def'}
  // ];

  return (
    <Drawer title="监测详情" width={1200} destroyOnClose="true" visible={visible} onClose={onClose}>
      <Card>
        <Radio.Group
          defaultValue="system"
          buttonStyle="solid"
          //   onChange={e => setShow(e.target.value)}
        >
          <Radio.Button value="system">操作系统</Radio.Button>
          {/* <Radio.Button value="oracle">Oracle</Radio.Button> */}
        </Radio.Group>
      </Card>
      <Card style={{ marginBottom: 24 }}>
        <Descriptions title="基本信息">
          <Item label="名称">{data.name}</Item>
          <Item label="IP">{data.ip}</Item>
          <Item label="设备类型">主机</Item>
          <Item label="状态">{data.status === 1 ? <font color="green">在线</font> : '离线'}</Item>
        </Descriptions>
      </Card>
      <Collapse bordered={false} expandIconPosition="right">
        <Panel key="1" header="告警信息">
          <Table showHeader={false} pagination={false} columns={columns} dataSource={listData} />
        </Panel>
      </Collapse>
      <Card style={{ marginTop: 24 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="监控指标" key="1">
            <Row>
              <Col span={12}>
                <LiquidChart
                  title={{
                    visible: true,
                    text: 'CPU使用率',
                  }}
                  min={0}
                  max={100}
                  value={50}
                  statistic={{
                    // visible: true,
                    // adjustColor: true,
                    formatter: value => `${value}%`,
                  }}
                />
              </Col>
              <Col span={12}>
                <LiquidChart
                  title={{
                    visible: true,
                    text: '内存使用率',
                  }}
                  min={0}
                  max={100}
                  value={50}
                  liquidStyle={{
                    fill: 'green',
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <BarChart
                  title={{
                    visible: true,
                    text: '磁盘使用情况',
                  }}
                  xField="x"
                  yField="y"
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Card title="IO读写速率">
                  <Statistic title="读取速度" value={600} />
                  <Statistic title="写入速度" value={600} />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </Drawer>
  );
};

export default detail;
