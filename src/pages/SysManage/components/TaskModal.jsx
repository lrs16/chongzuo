import React from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  Radio,
  Select,
  Row,
  Col,
} from 'antd';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const taskName = [
  { key: '0', title: '默认' },
  { key: '1', title: '系统' },
];

function TaskModal(props) {
  const { visible, ChangeVisible, title, handleSubmit } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const {
    jobName,
    jobGroup,
    invokeTarget,
    cronExpression,
    concurrent,
    misfirePolicy,
    status,
    jobId,
  } = props.record;

  const hanldleCancel = () => {
    ChangeVisible(false);
  };
  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        // 关闭弹窗
        hanldleCancel();
        // 传数据
        handleSubmit(values);
        props.form.resetFields();
        ChangeVisible(false);
      }
    });
  };

  return (
    <Modal
      title={title}
      width={1000}
      onOk={handleOk}
      onCancel={hanldleCancel}
      maskClosable={false}
      visible={visible}
      destroyOnClose
    >
      <Row gutter={16}>
        <Form {...formItemLayout}>
          <Col span={12} style={{ display: 'none' }}>
            <Form.Item label='jobId'>
              {getFieldDecorator('jobId', {
                rules: [
                  {
                    required,
                    message: ''
                  }
                ],
                initialValue: jobId
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='任务名称'>
              {getFieldDecorator('jobName', {
                rules: [
                  {
                    required,
                    message: '任务名称不能为空'
                  }
                ],
                initialValue: jobName || ''
              })(
                <Input placeholder="请输入任务名称" />
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="任务分组">
              {getFieldDecorator('jobGroup', {
                initialValue: jobGroup || '',
              })(
                <Select placeholder="请选择" allowClear>
                  {taskName.map(obj => (
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>
                  ))}
                </Select>)}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label='调用方法' {...forminladeLayout}
            >
              {
                getFieldDecorator('invokeTarget', {
                  initialValue: invokeTarget || '',
                  rules: [
                    {
                      required,
                      message: '调用字符串不能为空'
                    }
                  ],
                })(
                  <Input placeholder="请输入调用目标字符串" />
                )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Col span={12}>
              <Form.Item label="cron表达式">
                {getFieldDecorator('cronExpression', {
                  rules: [
                    {
                      required,
                      message: 'cron执行表达式不能为空'
                    }
                  ],
                  initialValue: cronExpression || '',
                })(<Input placeholder="请输入cron执行表达式" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否并发">
                {getFieldDecorator('concurrent', {
                  initialValue: concurrent || '0',
                })(<Radio.Group
                >
                  <Radio value='0'>允许</Radio>
                  <Radio value='1'>禁止</Radio>
                </Radio.Group>)}
              </Form.Item>
            </Col>
          </Col>

          <Col span={24}>
            <Col span={12}>
              <Form.Item label="错误策略">
                {getFieldDecorator('misfirePolicy', {
                  initialValue: misfirePolicy || '1',
                })(<Radio.Group buttonStyle="solid"
                >
                  <Radio.Button value="1">立即执行</Radio.Button>
                  <Radio.Button value="2">执行一次</Radio.Button>
                  <Radio.Button value="3">放弃执行</Radio.Button>
                </Radio.Group>)}
              </Form.Item>
            </Col>
          </Col>

          <Col span={12}>
            <Form.Item label="状态">
              {getFieldDecorator('status', {
                initialValue: status || '0',
              })(<Radio.Group
              >
                <Radio value='0'>停止</Radio>
                <Radio value='1'>启动</Radio>
              </Radio.Group>)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={hanldleCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={handleOk} type="primary">
          提交
        </Button>
      </div>
    </Modal>
  );
}

TaskModal.defaultProps = {
  record: {
    jobId: '',
    jobName: '',
    jobGroup: '',
    invokeTarget: '',
    cronExpression: '',
    concurrent: '',
    misfirePolicy: '',
    status: '',
  },
};

export default Form.create()(TaskModal);