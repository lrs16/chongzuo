import React from 'react';
import { Form, Input, Row, Col, Radio } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用
import FormTextArea from '@/components/FormTextArea';

const RadioGroup = Radio.Group;

const forminladeLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

function SummaryQuery(props) {
  const { info, formItemLayout, forminladeLayout, showFilelist, showFilelist2 } = props;

  return (
    <>
      <Row gutter={24}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="故障责任方">
              <Input defaultValue={info.finishBlame || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="是否需要提供故障报告" {...forminladeLayout1}>
              <RadioGroup defaultValue={Number(info.finishReportSign)} disabled>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="总结时间">
              <Input defaultValue={info.finishTime || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: '-10px' }}>
            <Form.Item label="总结说明" {...forminladeLayout}>
              <FormTextArea autoSize={1} indexText={info.finishContent} />
            </Form.Item>
          </Col>

          {info && info.finishAnalysisAttachments && (
            <>
              <Col span={24}>
                <Form.Item label="故障分析报告" {...forminladeLayout}>
                  {info.finishAnalysisAttachments && (
                    <Downloadfile files={info.finishAnalysisAttachments} />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="要求上传时间">
                  <Input defaultValue={info.finishRequiredTime || ''} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="实际上传时间">
                  <Input defaultValue={info.finishPracticeTime || ''} disabled />
                </Form.Item>
              </Col>
            </>
          )}

          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {info.finishAttachments && <Downloadfile files={info.finishAttachments} />}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="总结人">
              <Input defaultValue={info.finishUser} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="总结人单位">
              <Input defaultValue={info.finishUnit} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="总结人部门">
              <Input defaultValue={info.finishDept} disabled />
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}

export default SummaryQuery;
