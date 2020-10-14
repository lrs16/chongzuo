import React, { Component } from 'react';
import { Form, Input, Modal, Button,Layout   , Alert  } from 'antd';
import { ip_reg } from '@/utils/Regexp';

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
let id = 0;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
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
      if(!err){
        const batchInfo = {batchData:''};
        batchInfo.batchData = (values.info).replace(/；/ig,';');
        const { hostId,softId } = this.props;
        if(hostId){
          this.hanldleCancel();
          this.props.onsumitBatch(batchInfo);
        }else if(softId){
        } else {
          this.hanldleCancel();
          this.props.onsumitBatchprocess(batchInfo);
        }
      }
    });
  };

  validatorIp = (rule,value,callback) =>{
    const { hostId } = this.props;
    if(hostId){
      const end = value.substr(value.length-1,1);
      const arrayData = value.split(/;|；|\s+/);
      for(let j=0;j<arrayData.length;j++){
        const ip = arrayData[j];
        // 查找逗号的个数
        const c = ',';
        const regex = new RegExp(c, 'g');
        const result = arrayData[j].match(regex);
        const count = !result ? 0 : result.length;
        // 查找分号的个数
        
        const strIp = (arrayData[j]).replace(/，/ig,',');
        const data = strIp.substring(strIp.length-1,strIp.length);
        const IpIndex = strIp.indexOf(',');
        const ipData = strIp.substring(IpIndex+1,strIp.length);
  
        if(!(end == (';'))){
          console.log('end');
          callback(rule.message);
        }
        if(!(count == 1) && !(ipData == '')){
          console.log('count');
          callback(rule.message);
        }
  
        if(!ipData.match(rule.pattern) && !ipData == '') {
          console.log('ip');
          callback(rule.message);
        } else if((data === '' )){ //有分号且ipdata（分号后自动分隔）为空的时候取消告警
          console.log(';');
          callback();
        } else {
          console.log('err');
        // callback();
      }
    }
    }else {
      const end = value.substr(value.length-1,1);
      if(!(end == ';')){
        callback(rule.message);
      } else {
        callback();
      }
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
          height={600}
          maskClosable={false}
          onCancel={this.hanldleCancel}
          onOk={this.handleSubmit}
        >
          <Button type="primary" onClick={this.add} style={{marginBottom:'10px'}}>
            {this.props.hostId?'批量添加主机信息':'批量添加进程信息'}
          </Button>
   
          <Form 
            // layout="inline"
            id='myForm' 
            style={{ display: 'none'}}>
              {/* <Layout> */}
              <Form.Item label=''>
                    {
                      getFieldDecorator('info',{
                        rules:[
                          {
                            pattern: ip_reg,
                            validator:this.validatorIp,
                            message:'请输入正确的正确的信息格式',
                          }
                        ]
                      })(
                          <Header style={{backgroundColor:'blue',padding:'0px',height:'500px'}}>
                            <TextArea style={{height:'500px'}}/>
                          </Header>
                        )
                    }
              </Form.Item>
              <Alert 
                message={hostId?'主机提交格式：xxx(主机名称) , xxx(主机IP); xxx(主机名称) , xxx(主机IP);注:分号需在英文模式下':'进程提交格式:xxx(进程代码) , xxx(进程名称); xxx(进程代码) , xxx(进程名称);分号需在英文模式下'} 
                banner 
                style={{width:'100%'}}
                />    
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(BatchAdd);
