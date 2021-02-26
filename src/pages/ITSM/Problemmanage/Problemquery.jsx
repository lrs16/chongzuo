import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Form, Card, Input, Button, Row, Col, Table, Select, DatePicker } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const { Option } = Select;
let sign = '';
const columns = [
  {
    title: '问题编号',
    dataIndex: 'no',
    key: 'no',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/ITSM/problemmanage/querydetail/${record.id}/queryworkdetail`,
          query: {
            taskName: record.statuscn,
          }
        }}
      >
        {text}
      </Link>
    ),
  },
  {
    title: '问题标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '问题来源',
    dataIndex: 'sourcecn',
    key: 'sourcecn',
  },
  {
    title: '问题分类',
    dataIndex: 'typecn',
    key: 'typecn',
  },
  {
    title: '工单状态',
    dataIndex: 'statuscn',
    key: 'statuscn',
  },
  {
    title: '影响范围',
    dataIndex: 'registerScopecn',
    key: 'registerScopecn',
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    key: 'handler',
  },
  {
    title: '处理单位',
    dataIndex: 'handleUnit',
    key: 'handleUnit',
  },
  {
    title: '发送时间',
    dataIndex: 'registerTime',
    key: 'registerTime',
    render: text => {
      return <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>;
    }
  },
  {
    title: '重要程度',
    dataIndex: 'importance',
    key: 'importance',
  },
];

function Besolved(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    location:{ query: { orderStatus,orderClass,handleStatu,timeStatus } },
    dispatch,
    besolveList,
    handleList,
    keyVallist,
    prioritylist,
    scopeList,
    orderList,
    typelist,
    loading,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectedRows, setSelectedRows] = useState([]);
  let handleStatus;
  if( sign === 'have') {
    handleStatus = undefined;
  } else {
    handleStatus = handleStatu;
  }
  const getQuery = () => {
    dispatch({
      type: (handleStatus !== undefined) ? 'problemmanage/handlequeryList':'problemmanage/queryList',
      payload: {
        handleStatus,
        pageNum: paginations.current,
        pageSize: paginations.pageSize,
        status:orderStatus,
        type:orderClass,
        timeStatus
      },
    });
  };

  const getSourceapi = (dictModule, dictType) => {
    dispatch({
      type: 'problemdropdown/keyvalsource',
      payload: { dictModule, dictType }
    });
  }
  //  问题来源
  const getSource = () => {
    const dictModule = 'problem';
    const dictType = 'source';
    getSourceapi(dictModule, dictType);
  }
  //  问题分类
  const gettype = () => {
    const dictModule = 'problem';
    const dictType = 'type';
    getSourceapi(dictModule, dictType);
  }
  //  重要程度
  const getpriority = () => {
    const dictModule = 'public';
    const dictType = 'priority';
    getSourceapi(dictModule, dictType);
  }
  //  影响范围
  const getscope = () => {
    const dictModule = 'public';
    const dictType = 'effect';
    getSourceapi(dictModule, dictType);
  }

  // 所属项目
  const getProject = () => {
    const dictModule = 'public';
    const dictType = 'project';
    getSourceapi(dictModule, dictType);
  }


  // 问题工单
  const getorder = () => {
    const dictModule = 'problem';
    const dictType = 'orderstate';
    getSourceapi(dictModule, dictType);
  }

  useEffect(() => {
    getList();
    getSource();
    gettype();
    getpriority();
    getscope();
    getProject();
    getorder();
  }, []);

  const getList = () => {
    switch (handleStatus) {
      case '1':
      case '0':
        getQuery();
        break;
      default:
        getQuery();
        break;
    }
  }

  const handleReset = () => {
    resetFields();
  };

  const searchdata = (values, page, pageSize) => {
    sign = 'have' 
    handleStatus = undefined;
    return dispatch({
      type:(handleStatus !== undefined) ? 'problemmanage/handlequeryList':'problemmanage/queryList',
      payload: {
        handleStatus,
        ...values,
        pageSize,
        pageNum: page,
        status:orderStatus,
        type:orderClass
      },
    })
  };

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPaginations({
      ...paginations,
      pageSize,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page,paginations.pageSize);
      }
    });
    setPaginations({
      ...paginations,
      current: page,
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, select) => {
      setSelectedRows(select);
    },
  };


  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: besolveList.total,
    onChange: page => changePage(page),
  };

  const handlepagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: handleList.length,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      const obj = values;
      if (values.createTimeBegin) {
        obj.createTimeBegin = (values.createTimeBegin).format('YYYY-MM-DD HH:mm:ss');
      }
      if (err) {
        return;
      }
      searchdata(obj, paginations.current, paginations.pageSize);
    });
  };

  const download = () => {
    validateFields((err, values) => {
      const selectList = [];
      if (selectedRows.length) {
        selectedRows.forEach(function (item) {
          selectList.push(item.id);
        })
      }
      const downparams = values;
      (downparams.registerUserId) = selectList.toString();

      if (values.createTimeBegin) {
        downparams.createTimeBegin = (values.createTimeBegin).format('YYYY-MM-DD')
      }
      if (!err) {
        dispatch({
          type: 'problemmanage/eventdownload',
          payload: { ...downparams }
        }).then(res => {
          const filename = `下载.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      }
    })
  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="问题编号">
                {getFieldDecorator('no', {
                  rules: [
                    {
                      message: '请输入问题编号',
                    },
                  ],
                })(<Input placeholder='请输入'/>)}
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={8}>
              <Form.Item label="工单状态">
                {getFieldDecorator(
                  'status',
                  {},
                )(
                  <Select placeholder="请选择">
                    {
                      orderList.orderstate && orderList.orderstate.length && (
                        (orderList.orderstate).map(({ key, val }, index) => (
                          <Option key={index} value={key}>
                            {val}
                          </Option>
                        ))
                      )
                    }
                  </Select>,
                )}
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="问题标题">
                    {getFieldDecorator('title', {})(<Input placeholder='请输入'/>)}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="问题来源">
                    {getFieldDecorator(
                      'source',
                      {},
                    )(
                      <Select placeholder="请选择">
                        {
                          keyVallist && keyVallist.source.length && (
                            (keyVallist.source).map(({ key, val }) => (
                              <Option key={key} value={val}>
                                {val}
                              </Option>
                            ))
                          )
                        }
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="问题分类">
                    {getFieldDecorator('type', {})
                      (
                        <Select placeholder="请选择">
                          {
                            typelist && typelist.type.length && (
                              (typelist.type).map(({ key, val }) => (
                                <Option key={key} value={val}>
                                  {val}
                                </Option>
                              ))
                            )
                          }
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="影响范围">{getFieldDecorator('registerScope', {})
                    (
                      <Select placeholder="请选择">
                        {
                          scopeList && scopeList.effect.length && (
                            (scopeList.effect).map(({ key, val }) => (
                              <Option key={key} value={val}>
                                {val}
                              </Option>
                            ))
                          )
                        }
                      </Select>,
                    )}</Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="处理人">
                    {getFieldDecorator(
                      'handler',
                      {},
                    )(
                      <Input placeholder='请输入'/>
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="处理单位">
                    {getFieldDecorator(
                      'handleUnit',
                      {},
                    )(
                      <Input placeholder='请输入'/>
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送人">
                    {getFieldDecorator(
                      'registerUser',
                      {},
                    )(
                      <Input placeholder='请输入'/>
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送时间">
                    {getFieldDecorator(
                      'createTimeBegin',
                      {},
                    )(
                      <DatePicker />
                    )}
                  </Form.Item>
                </Col>


                <Col span={8}>
                  <Form.Item label='重要程度'>
                    {getFieldDecorator(
                      'importance',
                      {},
                    )(
                      <Select placeholder="请选择">
                        {
                          prioritylist && prioritylist.priority.length && (
                            prioritylist.priority.map(({ key, val }) => (
                              <Option key={key} value={val}>
                                {val}
                              </Option>
                            ))
                          )
                        }
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
              </>
            )}

            {expand === false && (
              <Col span={8}>
                <Button type="primary" onClick={handleSearch}>
                  查询
                </Button>

                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重置
                </Button>

                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      关闭 <UpOutlined />
                    </>
                  ) : (
                      <>
                        展开 <DownOutlined />
                      </>
                    )}
                </Button>
              </Col>
            )}

            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重置
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      关闭 <UpOutlined />
                    </>
                  ) : (
                      <>
                        展开 <DownOutlined />
                      </>
                    )}
                </Button>
              </Col>
            )}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            onClick={() => download()}
          >导出数据</Button>
        </div>

        {
          (handleStatus !== undefined ) && (
            <Table
            loading={loading}
            columns={columns}
            dataSource={handleList}
            rowKey={record => record.id}
            pagination={handlepagination}
            rowSelection={rowSelection}
          />
          )
        }

        {
          handleStatus === undefined && (
            <Table
            loading={loading}
            columns={columns}
            dataSource={besolveList.rows}
            rowKey={record => record.id}
            pagination={pagination}
            rowSelection={rowSelection}
          />
          )
        }

      

      
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, problemdropdown, loading }) => ({
    besolveList: problemmanage.besolveList,
    handleList: problemmanage.handleList,
    keyVallist: problemdropdown.keyVallist,
    typelist: problemdropdown.typelist,
    prioritylist: problemdropdown.prioritylist,
    scopeList: problemdropdown.scopeList,
    projectList: problemdropdown.projectList,
    orderList: problemdropdown.orderList,
    loading: loading.models.problemmanage,
  }))(Besolved),
);
