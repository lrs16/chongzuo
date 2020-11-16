import React, { useEffect } from 'react';
import { Card, Row, Col, Form, Select, Input, Button, Table } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Option } = Select;

const typemap = [
  { key: '0', value: '业务指标' },
  { key: '1', value: '终端在线和入库' },
  { key: '2', value: '接口数据' },
  { key: '3', value: 'KAFKA中间件' },
  { key: '4', value: '主站系统运行' },
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
    title: '告警标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '监控项',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '触发条件',
    dataIndex: 'condition',
    key: 'condition',
  },
  {
    title: '创建人',
    dataIndex: 'founder',
    key: 'founder',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
];

function SysSetting(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    list,
    loading,
    dispatch,
  } = props;
  const dataSource = list.data;

  useEffect(() => {
    dispatch({
      type: 'alarmovervies/fetchlist',
    });
  }, []);

  const handleSearch = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values);
    });
  };

  const handleReset = () => {
    resetFields();
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="监控项">
                {getFieldDecorator(
                  'type',
                  {},
                )(
                  <Select placeholder="请选择">
                    {typemap.map(({ key, value }) => (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="告警标题">
                {getFieldDecorator('title', {})(<Input placeholder="请选择" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重 置
                </Button>
              </Form.Item>
            </Col>
          </Form>
        </Row>
        <div style={{ margin: '0 0 24px 0' }}>
          <Button type="primary" style={{ marginRight: 8 }}>
            编 辑
          </Button>
          <Button type="primary" style={{ marginRight: 8 }}>
            启 用
          </Button>
          <Button type="danger" ghost style={{ marginRight: 8 }}>
            停 用
          </Button>
        </div>
        <Table columns={columns} loading={loading} dataSource={dataSource} />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ measuralarmsetting, loading }) => ({
    list: measuralarmsetting.list,
    loading: loading.models.measuralarmsetting,
  }))(SysSetting),
);
