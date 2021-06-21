import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { TextArea } = Input;

function Checkdes(props) {
  const { info, formItemLayout, forminladeLayout, } = props;
  return (
    <>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="审核结果">
              <Input defaultValue={info.checkResult} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间">
              <Input defaultValue={info.checkTime} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="审核意见">
              <TextArea autoSize={{ minRows: 3 }} defaultValue={info.content} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {info.fileIds !== '' && <Downloadfile files={info.fileIds} />}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人">
              <Input defaultValue={info.checkUser} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人单位">
              <Input defaultValue={info.checkUnit} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人部门">
              <Input defaultValue={info.checkDept} disabled />
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}

export default Checkdes;
