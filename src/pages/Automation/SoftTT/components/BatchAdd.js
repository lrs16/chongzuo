import React, { Component } from 'react';
import { Form, Input, Modal, Button,Icon, message } from 'antd';
import { ip_reg } from '@/utils/Regexp';

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
let id = 0;
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
    var list = [];
    setTimeout(() => {
      this.setState({
        resultIndex: list,
      })
    },0);
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // for(let i=0;i<(values.demo).length;i++){
        //   if(((values.demo)[i]).match(ip_reg) instanceof Array){
          
        //   }else {
        //     message.info('请输入正确的IP地址');
        //     return ;
        //   }
        // }
       
        const { keys, names,demo } = values;
        var i=0;
        var index = [];
        for(;i<names.length;i++){
          index.push(i);
        }
        setTimeout(() => {
          this.setState({
            resultIndex: index,
          })
        },0);
        var k = 0;
        var j = 0;
        for(;k<demo.length*2;k++){
          if(k%2 == 0){
          } else {
            names.splice(k,0,demo[index[j]]);
            j++;
          }
        }
        var result = names.filter(d=>d);
        var str = '';
        var p = 0;
        const obj = {batchData:''};
        for(;p<result.length;p++){
          if(p%2 == 0){
            str += result[p] + ',';
          } else {
            str += result[p] + ';';
          }
        }
        obj.batchData = str;
        console.log(obj.batchData,'obj');
        const { hostId,softId,processId } = this.props;
        if(hostId){
          this.hanldleCancel();
          this.props.onsumitBatch(obj);
        }else if(softId){
        } else {
          this.hanldleCancel();
          this.props.onsumitBatchprocess(obj);
        }
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

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;
    const { hostId,softId,processId } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    // Form双向绑定
    const required = true;
    const formItems = keys.map((k, index) => (
      <>
      <div style={{display:'flex', flexDirection:'row',marginTop:20}}>
        <div>
          <Form.Item
          // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          {...( formItemLayout)}
          // label={index === 0 ? 'Passengers' : ''}
          label={hostId?'主机名':(softId?'软件代码:':'代码:')}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入",
              },
            ],
          })(<Input style={{ width: '90%' }} />)}
          </Form.Item>
        </div>
        <div>
          <Form.Item
            // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            {...( formItemLayout)}
            // label={index === 0 ? 'Passengers' : ''}
            label={hostId?'主机IP':(softId?'软件名称':'名称')}
            required={false}
            key={k}
          >
            {getFieldDecorator(`demo[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "请输入",
                },
                {
                  pattern:ip_reg,
                  validator: this.validatorPwd,
                  message:'请输入正确的IP地址'
                }
              ],
            })(<Input style={{ width: '90%'}} />)}
              {keys.length >= 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              />
            ) : null}
          </Form.Item>
        </div>
      </div>
      </>
    ));

    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          centered
          maskClosable={false}
          onCancel={this.hanldleCancel}
          onOk={this.handleSubmit}
        >
          <Form>
            {formItems}
            <Form.Item style={{position:'absolute',left:0,top:0}}>
              <Button type="primary" onClick={this.add} style={{ width: '100%' }}>
                添加
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(BatchAdd);
