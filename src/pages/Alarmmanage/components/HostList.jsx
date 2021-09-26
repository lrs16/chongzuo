import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import {
  Card,
  Button,
  Dropdown,
  Menu,
  Table,
  Message,
  Badge,
  Tabs,
  Row, Col, Form, Input, Select, DatePicker, Tooltip
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { querkeyVal } from '@/services/api';
import TypeContext from '@/layouts/MenuContext';

const { TabPane } = Tabs;
const { Option } = Select;

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

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};



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

function HostList(props) {
  const { loading, dispatch, list, activeTabInfo } = props;
  const { getFieldDecorator, resetFields, validateFields } = props.form;
  const dataSource = list.data;
  const [querykeys, setQueryKeys] = useState({ type: '', configstatus: '', elimination: '' });
  const [selectedRowKeys, setSelectionRow] = useState([]);
  const [selectRowdata, setSelectdata] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [expand, setExpand] = useState(false);
  const [assets, setAssets] = useState([]);
  const { tabActivekey, pagetitle, selectdata } = useContext(TypeContext);

  const handleSearch = () => {
    validateFields((err, values) => {
      setQueryKeys(values);
    });
  };

  const handleReset = () => {
    resetFields();
    setQueryKeys({});
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
      setQueryKeys(querykeys);
    }
  }, [activeTabInfo]);

  useEffect(() => {
    if (tabActivekey) {
      setQueryKeys(querykeys);
    }
  }, [tabActivekey]);

  useEffect(() => {
    searchdata(querykeys, paginations.current, paginations.pageSize);
  }, [querykeys]);

  useEffect(() => {
    querkeyVal('assets', 'assets_host_zone_id').then(res => {
      if (res.code === 200) {
        setAssets(res.data.assets_host_zone_id)
      }
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


  const columns = [
    {
      title: '区域',
      dataIndex: 'type',
      key: 'type',
      width: 140,
    },
    {
      title: '设备IP',
      dataIndex: 'monitorco',
      key: 'monitorco',
      width: 180,
      onCell: () => {
        return {
          style: {
            maxWidth: 180,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    },
    {
      title: '设备名称',
      dataIndex: '1',
      key: '1',
      width: 180,
      onCell: () => {
        return {
          style: {
            maxWidth: 180,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    },
    {
      title: '巡检内容',
      dataIndex: '2',
      key: '2',
      width: 180,
      onCell: () => {
        return {
          style: {
            maxWidth: 180,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
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
      with: 300,
      onCell: () => {
        return {
          style: {
            maxWidth: 300,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    },
    {
      title: '告警时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '确认告警时间',
      dataIndex: 'contenttime',
      key: 'contenttime',
      width: 180,
    },
    {
      title: '告警消除时间',
      dataIndex: 'thistime',
      key: 'thistime',
      width: 180,
    },
  ];

  const softName = {
    title: '软件名称',
    dataIndex: '3softName',
    key: 'softName',
    width: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
  };

  const processName = {
    title: '进程名称',
    dataIndex: '4',
    key: '4',
    width: 180,
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
  };

  const addcolumn = (arr) => {
    if (pagetitle !== '主机巡检告警') {
      const newarr = arr;
      newarr.splice(3, 0, processName);
      newarr.splice(3, 0, softName);
      return newarr
    }
    return arr
  };
  const column = addcolumn(columns);

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const inspectionmmap = getTypebykey('1437319207950217217');       // 巡检内容
  const hostmonitormap = getTypebykey('1437322008466026497');       // 主机监测

  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button></>
  )

  return (
    <>

      <Card>
        <Form {...formItemLayout} onSubmit={handleSearch}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="区域">
                {getFieldDecorator('hostZoneId')(
                  <Select placeholder="请选择">
                    {assets.map(({ key, val }) => [
                      <Option key={key} value={val}>
                        {val}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="设备名称">
                {getFieldDecorator('hostName ')(
                  <Input allowClear />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="设备IP">
                {getFieldDecorator('hostIp')(
                  <Input allowClear />,
                )}
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                {(pagetitle === '软件巡检告警' || pagetitle === '应用程序运行状态告警') && (
                  <>
                    <Col span={8}>
                      <Form.Item label="软件名称">
                        {getFieldDecorator('inspection')(
                          <Input allowClear />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="进程名称">
                        {getFieldDecorator('softName')(
                          <Input allowClear />,
                        )}
                      </Form.Item>
                    </Col>
                  </>
                )}
                {(pagetitle === '主机巡检告警' || pagetitle === '软件巡检告警') && (
                  <Col span={8}>
                    <Form.Item label="巡检内容">
                      {getFieldDecorator('softName')(
                        <Select placeholder="请选择">
                          {inspectionmmap.map(({ dict_code, title }) => [
                            <Option key={dict_code} value={title}>
                              {title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                )}
                {pagetitle === '应用程序运行状态告警' && (
                  <Col span={8}>
                    <Form.Item label="监测内容">
                      {getFieldDecorator('softName')(
                        <Select placeholder="请选择">
                          {hostmonitormap.map(({ dict_code, title }) => [
                            <Option key={dict_code} value={title}>
                              {title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                )}
                {/* <Col span={8}>
                  <Form.Item label="告警时间">
                    <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('time1', {
                        initialValue: '',
                      })(
                        <DatePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: moment('00:00:00', 'HH:mm:ss'),
                          }}
                          placeholder="开始时间"
                          format='YYYY-MM-DD HH:mm:ss'
                          style={{ minWidth: 120, width: '100%' }}
                        />
                      )}
                    </div>
                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                    <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('time2', {
                        initialValue: '',
                      })(
                        <DatePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: moment('23:59:59', 'HH:mm:ss'),
                          }}
                          placeholder="结束时间"
                          format='YYYY-MM-DD HH:mm:ss'
                          style={{ minWidth: 120, width: '100%' }}
                        />
                      )}
                    </div>
                  </Form.Item>
                </Col> */}
                <Col span={8}>
                  <Form.Item label="告警确认时间">
                    <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('time3', {
                        initialValue: '',
                      })(
                        <DatePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: moment('00:00:00', 'HH:mm:ss'),
                          }}
                          placeholder="开始时间"
                          format='YYYY-MM-DD HH:mm:ss'
                          style={{ minWidth: 120, width: '100%' }}
                        />
                      )}
                    </div>
                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                    <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('time4', {
                        initialValue: '',
                      })(
                        <DatePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: moment('23:59:59', 'HH:mm:ss'),
                          }}
                          placeholder="结束时间"
                          format='YYYY-MM-DD HH:mm:ss'
                          style={{ minWidth: 120, width: '100%' }}
                        />
                      )}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="告警消除时间">
                    <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('time5', {
                        initialValue: '',
                      })(
                        <DatePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: moment('00:00:00', 'HH:mm:ss'),
                          }}
                          placeholder="开始时间"
                          format='YYYY-MM-DD HH:mm:ss'
                          style={{ minWidth: 120, width: '100%' }}
                        />
                      )}
                    </div>
                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                    <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('time6', {
                        initialValue: '',
                      })(
                        <DatePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: moment('23:59:59', 'HH:mm:ss'),
                          }}
                          placeholder="结束时间"
                          format='YYYY-MM-DD HH:mm:ss'
                          style={{ minWidth: 120, width: '100%' }}
                        />
                      )}
                    </div>
                  </Form.Item>
                </Col>
              </>
            )}
            {(expand && pagetitle !== '主机巡检告警') ? (<Col span={8}><Form.Item>{extra}</Form.Item></Col>) : (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>)}
          </Row>
        </Form>

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
          columns={column}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record.id}
          scroll={{ x: 2150 }}
          pagination={pagination}
        />
      </Card>
    </>
  );
}

export default Form.create({})(
  connect(({ measuralarm, loading }) => ({
    list: measuralarm.list,
    Donutdata: measuralarm.Donutdata,
    Smoothdata: measuralarm.Smoothdata,
    loading: loading.models.measuralarm,
  }))(HostList)
);
