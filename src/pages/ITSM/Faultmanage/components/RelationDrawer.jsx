import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Table, Row, Col, Input, Form, Select } from 'antd';
import { querkeyVal } from '@/services/api'

const { Option } = Select;

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
    SaveRefresh,
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

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
    // 保存成功刷新列表
    SaveRefresh()
  }

  const hanldleCancel = () => {
    ChangeVisible(false)
  };

  const handleSearch = (no, status, pageIndex, pageSize) => {
    if (orderTypeSuf === 'event') {
      dispatch({
        type: 'relationorder/fetchevent',
        payload: { no, status, pageIndex, pageSize },
      })
    };
    if (orderTypeSuf === 'problem') {
      dispatch({
        type: 'relationorder/fetchproblem',
        payload: { no, status, pageIndex, pageSize },
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
    querkeyVal('problem', 'status').then(res => {
      if (res.code === 200) {
        setproblemstatus(res.data.status)
      }
    })
  }, [])

  const columns = [
    {
      title: orderTypeSuf === 'problem' ? '问题单编号' : '故障单编码',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
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
        title={title}
        width={700}
        onClose={hanldleCancel}
        visible={visible}
        bodyStyle={{ paddingBottom: 60 }}
        destroyOnClose
      >
        <Row>
          <Form {...formItemLayout}>
            <Col span={10}>
              <Form.Item label='工单编号' >
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
        />
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