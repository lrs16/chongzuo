import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用

const { TextArea } = Input;

function SummaryQuery(props) {
  const { info, formItemLayout, forminladeLayout, showFilelist, showFilelist2 } = props;

  return (
    <>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="总结时间">
              <Input defaultValue={info.finishTime || ''} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="总结说明"  {...forminladeLayout}>
              <TextArea autoSize={{ minRows: 3 }} defaultValue={info.finishContent || ''} disabled />
            </Form.Item>
          </Col>

          {
            ((showFilelist2 && showFilelist2.checkReportSign) ? showFilelist2.checkReportSign === '0': showFilelist.checkReportSign === '0') && (
              <>
                <Col span={24}>
                  <Form.Item label="故障分析报告" {...forminladeLayout}>
                    {info.finishAnalysisAttachments && <Downloadfile files={info.finishAnalysisAttachments} />}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="要求上传时间">
                    <Input defaultValue={info.finishRequiredTime || ''} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="实际上传时间">
                    <Input defaultValue={info.finishAnalysisAttachments === null || info.finishAnalysisAttachments === '[]' ? '' : (JSON.parse(info.finishAnalysisAttachments))[0].nowtime} disabled />
                  </Form.Item>
                </Col>
              </>
            )
          }

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
};

export default SummaryQuery;