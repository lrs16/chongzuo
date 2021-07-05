import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  DatePicker
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

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />
}


function Contract(props) {
  const [visible, setVisible] = useState(false);
  const {
    form: { getFieldDecorator,validateFields },
    children,
    contract,
    title,
    onSumit,
  } = props;

  const required = true;

  const handleopenClick = () => {
    setVisible(true)
  }

  const handleOk = () => {
    props.form.validateFields((err, values) => {
      if(!err) {
        onSumit(values);
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
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label='合同编号'>
            {getFieldDecorator('no', {
              initialValue: contract.no
            })
              (<Input />)
            }
          </Form.Item>

          <Form.Item label='合同名称'>
            {getFieldDecorator('name', {
              rules: [
                {
                  required,
                  message: '请输入合同名称'
                }
              ],
              initialValue: contract.name
            })
              (<Input />)
            }
          </Form.Item>

          <Form.Item label='签订日期'>
            {getFieldDecorator('data', {
              rules: [
                {
                  required,
                  message: '请输入签订日期'
                }
              ],
              initialValue: contract.data
            })
              (<DatePicker />)
            }
          </Form.Item>

          <Form.Item label='到期日期'>
            {getFieldDecorator('enddata', {
              rules: [
                {
                  required,
                  message: '请输入到期日期'
                }
              ],
              initialValue: contract.enddata
            })
              (<DatePicker />)
            }
          </Form.Item>

          <Form.Item label='状态'>
            {getFieldDecorator('statu', {
              rules: [
                {
                  required,
                  message: '请输入状态'
                }
              ],
              initialValue: contract.statu
            })
              (<Input />)
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
    no:'',
    name:'',
    data:moment(new Date()),
    enddata:moment(new Date()),
    statu:'',
  }
}
export default Form.create({})(Contract)