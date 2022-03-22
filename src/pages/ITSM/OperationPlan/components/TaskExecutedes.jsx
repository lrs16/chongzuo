import React from 'react';
import { Form, Input, Row, Col } from 'antd';
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

function TaskExecutedes(props) {
  const { info } = props;

  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="作业结果">
            <Input defaultValue={info.result} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="实际开始时间" >
            <Input defaultValue={info.startTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="实际结束时间">
            <Input defaultValue={info.endTime} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="作业执行情况说明" {...forminladeLayout}>
            <TextArea autoSize={{ minRows: 3 }} defaultValue={info.content} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="附件" {...forminladeLayout}>
            {info.fileIds && <Downloadfile files={info.fileIds} />}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="执行操作时间">
            <Input defaultValue={info.operationTime} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row >
  );
}
export default TaskExecutedes;
