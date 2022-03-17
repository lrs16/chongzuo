import React from 'react';
import { Checkbox, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { TextArea } = Input;

function Registratdes(props) {
  const { info, main, formItemLayout, forminladeLayout, } = props;
  return (
    <>
      <Row gutter={24}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="事件编号">
              <Input defaultValue={main.eventNo} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="建单时间">
              <Input defaultValue={main.addTime} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="事件来源">
              <Input defaultValue={main.eventSource} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申报人">
              <Input defaultValue={info.applicationUser} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申报人单位">
              <Input defaultValue={info.applicationUnit} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申报人部门">
              <Input defaultValue={info.applicationDept} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申报人电话">
              <Input defaultValue={info.applicationUserPhone} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="手机号码">
              <Input defaultValue={info.mobilePhone} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访方式">
              <Input defaultValue={main.revisitWay} disabled />
            </Form.Item>
          </Col>
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
            <Form.Item label="影响度">
              <Input defaultValue={main.eventEffect} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="紧急度">
              <Input defaultValue={main.eventEmergent} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="优先级">
              <Input defaultValue={main.eventPrior} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="事件标题" {...forminladeLayout}>
              <Input defaultValue={main.title} disabled />
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginTop: 4 }}>
            <Form.Item label="事件描述"  {...forminladeLayout}>
              <TextArea autoSize={{ minRows: 3 }} defaultValue={main.content} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="自行处理">
              <Checkbox defaultChecked={Boolean(Number(info.selfhandle))} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="是否补单">
              <Checkbox defaultChecked={info.supplement === '' ? '' : Boolean(Number(info.supplement))} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="是否审核">
              <Checkbox defaultChecked={info.isCheck === '' ? '' : Boolean(Number(info.isCheck))} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {info.fileIds !== '' && <Downloadfile files={info.fileIds} />}
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
}

export default Registratdes;
