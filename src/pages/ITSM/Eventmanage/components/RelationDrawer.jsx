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
  const [troublestatus, setTroublestatus] = useState([]);
  const [problemstatus, setproblemstatus] = useState([]);
  const [releasestatus, setReleasestatus] = useState([]);
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
    if (orderTypeSuf === 'trouble') {
      dispatch({
        type: 'relationorder/fetchtrouble',
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
    handleSearch(values.no, values.status, 0, size);
    setPageinations({
      ...paginations,
      current: 1,
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
    querkeyVal('trouble', 'status').then(res => {
      if (res.code === 200) {
        setTroublestatus(res.data.status)
      }
    });
    querkeyVal('problem', 'orderstate').then(res => {
      if (res.code === 200) {
        setproblemstatus(res.data.orderstate)
      }
    })
    querkeyVal('release', 'statu').then(res => {
      if (res.code === 200) {
        setReleasestatus(res.data.statu)
      }
    })
  }, [])

  const columns = [
    {
      title: orderTypeSuf === 'problem' ? '问题单编号' : '故障单编码',
      dataIndex: 'no',
      key: 'no',
      with: 150,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
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
                  {orderTypeSuf === 'trouble' && (
                    <Form.Item label='状态' >
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="请选择" allowClear>
                          {troublestatus && troublestatus.map(obj => (
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
                          {problemstatus && problemstatus.map(obj => (
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
                  <Button style={{ marginLeft: 8 }} onClick={() => { resetFields(); handleSearch() }}>重置</Button>
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
              <Input value={rowrecord.no} />
              <h4 style={{ padding: '8px 0' }}>{title}来源</h4>
              <Input value={rowrecord.source} />
              <h4 style={{ padding: '8px 0' }}>{title}分类</h4>
              <Input value={rowrecord.type} />
              <h4 style={{ padding: '8px 0' }}>建单时间</h4>
              <Input value={rowrecord.addTime} />
              <h4 style={{ padding: '8px 0' }}>{title}标题</h4>
              <Input value={rowrecord.title} />
              <h4 style={{ padding: '8px 0' }}>{title}描述</h4>
              <TextArea
                value={rowrecord.content}
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
          <Button type='primary' onClick={() => handleSave()} style={{ marginRight: 8 }}>保存</Button>
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