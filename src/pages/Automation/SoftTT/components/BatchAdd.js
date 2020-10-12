import React, { Component } from 'react';
import { Form, Input, Modal, Button,Tag , Alert  } from 'antd';
import { ip_reg } from '@/utils/Regexp';

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
let id = 0;
const { TextArea } = Input;
class BatchAdd extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    resultIndex:[],
    visible: false,
  }

  handleopenClick = () => {
    this.setState({
      visible: true,
    });
  };

  hanldleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  hanldleCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  };

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    document.getElementById('myForm').style.display = 'block';
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const batchInfo = {batchData:''};
      batchInfo.batchData = (values.info).replace(/；/ig,';');
      const { hostId,softId,processId } = this.props;
      if(hostId){
        this.hanldleCancel();
        this.props.onsumitBatch(batchInfo);
      }else if(softId){
      } else {
        this.hanldleCancel();
        this.props.onsumitBatchprocess(batchInfo);
      }
    });
  };

  validatorPwd = (rule,value,callback) => {
    if(this.props.hostId){
      if(value && rule.pattern && !value.match(rule.pattern)){
        callback(rule.message);
      }else {
        callback();
      } 
    }else {
      callback();
    }
  }

  validatorIp = (rule,value,callback) =>{
    console.log('index');
    const { hostId,softId,processId } = this.props;
    const arrayData = value.split(/;|；|\s+/);
    console.log(arrayData);
    const hostArr = [];
    for(let i=0;i<arrayData.length;i++){
      hostArr.push(arrayData[i]);
    }
    for(let j=0;j<hostArr.length;j++){
      const ip = hostArr[j];
      console.log(ip);
      const c = ',';
      const regex = new RegExp(c, 'g');
      const result = hostArr[j].match(regex);
      const count = !result ? 0 : result.length;
      const strIp = (hostArr[j]).replace(/，/ig,',');
      // const data = effectInfo.substring(effectInfo.length-1,effectInfo.length);
      //console.log(strIp,'strIp');
      const IpIndex = strIp.indexOf(',');
      //console.log(IpIndex,'IpIndex');
      const ipData = strIp.substring(IpIndex+1,strIp.length);
      console.log(ipData);
    //  console.log(ipData,'ipData');
      // num = arrayData[i].split(';').length - 1;
      // num.push(num);
      // if(num>1){
      //   callback(rule.message);
      // }
      // if(!(data == ';')){
      //   callback(rule.message); 
      // }
      // if(count > 1) {
      //   callback(rule.message);
      //   }
  
      if( !(ipData).match(rule.pattern)) {
        callback(rule.message);
        console.log("-------------------------");
      }else {
        console.log('uu');
        callback();
      }
      // if(count == 0) {
      //   callback(rule.message);
      // }
    }
  
    
  }

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;
    const { hostId,softId,processId } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    // Form双向绑定
    const required = true;

    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          centered
          width={720}
          maskClosable={false}
          onCancel={this.hanldleCancel}
          onOk={this.handleSubmit}
        >
          <Button type="primary" onClick={this.add} style={{marginBottom:'10px'}}>
            {this.props.hostId?'批量添加主机信息':'批量添加进程信息'}
          </Button>
      <Form 
        layout="inline"
        id='myForm' 
        style={{ display: 'none' }}>
        <Form.Item label='' >
          {
            getFieldDecorator('info',{
              rules:[
                {
                  pattern: ip_reg,
                  validator:this.validatorIp,
                  message:'请输入正确的正确的信息格式',
                }
              ]
            })(<TextArea style={{height:'500px',width:'600px'}}/>)
          }
        </Form.Item>
        <Alert 
          message='test' banner />
      </Form>
        
        </Modal>
      </>
    );
  }
}

export default Form.create()(BatchAdd);
