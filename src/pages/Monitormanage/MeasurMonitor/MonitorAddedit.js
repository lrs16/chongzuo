import react, { Component } from 'react';
import { Card,
         Form, 
         Input,
         Descriptions,
         DatePicker,
         Select,
         Button   } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { values } from 'lodash';


const { TextArea } = Input;
const { Option } = Select;
const arr = [];
const selectData = [
  {id:'1',
   value:'采集指标情况'},
  {id:'2',
   value:'接口数据核查情况'},
  {id:'3',
   value:'KAFKA消费'},
  {id:'4',
   value:'KAFKA消费（凌晨）'},
  {id:'5',
   value:'主站系统运行'},
  {id:'6',
   value:'终端工况和数据入库'},
  {id:'7',
   value:'计量业务监测配置'},
];
selectData.forEach(function(values,index,array){
  arr.push(<Option key={values.id}>{values.value}</Option>)
});
let listData = '';
let remarkData = '';
let setpersonData = '';

class MonitorAddedit extends Component {
  componentDidMount(){
      const { data } = this.props.location.state;
      console.log(data,'data');
      data.forEach(function(item,index,array){
        listData = listData + item.indicatorName;
        remarkData = remarkData + item.remark;
        setpersonData = setpersonData + item.setPerson;
      });
      console.log(listData,'listData');
      console.log(remarkData,'remarkData');
      console.log(setpersonData,'setpersonData');
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
                initialValue:listData,
              })(<Select
                   mode='multiple'
                   style={{width:'100%'}}
                   >
                     {arr}
                  </Select>)}

            </Form.Item>

            <Form.Item label='警戒值'> 
              <Form.Item label=''
                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
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
                    (<Input type='number'/>)
                  }
                </Form.Item>

                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>

                <Form.Item label=''
                  style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
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
                  (<Input type='number'/>)
                }
              </Form.Item>
          
            </Form.Item >
              
            <Form.Item label='备注'>
              {
                getFieldDecorator('remark',{
                  initialValue:remarkData,
              })
              (<TextArea />)}

            </Form.Item>
            <Form.Item label='设置人'>
              {
                getFieldDecorator('setPerson',{
                  initialValue:setpersonData
                })(<Input />)
              }

            </Form.Item>

            <Form.Item label='设置时间'>
              {
                getFieldDecorator('setTime',{

                })(<DatePicker />)
              }

            </Form.Item>

       
            <Form.Item label=''> 
                 <Button>保存</Button>
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
