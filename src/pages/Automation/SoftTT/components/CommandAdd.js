import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Select } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
  colon: false,
};
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
}
const { Option } = Select;
const { TextArea } = Input;
//  命令类型 
const selectType = [
  {
    key:'1',
    value:'ssh命令'
  },
  {
    key:'2',
    value:'cmd命令'
  },
  {
    key:'3',
    value:'其他命令'
  },
];
const selectData = [];
selectType.forEach(function(item){
selectData.push(<Option value={item.key} key={item.key}>{item.value}</Option>)
});
//  命令分类
const  commandClassification = [
  {
    key:'1',
    value:'基础命令'
  },
  {
    key:'2',
    value:'网络命令'
  },
  {
    key:'3',
    value:'查找命令'
  },
  {
    key:'4',
    value:'其他命令'
  },
];
const classData = [];
commandClassification.forEach(function(item){
  classData.push(<Option value={item.key} key={item.key}>{item.value}</Option>)
});
//  命令状态下拉值
const statu = [
  {
    key:'1',
    value:'使用'
  },
  {
    key:'0',
    value:'不使用'
  },
];
const statuData = [];
statu.forEach(function(item){
statuData.push(<Option value={item.key} key={item.key}>{item.value}</Option>)
});
@connect(({ commandconfigurate, loading }) => ({
  commandconfigurate,
  loading:loading.models.commandconfigurate
}))
class CommandAdd extends Component {
  
  state = {
    visible: false,
    data:{
      id:'',
      commandType:'',
      commandClass:'',
      commandName:'',
      commandSrc:'',
      commandState:'',
      commandSort:'',
      commandRemark:'',
    }
  };

  handleopenClick = () => {
    const { id } = this.props;
    if(id){
      this.props.dispatch({
        type:'commandconfigurate/editSearchinfo',
        payload:{id}
      }).then(res => {
        this.setState({data:res.data});
      });
    }
    this.setState({
      visible: true,
    });
       
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk = () =>{
    this.props.form.validateFields((err, values) => {
      if(!err) {
        this.handleCancel();
        this.props.onSumit(values);
        this.props.form.resetFields();
      }
    })
    
  }

  render() {
    // const {commandconfigurate:{ editInfo }} = this.props;
    const { visible } = this.state;
    const { children, title } = this.props;
    const { getFieldDecorator } = this.props.form;
    const required = true;
    const {
      id,
      commandType,
      commandClass,
      commandName,
      commandSrc,
      commandState,
      commandSort,
      commandRemark,
      // founder
    } = this.state.data;
    console.log(this.state.data);


    return (
      <>
      {withClick(children,this.handleopenClick)}
      <Modal
        title={title}
        visible={visible}
        centered
        maskClosable='true'
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        >
          <Form {...formItemLayout}>
            <Form.Item label='数据编号'>
              {
                getFieldDecorator('id',{
                  initialValue:id
                })(<Input disabled/>)
              }
            </Form.Item>


            <Form.Item label='命令类型'>
            {
                getFieldDecorator('commandType',{
                  rules:[
                    {
                      required,
                      message:'命令类型不能为空'
                    }
                  ],
                  initialValue:commandType||'1'
                })(
                <Select 
                     getPopupContainer={triggerNode => triggerNode.parentNode}
                    //  defaultValue='1'
                     >
                  {selectData}
                </Select>
                )
              }
            </Form.Item>

            <Form.Item label='命令分类'>
              {
                getFieldDecorator('commandClass',{
                  rules:[
                    {
                      required,
                      message:'命令分类不能为空'
                    }
                  ],
                  initialValue:commandClass||'1'
                })(<Select
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  // defaultValue='1'
                >
                    {classData}
                </Select>)
              }

            </Form.Item>

            <Form.Item label='命令名称'>
            {
                getFieldDecorator('commandName',{
                  rules:[
                    {
                      required,
                      message:'命令名称不能为空'
                    }
                  ],
                  initialValue:commandName
                })(<Input />)
              }
            </Form.Item>

            <Form.Item label='命令源码'>
            {
                getFieldDecorator('commandSrc',{
                  rules:[
                    {
                      required,
                      message:'命令源码不能为空'
                    }
                  ],
                  initialValue:commandSrc
                })(<TextArea />)
              }
            </Form.Item>

            <Form.Item label='命令状态'>
            {
                getFieldDecorator('commandState',{
                  initialValue:commandState||'1'
                })(<Select
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  // defaultValue='1'
                >
                    {statuData}
                  </Select>)
              }
            </Form.Item>

            <Form.Item label='命令排序'>
            {
                getFieldDecorator('commandSort',{
                  initialValue:commandSort||'0'
                })(<Input type='number'/>)
              }
            </Form.Item>
            <Form.Item label='命令备注'>
            {
                getFieldDecorator('commandRemark',{
                  initialValue:commandRemark
                })(<Input />)
              }
            </Form.Item>

            {/* <Form.Item label='创建人'>
            {
                getFieldDecorator('founder',{
                  initialValue:founder
                })(<Input />)
              }
            </Form.Item> */}

          </Form>

      </Modal>
      </>
    )
  }
}
CommandAdd.defaultProps = {
  title:'添加命令',
  record: {
    id:'',
    commandType:'',
    commandClass:'',
    commandName:'',
    commandSrc:'',
    commandState:'',
    commandSort:'',
    commandRemark:'',
    // founder:''
  }
}
export default Form.create()(CommandAdd);