import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Table, Row, Col, Input, Form, Select, Layout, Tooltip } from 'antd';
import { querkeyVal } from '@/services/api'

const { Option } = Select;
const { Content, Sider } = Layout;
const { TextArea } = Input;

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

function RelationDrawer(props) {
  const {
    dispatch,
    title,
    visible,
    orderIdPre,
    orderTypePre,
    orderTypeSuf,
    ChangeVisible,
    orderlist,
    loading } = props;

  const {
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
    }, } = props;
  const [eventstatus, setEventstatus] = useState([]);
  const [problemstatus, setproblemstatus] = useState([]);
  const [releasestatus, setreleasestatus] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [collapsed, setCollapsed] = useState(false);
  const [rowrecord, setRowRecord] = useState({});

  const onSelectChange = RowKeys => {
    setSelectedRowKeys(RowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSave = () => {
    // 保存
    dispatch({
      type: 'relationorder/saverelation',
      payload: {
        orderIdPre,
        orderIdSuf: selectedRowKeys,
        orderTypePre,
        orderTypeSuf,
        relationType: 1
      },
    });
  }

  const hanldleCancel = () => {
    ChangeVisible(false)
  };

  const handleSearch = (no, status, pageIndex, pageSize) => {
    if (orderTypeSuf === 'event') {
      dispatch({
        type: 'relationorder/fetchevent',
        payload: { no, status: status === undefined ? '' : status, pageIndex, pageSize },
      })
    };
    if (orderTypeSuf === 'problem') {
      dispatch({
        type: 'relationorder/fetchproblem',
        payload: { no, status: status === undefined ? '' : status, pageIndex, pageSize },
      })
    }

    if (orderTypeSuf === 'release') {
      dispatch({
        type: 'relationorder/fetchrelease',
        payload: { no, status: status === undefined ? '' : status, pageIndex, pageSize },
      })
    }
  }

  const handleSumit = () => {
    const values = getFieldsValue();
    handleSearch(values.no, values.status, 0, 15);
  }

  const onShowSizeChange = (page, size) => {
    const values = getFieldsValue();
    handleSearch(values.no, values.status, page - 1, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    const values = getFieldsValue();
    handleSearch(values.no, values.status, page - 1, paginations.pageSize);
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
    total: orderlist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  useEffect(() => {
    handleSearch('', '', 0, 15)
  }, [orderTypeSuf])

  useEffect(() => {
    querkeyVal('event', 'status').then(res => {
      if (res.code === 200) {
        setEventstatus(res.data.status)
      }
    });
    querkeyVal('problem', 'orderstate').then(res => {
      if (res.code === 200) {
        setproblemstatus(res.data.orderstate)
      }
    })
    querkeyVal('release', 'statu').then(res => {
      if (res.code === 200) {
        setreleasestatus(res.data.statu)
      }
    })
  }, [])

  let notype;
  let indexType;
  let currentStatus;

  switch (orderTypeSuf) {
    case 'event':
      notype = '事件单';
      indexType = 'eventNo';
      currentStatus = 'flowNodeName'
      break;
    case 'problem':
      notype = '问题单';
      indexType = 'no';
      currentStatus = 'flowNodeName'
      break;
    case 'release':
      notype = '发布单';
      indexType = 'releaseNo';
      // titleType = '发布类型';
      currentStatus = 'releaseStatus';
      break;
    default:
      break;
  }

  const columns = [
    {
      title: `${notype}编号`,
      dataIndex: indexType,
      key: indexType,
    },
    {
      title: `${orderTypeSuf === 'release' ? '发布类型' : '标题'}`,
      dataIndex: `${orderTypeSuf === 'release' ? 'releaseType' : 'title'}`,
      key: `${orderTypeSuf === 'release' ? 'releaseType' : 'title'}`,
    },
    {
      title: '状态',
      dataIndex: currentStatus,
      key: currentStatus,
    },
  ];
  return (
    <>
      <Drawer
        title={`关联${title}单`}
        width={950}
        onClose={hanldleCancel}
        visible={visible}
        bodyStyle={{ paddingBottom: 60 }}
        destroyOnClose
      >
        <Layout style={{ background: '#fff' }}>
          <Content style={{ borderRight: '1px solid #e8e8e8' }}>
            <Row>
              <Form {...formItemLayout}>
                <Col span={10}>
                  <Form.Item label={`${title}编号`} >
                    {getFieldDecorator('no', {
                      initialValue: '',
                    })(
                      <Input placeholder="请输入" allowClear />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  {orderTypeSuf === 'event' && (
                    <Form.Item label='状态' >
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="请选择" allowClear>
                          {eventstatus.map(obj => (
                            <Option key={obj.key} value={obj.val}>
                              {obj.val}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  )}
                  {orderTypeSuf === 'problem' && (
                    <Form.Item label='状态' >
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="请选择" allowClear>
                          {problemstatus.map(obj => (
                            <Option key={obj.key} value={obj.val}>
                              {obj.val}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  )}
                  {orderTypeSuf === 'release' && (
                    <Form.Item label='状态' >
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="请选择" allowClear>
                          {releasestatus.map(obj => (
                            <Option key={obj.key} value={obj.val}>
                              {obj.val}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  )}
                </Col>

                <Col span={6} style={{ paddingTop: 4 }}>
                  <Button type='primary' style={{ marginLeft: 16 }} onClick={() => handleSumit()} >查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={() => { resetFields(); handleSearch('', '', 0, 15) }}>重置</Button>
                </Col>
              </Form>
            </Row>

            <Table
              loading={loading}
              columns={columns}
              dataSource={orderlist.rows}
              rowKey={r => r.id}
              rowSelection={rowSelection}
              pagination={pagination}
              onRow={record => {
                return {
                  onClick: () => { setRowRecord(record) }, // 点击行
                }
              }}
            />
          </Content>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={() => setCollapsed(!collapsed)}
            theme='light'
            width='250'
          >
            <h3 style={{ background: '#f8f8f8', padding: 20, border: '1px solid #e8e8e8', borderLeft: 0 }}>工单详情</h3>
            <div style={{ padding: '8px 0 0 24px' }}>
              <h4 style={{ padding: '8px 0' }}>{title}编号</h4>
              <Input value={rowrecord.no || rowrecord.releaseNo || rowrecord.eventNo} />
              <h4 style={{ padding: '8px 0' }}>{title}来源</h4>
              <Input value={rowrecord.source || rowrecord.eventSource || rowrecord.dataSource || rowrecord.releaseType} />
              <h4 style={{ padding: '8px 0' }}>{title}{orderTypeSuf === 'release' ? '状态' : '类型'}</h4>
              <Input value={rowrecord.type || rowrecord.eventType || rowrecord.releaseStatus} />
              <h4 style={{ padding: '8px 0' }}>建单时间</h4>
              <Input value={rowrecord.addTime || rowrecord.sendTime || rowrecord.creationTime || rowrecord.ctime} />
              <h4 style={{ padding: '8px 0' }}>{title}标题</h4>
              <Input value={rowrecord.title} />
              <h4 style={{ padding: '8px 0' }}>{title}描述</h4>
              <TextArea
                value={rowrecord.content || rowrecord.detail}
                autoSize={{ minRows: 5, maxRows: 10 }}
              />
            </div>
          </Sider>
        </Layout>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 999
          }}
        >
          <Button type='primary' onClick={() => handleSave()} style={{ marginRight: 8 }} disabled={selectedRowKeys.length === 0}>保存</Button>
          <Button onClick={() => hanldleCancel()} style={{ marginRight: 8 }}>关闭</Button>
        </div>
      </Drawer>
    </>
  );
}

export default Form.create({})(connect(({ relationorder, loading }) => ({
  orderlist: relationorder.order,
  loading: loading.models.relationorder,
}))(RelationDrawer));