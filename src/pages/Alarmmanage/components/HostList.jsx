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
import ButtonGroup from './ButtonGroup';

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
  const { loading, dispatch, list, searchtab, ChangeActiveTabKey, activeTabKey } = props;
  const { getFieldDecorator, resetFields, getFieldsValue } = props.form;
  const [selectedRowKeys, setSelectionRow] = useState([]);
  const [selectRowdata, setSelectdata] = useState([]);
  // const [classifykey, setClassifykey] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [searchdata, setSearchData] = useState({});
  const [activeKey, setActiveKey] = useState('');
  const [assets, setAssets] = useState([]);
  const [expand, setExpand] = useState(false);
  const { tabActivekey, selectdata, tabdate, warnModule, pagetitle } = useContext(TypeContext);

  useEffect(() => {
    querkeyVal('assets', 'assets_host_zone_id').then(res => {
      if (res.code === 200) {
        setAssets(res.data.assets_host_zone_id)
      }
    });
  }, []);

  const getvalues = () => {
    const val = getFieldsValue();
    const values = {
      firstClassify: val.Classify ? val.Classify[0] : '',
      secondClassify: val.Classify && val.Classify.length > 1 ? val.Classify[1] : '',
      thirdClassify: val.Classify && val.Classify.length > 2 ? val.Classify[2] : '',
      beginClearTime: val.beginClearTime ? moment(val.beginClearTime).format('YYYY-MM-DD HH:mm:ss') : '',
      beginConfirmTime: val.beginConfirmTime ? moment(val.beginConfirmTime).format('YYYY-MM-DD HH:mm:ss') : '',
      beginWarnTime: tabdate.beginWarnTime ? moment(tabdate.beginWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endClearTime: val.endClearTime ? moment(val.endClearTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endConfirmTime: val.endConfirmTime ? moment(val.endConfirmTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endWarnTime: tabdate.endWarnTime ? moment(tabdate.endWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
      warnContent: val.warnContent,
      warnModule
    };
    return values
  }

  const handleSearch = (page, size) => {
    const key = activeTabKey === '全部' ? '' : activeTabKey;
    setActiveKey('全部');
    const values = getvalues();
    setSearchData({ ...values, firstClassify: key, pageIndex: paginations.current, pageSize: paginations.pageSize })
    dispatch({
      type: 'measuralarm/fetchsearchtab',
      payload: {
        ...values,
        firstClassify: key,
      },
    });
    dispatch({
      type: 'measuralarm/fetchlist',
      payload: {
        ...values,
        firstClassify: key,
        pageSize: size,
        pageIndex: page,
      },
    });
  };

  const handleReset = () => {
    resetFields();
    handleSearch(1, 10);
  };

  const handleTabs = key => {
    setActiveKey(key);
    const values = getvalues();
    dispatch({
      type: 'measuralarm/fetchlist',
      payload: {
        ...values,
        confirmStatus: (key === '已确认' || key === '待确认') ? key : '',
        clearStatus: (key === '待消除' || key === '人工消除' || key === '自动消除') ? key : '',
        pageIndex: 1,
        pageSize: 10,
      },
    });
    setPageinations({ current: 1, pageSize: 10 })
  };

  // const onChange = (val) => {
  //   ChangeActiveTabKey(val)
  // };

  const handleSelects = (v) => {
    setSelectionRow(v);
    setSelectdata(v);
  };

  useEffect(() => {
    handleReset();
  }, [tabActivekey])

  useEffect(() => {
    if (activeTabKey && tabdate) {
      // const key = activeTabKey === '全部' ? '' : activeTabKey;
      // setClassifykey(key);
      handleSearch(1, 10);
    }
  }, [activeTabKey]);

  useEffect(() => {
    if (tabdate) {
      resetFields();
      handleSearch(1, 10);
    }
  }, [tabdate])

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectRowKey, selectedRows) => {
      setSelectionRow(selectRowKey);
      setSelectdata(selectedRows);
    },
  };

  const onShowSizeChange = (page, size) => {
    handleSearch(page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    handleSearch(page, paginations.pageSize);
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
      dataIndex: 'firstClassify',
      key: 'firstClassify',
      width: 140,
    },
    {
      title: '设备IP',
      dataIndex: 'fourthClassify',
      key: 'fourthClassify',
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
      dataIndex: 'thirdClassify',
      key: 'thirdClassify',
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
      dataIndex: 'secondClassify',
      key: 'secondClassify',
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
      dataIndex: 'confirmStatus',
      key: 'confirmStatus',
      width: 90,
      render: (text) => (
        <Badge status={text === '已确认' ? 'success' : 'error'} text={text} />
      ),
    },
    {
      title: '消除状态',
      dataIndex: 'clearStatus',
      key: 'clearStatus',
      width: 120,
      render: (text) => (
        <Badge status={text === '已确认' ? 'success' : 'default'} text={text} />
      ),
    },
    {
      title: '告警内容',
      dataIndex: 'warnContent',
      key: 'warnContent',
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
    dataIndex: 'fiveClassify',
    key: 'fiveClassify',
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
    dataIndex: 'sixthClassify',
    key: 'sixthClassify',
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
            {/* <Col span={8}>
              <Form.Item label="区域">
                {getFieldDecorator('firstClassify', {
                  initialValue: classifykey,
                })(
                  <Select placeholder="请选择" onChange={onChange} allowClear>
                    {assets.map(({ key, val }) => [
                      <Option key={key} value={val}>
                        {val}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col> */}
            <Col span={8}>
              <Form.Item label="设备名称">
                {getFieldDecorator('thirdClassify ')(
                  <Input allowClear />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="设备IP">
                {getFieldDecorator('fourthClassify')(
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
                        {getFieldDecorator('fiveClassify')(
                          <Input allowClear />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="进程名称">
                        {getFieldDecorator('sixthClassify')(
                          <Input allowClear />,
                        )}
                      </Form.Item>
                    </Col>
                  </>
                )}
                {(pagetitle === '主机巡检告警' || pagetitle === '软件巡检告警') && (
                  <Col span={8}>
                    <Form.Item label="巡检内容">
                      {getFieldDecorator('secondClassify')(
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
                      {getFieldDecorator('secondClassify')(
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
                      {getFieldDecorator('beginConfirmTime', {
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
                      {getFieldDecorator('endConfirmTime', {
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
                      {getFieldDecorator('beginClearTime', {
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
            <Col span={8}><Form.Item>{extra}</Form.Item></Col>
          </Row>
        </Form>

        <ButtonGroup
          selectedRowKeys={selectedRowKeys}
          selectRowdata={selectRowdata}
          values={searchdata}
          ChangeSelects={v => handleSelects(v)}
        />
        <Tabs activeKey={activeKey} onChange={handleTabs}>
          {searchtab && searchtab.map(({ name, total }) => [
            <TabPane
              tab={
                <>
                  <span>{name}</span>
                  <span style={{ color: `${(name === '待确认' || name === '待消除') ? '#ff0000' : ''}` }}>（{total}）</span>
                </>
              }
              key={name}
            />,
          ])}
        </Tabs>
        <Table
          rowSelection={rowSelection}
          columns={column}
          dataSource={list.records || []}
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
    searchtab: measuralarm.searchtab,
    loading: loading.models.measuralarm,
    updataloading: loading.effects['measuralarm/alarmsconfig'],
  }))(HostList)
);
