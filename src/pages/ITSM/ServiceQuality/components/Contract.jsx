import React, { useState } from 'react';
import { Drawer, Form, Input, Button, DatePicker, Select, message } from 'antd';
import moment from 'moment';

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

let startTime;
let endTime;
const { Option } = Select;

const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

function Contract(props) {
  const [visible, setVisible] = useState(false);
  const {
    form: { getFieldDecorator, setFieldsValue },
    children,
    contract,
    title,
    onSumit,
    isEdit,
  } = props;

  const required = true;

  const handleopenClick = () => {
    setVisible(true);
  };

  const handleOk = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const submitData = {
          ...values,
          id: contract.id || '',
        };

        switch (submitData.status) {
          case '在用':
            submitData.status = '1';
            break;
          case '停用':
            submitData.status = '0';
            break;
          case '过期':
            submitData.status = '2';
            break;
          default:
            break;
        }

        if (
          moment(values.signTime).format('YYYY-MM-DD') ===
          moment(values.dueTime).format('YYYY-MM-DD')
        ) {
          message.error('签订日期必须小于到期日期哦');
        } else {
          onSumit(submitData);
          startTime = '';
          endTime = '';
          setVisible(false);
        }
      }
    });
  };

  const handleCancel = () => {
    startTime = '';
    endTime = '';
    setVisible(false);
  };

  const startdisabledDate = current => {
    if (endTime) {
      return current > moment(endTime);
    }

    if (!endTime && contract.dueTime) {
      return current > moment(contract.dueTime);
    }

    return null;
  };

  const enddisabledDate = current => {
    if (startTime) {
      return current < moment(startTime);
    }

    if (!startTime && contract.signTime) {
      return current < moment(contract.signTime);
    }
    return null;
  };

  const onChange = (date, dateString) => {
    startTime = dateString;
    setFieldsValue({ signTime: moment(dateString) });
    enddisabledDate(startTime);
  };

  const endonChange = (date, dateString) => {
    endTime = dateString;
    setFieldsValue({ dueTime: moment(dateString) });
    startdisabledDate(endTime);
  };

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={title}
        visible={visible}
        width={720}
        centered="true"
        maskClosable="true"
        destroyOnClose="true"
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label="合同编号">
            {getFieldDecorator('contractNo', {
              initialValue: contract.contractNo,
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="合同名称">
            {getFieldDecorator('contractName', {
              rules: [
                {
                  required,
                  message: '请输入合同名称',
                },
              ],
              initialValue: contract.contractName,
            })(<Input disabled={isEdit} />)}
          </Form.Item>

          <Form.Item label="签订日期">
            {getFieldDecorator('signTime', {
              rules: [
                {
                  required,
                  message: '请输入签订日期',
                },
              ],
              initialValue: contract.signTime ? moment(contract.signTime) : '',
            })(
              <div>
                <DatePicker
                  defaultValue={
                    startTime || contract.signTime ? moment(startTime || contract.signTime) : ''
                  }
                  disabled={isEdit}
                  format="YYYY-MM-DD"
                  disabledDate={startdisabledDate}
                  onChange={onChange}
                />
              </div>,
            )}
          </Form.Item>

          <Form.Item label="到期日期">
            {getFieldDecorator('dueTime', {
              rules: [
                {
                  required,
                  message: '请输入到期日期',
                },
              ],
              initialValue: contract.dueTime ? moment(contract.dueTime) : '',
            })(
              <div>
                <DatePicker
                  defaultValue={
                    endTime || contract.dueTime ? moment(endTime || contract.dueTime) : ''
                  }
                  disabled={isEdit}
                  format="YYYY-MM-DD"
                  disabledDate={enddisabledDate}
                  onChange={endonChange}
                />
              </div>,
            )}
          </Form.Item>

          <Form.Item label="状态">
            {getFieldDecorator('status', {
              rules: [
                {
                  required,
                  message: '请输入状态',
                },
              ],
              initialValue: contract.status,
            })(
              <Select disabled={isEdit}>
                <Option key="1" value="在用">
                  在用
                </Option>
                <Option key="0" value="停用">
                  停用
                </Option>
                <Option key="2" value="过期">
                  过期
                </Option>
              </Select>,
            )}
          </Form.Item>
        </Form>

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
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>

          <Button onClick={handleOk} type="primary">
            确定
          </Button>
        </div>
      </Drawer>
    </>
  );
}

Contract.defaultProps = {
  contract: {
    no: '',
    name: '',
    signTime: '',
    dueTime: '',
    // data: new Date(),
    // enddata: new Date(),
    status: '',
  },
};
export default Form.create({})(Contract);
