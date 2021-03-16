import React from 'react';
import moment from 'moment';
import { Card, Form, Button, TimePicker, Row, Col, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '../style.less';

const format = 'HH:mm';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const fromallItem = {
  labelCol: {
    sm: { span: 24 },
  },
};

const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '开始时间',
    dataIndex: 'start',
    key: 'start',
  },
  {
    title: '结束时间',
    dataIndex: 'end',
    key: 'end',
  },
  {
    title: '性质',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '备注',
    dataIndex: 'des',
    key: 'des',
  },
  {
    title: '修改时间',
    dataIndex: 'updatatime',
    key: 'updatatime',
  },
];

function OrderDay(props) {
  const pagetitle = props.route.name;
  const { getFieldDecorator } = props.form;

  return (
    <PageHeaderWrapper title={pagetitle}>
      <div className={styles.orderdaycardbody}>
        <Card style={{ paddingBottom: 0 }}>
          <Form {...formItemLayout}>
            <Row>
              <Col span={2}>
                <Form.Item label="作息时间" {...fromallItem} />
              </Col>
              <Col span={10}>
                <Form.Item label="上午">
                  {getFieldDecorator('amstart', {})(<TimePicker format={format} />)}
                  <span style={{ padding: '0 12px' }}>--</span>
                  {getFieldDecorator('amend', {})(<TimePicker format={format} />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="下午">
                  {getFieldDecorator('pmstart', {})(<TimePicker format={format} />)}
                  <span style={{ padding: '0 12px' }}>--</span>
                  {getFieldDecorator('pmend', {})(<TimePicker format={format} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
      <h3 style={{ marginTop: 24, paddingLeft: 6 }}>例外设置</h3>
      <Table columns={columns} />
    </PageHeaderWrapper>
  );
}

export default Form.create({})(OrderDay);
