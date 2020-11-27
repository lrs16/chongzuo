import React, { Component } from 'react';
import { Form, Modal,Input, TreeSelect} from 'antd';

// const { SHOW_PARENT } = TreeSelect;
const treeData = [
  {
    title:'node1',
    value:'0-0',
    key:'0-0',
    children:[
      {
        title:'child nodel',
        value:'0-0-0',
        key:'0-0-0',
      },
    ],
  },
];
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
};
const withClick = (element, handleClick = () => {}) =>{
  return <element.type {...element.props} onClick={handleClick} />;
};

class NotifiGroupadd extends Component {
  state = {
    visible:false,
  }

  handleopenClick = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,value) => {
      if(!err){
       this.handleCancel();
      };
    });

  }

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;
    const { getFieldDecorator } = this.props.form;
    const required = true;

    const tProps = {
      treeData
    };
    
    return(
      <>
      {withClick(children,this.handleopenClick)}
      <Modal
        visible={visible}
        centered
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Form {...formItemLayout}>
          <Form.Item label='名称'>
            { getFieldDecorator('name',{
              rules:[
                {
                  required,
                  message:'请输入名称'
                },
              ],
              initialValue:''
            })(<Input/>)}
          </Form.Item>

            <Form.Item label='通知组说明'>
              { getFieldDecorator('infoExplain',{
                rules:[
                  {
                    required,
                    message:'请输入通知组说明'
                  },
                ],
              })(<Input/>)}
            </Form.Item>

            <Form.Item label='订阅信息'>
              { getFieldDecorator('subInformation',{
                rules:[
                  {
                    required,
                    message:'请输入订阅信息'
                  }
                ]
              })(<Input/>)}

            </Form.Item>

            <Form.Item label='组员'>
              { getFieldDecorator('teamMembers',{
                rules:[
                  {
                    required,
                    message:'请输入组员信息'
                  }
                ]
              })(<TreeSelect {...tProps}/>)}

            </Form.Item>

        </Form>

      </Modal>

      </>
    )
   
    
  }
}
export default Form.create()(NotifiGroupadd);