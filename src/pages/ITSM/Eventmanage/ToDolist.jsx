import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { Option } = Select;

const statemap = [
  { key: '1', value: '已登记' },
  { key: '2', value: '待审核' },
  { key: '3', value: '审核中' },
  { key: '4', value: '待处理' },
  { key: '5', value: '处理中' },
  { key: '6', value: '待确认' },
  { key: '7', value: '确认中' },
  { key: '8', value: '重分派' },
];

const sourcemap = [
  { key: '002', value: '用户电话申告' },
  { key: '001', value: '企信' },
];

const levelmap = [
  { key: '003', value: '低' },
  { key: '002', value: '中' },
  { key: '001', value: '高' },
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
    dataIndex: 'eventNo',
    key: 'eventNo',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/eventmanage/to-do/record/workorder`,
          query: {
            pangekey: record.eventStatus,
            id: record.taskId,
            mainId: record.mainId,
            check: record.checkResult,
            validate: false,
            //type: '',
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
    width: 200,
  },
  {
    title: '事件来源',
    dataIndex: 'eventSource',
    key: 'eventSource',
    render: (text, record) => {
      const textmaps = new Map([
        ['001', '用户电话申告'],
        ['002', '企信'],
      ]);
      return <>{textmaps.get(record.eventSource)}</>;
    },
  },
  {
    title: '事件分类',
    dataIndex: 'eventType',
    key: 'eventType',
    render: (text, record) => {
      const textmaps = new Map([
        ['001', '咨询'],
        ['002', '缺陷'],
        ['003', '故障'],
        ['004', '数据处理'],
        ['005', '账号权限'],
        ['006', '其它'],
      ]);
      return <>{textmaps.get(record.eventType)}</>;
    },
  },
  {
    title: '填报人',
    dataIndex: 'registerUser',
    key: 'registerUser',
  },
  // {
  //   title: '处理人',
  //   dataIndex: 'handle_user',
  //   key: 'handle_user',
  // },
  {
    title: '工单状态',
    dataIndex: 'eventStatus',
    key: 'eventStatus',
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
      return <>{textmaps.get(record.eventStatus)}</>;
    },
  },
  {
    title: '发送时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '优先级',
    dataIndex: 'eventPrior',
    key: 'eventPrior',
    render: (text, record) => {
      const textmaps = new Map([
        ['001', '低'],
        ['002', '中'],
        ['003', '高'],
      ]);
      return <>{textmaps.get(record.eventPrior)}</>;
    },
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

  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'eventtodo/fetchlist',
          payload: {
            ...values,
            pageIndex: paginations.current - 1,
            pageSize: paginations.pageSize,
          },
        });
      }
    });
  }, []);

  // 查询
  const searchdata = (values, page, size) => {
    dispatch({
      type: 'eventtodo/fetchlist',
      payload: {
        ...values,
        pageSize: size,
        pageIndex: page - 1,
      },
    });
  };

  //  下载
  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'eventtodo/eventdownload',
          payload: { ...values },
        }).then(res => {
          // console.log(res);
          const filename = `下载.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }
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
          <Button type="primary" onClick={() => download()}>
            导出数据
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          rowKey={record => record.eventNo}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ eventtodo, loading }) => ({
    list: eventtodo.list,
    loading: loading.models.eventtodo,
  }))(ToDolist),
);
