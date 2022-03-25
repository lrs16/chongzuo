import React from 'react';
import { Form, Input, Row, Col, Checkbox, Radio } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import FormTextArea from '@/components/FormTextArea';

// const { TextArea } = Input;

const resultmap = new Map([
  [1, '通过'],
  [0, '不通过'],
  [2, '通过'],
  [3, '通过'],
  [4, '通过'],
  [5, '通过'],
  [6, '通过'],
  [7, '通过'],
  [8, '通过'],
]);

const confirresultmap = new Map([
  [1, '通过'],
  [0, '重新处理'],
  [2, '需求取消'],
])


function Examinedes(props) {
  const { info, formItemLayout, forminladeLayout } = props;
  const text = info.taskName.indexOf('确认') === -1 ? '审核' : '确认';

  return (
    <>
      <Row gutter={24}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label={`${text}结果`}>
              {(info.taskName === '自动化科业务人员确认' || info.taskName === '需求登记人员确认') ? (
                <Radio.Group value={confirresultmap.get(info.result)} disabled>
                  <Radio value='通过'>通过</Radio>
                  <Radio value='重新处理'>重新处理</Radio>
                  <Radio value='需求取消'>需求取消</Radio>
                </Radio.Group>
              ) : (
                <Radio.Group value={resultmap.get(info.result)} disabled>
                  <Radio value='通过'>通过</Radio>
                  <Radio value='不通过'>不通过</Radio>
                </Radio.Group>
              )}

            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={`${text}时间`}>
              <Input defaultValue={info.reviewTime} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            {info.taskName === '自动化科审核' && (
              <Form.Item label=''>
                {(info.result === 3 || info.result === 2 || info.result === 6 || info.result === 8) && <><Checkbox defaultChecked disabled />市场部领导审核</>}
                {(info.result === 4 || info.result === 2 || info.result === 6 || info.result === 7) && <><Checkbox defaultChecked disabled />科室领导审核</>}
                {(info.result === 5 || info.result === 2 || info.result === 7 || info.result === 8) && <><Checkbox defaultChecked disabled />中心领导审核</>}
              </Form.Item>)}
          </Col>
          {info.taskName === '系统开发商审核' && (
            <Col span={24}>
              <Form.Item label='开发负责人' {...forminladeLayout}>
                <Input defaultValue={info.developmentLead} disabled />
              </Form.Item>
            </Col>
          )}
          <Col span={24} style={{ marginTop: 3 }}>
            <Form.Item label={`${text}意见`}  {...forminladeLayout}>
              <FormTextArea autoSize={1} indexText={info.opinion} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {info.fileIds !== '' && <Downloadfile files={info.attachment} />}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={`${text}人`}>
              <Input defaultValue={info.userName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={`${text}人单位`}>
              <Input defaultValue={info.unit} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={`${text}人部门`}>
              <Input defaultValue={info.department} disabled />
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}

export default Examinedes;
