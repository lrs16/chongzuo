import React from 'react';
import { Descriptions, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import styles from '../index.less';

const { TextArea } = Input;

function Registratdes(props) {
  const { info, formItemLayout, forminladeLayout } = props;
  return (
    <>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label='需求编号'>
              <Input defaultValue={info.demandId} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='开发工作量'>
              <Input defaultValue={info.workLoad} disabled />
            </Form.Item>
          </Col>
          <Col span={8} style={{ clear: 'both' }}>
            <Form.Item label='建单时间'>
              <Input defaultValue={info.creationTime} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='申请时间'>
              <Input defaultValue={info.registerTime} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='期待完成时间'>
              <Input defaultValue={info.completeTime} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='申请人'>
              <Input defaultValue={info.proposer} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='申请人单位'>
              <Input defaultValue={info.proposingUnit} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='申请人部门'>
              <Input defaultValue={info.proposingDepartment} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='联系电话'>
              <Input defaultValue={info.proposerPhone} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='所属项目'>
              <Input defaultValue={info.project} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='需求类型'>
              <Input defaultValue={info.demandType} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='功能模块'>
              <Input defaultValue={info.functionalModule} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='需求优先级'>
              <Input defaultValue={info.priority} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="需求标题" {...forminladeLayout}>
              <Input defaultValue={info.title} disabled />
            </Form.Item>
          </Col>
        </Form>
        <Col span={24}>
          <Form.Item label='需求原因'  {...forminladeLayout}>
            <TextArea autoSize={{ minRows: 3 }} defaultValue={info.reason} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label='需求描述'  {...forminladeLayout}>
            <TextArea autoSize={{ minRows: 3 }} defaultValue={info.detail} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="附件" {...forminladeLayout}>
            {info.fileIds !== '' && <Downloadfile files={info.attachment} />}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='登记人'>
            <Input defaultValue={info.registerPerson} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='登记人单位'>
            <Input defaultValue={info.registrationUnit} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='登记人部门'>
            <Input defaultValue={info.registrationDepartment} disabled />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

export default Registratdes;
