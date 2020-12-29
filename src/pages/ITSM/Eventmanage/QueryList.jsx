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
// 事件来源
const sourcemaps = new Map([
  ['001', '用户电话申告'],
  ['002', '企信'],
]);
// 事件分类
const typemap = new Map([
  ['001', '咨询'],
  ['002', '缺陷'],
  ['003', '故障'],
  ['004', '数据处理'],
  ['005', '账号权限'],
  ['006', '其它'],
]);

// 回访方式
const revisitwaymap = new Map([
  ['001', '企信回访'],
  ['002', '电话回访'],
  ['003', '短信回访'],
  ['004', '邮箱回访'],
]);
// 事件对象
const objectmap = new Map([
  ['001', '配网采集'],
  ['002', '主网采集'],
  ['003', '终端掉线'],
  ['004', '配网档案'],
  ['005', '实用化指标'],
  ['006', '账号缺陷'],
]);
// 影响、紧急度
const degreemap = new Map([
  ['001', '低'],
  ['002', '中'],
  ['003', '高'],
  ['004', '紧急'],
]);

const columns = [
  {
    title: '事件编号',
    dataIndex: 'event_no',
    key: 'event_no',
    width: 150,
    fixed: 'left',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/eventmanage/query/details`,
          query: {
            id: record.task_id,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '事件标题',
    dataIndex: 'title',
    key: 'title',
    fixed: 'left',
    width: 200,
  },
  {
    title: '建单时间',
    dataIndex: 'add_time',
    key: 'add_time',
    fixed: 'left',
    width: 200,
  },
  {
    title: '工单状态',
    dataIndex: 'event_status',
    key: 'event_status',
    fixed: 'left',
    width: 100,
    render: (text, record) => {
      const textmaps = new Map([
        ['1', '已登记'],
        ['2', '待审核'],
        ['3', '审核中'],
        ['4', '待处理'],
        ['5', '处理中'],
        ['6', '待确认'],
        ['7', '确认中'],
        ['8', '重分派'],
        ['9', '已关闭'],
      ]);
      return <>{textmaps.get(record.event_status)}</>;
    },
  },
  {
    title: '申报人',
    dataIndex: 'application_user',
    key: 'application_user',
    fixed: 'left',
    width: 100,
  },
  {
    title: '申报人单位',
    dataIndex: 'application_unit',
    key: 'application_unit',
    width: 200,
  },
  {
    title: '申报人部门',
    dataIndex: 'application_dept',
    key: 'application_dept',
    width: 200,
  },
  {
    title: '事件分类',
    dataIndex: 'event_type',
    key: 'event_type',
    width: 80,
    render: (text, record) => {
      return <>{typemap.get(record.event_type)}</>;
    },
  },
  {
    title: '事件对象',
    dataIndex: 'event_object',
    key: 'event_object',
    width: 80,
    render: (text, record) => {
      return <>{objectmap.get(record.event_object)}</>;
    },
  },
  // {
  //   title: '标签',
  //   dataIndex: 'eventobject',
  //   key: 'eventobject',
  //   width: 150,
  //   render: (text, record) => {
  //     const tags = ['标签1', '标签2', '标签3'];
  //     return (
  //       <>
  //         {tags.map(obj => (
  //           <Tag color="#108ee9" style={{ margin: 2 }}>
  //             {obj}
  //           </Tag>
  //         ))}
  //       </>
  //     );
  //   },
  // },
  {
    title: '回访方式',
    dataIndex: 'revisit_way',
    key: 'revisit_way',
    width: 100,
    render: (text, record) => {
      return <>{revisitwaymap.get(record.revisit_way)}</>;
    },
  },
  {
    title: '事件来源',
    dataIndex: 'event_source',
    key: 'event_source',
    width: 150,
    render: (text, record) => {
      return <>{sourcemaps.get(record.event_source)}</>;
    },
  },
  {
    title: '影响度',
    dataIndex: 'event_effect',
    key: 'event_effect',
    width: 80,
    render: (text, record) => {
      return <>{degreemap.get(record.event_effect)}</>;
    },
  },
  {
    title: '优先级',
    dataIndex: 'event_prior',
    key: 'event_prior',
    width: 80,
    render: (text, record) => {
      return <>{degreemap.get(record.event_prior)}</>;
    },
  },
  {
    title: '紧急度',
    dataIndex: 'event_emergent',
    key: 'event_emergent',
    width: 80,
    render: (text, record) => {
      return <>{degreemap.get(record.event_emergent)}</>;
    },
  },
  {
    title: '登记人',
    dataIndex: 'register_user',
    key: 'register_user',
    width: 80,
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    key: 'handler',
    width: 80,
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
  const [paginations, setPageinations] = useState({ current: 0, pageSize: 10 });
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'eventquery/fetchlist',
          payload: {
            ...values,
            pageIndex: paginations.current,
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
        pageIndex: page,
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
                {getFieldDecorator('eventNo', {
                  initialValue: '',
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="事件标题">
                    {getFieldDecorator('eventTitle', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="事件来源">
                    {getFieldDecorator('eventSource', {
                      initialValue: '',
                    })(
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
                {getFieldDecorator('eventStatus', {
                  initialValue: '',
                })(
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
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="申报人">
                    {getFieldDecorator('applicationUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                {/* <Col span={8}>
                  <Form.Item label="发送时间">
                    {getFieldDecorator('contenttime')(<DatePicker showTime />)}
                  </Form.Item>
                </Col> */}
                <Col span={8}>
                  <Form.Item label="优先级">
                    {getFieldDecorator('eventPrior', {
                      initialValue: '',
                    })(
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
          dataSource={list.rows}
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
