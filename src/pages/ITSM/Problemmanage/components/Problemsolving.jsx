import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { TextArea } = Input;

function Problemsolving(props) {
  const { info, formItemLayout, forminladeLayout } = props;
  return (
    <Row gutter={24} style={{ marginTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="接单时间">
            <Input defaultValue={info.addTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理完成时间">
            <Input defaultValue={info.handleTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="计划完成时间">
            <Input defaultValue={info.planEndTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理结果">
            <Input defaultValue={info.handleResult} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="解决方案"  {...forminladeLayout}>
            <TextArea autoSize={{ minRows: 3 }} defaultValue={info.handleContent} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="附件" {...forminladeLayout}>
            {info.handleAttachments !== null && <Downloadfile files={info.handleAttachments} />}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理人">
            <Input defaultValue={info.handler} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理单位">
            <Input defaultValue={info.handleUnit} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理部门">
            <Input defaultValue={info.handleDept} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
export default Problemsolving;
