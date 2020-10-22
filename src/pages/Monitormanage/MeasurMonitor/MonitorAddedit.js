import react, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Descriptions, DatePicker, Select, Button, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { values } from 'lodash';

const { TextArea } = Input;
const { Option } = Select;
const arr = [];
const selectData = [
  { id: '1', value: '采集指标情况' },
  { id: '2', value: '接口数据核查情况' },
  { id: '3', value: 'KAFKA消费' },
  { id: '4', value: 'KAFKA消费（凌晨）' },
  { id: '5', value: '主站系统运行' },
  { id: '6', value: '终端工况和数据入库' },
  { id: '7', value: '计量业务监测配置' },
];
selectData.forEach(function(values, index, array) {
  arr.push(<Option key={values.id}>{values.value}</Option>);
});
let listData = '';
let remarkData = '';
let setpersonData = '';
let dateFormat;

@connect(({ monitorconfiguration, loading }) => ({
  monitorconfiguration,
  loading: loading.models.monitorconfiguration,
}))

class MonitorAddedit extends Component {
  componentDidMount() {
    if (this.props.location.state) {
      const { data } = this.props.location.state;
      console.log(data, 'data');
      data.forEach(function(item, index, array) {
        listData = listData + item.indicatorName;
        remarkData = remarkData + item.remark;
        setpersonData = setpersonData + item.setPerson;
      });
    }
 
  }
  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,value) => {
      if(err) {
        return;
      }
      value.setTime = this.dateFormat;
      console.log(value,'ff');
      // const { dispatch } = this.props;
      this.props.dispatch({
        type:'monitorconfiguration/fetch',
        payload:{value}
      })
      this.props.history.goBack();
      // .then(res => {
      //   if(res.code === 200) {
      //     message.info(msg);
      //     this.props.history.goBack();
      //   }else {
      //     message.info(res.msg);
      //   }
      // })
    })
  }

  onChange = (date, dateString) => {
    this.dateFormat = dateString;
    
  }


  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const required = true;
    console.log(this,'this');
    return (
      <PageHeaderWrapper title="编辑计量业务监控配置">
        <Card>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="指标名称">
              {getFieldDecorator('indicatoName', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: listData ? listData : '',
              })(
                <Select mode="multiple" style={{ width: '100%' }}>
                  {arr}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="警戒值">
              <Form.Item label="" style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {getFieldDecorator('warnValue', {
                  rules: [
                    {
                      required,
                      message: '请输入',
                    },
                  ],
                  // initialValue:warnValue,
                })(<Input type="number" />)}
              </Form.Item>

              <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>

              <Form.Item label="" style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {getFieldDecorator('warnValue', {
                  rules: [
                    {
                      required,
                      message: '请输入',
                    },
                  ],
                  // initialValue:warnValue,
                })(<Input type="number" />)}
              </Form.Item>
            </Form.Item>

            <Form.Item label="备注">
              {getFieldDecorator('remark', {
                initialValue: remarkData ? remarkData : '',
              })(<TextArea />)}
            </Form.Item>
            <Form.Item label="设置人">
              {getFieldDecorator('setPerson', {
                initialValue: setpersonData ? setpersonData : '',
              })(<Input />)}
            </Form.Item>

            <Form.Item label="设置时间">
              {getFieldDecorator('setTime', {})(<DatePicker onChange={this.onChange}/>)}
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type='primary' htmlType='submit'>保存</Button>
              <Button style={{marginLeft:'10px'}}>取消</Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

MonitorAddedit.defaultProps = {
  record: {
    indicatoName: '',
    warnValue: '',
    remark: '',
    setMan: '',
    setTime: '',
  },
};
export default Form.create()(MonitorAddedit);
