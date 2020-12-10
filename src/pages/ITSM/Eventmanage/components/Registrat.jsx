import React, { useContext, useRef, useImperativeHandle } from 'react';
import { Row, Col, Form, Input, Select, Upload, Button, Checkbox, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from '../index.less';
import { RegistratContext } from '../Registration';
import { phone_reg } from '@/utils/Regexp';

const { Option } = Select;
const { TextArea } = Input;

const sourcemap = [
  { key: 0, value: '用户电话申告' },
  { key: 1, value: '企信' },
];

const returnvisit = [
  { key: 0, value: '企信回访' },
  { key: 1, value: '电话回访' },
  { key: 2, value: '短信回访' },
  { key: 3, value: '邮箱回访' },
];

const degreemap = [
  { key: 0, value: '高' },
  { key: 1, value: '中' },
  { key: 2, value: '低' },
];

const sysmodular = [
  { key: 0, value: '配网采集' },
  { key: 1, value: '主网采集' },
  { key: 2, value: '终端掉线' },
  { key: 3, value: '配网档案' },
  { key: 4, value: '实用化指标' },
  { key: 5, value: '账号缺陷' },
];

const Registrat = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, show } = props;
  const { getFieldDecorator } = props.form;
  const { setActiveKey, setShow } = useContext(RegistratContext);
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const required = true;

  const handleself = e => {
    setShow(e.target.checked);
    setActiveKey(['1', '2']);
  };

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="建单时间">
            {getFieldDecorator('re1', {
              rules: [
                {
                  required,
                  message: '请选择建单时间',
                },
              ],
            })(<DatePicker />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="事件来源">
            {getFieldDecorator('re2', {
              rules: [
                {
                  required,
                  message: '请选择事件来源',
                },
              ],
            })(
              <Select placeholder="请选择">
                {sourcemap.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="申报人">
            {getFieldDecorator('re3', {
              rules: [{ required, message: '请输入申报人' }],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="申报人单位">
            {getFieldDecorator('re4', {
              rules: [{ required, message: '请选择申报人单位' }],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="申报人部门">
            {getFieldDecorator('re5', {
              rules: [{ required, message: '请选择申报人部门' }],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="申报人电话">
            {getFieldDecorator('re6', {
              rules: [
                {
                  required,
                  len: 11,
                  validator: phone_reg,
                  message: '请输入正确的正确的手机号码',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="回访方式">
            {getFieldDecorator('re7')(
              <Select placeholder="请选择">
                {returnvisit.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="影响度">
            {getFieldDecorator('re8')(
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
          <Form.Item label="系统模块">
            {getFieldDecorator('re9')(
              <Select placeholder="请选择">
                {sysmodular.map(({ key, value }) => [
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
            {getFieldDecorator('re10')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="紧急度">
            {getFieldDecorator('re11')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="优先级">
            {getFieldDecorator('re12')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="事件标题" {...forminladeLayout}>
            {getFieldDecorator('re13')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="一线标签" {...forminladeLayout}>
            {getFieldDecorator('re14')(
              <Input placeholder="请输入标签，至少两个字符，回车确认，最多输入八个标签" />,
            )}
          </Form.Item>
        </Col>
        <Col span="22" offset={2}>
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
        </Col>
        <Col span={24}>
          <Form.Item label="事件描述" {...forminladeLayout}>
            {getFieldDecorator('re15')(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="自行处理" {...forminladeLayout}>
            {getFieldDecorator('show')(<Checkbox checked={show} onClick={handleself} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('re17')(
              <Upload>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                </Button>
              </Upload>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记人">
            {getFieldDecorator('re18')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记人单位">
            {getFieldDecorator('re19')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记人部门">
            {getFieldDecorator('re20')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

export default Form.create({})(Registrat);
