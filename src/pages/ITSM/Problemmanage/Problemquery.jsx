import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Form, Card, Input, Button, Row, Col, Table, Select, message } from 'antd';
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
const columns = [
  {
    title: '问题编号',
    dataIndex: 'no',
    key: 'no',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/ITSM/problemmanage/querydetail/${record.id}/queryworkdetail`,
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
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: '问题分类',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '工单状态',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '影响范围',
    dataIndex: 'registerScope',
    key: 'registerScope',
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
    title: '发送人',
    dataIndex: 'sender',
    key: 'Sender',
  },
];

function Besolved(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    dispatch,
    besolveList,
    loading,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });

  const getQuery = () => {
    dispatch({
      type: 'problemmanage/queryList',
      payload: {
        // ...values,
        current: paginations.current,
        pageSize: paginations.pageSize,
      },
    });
  };

  useEffect(() => {
    getQuery();
  }, []);

  const handleReset = () => {
    resetFields();
  };

  const searchdata = (values, page, pageSize) => {
    return dispatch({
      type: 'problemmanage/queryList',
      payload: {
        values,
        pageSize,
        current: page,
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

  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(selectedRows);
  //     setSelectedRows(selectedRows);
  //   },
  // };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total:besolveList.total,
    onChange: page => changePage(page),
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
      searchdata(values, paginations.current, paginations.pageSize);
    });
  };

  const download = () => {
    validateFields((err,values) => {
      if(!err) {
        dispatch({
          type:'problemmanage/eventdownload',
          payload:{...values}
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
                })(<Input />)}
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={8}>
              <Form.Item label="工单状态">
                {getFieldDecorator(
                  'status',
                  {},
                )(
                  <Select>
                    <Option value="问题登记">问题登记</Option>
                    <Option value="问题审核">问题审核</Option>
                    <Option value="问题处理">问题处理</Option>
                    <Option value="问题确认">问题确认</Option>
                    <Option value="确认会签">确认会签</Option>
                    <Option value="问题关闭">问题关闭</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="问题标题">
                    {getFieldDecorator('title', {})(<Input />)}
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
                      <Select>
                        <Option value="重复性分析事件">重复性分析事件</Option>
                        <Option value="事件升级">事件升级</Option>
                        <Option value="巡检发现">巡检发现</Option>
                        <Option value="系统监控发现">系统监控发现</Option>
                        <Option value="其他">其他</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="问题分类">{getFieldDecorator('type', {})
                  ( <Select>
                    <Option value="功能问题">功能问题</Option>
                    <Option value="程序问题">程序问题</Option>
                  </Select>,)}</Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="影响范围">{getFieldDecorator('type', {})
                  ( <Select>
                    <Option value="功能问题">功能问题</Option>
                    <Option value="程序问题">程序问题</Option>
                  </Select>,)}</Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="处理人">
                    {getFieldDecorator(
                      'registerUser',
                      {},
                    )(
                      <Input />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="处理单位">
                    {getFieldDecorator(
                      'handleUnit',
                      {},
                    )(
                      <Input />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送人">
                    {getFieldDecorator(
                      'sender',
                      {},
                    )(
                      <Input />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送时间">
                    {getFieldDecorator(
                      'sender',
                      {},
                    )(
                      <Input />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label='重要程度'>
                    {getFieldDecorator(
                      'sender',
                      {},
                    )(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="创建时间">
                    {getFieldDecorator('createTimeBegin', {})(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="优先级">
                    {getFieldDecorator(
                      'priority',
                      {},
                    )(
                      <Select>
                        <Option value="高">高</Option>
                        <Option value="中">中</Option>
                        <Option value="低">低</Option>
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
        <div style={{ marginBottom: 24 }}>
          <Button 
            type="primary"
            onClick={() => download()}
            >导出数据</Button>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={besolveList.rows}
          rowKey={record => record.id}
          pagination={pagination}
          // rowSelection={rowSelection}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    besolveList: problemmanage.besolveList,
    // html: problemmanage.html,
    loading: loading.models.problemmanage,
  }))(Besolved),
);
