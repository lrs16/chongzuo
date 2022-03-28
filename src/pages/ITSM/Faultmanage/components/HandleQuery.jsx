import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import FormTextArea from '@/components/FormTextArea';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

function HandleQuery(props) {
  const {
    info,
    // showFilelist
  } = props;

  return (
    <>
      <Row gutter={24}>
        <Form {...formItemLayout}>
          <Col span={24}>
            <Form.Item label="故障详细描述" {...forminladeLayout}>
              <FormTextArea autoSize={1} indexText={info.handleContent} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="故障分析及原因" {...forminladeLayout}>
              <FormTextArea autoSize={1} indexText={info.handleReason} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="故障措施或建议" {...forminladeLayout}>
              <FormTextArea autoSize={1} indexText={info.handleAdvise} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理开始时间">
              <Input defaultValue={info.handleStartTime || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理完成时间">
              <Input defaultValue={info.handleEndTime || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理结果">
              <Input defaultValue={info.handleResult || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="处理过程" {...forminladeLayout}>
              <FormTextArea autoSize={1} indexText={info.handleProcess} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="故障处理记录表" {...forminladeLayout}>
              {info.handleRecordAttachments && (
                <Downloadfile files={info.handleRecordAttachments} />
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="故障系统截图" {...forminladeLayout}>
              {info.handlePictureAttachments && (
                <Downloadfile files={info.handlePictureAttachments} />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {info.handleAttachments && <Downloadfile files={info.handleAttachments} />}
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

export default HandleQuery;
