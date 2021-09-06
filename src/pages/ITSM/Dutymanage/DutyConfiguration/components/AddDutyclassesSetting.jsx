import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button
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

function AddDutyclassesSetting(props) {
  const [visble, setVisble] = useState(false);
  const {
    form: { getFieldDecorator,validateFields },
    title,
    children,
    onsubmit,
    id
  } = props;

  const required = true;

  const handleopenClick = () => {
    setVisble(true)
  }

  const handleCancel = () => {
    setVisble(false)
  }

  const handleOk = () => {
    validateFields((err,values) => {
      if(!err) {
        onsubmit(values);
        setVisble(false)
      }
    })
  }

  const handleDelete = () => {

  }

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        visible={visble}
        width={720}
      >
        <Form {...formItemLayout}>
          <Form.Item label='班次编号'>
            {
              getFieldDecorator('NO', {}
              )(<Input />)
            }

          </Form.Item>

          <Form.Item label='班次名称'>
            {
              getFieldDecorator('name', {}
              )(<Input />)
            }

          </Form.Item>

          <Form.Item label='值班时段'>
            {
              getFieldDecorator('time', {}
              )(<Input />)
            }

          </Form.Item>

          <Form.Item label='启用状态'>
            {
              getFieldDecorator('status', {}
              )(<Input />)
            }

          </Form.Item>

          <Form.Item label='创建人'>
            {
              getFieldDecorator('person', {}
              )(<Input />)
            }

          </Form.Item>

          <Form.Item label='创建时间'>
            {
              getFieldDecorator('time', {}
              )(<Input />)
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
          
          {
            id && (
              <Button onClick={handleDelete} type='danger' ghost>
              删除
            </Button>
            )
          }
        

          

        </div>
      </Drawer>
    </>
  )
}

export default Form.create({})(AddDutyclassesSetting)