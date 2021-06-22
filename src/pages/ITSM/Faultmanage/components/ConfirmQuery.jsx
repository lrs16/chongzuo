import React from 'react';
import { Radio, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用

const RadioGroup = Radio.Group;
const { TextArea } = Input;

function ConfirmQuery(props) {
  const { info, formItemLayout, forminladeLayout } = props;

  return (
    <>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="确认结果">
              <RadioGroup defaultValue={info.confirmResult} disabled>
                <Radio value='1'>通过</Radio>
                <Radio value='0'>不通过</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="确认时间">
              <Input defaultValue={info.confirmTime || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="故障责任方">
              <Input defaultValue={info.confirmBlame || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="确认说明"  {...forminladeLayout}>
              <TextArea autoSize={{ minRows: 3 }} defaultValue={info.confirmContent || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {info.confirmAttachments && <Downloadfile files={info.confirmAttachments} />}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="确认人">
              <Input defaultValue={info.confirmUser} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="确认人单位">
              <Input defaultValue={info.confirmUnit} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="确认人部门">
              <Input defaultValue={info.confirmDept} disabled />
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
};

export default ConfirmQuery;