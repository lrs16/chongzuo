import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Card, Button, Table, Tabs, Row, Col, Form, Input, Select, DatePicker, Tooltip } from 'antd';
import { connect } from 'dva';
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

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
function ClockPatrolList(props) {
  const { loading, dispatch, list, activeTabInfo } = props;
  const { getFieldDecorator, resetFields, validateFields } = props.form;
  const dataSource = list.data;
  const [querykeys, setQueryKeys] = useState({ type: '', configstatus: '', elimination: '' });
  const [selectedRowKeys, setSelectionRow] = useState([]);
  const [selectRowdata, setSelectdata] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const { tabActivekey, selectdata } = useContext(TypeContext);

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

  const rowSelection = {
    onChange: (selectRowKey, selectedRows) => {
      setSelectionRow(selectRowKey);
      setSelectdata(selectedRows);
    },
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
      title: '服务器时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '时钟时间',
      dataIndex: 'contenttime',
      key: 'contenttime',
      width: 180,
    },
    {
      title: '时间差值',
      dataIndex: 'thistime1',
      key: 'thistime1',
      width: 180,
    },
    {
      title: '告警时间',
      dataIndex: 'thistime',
      key: 'thistime',
      width: 180,
    },
  ];

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const areammap = getTypebykey('1437583023694807042');             // 时钟巡检区域

  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
  </>
  )

  return (
    <>
      <Card>
        <Form {...formItemLayout} onSubmit={handleSearch}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="区域">
                {getFieldDecorator('hostZoneId')(
                  <Select placeholder="请选择">
                    {areammap.map(({ dict_code, title }) => [
                      <Option key={dict_code} value={title}>
                        {title}
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
            <Col span={10}>
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
            </Col>
            <Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>
          </Row>
        </Form>
        <ButtonGroup selectedRowKeys={selectedRowKeys} selectRowdata={selectRowdata} />
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
  }))(ClockPatrolList)
);
