/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {Form, Input,  Drawer, Radio, Select, Upload, Button} from 'antd';
import { element } from 'prop-types';

const {TextArea} = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const formItemLayout = {
    labelCol:{
        xs:{ span : 24 },
        sm:{ span :6}

    },
    wrapperCol:{
        xs:{ span : 24 },
        sm:{ span :18 }
    },
    colon : false
}
const statusoptions = [
  { label: 'shell', value: 'shell' },
  { label: 'bat', value: 'bat' },
  { label: 'perl', value: 'perl' },
  { label: 'python', value: 'python' },
  { label: 'powershell', value: 'powershell' },
];

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {})=>{
    return <element.type {...element.props} onClick={handleClick} />
}
class ScriptModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showElem:'none'
    };
    this.onChange = this.onChange.bind(this);
  }

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
                this.props.onSumit(values);
                // console.log(values);
            }
        });
    }

    onChange = e => {
      if (e.target.value === '本地上传') {
          this.setState({ 
            showElem: 'block',
         }) 
      } else {
          this.setState({ 
            showElem: 'none',
           })
      }
      }

      // 本地上传内容写入文本框中
      getTextInfo=(file)=>{
        const reader = new FileReader();
        reader.readAsText(file,'gbk');
        reader.onload = ()=>{
         this.props.form.setFieldsValue({subDescription:reader.result});
        }
    }

    render() {
        const { visible} = this.state;
        const { children, title } = this.props;
        
        // Form双向绑定
        const {getFieldDecorator} = this.props.form;
        const required = true;
        // console.log(this.props.record);
        const {id,name, application, source, status, subDescription} =this.props.record;
        return (
          <>
            {withClick(children, this.handleopenClick)}
            <Drawer
              title={title}
              visible={visible}
              width={720}
              onClose={this.hanldleCancel}
              bodyStyle={{ paddingBottom: 30 }}
            >
              <Form {... formItemLayout}>
                <Form.Item label="脚本编码:">
                  {getFieldDecorator('id',{
                           initialValue: id,
                       })
                       (<Input placeholder="系统生成" disabled />)}
                </Form.Item>
                <Form.Item label="脚本名称:">
                  {getFieldDecorator('name',{
                           rules: [
                               {
                                   required,
                                   message:'请输入脚本名称'
                               }
                           ],
                           initialValue: name,
                       })
                       (<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item label="脚本应用:">
                  {getFieldDecorator('application',{
                           rules: [
                               {
                                   required,
                                   message:'请选择应用类型'
                               }
                           ],
                           initialValue: application,
                       }
                  )
                       (
                         <Select>
                           <Option value="业务应用系统">业务应用系统</Option>
                           <Option value="业务系统">业务系统</Option>
                           <Option value="测试导入">测试导入</Option>
                         </Select>
                       )}
                </Form.Item>
                <Form.Item label="脚本来源:" span={12}>
                  {getFieldDecorator('source',{
                           rules: [
                               {
                                   required,
                                   message:'请选择应用类型'
                               }
                           ],
                           initialValue: source,
                       }
                  )
                       (
                         <RadioGroup onChange={this.onChange}>
                           <Radio value="手动录入">手动录入</Radio>
                           <Radio value="本地上传">本地上传</Radio>
                         </RadioGroup>
                       )}
                </Form.Item>
                <Form.Item label="上传：" style={{display:this.state.showElem}}>
                  {getFieldDecorator('upload')
                    (
                      <Upload action="" accept="text/plain" beforeUpload={this.getTextInfo} showUploadList={false}>
                        <Button icon='upload'>导入</Button>
                      </Upload>
                        )}
                </Form.Item>
                <Form.Item label="脚本类型：">
                  {getFieldDecorator('status',{
                           rules: [
                               {
                                   required,
                                   message:'请选脚本类型'
                               }
                           ],
                           initialValue: status,
                       })
                       (
                         <Radio.Group options={statusoptions} />
                       )}
                </Form.Item>

                <Form.Item label="脚本内容：">
                  {getFieldDecorator('subDescription',{
                           rules: [
                               {
                                   required,
                                   message:'请输入脚本'
                               }
                           ],
                           initialValue: subDescription,
                       })
                       (<TextArea rows="13" allowClear placeholder="脚本内容" />)}
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
                <Button onClick={this.hanldleCancel} style={{ marginRight: 8 }}>
              取消
                </Button>
                <Button onClick={this.handleOk} type="primary">
              提交
                </Button>
              </div>
            </Drawer>
          </>
        );
    }
}
ScriptModal.defaultProps = {
    title:'新建脚本',
    record:{id:'', name:'',  subDescription:''}
}
export default Form.create() (ScriptModal) ;