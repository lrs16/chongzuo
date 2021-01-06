import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

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
    title: '故障编号',
    dataIndex: 'id',
    key: 'id',
    width: 200,
  },
  {
    title: '日期',
    dataIndex: 'datetime',
    key: 'datetime',
    width: 300,
  },
  {
    title: '故障分类',
    dataIndex: 'faultClass',
    key: 'faultClass',
    width: 250,
  },
  {
    title: '故障问题及现象',
    dataIndex: 'faultProblem',
    key: 'faultproblem',
    width: 250,
  },
  {
    title: '故障概要',
    dataIndex: 'faultSum',
    key: 'faultSum',
    width: 250,
    ellipsis: true
  },
  {
    title: '影响范围',
    dataIndex: 'influScope',
    key: 'handler',
    width: 200,
  },
  {
    title: '处理过程',
    dataIndex: 'treat',
    key: 'treat',
    width: 250,
    ellipsis: true
  },
  {
    title: '改进措施及故障原因',
    dataIndex: 'faultMeasure',
    key: 'faultMeasure',
    width: 250,
    ellipsis: true
  },
  {
    title: '是否提交故障报告',
    dataIndex: 'reportSubmit',
    key: 'reportsubmit',
    width: 250,
  },
  {
    title: '故障责任单位及扣分情况',
    dataIndex: 'faultUnit',
    key: 'faultunit',
    width: 200,
    ellipsis: true
  },
  {
    title: '是否已发布处理结果',
    dataIndex: 'proResult',
    key: 'proresult',
    width: 250,
  },
  {
    title: '扣分细项',
    dataIndex: 'itemDeduc',
    key: 'itemDeduc',
    width: 100,
  },
];

function Faultbreakdownlist(props) {
  const pagetitle = props.route.name;

  const {
    form: { getFieldDecorator, resetFields, validateFields },
    loading,
    getfaultBreakdownList,
    dispatch,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'fault/fetchfaultBreakdownList',
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
      type: 'fault/fetchfaultBreakdownList',
      payload: {
        ...values,
        pageSize: size,
        current: page,
      },
    });
  };

  const handleReset = () => {
    resetFields();
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
    total: getfaultBreakdownList.total,
    onChange: page => changePage(page),
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="日期">
                {getFieldDecorator('datetime', {})(<DatePicker showTime style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="故障分类">
                {getFieldDecorator('faultClass', {})(<Select />)}
              </Form.Item>
            </Col>
            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="故障问题及现象">
                    {getFieldDecorator('faultProblem', {})(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="故障概要">
                    {getFieldDecorator('faultSum', {})(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="影响范围">
                    {getFieldDecorator('influScope', {})(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="处理过程">
                    {getFieldDecorator('treat', {})(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="改进措施及故障原因">
                    {getFieldDecorator('faultMeasure', {})(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="是否提交故障报告">
                    {getFieldDecorator('reportSubmit', {})(<Select />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="是否已发布处理结果">
                    {getFieldDecorator('proResult', {})(<Select />)}
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
                        收起 <UpOutlined />
                      </>
                    ) : (
                        <>
                          展开 <DownOutlined />
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
                      收起 <UpOutlined />
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
          <Button type="primary">导出数据</Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={getfaultBreakdownList.data}
          table-layout="fixed"
          scroll={{ x: 1500 }}
          rowKey={record => record.id}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ fault, loading }) => ({
    getfaultBreakdownList: fault.getfaultBreakdownList,
    html: fault.html,
    loading: loading.models.fault,
  }))(Faultbreakdownlist),
);
