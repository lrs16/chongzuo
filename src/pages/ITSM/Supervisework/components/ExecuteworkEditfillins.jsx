import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import FormTextArea from '@/components/FormTextArea';

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

function ExecuteworkEditfillins(props) {
  const { info } = props;

  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="工作执行结果">
            <Input defaultValue={info.result} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="实际开始时间">
            <Input defaultValue={info.startTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="实际结束时间">
            <Input defaultValue={info.endTime} disabled />
          </Form.Item>
        </Col>
        <Col span={24} style={{ marginTop: 4, marginBottom: '-10px' }}>
          <Form.Item label="工作执行情况说明" {...forminladeLayout}>
            <FormTextArea autoSize={1} indexText={info.content} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="附件" {...forminladeLayout}>
            {info.fileIds && <Downloadfile files={info.fileIds} />}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="执行操作时间">
            <Input defaultValue={info.executeTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="执行人">
            <Input defaultValue={info.executeUser} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
export default ExecuteworkEditfillins;
