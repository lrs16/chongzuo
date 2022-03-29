import React from 'react';
import { Form, Input, Row, Col, Radio } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import FormTextArea from '@/components/FormTextArea';

// const { TextArea } = Input;

function Checkdes(props) {
  const { info, formItemLayout, forminladeLayout, } = props;
  return (
    <>
      <Row gutter={24}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="审核结果">
              <Radio.Group value={info.checkResult} disabled>
                <Radio value='通过'>通过</Radio>
                <Radio value='不通过'>不通过</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间">
              <Input defaultValue={info.checkTime} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="审核意见"  {...forminladeLayout} style={{ marginTop: 4, marginBottom: '-10px' }}>
              <FormTextArea autoSize={1} indexText={info.content} />
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
