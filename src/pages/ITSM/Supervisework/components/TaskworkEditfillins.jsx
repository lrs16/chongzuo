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

function TaskworkEditfillins(props) {
  const { info } = props;

  return (
    <Row gutter={24} style={{ marginTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='工作任务编号'>
            <Input defaultValue={info.no} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='填报时间'>
            <Input defaultValue={info.addTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="工作状态">
            <Input defaultValue={info.status} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="工作负责人">
            <Input defaultValue={info.workUser} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="工作内容" {...forminladeLayout}>
            <TextArea autoSize={{ minRows: 3 }} defaultValue={info.content} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="计划开始时间">
            <Input defaultValue={info.plannedStartTime} disabled />
          </Form.Item>
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
          <Form.Item label="填报人">
            <Input defaultValue={info.addUser} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="填报单位">
            <Input defaultValue={info.addUnit} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
export default TaskworkEditfillins;
