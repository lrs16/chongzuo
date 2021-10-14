import React from 'react';
import { Form, Input, Row, Col, Radio } from 'antd';

const { TextArea } = Input;

function Examinedes(props) {
  const { formItemLayout, forminladeLayout } = props;
  return (
    <>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="审核结果">
              <Radio.Group value="{resultmap.get(info.result)}" disabled>
                <Radio value='通过'>通过</Radio>
                <Radio value='不通过'>不通过</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间">
              <Input defaultValue="{info.reviewTime}" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="审核说明"  {...forminladeLayout}>
              <TextArea autoSize={{ minRows: 5 }} defaultValue="{info.opinion}" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人">
              <Input defaultValue="{info.userName}" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核单位">
              <Input defaultValue="{info.unit}" disabled />
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}
export default Examinedes;
