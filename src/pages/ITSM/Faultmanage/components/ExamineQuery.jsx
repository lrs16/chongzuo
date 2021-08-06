import React from 'react';
import { Radio, Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用

const RadioGroup = Radio.Group;
const { TextArea } = Input;

function ExamineQuery(props) {
  const { info, formItemLayout, forminladeLayout } = props;

  return (
    <>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form >
          <Col span={8}>
            <Form.Item label="审核结果" {...formItemLayout}>
              <RadioGroup defaultValue={info.checkResult} disabled>
                <Radio value='1'>通过</Radio>
                <Radio value='0'>不通过</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="是否需要提供故障报告" {...formItemLayout}>
              <RadioGroup defaultValue={Number(info.checkReportSign)} disabled>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间" {...formItemLayout}>
              <Input defaultValue={info.checkTime || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="审核意见"  {...forminladeLayout}>
              <TextArea autoSize={{ minRows: 3 }} defaultValue={info.checkOpinion || ''} disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {info.checkAttachments && <Downloadfile files={info.checkAttachments} />}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人"{...formItemLayout}>
              <Input defaultValue={info.checkUser} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人单位" {...formItemLayout}>
              <Input defaultValue={info.checkUnit} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人部门" {...formItemLayout}>
              <Input defaultValue={info.checkDept} disabled />
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
};

export default ExamineQuery;
