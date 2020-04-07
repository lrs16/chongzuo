import React, { Component } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon } from 'antd';

const { Option } = Select;
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
// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {})=>{
  return <element.type {...element.props} onClick={showDrawer} />
}
class ScenesDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
    // this.onChange = this.onChange.bind(this);
  }

  state = {
    visible: false,
};

showDrawer = () => {
  this.setState({
    visible: true,
  });
};

onClose = () => {
  this.setState({
    visible: false,
  });
};

  render() {
    const { getFieldDecorator } = this.props.form;
    const required = true;
    const { visible} = this.state;
    const { children, title } = this.props;

    return (
      <>

        {withClick(children, this.showDrawer)}
        <Drawer
          title={title}
          width={720}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
        >
          <Form hideRequiredMark {... formItemLayout}>
            <Form.Item label="场景编码：">
              {getFieldDecorator('id',{
                          //  initialValue: id,
                       })
                       (<Input placeholder="系统生成" disabled />)}
            </Form.Item>
            <Form.Item label="场景名称：">
              {getFieldDecorator('name', {
                    rules: [{ required, message: 'Please enter' }],
                  })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="场景类型：">
              {getFieldDecorator('type', {
                    rules: [{ required, message: 'Please choose' }],
                  })(
                    <Select placeholder="请选择">
                      <Option value="private">Private</Option>
                      <Option value="public">Public</Option>
                    </Select>,
                  )}
            </Form.Item>
            <Form.Item label="场景描述：">
              {getFieldDecorator('description', {
                    rules: [
                      {
                        required,
                        message: 'please enter',
                      },
                    ],
                  })(<Input.TextArea rows={4} placeholder="请输入" />)}
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
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.onClose} type="primary">
              提交
            </Button>
          </div>
        </Drawer>
      </>
    );
  }
}
ScenesDrawer.defaultProps = {
    title:'新建运维场景',
    record:{id:'', name:'',  subDescription:''}
}
export default Form.create()(ScenesDrawer);