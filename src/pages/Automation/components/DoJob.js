/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Form, Input,  Modal, Radio, Select} from 'antd';
import FormItem from 'antd/lib/form/FormItem';


const formItemLayout = {
  labelCol:{
      xs:{ span : 24 },
      sm:{ span :4}

  },
  wrapperCol:{
      xs:{ span : 24 },
      sm:{ span :20 }
  },
  colon : false
}
const formipLayout = {
  labelCol:{
      xs:{ span : 24 },
      sm:{ span :9}

  },
  wrapperCol:{
      xs:{ span : 24 },
      sm:{ span :15 }
  },
  colon : false
}
// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {})=>{
  return <element.type {...element.props} onClick={handleClick} />
}
class DoJob extends Component {
  state = {
    visible: false,
};

handleopenClick = () =>{
  this.setState({
      visible: true,
  });
}

hanldleCancel = () => {
  this.setState({
      visible: false,
  });
}

handleOk = () => {
  this.props.form.validateFields((err,values) => {
      if(!err){
          // 关闭弹窗                
          this.hanldleCancel();
          // 传数据
          this.props.onDoSumit(values);
          // console.log(values);
      }
  });
}

  render() {
    const { visible} = this.state;
    const { children } = this.props;
    const {getFieldDecorator} = this.props.form;
    const required = true;
    const {id,name} =this.props.record;
    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title="快速执行作业"
          visible={visible}
          centered
          maskClosable={false}
          onCancel={this.hanldleCancel}
          onOk={this.handleOk}
        >
          <Form {... formItemLayout}>
            <Form.Item label="作业名称">
              {getFieldDecorator('jobname',{
                           rules: [
                               {
                                   required,
                                   message:'请输入作业名'
                               }
                           ],
                       })
                       (<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="脚本编码">
              {getFieldDecorator('id',{
                           initialValue: id,
                       })
                       (<Input disabled />)}
            </Form.Item>
            <Form.Item label="脚本名称">
              {getFieldDecorator('name',{
                           initialValue: name,
                       })
                       (<Input disabled />)}
            </Form.Item>
            <Form.Item label="脚本目标服务器IP名称" {... formipLayout}>
              {getFieldDecorator('serveIP',{
                           rules: [
                               {
                                   required,
                                   message:'请输入脚本目标服务器IP名称'
                               }
                           ],
                       })
                       (<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="目标服务器主机名称" {... formipLayout}>
              {getFieldDecorator('servename',{
                           rules: [
                               {
                                   required,
                                   message:'请输入目标服务器主机名称'
                               }
                           ],
                       })
                       (<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="目标服务器状态" {... formipLayout}>
              {getFieldDecorator('serveststatu',{
                           rules: [
                               {
                                   required,
                                   message:'请输入目标服务器状态'
                               }
                           ],
                       })
                       (<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="目标服务器账号" {... formipLayout}>
              {getFieldDecorator('serveaccount',{
                           rules: [
                               {
                                   required,
                                   message:'请输入目标服务器账号'
                               }
                           ],
                       })
                       (<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="目标服务器操作系统版本" {... formipLayout}>
              {getFieldDecorator('system',{
                           rules: [
                               {
                                   required,
                                   message:'目标服务器操作系统版本'
                               }
                           ],
                       })
                       (<Input placeholder="请输入" />)}
            </Form.Item>
          </Form>       
        </Modal>
      </>
    );
  }
}

export default Form.create() (DoJob);