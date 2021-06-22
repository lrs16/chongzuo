import React from 'react';
import { Radio, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

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

const { TextArea } = Input;

function Operatorconfirmades(props) {
  const { info } = props;
  let value;
  if (info) {
    value = info.confirmResult;
  }
  return (
    <Row gutter={24} style={{ marginTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="审核结果">
            <Radio.Group value={value} disabled>
              <Radio value='1'>通过</Radio>
              <Radio value='0'>不通过</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="确认时间">
            <Input defaultValue={info.confirmTime} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="确认意见"  {...forminladeLayout}>
            <TextArea autoSize={{ minRows: 3 }} defaultValue={info.confirmContent} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="附件" {...forminladeLayout}>
            {info.confirmAttachments !== null && <Downloadfile files={info.confirmAttachments} />}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="确认人">
            <Input defaultValue={info.confirmUser} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="确认单位">
            <Input defaultValue={info.confirmUnit} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="确认部门">
            <Input defaultValue={info.confirmDept} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
export default Operatorconfirmades;
