import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Table, Row, Col, Input, Form, Select, Layout } from 'antd';
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
    assessNo,
    title,
    visible,
    orderIdPre,
    orderTypePre,
    orderTypeSuf,
    ChangeVisible,
    orderlist,
    loading
  } = props;

  const {
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
    }, } = props;
  const [eventstatus, setEventstatus] = useState([]);
  const [troublestatus, setTroublestatus] = useState([]);
  const [problemstatus, setproblemstatus] = useState([]);
  const [demandstatus, setdemandstatus] = useState([]);
  const [releasestatus, setReleasestatus] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginations, setPaginating] = useState({ current: 1, pageSize: 15 });
  const [collapsed, setCollapsed] = useState(false);
  const [rowrecord, setRowRecord] = useState({});
  const [selectRecord, setSelectRecord] = useState([]);
  const [newcolumn, setNewcolumn] = useState([]);

  const onSelectChange = (RowKeys, selectrecord) => {
    setSelectedRowKeys(RowKeys);
    setSelectRecord(selectrecord)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSave = () => {
    switch (orderTypeSuf) {
      case 'event':
      case 'trouble':
      case 'problem':
      case 'demand':
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
        break;
      case 'release': {
        const arryNew = [];
        selectRecord.map((item) => {
          arryNew.push({ ...item, assessNo, orderType: 'FB', relationType: '2', title: '????????????????????????????????????' })
        })
        const result = JSON.parse(JSON.stringify(arryNew).replace(/releaseNo/g, "orderNo"));
        return dispatch({
          type: 'relationorder/saveelease',
          payload: result,
        }).then(res => {
          if (res.code === 200) {
            dispatch({
              type: 'relationorder/relesefetcht',
              payload: { assessNo, orderType: 'FB' }
            })
          }
        })
      }
      default:
        break;
    }
    return []
  }

  const hanldleCancel = () => {
    ChangeVisible(false)
  };

  const handleSearch = (no, status, pageIndex, pageSize) => {
    switch (orderTypeSuf) {
      case 'event':
        dispatch({
          type: 'relationorder/fetchevent',
          payload: { no, status: status === undefined ? '' : status, pageIndex:pageIndex-1, pageSize },
        })
        break;
      case 'trouble':
        dispatch({
          type: 'relationorder/fetchtrouble',
          payload: { no, status, pageIndex:pageIndex-1, pageSize },
        })
        break;
      case 'problem':
        dispatch({
          type: 'relationorder/fetchproblem',
          payload: { no, status, pageIndex:pageIndex-1, pageSize },
        })
        break;
      case 'release':
        dispatch({
          type: 'relationorder/fetchrelease',
          payload: { no, status:status === undefined ? '' : status, pageIndex:pageIndex-1, pageSize },
        })
        break;
      case 'demand':
        dispatch({
          type: 'relationorder/fetchDemandList',
          payload: { no, status, pageIndex:pageIndex-1, pageSize },
        })
        break;
      default:
        break;
    }
  }

  const handleSumit = () => {
    const values = getFieldsValue();
    handleSearch(values.no, values.status, 1, 15);
  }

  const onShowSizeChange = (page, size) => {
    const values = getFieldsValue();
    handleSearch(values.no, values.status || '', page, size);
    setPaginating({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    const values = getFieldsValue();
    handleSearch(values.no, values.status || '', page, paginations.pageSize);
    setPaginating({
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
    showTotal: total => `??????  ${total}  ?????????`,
    onChange: page => changePage(page),
  };

  useEffect(() => {
    handleSearch('', '', 1, 15)
  }, [orderTypeSuf])

  useEffect(() => {
    querkeyVal('event', 'status').then(res => {
      if (res.code === 200) {
        setEventstatus(res.data.status)
      }
    });
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
    });
    querkeyVal('demand', 'status').then(res => {
      if (res.code === 200) {
        setdemandstatus(res.data.status)
      }
    });
  }, [])

  let notype;
  let indexType;
  let currentStatus;
  switch (orderTypeSuf) {
    case 'event':
      notype = '?????????';
      indexType = 'eventNo';
      currentStatus = 'flowNodeName'
      break;
    case 'trouble':
      notype = '?????????';
      indexType = 'no';
      currentStatus = 'flowNodeName'
      break;
    case 'problem':
      notype = '?????????';
      indexType = 'no';
      currentStatus = 'flowNodeName'
      break;
    case 'demand':
      notype = '?????????';
      indexType = 'demandId';
      currentStatus = 'flowNodeName'
      break;
    case 'release':
      notype = '?????????';
      indexType = 'releaseNo';
      // titleType = '????????????';
      currentStatus = 'releaseStatus';
      break;
    default:
      break;
  }

  const columns = [
    {
      title: `${notype}??????`,
      dataIndex: indexType,
      key: indexType,
    },
    {
      title: `${orderTypeSuf === 'release' ? '????????????' : '??????'}`,
      dataIndex: `${orderTypeSuf === 'release' ? 'releaseType' : 'title'}`,
      key: `${orderTypeSuf === 'release' ? 'releaseType' : 'title'}`,
    },
    {
      title: '??????',
      dataIndex: currentStatus,
      key: currentStatus,
    },
  ];

  return (
    <>
      <Drawer
        title={`??????${title}???`}
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
                  <Form.Item label={`${title}??????`} >
                    {getFieldDecorator('no', {
                      initialValue: '',
                    })(
                      <Input placeholder="?????????" allowClear />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  {orderTypeSuf === 'event' && (
                    <Form.Item label='??????' >
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="?????????" allowClear>
                          {eventstatus.map(obj => (
                            <Option key={obj.key} value={obj.val}>
                              {obj.val}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  )}

                  {orderTypeSuf === 'trouble' && (
                    <Form.Item label='??????' >
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="?????????" allowClear>
                          {troublestatus.map(obj => (
                            <Option key={obj.key} value={obj.val}>
                              {obj.val}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  )}

                  {orderTypeSuf === 'problem' && (
                    <Form.Item label='??????' >
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="?????????" allowClear>
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
                    <Form.Item label='??????' >
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="?????????" allowClear>
                          {releasestatus.map(obj => (
                            <Option key={obj.key} value={obj.val}>
                              {obj.val}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  )}

                  {orderTypeSuf === 'demand' && (
                    <Form.Item label='??????' >
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="?????????" allowClear>
                          {demandstatus.map(obj => (
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
                  <Button type='primary' style={{ marginLeft: 16 }} onClick={() => handleSumit()} >??????</Button>
                  <Button style={{ marginLeft: 8 }} onClick={() => { resetFields(); handleSearch('', '', 1, 15) }}>??????</Button>
                </Col>
              </Form>
            </Row>

            <Table
              loading={loading}
              columns={columns}
              dataSource={orderlist.rows || orderlist.records}
              rowKey={r => {
                if (orderTypeSuf === 'demand') {
                  return r.processId
                }
                if (orderTypeSuf !== 'demand') {
                  return r.id
                }
              }}
              rowSelection={rowSelection}
              pagination={pagination}
              onRow={record => {
                return {
                  onClick: () => { setRowRecord(record) }, // ?????????
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
            <h3 style={{ background: '#f8f8f8', padding: 20, border: '1px solid #e8e8e8', borderLeft: 0 }}>????????????</h3>
            <div style={{ padding: '8px 0 0 24px' }}>
              <h4 style={{ padding: '8px 0' }}>{title}??????</h4>
              <Input value={rowrecord.no || rowrecord.releaseNo || rowrecord.eventNo || rowrecord.demandId} />
              <h4 style={{ padding: '8px 0' }}>{title}??????</h4>
              <Input value={rowrecord.source || rowrecord.eventSource || rowrecord.dataSource || rowrecord.releaseType} />
              <h4 style={{ padding: '8px 0' }}>{title}??????</h4>
              <Input value={rowrecord.type || rowrecord.eventType || rowrecord.demandType || rowrecord.releaseStatus} />
              <h4 style={{ padding: '8px 0' }}>????????????</h4>
              <Input value={rowrecord.addTime || rowrecord.sendTime || rowrecord.creationTime || rowrecord.ctime} />
              <h4 style={{ padding: '8px 0' }}>{title}??????</h4>
              <Input value={rowrecord.title} />
              <h4 style={{ padding: '8px 0' }}>{title}??????</h4>
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
          <Button type='primary' onClick={() => handleSave()} style={{ marginRight: 8 }} disabled={selectedRowKeys.length === 0}>??????</Button>
          <Button onClick={() => hanldleCancel()} style={{ marginRight: 8 }}>??????</Button>
        </div>
      </Drawer>
    </>
  );
}

export default Form.create({})(connect(({ relationorder, loading }) => ({
  orderlist: relationorder.order,
  loading: loading.models.relationorder,
}))(RelationDrawer));