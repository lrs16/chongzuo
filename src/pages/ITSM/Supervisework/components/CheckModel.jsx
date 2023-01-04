import React, { useState } from 'react';
import moment from 'moment';
import { Form, Input, Modal, DatePicker, Tag, Radio, Row, Col, message } from 'antd';

const { TextArea } = Input;
const color = ['blue', 'green', 'blue'];

const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
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

function CheckModel(props) {
  const {
    form: { getFieldDecorator, validateFields, resetFields, setFieldsValue },
    children,
    title,
    selectedRows,
    userinfo,
  } = props;
  const required = true;
  const [visible, setVisible] = useState(false);
  const [adopt, setAdopt] = useState('001');

  const handleopenClick = () => {
    if (selectedRows.length === 0) {
      message.info('请至少选择一条数据');
      return false;
    }
    const res = selectedRows.every(item => {
      if (item.checkStatus === '待审核') {
        return item.id;
      }
      message.info('请选择执行状态:待审核');
      return false;
    });

    if (res === false) {
      return false;
    }
    setVisible(true);
    return null;
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        handleCancel();
        props.tocheckSubmit(values);
        resetFields();
      }
    });
  };

  const handleAdopt = e => {
    setAdopt(e.target.value);
  };

  return (
    <>
      {withClick(children, handleopenClick)}
      <Modal
        title={title}
        visible={visible}
        width={1350}
        checkable
        maskClosable={false}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="延期审核结果">
                {getFieldDecorator('check_result', {
                  rules: [
                    {
                      required,
                      message: '请输入审核结果',
                    },
                  ],
                  initialValue: '001',
                })(
                  <Radio.Group onChange={handleAdopt}>
                    <Radio value="001">通过</Radio>
                    <Radio value="002">不通过</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="延期审核时间">
                {getFieldDecorator('check_checkTime', {
                  rules: [
                    {
                      required,
                      message: '请输入审核时间',
                    },
                  ],
                  initialValue: moment(new Date()),
                })(
                  <>
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      defaultValue={moment(new Date())}
                      onChange={v => {
                        setFieldsValue({ check_checkTime: moment(v) });
                      }}
                    />
                  </>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="延期审核状态">
                {getFieldDecorator('check_status', {})(<Tag color={color[0]}>待审核</Tag>)}
              </Form.Item>
            </Col>

            <Col span={24}>
              {adopt === '001' && (
                <Form.Item label="审核说明" {...forminladeLayout}>
                  {getFieldDecorator('check_content', {
                    rules: [{ required: false, message: '请输入' }],
                  })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
                </Form.Item>
              )}
              {adopt === '002' && (
                <Form.Item label="审核说明" {...forminladeLayout}>
                  {getFieldDecorator('check_content', {
                    rules: [{ required: true, message: '请输入' }],
                  })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
                </Form.Item>
              )}
            </Col>
            <Col span={8}>
              <Form.Item label="延期审核人">
                {getFieldDecorator('check_checkUser', {
                  initialValue: userinfo.userName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="延期审核单位">
                {getFieldDecorator('check_checkUnit', {
                  initialValue: userinfo.unitName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </Modal>
    </>
  );
}

export default Form.create()(CheckModel);
