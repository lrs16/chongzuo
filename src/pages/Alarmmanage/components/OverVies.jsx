import React, { useState, useEffect, createContext } from 'react';
import {
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Button,
  Dropdown,
  Menu,
  Table,
  Message,
  Badge,
  Tabs,
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import { DownOutlined } from '@ant-design/icons';
import { ChartCard } from '@/components/Charts';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import TypeContext from '@/layouts/MenuContext';
import FromOverVies from './FromOverVies';

const { TabPane } = Tabs;

const keysmap = new Map([
  ['quotas', 0],
  ['databaseterminal', 1],
  ['connector', 2],
  ['KAFKA', 3],
  ['KAFKA0', 4],
  ['sysrun', 5],
]);

const tabsmap = [
  { key: '0', name: '全部', color: '', data: 356 },
  { key: '1', name: '待确认', color: '#ff0000', data: 6 },
  { key: '2', name: '已确认', color: '', data: 300 },
  { key: '3', name: '待消除', color: '#ff0000', data: 16 },
  { key: '4', name: '已消除', color: '', data: 340 },
];

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
  const { loading, dispatch, list, Donutdata, Smoothdata, activeTabInfo } = props;
  // const Donuttitle = props.route.name;
  const Linetitle = '趋势';
  const dataSource = list.data;
  const [querykeys, setQueryKeys] = useState({ type: '', configstatus: '', elimination: '' });
  const [selectedRowKeys, setSelectionRow] = useState([]);
  const [selectRowdata, setSelectdata] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });

  const getdatas = () => {
    dispatch({
      type: 'measuralarm/fetchoverdonut',
      payload: { key: activeTabInfo.tab },
    });
    dispatch({
      type: 'measuralarm/fetchoversmooth',
      payload: { key: activeTabInfo.tab },
    });
  };

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'measuralarm/fetchlist',
      payload: {
        ...values,
        type: activeTabInfo.tab,
        pageSize: size,
        current: page,
      },
    });
  };

  const handleTabs = key => {
    switch (key) {
      case '0':
        setQueryKeys({ configstatus: '', elimination: '' });
        break;
      case '1':
        setQueryKeys({ configstatus: 0, elimination: '' });
        break;
      case '2':
        setQueryKeys({ configstatus: 1, elimination: '' });
        break;
      case '3':
        setQueryKeys({ configstatus: '', elimination: 0 });
        break;
      case '4':
        setQueryKeys({ configstatus: '', elimination: 1 });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (activeTabInfo) {
      getdatas();
      setQueryKeys(querykeys);
    }
  }, [activeTabInfo]);

  useEffect(() => {
    searchdata(querykeys, paginations.current, paginations.pageSize);
  }, [querykeys]);

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

  const onShowSizeChange = (page, size) => {
    searchdata(querykeys, page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    searchdata(querykeys, page, paginations.pageSize);
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: list.total,
    onChange: page => changePage(page),
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <ChartCard title='告警概览'>
            <Spin spinning={false} style={{ background: '#ffffff' }}>
              {Donutdata === undefined && <Empty style={{ height: '250px' }} />}
              {Donutdata !== undefined && (
                <DonutPCT data={Donutdata} cols={cols} height={350} padding={[40, 40, 60, 40]} onGetVal={() => { }} />
              )}
            </Spin>
          </ChartCard>
        </Col>
        <Col span={12}>
          <ChartCard title={Linetitle}>
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
                <SmoothLine data={Smoothdata} height={350} padding={[30, 0, 50, 60]} onGetVal={() => { }} />
              )}
            </Spin>
          </ChartCard>
        </Col>
      </Row>
      <Card style={{ marginTop: 24 }}>
        <TypeContext.Provider value={{ setQueryKeys }}>
          <FromOverVies />
        </TypeContext.Provider>
        <div style={{ margin: '10px 0 24px 0' }}>
          <Button type="primary" style={{ marginRight: 8 }} onClick={handleConfig}>
            确认告警
          </Button>
          <Button style={{ marginRight: 8 }}>取消确认</Button>
          <DropdownMenu selectedRowKeys={selectedRowKeys} datas={selectRowdata} />
          <Button type="danger" ghost style={{ marginRight: 8 }}>
            手工消除
          </Button>
          <Button style={{ marginRight: 8 }}>导 出</Button>
        </div>
        <Tabs defaultActiveKey="0" onChange={handleTabs}>
          {tabsmap.map(({ key, name, color, data }) => [
            <TabPane
              tab={
                <>
                  <span>{name}</span>
                  <span style={{ color: `${color}` }}>（{data}）</span>
                </>
              }
              key={key}
            />,
          ])}
        </Tabs>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record.id}
          scroll={{ x: 1400 }}
          pagination={pagination}
        />
      </Card>
    </>
  );
}

export default connect(({ measuralarm, loading }) => ({
  list: measuralarm.list,
  Donutdata: measuralarm.Donutdata,
  Smoothdata: measuralarm.Smoothdata,
  loading: loading.models.measuralarm,
}))(OverVies);
