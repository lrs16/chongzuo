import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  DatePicker,
  Select
} from 'antd';
import moment from 'moment';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}

const { Option } = Select;

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />
}


function Contract(props) {
  const [visible, setVisible] = useState(false);
  const {
    form: { getFieldDecorator, validateFields },
    children,
    contract,
    title,
    onSumit,
    isEdit
  } = props;

  const required = true;

  const handleopenClick = () => {
    setVisible(true)
  }

  const handleOk = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const submitData = {
          ...values,
          id: contract.id || ''
        };
        onSumit(submitData);
        setVisible(false)
      }
    })
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={title}
        visible={visible}
        width={720}
        centered='true'
        maskClosable='true'
        destroyOnClose={true}
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label='合同编号'>
            {getFieldDecorator('contractNo', {
              initialValue: contract.contractNo
            })
              (<Input disabled='true' />)
            }
          </Form.Item>

          <Form.Item label='合同名称'>
            {getFieldDecorator('contractName', {
              rules: [
                {
                  required,
                  message: '请输入合同名称'
                }
              ],
              initialValue: contract.contractName
            })
              (<Input disabled={isEdit} />)
            }
          </Form.Item>

          <Form.Item label='签订日期'>
            {getFieldDecorator('signTime', {
              rules: [
                {
                  required,
                  message: '请输入签订日期'
                }
              ],
              initialValue: moment(contract.signTime)
            })
              (<DatePicker
                disabled={isEdit}
                format='YYYY-MM-DD HH:mm:ss'
              />)
            }
          </Form.Item>

          <Form.Item label='到期日期'>
            {getFieldDecorator('dueTime', {
              rules: [
                {
                  required,
                  message: '请输入到期日期'
                }
              ],
              initialValue: moment(contract.dueTime)
            })
              (<DatePicker
                disabled={isEdit}
                format='YYYY-MM-DD HH:mm:ss'
              />)
            }
          </Form.Item>

          <Form.Item label='状态'>
            {getFieldDecorator('status', {
              rules: [
                {
                  required,
                  message: '请输入状态'
                }
              ],
              initialValue: contract.status
            })
              (
                <Select disabled={isEdit}>
                  <Option key='0' value='0'>在用</Option>
                  <Option key='1' value='1'>停用</Option>
                  <Option key='2' value='2'>过期</Option>
                </Select>
              )
            }
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

          <Button onClick={handleOk} type='primary'>
            确定
          </Button>

        </div>
      </Drawer>
    </>
  )
}

Contract.defaultProps = {
  contract: {
    no: '',
    name: '',
    data: new Date(),
    enddata: new Date(),
    status: '0',
  }
}
export default Form.create({})(Contract)