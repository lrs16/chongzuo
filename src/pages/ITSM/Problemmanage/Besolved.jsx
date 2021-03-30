import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Table,
  DatePicker,
  Select
} from 'antd';
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

function Besolved(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    dispatch,
    besolveList,
    keyVallist,
    typelist,
    prioritylist,
    stateList,
    loading,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });


  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    //   width: 100,
    //   render: (text, record, index) =>
    //     `${(paginations.current - 1) * paginations.pageSize + (index + 1)}`,
    // },
    {
      title: '问题编号',
      dataIndex: 'no',
      key: 'no',
      render: (text, record) => (
        <Link
          to={{
            pathname: `/ITSM/problemmanage/besolveddetail/workorder/${record.id}`,
            paneKey: record.status, // 传状态
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
      title: '当前处理环节',
      dataIndex: 'currentNode',
      key: 'currentNode',
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '重要程度',
      dataIndex: 'importancecn',
      key: 'importancecn',
    },
  ];
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

  // 当前处理环节
  const getstate = () => {
    const dictModule = 'problem';
    const dictType = 'current';
    getSourceapi(dictModule, dictType);
  }

  const getTobolist = () => {
    dispatch({
      type: 'problemmanage/besolveList',
      payload: {
        pageNum: paginations.current,
        pageSize: paginations.pageSize,
      },
    });
  };

  useEffect(() => {
    getTobolist();
    getSource();
    gettype();
    getpriority();
    getscope();
    getProject();
    getstate();
  }, []);

  const handleReset = () => {
    resetFields();
  };

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'problemmanage/searchBesolve',
      payload: {
        ...values,
        pageSize,
        pageNum: page,
      },
    });
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
        searchdata(values, page, paginations.pageSize);
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
    total: besolveList.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: (page) => changePage(page),
  };

  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const obj = values;
      if (values.registerTime) {
        obj.registerTime = (values.registerTime).format('YYYY-MM-DD HH:mm:ss');
      }
      searchdata(obj, paginations.current, paginations.pageSize);
    });
  };

  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'problemmanage/besolvedownload',
          payload: { ...values }
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
                })(<Input placeholder='请输入' allowClear />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('currentNode', {
                  rules: [
                    {
                      message: '请输入处理环节',
                    },
                  ],
                })(
                  <Select placeholder="请选择" allowClear>
                    {
                      stateList.current && stateList.current.length > 0 && (
                        (stateList.current).map(({ key, val }) => (
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

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="问题标题" >
                    {getFieldDecorator('title', {})(<Input placeholder='请输入' allowClear />)}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="问题来源">
                    {getFieldDecorator('source', {})
                      (
                        <Select placeholder="请选择" allowClear>
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
                        <Select placeholder="请选择" allowClear>
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
                  <Form.Item label="发送人">{getFieldDecorator('registerUser', {})(<Input placeholder='请输入' allowClear />)}</Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="发送时间">
                    {getFieldDecorator('registerTime', {
                    })
                      (<DatePicker allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="重要程度">
                    {getFieldDecorator('importance', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {
                            prioritylist && prioritylist.priority.length && (
                              (prioritylist.priority).map(({ key, val }) => (
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
        {/* <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            onClick={() => download()}
          >导出数据</Button>
        </div> */}

        <Table
          loading={loading}
          columns={columns}
          dataSource={besolveList.rows}
          rowKey={record => record.id}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, problemdropdown, loading }) => ({
    besolveList: problemmanage.besolveList,
    keyVallist: problemdropdown.keyVallist,
    typelist: problemdropdown.typelist,
    prioritylist: problemdropdown.prioritylist,
    scopeList: problemdropdown.scopeList,
    projectList: problemdropdown.projectList,
    stateList: problemdropdown.stateList,
    loading: loading.models.problemmanage,
  }))(Besolved),
);
