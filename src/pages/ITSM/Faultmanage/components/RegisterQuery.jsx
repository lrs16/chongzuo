import React from 'react';
import { Radio, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用

const RadioGroup = Radio.Group;
const { TextArea } = Input;

function RegisterQuery(props) {
  const { info, maindata, formItemLayout, forminladeLayout } = props;

  return (
    <>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="故障编号">
              <Input defaultValue={maindata.no || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记时间">
              <Input defaultValue={info.registerTime || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="发生时间">
              <Input defaultValue={info.registerOccurTime || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="故障来源">
              <Input defaultValue={maindata.source || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="系统模块">
              <Input defaultValue={info.registerModel || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="故障类型">
              <Input defaultValue={maindata.typecn || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="故障地点">
              <Input defaultValue={info.registerAddress || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="严重程度">
              <Input defaultValue={info.registerLevel || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="影响范围">
              <Input defaultValue={info.registerScope || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="是否影响业务">
              <RadioGroup defaultValue={Number(info.registerEffect)} disabled>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="故障名称" {...forminladeLayout}>
              <Input defaultValue={maindata.title || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="故障概要"  {...forminladeLayout}>
              <TextArea autoSize={{ minRows: 3 }} defaultValue={maindata.content || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {info.registerAttachments && <Downloadfile files={info.registerAttachments} />}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记人">
              <Input defaultValue={info.registerUser} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记人单位">
              <Input defaultValue={info.registerUnit} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记人部门">
              <Input defaultValue={info.registerDept} disabled />
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
};

export default RegisterQuery;
