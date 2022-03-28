import React from 'react';
import { Form, Input, Row, Col, } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { TextArea } = Input;

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

function OperationPlanfillindes(props) {
  const { info } = props;

  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='作业计划编号'>
            <Input defaultValue={info.operationNo} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='填报时间'>
            <Input defaultValue={info.addTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='作业系统名称'>
            <Input defaultValue={info.systemName} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='作业类型'>
            <Input defaultValue={info.type} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="作业性质">
            <Input defaultValue={info.nature} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="作业单位">
            <Input defaultValue={info.operationUnit} disabled /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="作业负责人">
            <Input defaultValue={info.operationUser} disabled /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="开工作票">
            <Input defaultValue={info.billing} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="作业状态">
            <Input defaultValue={info.status} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="作业对象" {...forminladeLayout}>
            <TextArea autoSize={{ maxRows: 1 }} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="作业内容" {...forminladeLayout}>
            <TextArea autoSize={{ maxRows: 1 }} defaultValue={info.content} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="风险分析" {...forminladeLayout}>
            <TextArea autoSize={{ maxRows: 1 }} defaultValue={info.riskAnalysis} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="风险应对措施" {...forminladeLayout}>
            <TextArea autoSize={{ maxRows: 1 }} defaultValue={info.riskMeasures} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="计划开始时间"><Input defaultValue=
            {info.plannedStartTime} disabled /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="计划结束时间">
            <Input defaultValue={info.plannedEndTime} disabled />
          </Form.Item>
        </Col>
        <Col span={24} >
          <Form.Item label="附件" {...forminladeLayout}>
            {info.fileIds && <Downloadfile files={info.fileIds} />}
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item label="填报人"><Input defaultValue={info.addUser} disabled /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="填报单位"><Input defaultValue={info.addUnit} disabled /></Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
export default OperationPlanfillindes;
