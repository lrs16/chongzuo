/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Badge, Form, Input, Row, Col, Checkbox, Radio } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

class AlarmInfo extends Component {
  render() {
    const { data } = this.props;
    return (
      <>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='告警编号'>
                <Input defaultValue={data.detailsid} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='区域'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='设备IP'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='设备名称'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='巡检内容'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='告警时间'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='告警确认时间'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='告警消除时间'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='持续时长'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='告警内容' {...forminladeLayout}>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='上次告警时间'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='工单生成'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='工单编号'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='确认告警'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='消除告警'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='派发工单'>
                <Input defaultValue={data.category} disabled />
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </>
    );
  }
}

export default AlarmInfo;
