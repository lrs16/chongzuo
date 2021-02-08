import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import KeyVal from '@/components/SysDict/KeyVal';

const { Option } = Select;

const statemap = [
  { key: '0', value: '需求登记' },
  { key: '1', value: '业务科室领导审核' },
  { key: '2', value: '系统开发商审核' },
  { key: '3', value: '自动化科专责审核' },
  { key: '4', value: '自动化科业务人员审核' },
  { key: '5', value: '市场部领导审核' },
  { key: '6', value: '科室领导审核' },
  { key: '7', value: '市场部领导审核' },
  { key: '8', value: '科室领导审核' },
  { key: '9', value: '系统开发商处理' },
  { key: '10', value: '自动化科负责人确认' },
  { key: '11', value: '需求登记人员确认' },
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
    title: '需求编号',
    dataIndex: 'demandId',
    key: 'demandId',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/demandmanage/to-do/record/workorder`,
          query: {
            taskName: record.taskName,
            taskId: record.taskId,
            mainId: record.processInstanceId,
            result: '1',
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '需求标题',
    dataIndex: 'demandTitle',
    key: 'demandTitle',
  },
  {
    title: '需求类型',
    dataIndex: 'demandType',
    key: 'demandType',
  },
  {
    title: '功能模块',
    dataIndex: 'module',
    key: 'module',
  },

  {
    title: '当前处理环节',
    dataIndex: 'taskName',
    key: 'taskName',
  },
  {
    title: '提出人',
    dataIndex: 'proposer',
    key: 'proposer',
  },
  {
    title: '登记人',
    dataIndex: 'sender',
    key: 'sender',
  },
  {
    title: '发送时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    render: text => {
      return <>{moment(text).format('YYYY-MM-DD HH:mm')}</>;
    },
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
  },
];

function ToDolist(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    loading,
    list,
    dispatch,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');

  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'demandtodo/fetchlist',
          payload: {
            ...values,
            page: paginations.current,
            limit: paginations.pageSize,
            userId: sessionStorage.getItem('userauthorityid'),
          },
        });
      }
    });
    return () => {
      setExpand(false);
      setSelectData('');
    };
  }, []);

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'demandtodo/fetchlist',
      payload: {
        ...values,
        limit: size,
        page,
        userId: sessionStorage.getItem('userauthorityid'),
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
      <KeyVal
        style={{ display: 'none' }}
        dictModule="demand"
        dictType="source"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="需求编号">
                {getFieldDecorator('demandId', {
                  initialValue: '',
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('taskName', { initialValue: '' })(
                  <Select placeholder="请选择">
                    {statemap.map(({ key, value }) => (
                      <Option key={key} value={value}>
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
                  <Form.Item label="需求标题">
                    {getFieldDecorator('title', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="需求类型">
                    {getFieldDecorator('demandType', { initialValue: '' })(
                      <Select placeholder="请选择">
                        {selectdata.source.map(obj => (
                          <Option key={obj.key} value={obj.val}>
                            {obj.val}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerPerson', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发送时间">
                    {getFieldDecorator('creationTime')(<DatePicker />)}
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
        {/* <div style={{ marginBottom: 24 }}>
          <Button type="primary">导出数据</Button>
        </div> */}
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ demandtodo, loading }) => ({
    list: demandtodo.list,
    loading: loading.models.demandtodo,
  }))(ToDolist),
);
