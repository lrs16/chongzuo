import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, 
         Table,
         Descriptions, 
         Input, 
         Checkbox, 
         Tag,
         Form,
         Select,
         Button,   
         TimePicker,
         Popconfirm,
        message,
        Row,
        Col,
        Radio 
   } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditStrategy from './components/EditStrategy';

const { TextArea } = Input;
const { CheckableTag } = Tag;
const format = 'HH:mm';
const tagsData = ['皖苏', '李东东', '吴西西'];
const { Option } = Select;
const data = [
  {key:'',
   value:'全部'
  },
  {key:'1',
   value:'皖苏'
  },
  {
    key:'2',
   value:'李冬冬'
  },
  {
    key:'3',
   value:'吴西西'
  },
  {
    key:'4',
   value:'罗男男'
  },
  {
    key:'5',
   value:'刘北北'
  },
];
const children = [];
data.forEach(function(item,index){
  children.push(<Option key={index}>{item.value}</Option>)
})
const frequencyData = [
  {
    key:'1',
    value:'五分钟'
  },
  {
    key:'2',
    value:'十分钟'
  },
  {
    key:'3',
    value:'十五分钟'
  },
]
const frequencyChildren = [];
const delayData = [
  {
    key:'',
    value:'立刻'
  },
  {
    key:'1',
    value:'一小时后'
  },
  {
    key:'2',
    value:'两小时后'
  },
]
const delayChildren = [];
delayData.forEach(function(item,index){
  delayChildren.push(<Option key={index}>{item.value}</Option>)
})
frequencyData.forEach(function(item,index) {
  frequencyChildren.push(<Option key={index}>{item.value}</Option>)
})

const config = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
};
const formStyle = {
  marginLeft:50,
  display:'block'
};
const indexrelation = [];
let num = 1;
let show = false;
@connect(({ strategyedit, loading }) => ({
  strategyedit,
  loading: loading.models.loading,
}))
class StrategyAddEdit extends Component {
  // state = {
  //   selectedRows:[],
  //   startDate:''
  // }
  constructor(props) {
    super(props);
    this.detailsid = props.match.params.detailsid;
    this.state = {
      selectedRows:[],
      startDate:'',
  }
  }

  componentDidMount() {
    this.getDetail();
    this.getTableone();
    this.getTabletwo();
  }

  getDetail = () => {
    if(this.detailsid) {
      this.props.dispatch({
        type:'strategyedit/strategyDetail',
        payload:this.detailsid,
      });
    }
  }

  getTableone = () => {
    if(this.detailsid) {
      this.props.dispatch({
        type:'strategyedit/strategyTableone',
        payload:this.detailsid
      });
    }
  }

  getTabletwo = () => {
    // cons {detailsid = this.detailsid;
    if(this.detailsid) {
      this.props.dispatch({
        type:'strategyedit/strategyTabletwo',
        payload:this.detailsid
      });
    }
  }

  handleDeleteOk = () => {
        if (this.state.selectedRows.length){
          const idList = [];
          this.state.selectedRows.forEach(item => {
            const id = item.detailsid;
            idList.push(id);
          });
          const { dispatch } = this.props;
          dispatch({
            type:'alarmstrategy/strategyList',
            payload:{
              alarmstrategyList: idList,
            },
          }).then(() => {
            this.getDetail();
          })
        } else {
          message.info('至少选择一条数据');
        }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) =>{
      // if(!err) {
      //   const { dispatch } = this.props;
      //   return dispatch({
      //     type: '/strategyadd/strategyAdd',
      //     payload: values,
      //   }).then();
      // };
    })

  }

  save = (tableValue) => {
    this.props.form.validateFields((err, values) => {
        if(!err){
          const alarmResults =[];
          const obj = {};
          (tableValue.tableDt).forEach(function(item,index){
            alarmResults.push({name:`指标名${index+1}`,x:item.nextIndicator});
          });
          values.tableDt = tableValue.tableDt;
          alarmResults[alarmResults.length-1].x = '';
          values.result = alarmResults;
          console.log(alarmResults,'alarmResults');
          console.log(values,'lplp');
            // values.tableDt就是个表格数据的数组，可对获取的值进行处理校验处理
        }
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const { getFieldDecorator } = this.props.form;
    const required = true;

    const { strategyedit } = this.props;
    const { list, tableone, tabletwo} = strategyedit;
    const  dataSource  = [...tableone];
    const tabletwoSource = [...tabletwo];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectedRows: selectedRows,
        });
        // console.log(this.state.detailsid);
      },

    }

    const editResources = values => {
      const { dispatch } = this.props;
      return dispatch({

      }).then();
    };
