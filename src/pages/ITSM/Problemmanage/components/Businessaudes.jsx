import React from 'react';
import { Radio, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { TextArea } = Input;

function Businessaudes(props) {
  const { info, formItemLayout, forminladeLayout, } = props;
  let value;
  if (info) {
    value = info.checkResult;
  }
  return (
    <Row gutter={24}>
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
          <Form.Item label="审核时间">
            <Input defaultValue={info.checkTime} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="审核意见"  {...forminladeLayout}>
            <TextArea autoSize={{ minRows: 3 }} defaultValue={info.checkOpinion} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="附件" {...forminladeLayout}>
            {info.checkAttachments !== null && <Downloadfile files={info.checkAttachments} />}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核人">
            <Input defaultValue={info.checkUser} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核单位">
            <Input defaultValue={info.checkUnit} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核部门">
            <Input defaultValue={info.checkDept} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
export default Businessaudes;
