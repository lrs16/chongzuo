import React, { useEffect,useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Checkbox,
  Upload,
  Tabs,
  Menu,
  Table,
  Select,
  DatePicker,
  Message,
} from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Problemworkorder from './components/Problemworkorder';
import Problemflow from './components/Problemflow';
import Problemsolving from './components/Problemsolving';
import Problemreview from './components/Problemreview';
import Problemconfirmation from './components/Problemconfirmation';
import Problemregistration from './components/Problemregistration';
import Confirmationcountersignature from './components/Confirmationcountersignature';
import Problemclosed from './components/Problemclosed';
import Associateworkorder from './components/Associateworkorder';

const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24},
    sm: { span: 18 },
  },
};
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
}
function Besolveddetail(props) {
  const pagetitle = props.route.name;
  const { 
    currentProcess, 
    statue,
    currentObj,
   } = props.location.state;
   const {
     form:{ validateFields,getFieldDecorator },
     dispatch,
     registrationDetail
   } = props;
  const { params:{id}  } = props.match;
  const [tabnum,setTabnum] = useState(false);
  const panes = [
    {key:1},
    {key:2},
    {key:3}
  ];
  const [activekey,setActivekey] = useState(panes[0].key);
  const [expand, setExpand] = useState(currentProcess);

  const getRegistration = () => {
    dispatch({
      type:'problemmanage/problemRegistration',
    })
  };

  useEffect(() => {
    getRegistration();
  },[]);


  const onChange = (activekey) => {
    // console.log('activekey: ', activekey);
    setActivekey(activekey);
  }

  const handleSubmit = () => {
    validateFields((err, value) => {
      if(!err) {
        console.log(value,'value');
      }
    })

  }
  console.log(activekey,'activekey')

  return (
    <PageHeaderWrapper title={pagetitle}  >
      {
        currentObj === '问题待办' && (
           
      <Card 
        extra={
          <>
          {
            currentObj === '问题待办' && (
             
              <>
                {
                activekey === '1' && (
                  <Button 
                  type='danger'
                  ghost
                  style={{ marginRight: 8}}
                >
                  删除
                </Button>
                )
              }
                <Button 
                  type='primary'
                  style={{ marginRight: 8}}
                  onClick={handleSubmit}
                >
                  保存
                </Button>
    
                <Button
                  type='primary'
                  style={{marginRight: 8}}
                >
                  流转
                </Button>
    
                <Button 
                  type='default'
                >
                  返回
                </Button>
              </>
            )
          }
          </>
        }
      >
    {
      currentObj === '问题待办' && (
        <Tabs 
        defaultActiveKey='1'
        onChange={onChange}
        activekey={activekey}
        >
          <TabPane tab='问题工单' key={1}>
            <Problemregistration 
              currentProcess={currentProcess}
              statue={statue}
              id={id}
              currentObj={currentObj}
              />
          </TabPane>

          <TabPane tab='问题流程' key={2}>
            <Problemflow />
          </TabPane>

          <TabPane tab='关联工单' key={3}>
            <Tabs defaultActiveKey='31'>
              <TabPane tab='事件单' key='31'>
                <Associateworkorder chooseClass={1}/>
              </TabPane>
              <TabPane tab='发布单' key='32'>
                <Associateworkorder chooseClass={2}/>
              </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
        )
      }
    </Card>
        )
      }


      {/* {
        activekey === 1 && (
          <div style={{marginTop:'20px'}}>
            <Problemreview 
              currentProcess={currentProcess}
              statue={statue}
              id={id}
              currentObj={currentObj}
            />
          </div>
        )
      }
 
      {
        activekey === 1 && (
          <div style={{marginTop:'20px'}}>
            <Problemsolving 
              currentProcess={currentProcess}
              statue={statue}
              id={id}
              currentObj={currentObj}
            />
          </div>
        )
      }
 
      {
        activekey === 1 && (
          <div style={{marginTop:'20px'}}>
            <Problemconfirmation 
              currentProcess={currentProcess}
              statue={statue}
              id={id}
              currentObj={currentObj}
            />
          </div>
        )
      }
 
      {
        activekey === 1 && (
          <div style={{marginTop:'20px'}}>
            <Confirmationcountersignature 
              currentProcess={currentProcess}
              statue={statue}
              id={id}
              currentObj={currentObj}
            />
          </div>
        )
      }
 
      {
        activekey === 1 && (
          <div style={{marginTop:'20px'}}>
            <Problemclosed 
              currentProcess={currentProcess}
              statue={statue}
              id={id}
              currentObj={currentObj}
            />
          </div>
        )
      } */}

      
{/* 由于点击父页面无法拿到子组件的值因此把所有子页面表单放在父组件 */}
{/* 问题登记 */}
  {
    expand === '问题登记' && currentObj === '问题待办' && (
      <>
            <Menu
              style={{ width: '100%' }}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
            >
              <SubMenu
                  key="sub1"
                  title={
                    <>
                      <span style={{fontWeight:'900',fontSize:'17px'}}>问题登记</span>
                      {/* <Divider /> */}
                    </>
                  }
                >
                  <Menu.ItemGroup key="g1" title="">
                      <Row gutter={16}>
                        <Form {...formItemLayout}>
                          <Col span={8}>
                            <Form.Item label='问题编号'>
                              { getFieldDecorator('questionNumber',{
                                rules:[
                                  {
                                    // required,
                                    message:'请输入问题编号'
                                  }
                                ],
                                initialValue: registrationDetail.questionNumber || ''

                              })(<Input />)}
                              
                            </Form.Item>
                          </Col>

                          <Col span={8}>
                            <Form.Item label='问题来源'>
                                { getFieldDecorator('questionSource',{
                                  rules:[
                                    {
                                      // required,
                                      message:'请输入问题来源'
                                    }
                                  ],
                                  initialValue: registrationDetail.questionSource || ''
                                })(<Select/>)}
                        
                              </Form.Item>
                          </Col>
                        
                          <Col span={8}>
                            <Form.Item label='问题分类'>
                                { getFieldDecorator('problemClass',{
                                  rules:[
                                    {
                                      // required,
                                      message:'请输入问题分类'

                                    }
                                  ],
                                  // initialValue: registrationDetail.problemClass || ''
                                })(<Select/>)}
                                </Form.Item>
                          </Col>
                        

                          <Col span={8}>
                            <Form.Item label='紧急度'>
                              { getFieldDecorator('urgency',{
                                rules:[
                                  {
                                    // required,
                                    message:'请输入紧急度'
                                  }
                                ],
                                // initialValue: registrationDetail.urgency || ''
                              })(<Select/>)}

                            </Form.Item>
                          </Col>

                          <Col span={8}>
                            <Form.Item label='影响度'>
                              { getFieldDecorator('influenceDegree',{
                                rules:[
                                  {
                                    // required,
                                    message:'请输入影响度'
                                  }
                                ],
                                // initialValue: registrationDetail.influenceDegree || ''
                              })(<Select/>)}

                            </Form.Item>
                          </Col>

                          <Col span={8}>
                            <Form.Item label='优先级'>
                              { getFieldDecorator('priority',{
                                rules:[{
                                  // required,
                                  message:'请输入优先级'
                                }
                            
                                ],
                                // initialValue: registrationDetail.priority || ''
                              })(<Select/>)}
                          </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label='填报人单位'>
                              { getFieldDecorator('applicant',{
                                rules:[{
                                  // required,
                                  message:'请输入填报人单位'
                                }
                            
                                ],
                                // initialValue: registrationDetail.applicant || ''
                              })(<Select/>)}
                          </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label='填报人部门'>
                              { getFieldDecorator('departmentApplicant',{
                                rules:[{
                                  // required,
                                  message:'请输入填报人部门'
                                }
                            
                                ],
                                // initialValue: registrationDetail.departmentApplicant || ''
                              })(<Select/>)}
                          </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label='填报人'>
                              { getFieldDecorator('filledBy',{
                                rules:[{
                                  // required,
                                  message:'请输入优先级'
                                }
                            
                                ],
                                // initialValue: registrationDetail.filledBy || ''
                              })(<Select/>)}
                          </Form.Item>
                          </Col>
                          
                          <Col span={8}>
                            <Form.Item label='联系电话'>
                              { getFieldDecorator('contactNumber',{
                                rules:[
                                  {
                                    // required,
                                    message:'请输入联系电话'
                                  }
                                ],
                                // initialValue: registrationDetail.contactNumber || ''
                              })(<Input/>)}
                            </Form.Item>
                          </Col>

                          <Col span={8}>
                              <Form.Item label='登记时间'> 
                                { getFieldDecorator('registrationTime',{
                                  rules:[
                                    {
                                      // required,
                                      message:'请输入登记时间'

                                    }
                                  ],
                                  // initialValue: registrationDetail.registrationTime || ''
                                })(<DatePicker showTime />)}
                              </Form.Item>
                          </Col>

                          <Col span={8}>
                            <Form.Item label='建单时间'>
                              { getFieldDecorator('orderCreatetime',{
                                rules:[
                                  {
                                    // required,
                                    message:'请输入建单时间'
                                  }
                                ],
                                // initialValue: registrationDetail.orderCreatetime || ''
                              })(<DatePicker showTime />)}
                            </Form.Item>
                          </Col>

                          <Col span={24} >
                          <Form.Item label='问题标题' {...forminladeLayout}>
                            { getFieldDecorator('questionTitle',{
                              rules:[
                                {
                                  //  required,
                                  message:'请输入问题标题'
                                }
                              ],
                              // initialValue: registrationDetail.questionTitle || ''
                            })(<Input/>)}
                          </Form.Item>
                          </Col>

                          <Col span={24}>
                          <Form.Item label='问题描述' {...forminladeLayout}>
                            { getFieldDecorator('problemDescription',{
                              rules:[
                                {
                                  //  required,
                                  message:'请输入问题描述'
                                }
                              ],
                              // initialValue: registrationDetail.problemDescription || ''
                            })(<TextArea/>)}
                            </Form.Item>
                            </Col>

                          {/* <Col span={8}>
                          <Form.Item label='上传附件'>

                          </Form.Item>
                        </Col> */}
                        </Form>
                      </Row>
                  </Menu.ItemGroup>
                
                </SubMenu>
  

            </Menu>
          </>
        )
  }

{/* 问题审查 */}
  { 
    expand === '问题审核' && currentObj === '问题待办' && (
      <>
          <Menu
    // onClick={this.handleClick}
            style={{ width: '100%' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
              key="sub1"
              title={
                <>
                  <span style={{fontWeight:'900',fontSize:'17px'}}>问题审核</span>
                  {/* <Divider /> */}
                </>
              }
            >
              <Menu.ItemGroup key="g1">
                  <Row gutter={16}>
                    <Form {...formItemLayout}>
                      <Col span={8}>
                        <Form.Item label='审核单位'> 
                          { getFieldDecorator('auditUnit',{
                            // initialValue: reviewInfo.auditUnit || ''
                          })(<Input />)}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label='审核部门'>
                          { getFieldDecorator('auditDepartment',{
                            // initialValue: reviewInfo.auditDepartment || ''
                          })(<Input />)}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label='审核人'>
                        { getFieldDecorator('Reviewer',{
                            //  initialValue: reviewInfo.Reviewer || ''
                        })(<Input />)}
                        </Form.Item>
                        </Col>

                      <Col span={24} >
                        <Form.Item label='审核时间' {...forminladeLayout}>
                          { getFieldDecorator('auditTime',{
                          })(<DatePicker showTime />)}
                        </Form.Item>
                      </Col>

                      <Col span={24} >
                        <Form.Item label='审核意见' {...forminladeLayout}>
                          { getFieldDecorator('auditOpinion',{
                                // initialValue: reviewInfo.auditOpinion || ''
                          })(<Input />)}
                        </Form.Item>
                      </Col>
                    </Form>
                </Row>
            </Menu.ItemGroup>
          </SubMenu>
        </Menu>
          </>
  )}

{/* 问题处理 */}
  {
    expand === '问题处理' && currentObj === '问题待办'  && (
      <>
          <Menu
            style={{ width: '100%' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
                key="sub1"
                title={
                  <>
                    <span style={{fontWeight:'900',fontSize:'17px'}}>问题处理</span>
                    {/* <Divider /> */}
                  </>
                }
              >
                <Menu.ItemGroup key="g1">
                    <Row gutter={16}>
                      <Form {...formItemLayout}>
                        <Col span={8}>
                          <Form.Item label='处理单位'>
                            { getFieldDecorator('processingUnit',{
                              // initialValue: solvingInfo.processingUnit  || ''
                            })(<Input/>)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label='处理部门'>
                            { getFieldDecorator('processingDepartment',{
                              //  initialValue: solvingInfo.processingDepartment  || ''
                            })(<Input/>)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label='处理人'>
                            { getFieldDecorator('handler',{
                              // initialValue: solvingInfo.handler  || ''
                            })(<Input/>)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label='接单时间'>
                            { getFieldDecorator('orderReceivingtime',{
                              //  initialValue: solvingInfo.orderReceivingtime  || ''
                            })(<DatePicker showTime />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label='处理时间'>
                            { getFieldDecorator('processingTime',{
                              //  initialValue: solvingInfo.processingDepartment  || ''
                            })(<DatePicker showTime />)}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label='处理结果'>
                            { getFieldDecorator('processingResults',{
                              // initialValue: solvingInfo.processingResults  || ''
                            })(<Input />)}
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item label='解决方案' {...forminladeLayout}>
                            { getFieldDecorator('solution',{
                              //  initialValue: solvingInfo.solution  || ''
                            })(<TextArea />)}
              
                          </Form.Item>
                        </Col>
                      </Form>
                    </Row>
                </Menu.ItemGroup>
                </SubMenu>
              </Menu>
              </>
    )
  }

{/* 问题确认 */}
  {
    expand === '问题确认' && currentObj === '问题待办' && (
      <>
          <Menu
    // onClick={this.handleClick}
            style={{ width: '100%' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
                  key="sub1"
                  title={
                    <>
                      <span style={{fontWeight:'900',fontSize:'17px'}}>问题确认</span>
                      {/* <Divider /> */}
                    </>
                  }
                >
                    <Menu.ItemGroup key="g1">
                        <Row gutter={16}>
                          <Form {...formItemLayout}>
                            <Col span={8}>
                              <Form.Item label='确认单位'>
                                { getFieldDecorator('confirmationUnit',{
                                  //  initialValue: confirmInfo.confirmationUnit || ''
                                })(<Input/>)}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label='确认部门'>
                                { getFieldDecorator('confirmationDepartment',{
                                    // initialValue: confirmInfo.confirmationDepartment || ''
                                })(<Input/>)}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label='确认人'>
                                { getFieldDecorator('confirmer',{
                                  // initialValue: confirmInfo.confirmer || ''
                                })(<Input/>)}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label='确认结果'>
                                { getFieldDecorator('confirmResults',{
                                  // initialValue: confirmInfo.confirmResults || ''
                                })(<Input  />)}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label='确认时间'>
                                { getFieldDecorator('confirmTime',{
                                  // initialValue: confirmInfo.confirmTime || ''
                                })(<DatePicker showTime />)}
                              </Form.Item>
                            </Col>
                      
                            <Col span={24}>
                              <Form.Item label='确认意见' {...forminladeLayout}>
                                { getFieldDecorator('confirmOpinion',{
                                  // initialValue: confirmInfo.confirmOpinion || ''
                                })(<TextArea />)}
                              </Form.Item>
                            </Col>
                          </Form>
                        </Row>
                    </Menu.ItemGroup>
                </SubMenu>
              </Menu>
          </>
    )
  }

{/* 确认会签 */}
  {
    expand === '确认会签' && currentObj === '问题待办' && (
      <>
          <Menu
            style={{ width: '100%' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
                key="sub1"
                title={
                  <>
                    <span style={{fontWeight:'900',fontSize:'17px'}}>确认会签</span>
                    {/* <Divider /> */}
                  </>
                }
              >
                <Menu.ItemGroup key="g1">
                  <Row gutter={16}>
                    <Form {...formItemLayout}>
                      <Col span={8}>
                        <Form.Item label='会签单位'>
                          { getFieldDecorator('confirmationUnit',{
                            // initialValue: counterInfo.confirmationUnit || ''
                          })(<Input/>)}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label='会签部门'>
                          { getFieldDecorator('confirmationDepartment',{
                            // initialValue: counterInfo.confirmationDepartment || ''
                          })(<Input/>)}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label='会签人'>
                          { getFieldDecorator('confirmer',{
                            // initialValue: counterInfo.confirmer || ''
                          })(<Input/>)}
                        </Form.Item>
                      </Col>
                    
                      <Col span={24}>
                        <Form.Item label='会签意见' {...forminladeLayout}>
                          { getFieldDecorator('confirmOpinion',{
                            // initialValue: counterInfo.confirmOpinion || ''
                          })(<TextArea />)}
                        </Form.Item>
                      </Col>
                    </Form>
                  </Row>
            </Menu.ItemGroup>
          </SubMenu>
        </Menu>
      </>
    )
  }

{/* 确认关闭 */}
  {
      expand === '问题关闭' && currentObj === '问题待办' && (
        <>
        <Menu
          style={{ width: '100%' }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
           <SubMenu
              key="sub1"
              title={
                <>
                  <span style={{fontWeight:'900',fontSize:'17px'}}>问题关闭</span>
                </>
              }
            >
              <Menu.ItemGroup key="g1">
                <Row gutter={16}>
                  <Form {...formItemLayout}>
                    <Col span={8}>
                      <Form.Item label='关闭单位'>
                        { getFieldDecorator('closeUnit',{
                          //  initialValue: closeInfo.closeUnit || ''
                        })(<Input/>)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label='关闭部门'>
                        { getFieldDecorator('confirmationDepartment',{
                          //  initialValue: closeInfo.confirmationDepartment || ''
                        })(<Input/>)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label='关闭人'>
                        { getFieldDecorator('confirmer',{
                          //  initialValue: closeInfo.confirmer || ''
                        })(<Input/>)}
                      </Form.Item>
                    </Col>
                  
                    <Col span={24}>
                      <Form.Item label='问题总结' {...forminladeLayout}>
                        { getFieldDecorator('confirmOpinion',{
                          //  initialValue: closeInfo.confirmOpinion || ''
                        })(<TextArea />)}
                      </Form.Item>
                    </Col>
                  </Form>
                </Row>
              </Menu.ItemGroup>
            </SubMenu>
          </Menu>
        </>
      
      )
  }
    </PageHeaderWrapper>
  )

}
export default Form.create({})
(
  connect(({ problemmanage, loading }) => ({
    registrationDetail:problemmanage.registrationDetail,
    loading: loading.models.problemmanage
  }))(Besolveddetail)
);