//适用对象的列
    const objColumns = [
      {
        title:'IP地址',
        dataIndex:'ip',
        key:'ip'
      },
      {
        title:'监测对象',
        dataIndex:'monitorObj',
        key:'monitorObj'
      }
    ]

    return (
      <PageHeaderWrapper title="告警详细信息">
        <Card>
          <Descriptions>
            <Descriptions.Item label='告警ID'>{list.id}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card>
        <Descriptions title='告警内容' ></Descriptions>
        <Form
          onSubmit={this.handleSubmit}
          {...formItemLayout}
        >
         <Row>
           <Col span={12}>
             <Form.Item label='告警标题'>
              {getFieldDecorator('alatitle',{
                rules:[
                  {
                    required,
                    message:'请输入 '
                  },
                ],
                initialValue: list.alatitle?list.alatitle:''
              })(<Input placeholder="请输入" />)}
              </Form.Item>
           </Col>
           <Col span={12}>
             <Form.Item label='描述'>
                {getFieldDecorator('describe',{
                  rules:[
                    {
                      message:'请输入'
                    },
                  ],
                  initialValue:list.describe?list.describe:''
                })(<Input placeholder='请输入'/>)}
             </Form.Item>
           </Col>
         </Row>

           <Descriptions title='触发条件'></Descriptions>
           <EditStrategy 
            onSubmit={this.save}
            detailsid={this.detailsid}
           ></EditStrategy>
          {/* <Descriptions.Item label='在过去的:'></Descriptions.Item> */}
          {/* <Form.Item label='在过去的'  style={{marginLeft:50}}>
            {
              getFieldDecorator('past',{
                rules:[
                  {
                    required,
                  },
                ],
                initialValue:list.past?list.past:''
              })(<Select style={{width:200}}>
                   {frequencyChildren}
                 </Select>)
            }
          </Form.Item> */}
{/*          
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <div style={{display:this.detailsid?'inline-block':'none',marginTop:'5px'}}>
                <Button style={{display:'inline',marginRight:'5px'}}>取消</Button>
                <Button type='primary' htmlType='submit' onClick={this.save}>提交</Button>
              </div>
            </Col>
            
          </Row> */}
      

          {/* <Descriptions title='执行动作'></Descriptions>
          {/* <Descriptions column={1}>
            <Descriptions.Item label='通知方式:' style={{marginLeft:50}}>
              <Checkbox value='shortMessage'>短信</Checkbox>
              <Checkbox value='mail'>邮件</Checkbox>
              <Checkbox value='enterpriseCredit'>企信</Checkbox>
            </Descriptions.Item> */}
            {/* <Form.Item label='通知方式' style={{marginLeft:50, marginTop:10}}>
              {getFieldDecorator('notiMethod',{
                rules:[
                  {
                    required,
                    message:'请输入',
                  },
                ],
                initialValue:list.notiMethod?list.notiMethod:''
              })(
                <Checkbox.Group>
                  <Checkbox value='shortMessage'>短信</Checkbox>
                  <Checkbox value='mail'>邮件</Checkbox>
                  <Checkbox value='enterprise'>企信</Checkbox>
              </Checkbox.Group>
              )}


            </Form.Item> */}
{/* 
            <Form.Item label='通知对象' style={{display:'block',marginLeft:50,marginTop:20}}>
              {getFieldDecorator('notiObj',{
                rules:[
                  {
                    required,
                  },
                ],
                initialValue:list.notiObj?list.notiObj:''
              })(<Select 
                   style={{width:400}}
                   mode='multiple'
                   defaultValue={['全部']}
              >
                   {children}
                 </Select>)
              }
            </Form.Item> */}

            {/* <Form.Item label='告警频率' style={{display:'block',marginLeft:50,marginTop:20}}>
              {getFieldDecorator('alafrequency',{
                rules:[
                  {
                    required,
                  },
                ],
                initialValue:list.alafrequency?list.alafrequency:''
              })(<Select style={{width:200}}>
                   {frequencyChildren}
                 </Select>)
              }
            </Form.Item> */}

            {/* <Form.Item label='生效时间' style={{display:'block',marginLeft:50, marginTop:10}}>
                {getFieldDecorator('forcetime', {
                  rules:[
                    {
                      required
                    },
                  ],
                  initialValue: list.forcetime?moment(list.forcetime,'HH:mm'):''
                  // initialValue: moment(list.forcetime) || ''
                })(<TimePicker 
                      format={format}
                     />)}
            </Form.Item> */}

            {/* <Form.Item label='延迟策略' style={{display:'block',marginLeft:50, marginTop:15}}>
              {getFieldDecorator('delaystrate',{
                rules:[
                  {
                    required,
                  },
                ],
                initialValue:list.delaystrate?list.delaystrate:''
              })(<Select style={{width:200}}>
                   {frequencyChildren}
                 </Select>)
              }
            </Form.Item> */}

            {/* <Form.Item label='通知内容' style={{display:'block',marginLeft:50, marginTop:10}}>
              {getFieldDecorator('remark',{
                rules:[
                  {
                    required,
                  },
                ],
                initialValue:list.remark?list.remark:''
              })(
              <Input style={{width:1000}}/>)}
            </Form.Item> */}

          {/* <Descriptions title='适用对象'></Descriptions>
          <Form.Item>
            <Popconfirm title='确定删除吗？' onConfirm={this.handleDeleteOk}>
              <Button style={{float:'right'}}>删除</Button>
              {/* <Button>批量删除</Button> */}
            {/* </Popconfirm>
          </Form.Item>  */}
          
         
          {/* <EditResources
            onSumit={values => editResources(values)}>
            <Button style={{float:'right', marginRight:10,zIndex:999}}>编辑资源</Button>
          </EditResources>
          <Table 
            columns={objColumns}
            dataSource={tabletwoSource}
            rowSelection={rowSelection}
          >
          </Table> */}

        </Form>
        </Card>
      
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(StrategyAddEdit);
