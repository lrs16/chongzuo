import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, Badge, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { Option } = Select;

const statemap = [
  { key: '0', value: '事件登记' },
  { key: '1', value: '事件处理' },
  { key: '2', value: '事件回访' },
];

const sourcemap = [
  { key: '0', value: '用户电话申告' },
  { key: '1', value: '企信' },
];

const levelmap = [
  { key: '0', value: '高' },
  { key: '1', value: '中' },
  { key: '1', value: '低' },
];

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

const columns = [
  {
    title: '事件编号',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    fixed: 'left',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/eventmanage/query/details`,
          query: {
            pangekey: record.state,
            id: record.id,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '建单时间',
    dataIndex: 'creationtime',
    key: 'creationtime',
    fixed: 'left',
    width: 150,
  },
  {
    title: '工单状态',
    dataIndex: 'state',
    key: 'state',
    fixed: 'left',
    width: 100,
    render: (text, record) => {
      const textmaps = [
        '待登记',
        '已登记',
        '已派单待处理',
        '处理中',
        '已处理待回访',
        '已回访',
        '重分派',
        '已关闭',
      ];
      return <>{textmaps[record.state]}</>;
    },
  },
  {
    title: '申报人',
    dataIndex: 'Declarant',
    key: 'Declarant',
    fixed: 'left',
    width: 100,
  },
  {
    title: '申报人单位',
    dataIndex: 'Declarantunit',
    key: 'Declarantunit',
    width: 200,
  },
  {
    title: '申报人部门',
    dataIndex: 'Declarantdep',
    key: 'Declarantdep',
    width: 200,
  },
  {
    title: '事件分类',
    dataIndex: 'type',
    key: 'type',
    width: 80,
  },
  {
    title: '事件对象',
    dataIndex: 'eventobjects',
    key: 'eventobjects',
    width: 80,
  },
  {
    title: '标签',
    dataIndex: 'eventobject',
    key: 'eventobject',
    width: 150,
    render: (text, record) => {
      const tags = ['标签1', '标签2', '标签3'];
      return (
        <>
          {tags.map(obj => (
            <Tag color="#108ee9" style={{ margin: 2 }}>
              {obj}
            </Tag>
          ))}
        </>
      );
    },
  },
  {
    title: '回访方式',
    dataIndex: 'level1',
    key: 'level1',
    width: 100,
  },
  {
    title: '事件来源',
    dataIndex: 'level2',
    key: 'level2',
    width: 100,
  },
  {
    title: '工单状态',
    dataIndex: 'level3',
    key: 'level3',
    width: 100,
  },
  {
    title: '影响度',
    dataIndex: 'level4',
    key: 'level4',
    width: 100,
  },
];

function QueryList(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    loading,
    list,
    dispatch,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'eventquery/fetchlist',
          payload: {
            ...values,
            current: paginations.current,
            pageSize: paginations.pageSize,
          },
        });
      }
    });
  }, []);

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'eventquery/fetchlist',
      payload: {
        ...values,
        pageSize: size,
        current: page,
      },
    });
  };

  const onShowSizeChange = (page, size) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, size);
      }
    });
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
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

  const handleSearch = () => {
    setPageinations({
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

  const handleReset = () => {
    resetFields();
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="事件编号">
                {getFieldDecorator('form1', {})(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="事件标题">
                    {getFieldDecorator('form2', {})(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="事件来源">
                    {getFieldDecorator(
                      'form3',
                      {},
                    )(
                      <Select placeholder="请选择">
                        {sourcemap.map(({ key, value }) => (
                          <Option key={key} value={key}>
                            {value}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={8}>
              <Form.Item label="工单状态">
                {getFieldDecorator(
                  'form4',
                  {},
                )(
                  <Select placeholder="请选择">
                    {statemap.map(({ key, value }) => (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="填报人">
                    {getFieldDecorator('form5', {})(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="处理人">
                    {getFieldDecorator('form6', {})(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发送时间">
                    {getFieldDecorator('contenttime')(<DatePicker showTime />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="优先级">
                    {getFieldDecorator('lasttime')(
                      <Select placeholder="请选择">
                        {levelmap.map(({ key, value }) => (
                          <Option key={key} value={key}>
                            {value}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </>
            )}
            {expand === false && (
              <Col span={8}>
                <Form.Item>
                  <Button type="primary" onClick={handleSearch}>
                    查 询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                    重 置
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
                        关 闭 <UpOutlined />
                      </>
                    ) : (
                      <>
                        展 开 <DownOutlined />
                      </>
                    )}
                  </Button>
                </Form.Item>
              </Col>
            )}
            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重 置
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
                      关 闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展 开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary">导出数据</Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.data}
          scroll={{ x: 1800 }}
          rowKey={record => record.id}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ eventquery, loading }) => ({
    list: eventquery.list,
    loading: loading.models.eventquery,
  }))(QueryList),
);
