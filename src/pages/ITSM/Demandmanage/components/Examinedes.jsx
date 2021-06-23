import React from 'react';
import { Form, Input, Row, Col, Checkbox, Radio } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { TextArea } = Input;

const resultmap = new Map([
  [1, '通过'],
  [0, '不通过'],
  [2, '通过'],
  [3, '通过'],
  [4, '通过'],
]);

function Examinedes(props) {
  const { info, formItemLayout, forminladeLayout } = props;
  const text = info.taskName.indexOf('确认') === -1 ? '审核' : '确认';

  return (
    <>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label={`${text}结果`}>
              <Radio.Group value={resultmap.get(info.result)} disabled>
                <Radio value='通过'>通过</Radio>
                <Radio value='不通过'>不通过</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={`${text}时间`}>
              <Input defaultValue={info.reviewTime} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label=''>
              {info.result === 2 && <><Checkbox defaultChecked disabled />科室领导审核<Checkbox defaultChecked disabled />市场部领导审核</>}
              {info.result === 4 && <><Checkbox defaultChecked disabled />科室领导审核</>}
              {info.result === 3 && <><Checkbox defaultChecked disabled />市场部领导审核</>}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={`${text}意见`}  {...forminladeLayout}>
              <TextArea autoSize={{ minRows: 3 }} defaultValue={info.opinion} disabled />
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
