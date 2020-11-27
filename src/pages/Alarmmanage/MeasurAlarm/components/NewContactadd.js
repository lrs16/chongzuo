import React,{Component} from 'react';
import { 
  Form,
  Modal,
  Input,
  message
} from 'antd';

const withClick = (element,handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
const detailData = {};
const formItemLayout = {
  labelCol: {
    xs:{span:24},
    sm:{span:6},
  },
  wrapperCol:{
    xs:{span:24},
    sm:{span:17}
  },
  colon: true
}
class NewContactadd extends Component {

  state = {
    visible:false
  }

  handleopenClick = () =>{
    const { contactId } = this.props;
    if(contactId) {
      this.handleIdClick();
    } else {
      this.handleAddclick();
    }
  }

  handleIdClick = () => {
    const { selectedRows } = this.props;
    if(selectedRows.length === 1) {
      selectedRows.forEach(function(item) {
        detailData.fullName = item.fullName;
        detailData.systemAccount = item.systemAccount;
        detailData.telephoneNumber = item.telephoneNumber;
        detailData.organization = item.organization;
  });
      this.setState({
        visible: true
      })
    } else {
      message.info('请选中一条数据进行编辑');
    }
  }

  handleAddclick = () => {
    const { selectedRows } = this.props;
    if(selectedRows.length === 0) {
      Object.keys(detailData).forEach(key=>{detailData[key]=''});
      this.setState({
        visible: true
      });
    } else {
      message.info('添加时不能选择用户');
    }
  }


  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,value) => {
      if(!err) {
        this.handleCancel();
        this.props.form.resetFields();
      }
    }) 
  }
  
  render() {
    const { visible } = this.state;
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const required = true;

 
  
    return (
      <>
      {withClick(children,this.handleopenClick)}
      <Modal 
        visible={visible}
        centered
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Form {...formItemLayout}>
          <Form.Item label='姓名'>
            { getFieldDecorator('fullName',{
              rules:[
                {
                  required,
                  message:'请输入姓名'
                }
              ],
              initialValue: detailData.fullName || ''
            })(<Input/>)}
          </Form.Item>

          <Form.Item label='系统账号'>
            { getFieldDecorator('systemAccount',{
              rules:[
                {
                  required,
                  message:'请输入系统账号'
                }
              ],
              initialValue: detailData.systemAccount || ''
            })(<Input/>)}
          </Form.Item>

          <Form.Item label='电话号码'>
            { getFieldDecorator('telephoneNumber',{
              rules: [
                {
                  required,
                  message:'请输入电话号码'
                }
              ],
              initialValue: detailData.organization || ''
            })(<Input/>)}
          </Form.Item>

          <Form.Item label='所属组织'>
            { getFieldDecorator('Organization',{
              rules:[
                {
                  required,
                  message:'请输入所属组织'
                }
              ],
              initialValue: detailData.fullName || ''
            })(<Input/>)}

          </Form.Item>
        </Form>

      </Modal>
      </>
    )
  }

}
export default Form.create()(NewContactadd);