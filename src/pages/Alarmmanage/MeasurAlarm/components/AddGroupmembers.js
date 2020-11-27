import React, {Component} from 'react';
import { Form, Modal, Input } from 'antd';

const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

class AddGroupmembers extends Component {

  state = {
    visible: false,
  }

  handleopenClick = () =>{
    this.setState({
      visible: true,
    })
  }

  handleOk = () => {
    this.setState({
      visible:false,
    })
  }

  handleCancel =() => {
    this.setState({
      visible: false
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {span:24},
        sm: {span:6},
      },
      wrapperCol: {
        xs: {span:24},
        sm: {span:17},
      },
      colon: true,
    }
    const { visible } = this.state;
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const required = true;

    return(
      <>
      {withClick(children, this.handleopenClick)}
      <Modal
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        centered
       
      >
        <Form {...formItemLayout}>
          <Form.Item label='告警通知人'>
            { getFieldDecorator('alertNotifier',{
              rules:[
                {
                  required,
                  message:'请输入告警通知人'
                },
              ]
            })(<Input/>)}
          </Form.Item>

          <Form.Item label='手机'>
            { getFieldDecorator('mobilePhone',{
              rules:[
                {
                  required,
                  message:'请输入手机号码'
                }
              ]
            })(<Input/>)}

          </Form.Item>

          <Form.Item label='通知方式'>
            { getFieldDecorator('notifiMethod',{
              rules:[
                {
                  required,
                  message:'请输入通知方式'
                }
              ]
            })(<Input/>)}
          </Form.Item>
        </Form>

      </Modal>

      </>
    )
  }
}
export default Form.create()(AddGroupmembers);

