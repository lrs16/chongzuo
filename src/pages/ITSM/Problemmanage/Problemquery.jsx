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
let timeoutSearch = '';
let searchSign;
let initialParams = '';
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
    dataIndex: 'importancecn',
    key: 'importancecn',
  },
];

function Besolved(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    location: { query:
      {
        status,
        type,
        handleDeptId,
        timeStatus,
        problem,
        handlerId,
        handleProcessGroupType
      } },
    dispatch,
    queryArr,
    handleList,
    handleArr,
    keyVallist,
    prioritylist,
    scopeList,
    stateList,
    typelist,
    loading,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectedRows, setSelectedRows] = useState([]);
  sign = problem;
  const getQuery = (values, page, pageSize, search) => {
    if (search) {
      dispatch({
        type: 'problemmanage/queryList',
        payload: {
          ...values,
          pageNum: page,
          pageSize: paginations.pageSize,
        },
      });
    } else {
      switch (sign) {
        case undefined:
        case 'class':
        case 'status':
          dispatch({
            type: 'problemmanage/queryList',
            payload: {
              pageNum: initialParams?paginations.current:page,
              pageSize: paginations.pageSize,
              status,
              type,
              timeStatus
            },
          });
          break;
        case 'handle':
          dispatch({
            type: 'problemmanage/handleData',
            payload: {
              pageNum: page,
              pageSize: paginations.pageSize,
              handlerId,
              status,
              handleDeptId,
              handleProcessGroupType
            },
          });
          break;
        case 'timeout':
          dispatch({
            type: 'problemmanage/timeoutData',
            payload: {
              pageNum: page,
              pageSize: paginations.pageSize,
              timeStatus
            },
          });
          break;

        default:
          break;
      }
    }

  };

  const getinitiaQuery = () => {
    if(sign) {
      getQuery();
    } else {
      dispatch({
        type: 'problemmanage/queryList',
        payload: {
          status,
          type,
          timeStatus,
          pageNum: paginations.current,
          pageSize: paginations.pageSize,
        },
      });
    }
    } 

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

  // 问题工单状态
  const getorder = () => {
    const dictModule = 'problem';
    const dictType = 'current';
    getSourceapi(dictModule, dictType);
  }

  useEffect(() => {
    timeoutSearch = '';
    searchSign = '';
    initialParams = 'initialParams';
    getinitiaQuery();
    getSource();
    gettype();
    getpriority();
    getscope();
    getProject();
    getorder();
  }, []);

  const handleReset = () => {
    resetFields();
  };

  //  从统计到查询进行查询后分页的数据，清空数据
  const emptyData = (values, page, pageSize, search) => {
    dispatch({
      type: 'problemmanage/queryList',
      payload: {
        ...values,
        pageNum: page,
        pageSize: paginations.pageSize
      },
    });
  }
  const searchdata = (values, page, pageSize, search) => {
    initialParams = '';
    if(search) {
      searchSign = 'searchSign';
    }

    if (sign === 'timeout' && search === 'search') {
      timeoutSearch = 'search';
    }

    if (sign === 'handle' && search === 'search') {
      timeoutSearch = 'search';
    }

    if (searchSign) {
      emptyData(values, page, pageSize, search);
    } else {
      switch (sign) {
        case undefined:
        case 'timeout':
        case 'class':
        case 'status':
        case 'handle':
          getQuery(values, page, pageSize, search);
          break;
        default:
          break;
      }
    }

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

  const changePage = (page) => {
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


  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: (sign === 'timeout' && timeoutSearch === '') ? handleList.length : queryArr.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: (page) => changePage(page),
  };

  const handlepagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: handleArr.length,
    showTotal: total => `总共  ${total}条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = (search) => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const obj = values;
      if (values.createTimeBegin) {
        obj.createTimeBegin = (values.createTimeBegin).format('YYYY-MM-DD HH:mm:ss');
      }
      searchdata(obj, paginations.current, paginations.pageSize, search);
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
                })(<Input placeholder='请输入' />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="工单状态">
                {getFieldDecorator('currentNode',
                  {},
                )(
                  <Select placeholder="请选择">
                    {
                      stateList.current && stateList.current.length && (
                        (stateList.current).map(({ key, val }, index) => (
                          <Option key={index} value={val}>
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
                    {getFieldDecorator('title', {})(<Input placeholder='请输入' />)}
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
                              <Option key={key} value={key}>
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
                                <Option key={key} value={key}>
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
                              <Option key={key} value={key}>
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
                      <Input placeholder='请输入' />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="处理单位">
                    {getFieldDecorator(
                      'handleUnit',
                      {},
                    )(
                      <Input placeholder='请输入' />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送人">
                    {getFieldDecorator(
                      'registerUser',
                      {},
                    )(
                      <Input placeholder='请输入' />
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
                              <Option key={key} value={key}>
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
                <Button type="primary" onClick={() => handleSearch('search')}>
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
                <Button type="primary" onClick={() => handleSearch('search')}>
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

        {/* {
          (problem !== undefined) && (
            <Table
              loading={loading}
              columns={columns}
              dataSource={handleList}
              rowKey={record => record.id}
              pagination={handlepagination}
            />
          )
        } */}

        {/* { */}
        {
          (sign === 'timeout' || sign === 'class' || sign === 'status' || sign === undefined || timeoutSearch === ' timeoutSearch' || (sign === 'handle' && timeoutSearch === 'search')) && (
            <Table
              loading={loading}
              columns={columns}
              dataSource={(sign === 'timeout') ? handleArr : queryArr.rows}
              rowKey={record => record.id}
              pagination={pagination}
            />
          )
        }



        {
          (sign === 'handle' && timeoutSearch === '') && (
            <Table
              loading={loading}
              columns={columns}
              dataSource={handleArr}
              rowKey={record => record.id}
              pagination={handlepagination}
            />
          )
        }

        {/* // ) */}
        {/* } */}




      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, problemdropdown, loading }) => ({
    queryArr: problemmanage.queryArr,
    handleList: problemmanage.handleList,
    handleArr: problemmanage.handleArr,
    keyVallist: problemdropdown.keyVallist,
    typelist: problemdropdown.typelist,
    prioritylist: problemdropdown.prioritylist,
    scopeList: problemdropdown.scopeList,
    projectList: problemdropdown.projectList,
    stateList: problemdropdown.stateList,
    loading: loading.models.problemmanage,
  }))(Besolved),
);
