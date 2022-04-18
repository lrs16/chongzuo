import React from 'react';
import { Radio, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用
import FormTextArea from '@/components/FormTextArea';

const RadioGroup = Radio.Group;

const forminladeLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

function ExamineSecondQuery(props) {
  const { info, formItemLayout, forminladeLayout } = props;

  return (
    <>
      <Row gutter={24}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="审核结果">
              <RadioGroup defaultValue={info.checkResult} disabled>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="故障责任方">
              <Input defaultValue={info.checkBlame || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间">
              <Input defaultValue={info.checkTime || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="严重程度">
              <Input defaultValue={info.checkLevel || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="是否影响计量主站" {...forminladeLayout1}>
              <RadioGroup defaultValue={Number(info.checkMaster)} disabled>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: '-10px' }}>
            <Form.Item label="审核意见" {...forminladeLayout}>
              <FormTextArea autoSize={1} indexText={info.checkOpinion} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="上传附件" {...forminladeLayout}>
              {info.checkAttachments && <Downloadfile files={info.checkAttachments} />}
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

export default ExamineSecondQuery;
