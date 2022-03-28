import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { TextArea } = Input;

function Problemregistration(props) {
  const { main, info, formItemLayout, forminladeLayout } = props;
  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="问题编号">
            <Input defaultValue={main.no} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记时间">
            <Input defaultValue={info.registerTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="发生时间">
            <Input defaultValue={info.registerOccurTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="问题申报人">
            <Input defaultValue={info.complainUser} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="问题来源">
            <Input defaultValue={main.sourcecn} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="问题分类">
            <Input defaultValue={main.typecn} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="重要程度">
            <Input defaultValue={main.importancecn} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="期待完成时间">
            <Input defaultValue={info.registerExpectTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="影响范围">
            <Input defaultValue={info.registerScopecn} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="所属项目">
            <Input defaultValue={info.registerProjectcn} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="联系电话">
            <Input defaultValue={info.registerUserPhone} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="开发负责人">
            <Input defaultValue={info.developmentLead} disabled />
          </Form.Item>
        </Col>
        <Col span={24} >
          <Form.Item label="问题标题" {...forminladeLayout}>
            <Input defaultValue={main.title} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="问题描述"  {...forminladeLayout}>
            <TextArea autoSize={{ maxRows: 1 }} defaultValue={main.content} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="附件" {...forminladeLayout}>
            {info.registerAttachments !== null && <Downloadfile files={info.registerAttachments} />}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="填报人">
            <Input defaultValue={info.registerUser} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="填报人单位">
            <Input defaultValue={info.registerUnit} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="填报人部门">
            <Input defaultValue={info.registerDept} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
export default Problemregistration;
