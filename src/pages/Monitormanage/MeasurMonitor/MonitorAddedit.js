import react, { Component } from 'react';
import { Card,Form, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

class MonitorAddedit extends Component {
  render() {
    console.log(this,'this');
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 5 },
        sm: { span: 5 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const required = true;
    return(
      <PageHeaderWrapper title='编辑计量业务监控配置'>
        <Card>
          <Form {...formItemLayout}>
            <Form.Item label='指标名称'>
              {getFieldDecorator('indicatoName',{
                rules:[
                  {
                    required,
                    message:'请输入'
                  }
                ],
                // initialValue:indicatoName,
              })(<Input/>)}

            </Form.Item>

            <Form.Item label='警戒值'>
              {
                getFieldDecorator('warnValue',{
                  rules:[
                    {
                      required,
                      message:'请输入'
                    }
                  ],
                  // initialValue:warnValue,
                })
                (<Input/>)
              }

            </Form.Item>

            <Form.Item label='备注'>
              {
              //   getFieldDecorator('remark',{

              // })
              (<Input/>)}

            </Form.Item>

            <Form.Item label='设置人'>
              {
                // getFieldDecorator('setMan',{

                // })
                (<Input/>)

              }

            </Form.Item>

            <Form.Item label='设置时间'>
              {
                getFieldDecorator('setTime',{

                })
              }

            </Form.Item>

          </Form>

        </Card>

      </PageHeaderWrapper>
    );
  }
}

MonitorAddedit.defaultProps = {
  record: {
    indicatoName:'',
    warnValue:'',
    remark:'',
    setMan:'',
    setTime:''
  }
}
export default Form.create()(MonitorAddedit);
