import React from 'react';
import { Form, Input, Row, Col, Radio } from 'antd';

const { TextArea } = Input;

function Contentdes(props) {
  const { forminladeLayout, contentInfo } = props;
  return (
    contentInfo && 
    (<>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form {...forminladeLayout}>
          <Col span={24}>
            <Form.Item label='作业名称'>
              <Input defaultValue={contentInfo[0].taskName} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='作业对象'>
              <Input defaultValue={contentInfo[0].taskObjectNum} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='作业脚本' >
              <Input defaultValue={contentInfo[0].taskScriptNum} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='作业备注'>
              <TextArea autoSize={{ minRows: 3 }} defaultValue={contentInfo[0].taskRemarks} disabled/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="执行方式">
              <Radio.Group value={contentInfo[0].taskModes} disabled>
                <Radio value='手动'>手动</Radio>
                <Radio value='定时'>定时</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>)
  );
}

export default Contentdes;
