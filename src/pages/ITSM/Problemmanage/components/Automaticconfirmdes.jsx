import React from 'react';
import { Radio, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { TextArea } = Input;
function Automaticconfirmdes(props) {
  const { confirmationDetail, formItemLayout, forminladeLayout, } = props;
  const { problemFlowNodeRows } = confirmationDetail;
  let value;
  if (problemFlowNodeRows) {
    value = problemFlowNodeRows[5].confirmResult;
  }

  return (
    <Row gutter={24} style={{ marginTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="确认结果">
            <Radio.Group value={value} disabled>
              <Radio value='1'>通过</Radio>
              <Radio value='0'>不通过</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="确认时间">
            <Input defaultValue={confirmationDetail ? confirmationDetail.problemFlowNodeRows[5].confirmTime : ''} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="确认意见"  {...forminladeLayout}>
            <TextArea autoSize={{ minRows: 3 }} defaultValue={confirmationDetail ? confirmationDetail.problemFlowNodeRows[5].confirmTime : ''} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="附件" {...forminladeLayout}>
            {problemFlowNodeRows[5].confirmAttachments !== null && <Downloadfile files={problemFlowNodeRows[5].confirmAttachments} />}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="确认人">
            <Input defaultValue={confirmationDetail ? confirmationDetail.problemFlowNodeRows[5].confirmUser : ''} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="确认单位">
            <Input defaultValue={confirmationDetail ? confirmationDetail.problemFlowNodeRows[5].confirmUnit : ''} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="确认部门">
            <Input defaultValue={confirmationDetail ? confirmationDetail.problemFlowNodeRows[5].confirmDept : ''} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
export default Automaticconfirmdes;
