import React from 'react';
import { Descriptions, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import styles from '../index.less';

const { TextArea } = Input;
function ReturnVisitdes(props) {
  const { info, main, formItemLayout, forminladeLayout, } = props;
  return (
    <>
      <Row gutter={24}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="回访方式">
              <Input defaultValue={info.revisitWay} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理结果">
              <Input defaultValue={main.eventResult} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="满意度">
              <Input defaultValue={info.satisfaction} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="回访内容"  {...forminladeLayout}>
              <TextArea autoSize={{ minRows: 3 }} defaultValue={info.content} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="填单时间" >
              <Input defaultValue={info.addTime} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访时间" >
              <Input defaultValue={info.revisitTime} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {info.fileIds !== '' && <Downloadfile files={info.fileIds} />}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访人">
              <Input defaultValue={info.revisitor} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访人单位">
              <Input defaultValue={info.revisitUnit} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访人部门">
              <Input defaultValue={info.revisitDept} disabled />
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}

export default ReturnVisitdes;
