import React from 'react';
import { Descriptions, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import styles from '../index.less';

const { TextArea } = Input;

function Handledes(props) {
  const { info, main, formItemLayout, forminladeLayout, } = props;
  return (
    <>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="事件分类">
              <Input defaultValue={main.eventType} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="事件对象">
              <Input defaultValue={main.eventObject} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理结果">
              <Input defaultValue={info.handleResult} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="接单时间">
              <Input defaultValue={info.addTime} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理完成时间">
              <Input defaultValue={info.endTime} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="解决方案"  {...forminladeLayout}>
              <TextArea autoSize={{ minRows: 3 }} defaultValue={info.content} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {info.fileIds !== '' && <Downloadfile files={info.fileIds} />}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理人">
              <Input defaultValue={info.handler} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理人单位">
              <Input defaultValue={info.handleUnit} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理人部门">
              <Input defaultValue={info.handleDept} disabled />
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}

export default Handledes;
