import React, { useRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Select, Upload, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { Option } = Select;
const { TextArea } = Input;

const degreemap = [
  { key: '001', value: '高' },
  { key: '002', value: '中' },
  { key: '003', value: '低' },
];

const eventclass = [
  { key: '001', value: '咨询' },
  { key: '002', value: '缺陷' },
  { key: '003', value: '故障' },
  { key: '004', value: '数据处理' },
  { key: '005', value: '其他' },
];

const eventobject = [
  { key: '001', value: '配网采集' },
  { key: '002', value: '主网采集' },
  { key: '003', value: '终端掉线' },
  { key: '004', value: '配网档案' },
  { key: '005', value: '实用化指标' },
  { key: '006', value: '账号缺陷' },
];

const result = [
  { key: '001', value: '误报' },
  { key: '002', value: '根本解决' },
  { key: '003', value: '代替方法' },
  { key: '004', value: '自动消失' },
  { key: '005', value: '转问题解决' },
];

const Handle = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout } = props;
  const { getFieldDecorator } = props.form;
  const required = true;
  const starttime = moment().format('YYYY-MM-DD HH:mm:ss');
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  return (
    <Row gutter={24} style={{ marginTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="处理人">
            {getFieldDecorator('ha1')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理人单位">
            {getFieldDecorator('ha2')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理人部门">
            {getFieldDecorator('ha3')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="影响度">
            {getFieldDecorator('ha4', {
              rules: [{ required, message: '请选择影响度' }],
              initialValue: '',
            })(
              <Select placeholder="请选择">
                {degreemap.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="紧急度">
            {getFieldDecorator('ha5', {
              rules: [{ required, message: '请选择紧急度' }],
              initialValue: '',
            })(
              <Select placeholder="请选择">
                {degreemap.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="优先级">
            {getFieldDecorator('ha6', {
              rules: [{ required, message: '请选择优先级' }],
              initialValue: '',
            })(
              <Select placeholder="请选择">
                {degreemap.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="事件分类">
            {getFieldDecorator('ha7', {
              rules: [{ required, message: '请选择事件分类' }],
              initialValue: '',
            })(
              <Select placeholder="请选择">
                {eventclass.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="事件对象">
            {getFieldDecorator('ha8', {
              rules: [{ required, message: '请选择事件对象' }],
              initialValue: '',
            })(
              <Select placeholder="请选择">
                {eventobject.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理结果">
            {getFieldDecorator('ha9', {
              rules: [{ required, message: '请选择处理结果' }],
              initialValue: '',
            })(
              <Select placeholder="请选择">
                {result.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="接单时间">
            {getFieldDecorator('ha10', {
              rules: [{ required }],
              initialValue: starttime,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="结束时间">
            {getFieldDecorator('ha11', {
              rules: [{ required }],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        {/* <Col span={24}>
          <Form.Item label="二线标签" {...forminladeLayout}>
            {getFieldDecorator('ha12')(
              <Input placeholder="请输入标签，至少两个字符，回车确认，最多输入八个标签" />,
            )}
          </Form.Item>
        </Col>
        <Col span={22} offset={2}>
          <span>您可输入相关标签（例如重点标签）</span>
          <div
            style={{
              marginBottom: 24,
              padding: '12px 12px 24px 12px',
              background: '#f1f1f1',
              borderRadius: 4,
            }}
          >
            <h5>推荐标签</h5>
            <div className={styles.margin_r}>
              <Button>重点标签</Button>
              <Button>标签1</Button>
              <Button>标签2</Button>
              <Button>标签3</Button>
              <Button>标签4</Button>
            </div>
          </div>
        </Col> */}
        <Col span={24}>
          <Form.Item label="解决方案" {...forminladeLayout}>
            {getFieldDecorator('ha13')(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
          </Form.Item>
        </Col>
        {/* <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('ha14')(
              <Upload>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                </Button>
              </Upload>,
            )}
          </Form.Item>
        </Col> */}
      </Form>
    </Row>
  );
});

export default Form.create({})(Handle);
