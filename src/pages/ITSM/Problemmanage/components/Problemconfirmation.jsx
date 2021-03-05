import React,{ useEffect, useState}from 'react';
import {
  From,
  Input,
  Card,
  Descriptions,
  Col,
  Row,
  Form,
  DatePicker,
  Menu,
  Divider 
  } from 'antd';
  import { connect } from 'dva';
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
  
  const { TextArea } = Input;
  const { SubMenu } = Menu;


function Problemconfirmation(props) {
  const {
    form:{ getFieldDecorator },
    id,
    dispatch,
    confirmInfo,
    currentProcess,
    statue,
    currentObj
  } = props;
  const [expand, setExpand] = useState(currentProcess);
  const [state, setState] = useState(4);

  useEffect(() => {
    dispatch({
      type:'problemmanage/problemconfirmInfo',
      payload: { id }
    })
  },[])

  return (
    <>
 
    {
      expand !== '问题确认' && statue >= state && (
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
            <span>
             <span style={{fontWeight:'900',fontSize:'17px'}}>问题确认</span>
              <Divider />
            </span>
          }
        >
          <Menu.ItemGroup>
            <Card>
              <Descriptions >
                <Descriptions.Item label='确认单位'>{confirmInfo.confirmationUnit || ''}</Descriptions.Item>
                <Descriptions.Item label='确认部门'>{confirmInfo.confirmationDepartment || ''}</Descriptions.Item>
                <Descriptions.Item label='确认人'>{confirmInfo.confirmer || ''}</Descriptions.Item>
                <Descriptions.Item label='确认结果'>{confirmInfo.confirmResults || ''}</Descriptions.Item>
                <Descriptions.Item label='确认时间'>{confirmInfo.confirmTime}</Descriptions.Item>
                <Descriptions.Item label='确认意见'>{confirmInfo.confirmOpinion || ''}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Menu.ItemGroup>
        </SubMenu>
      </Menu>
     
      )
    }
  
  </>
  )
}
export default Form.create({})
(
  connect(({problemmanage, loading}) => ({
    confirmInfo:problemmanage.confirmInfo,
    loading: loading.models.problemmanage
  }))(Problemconfirmation)
);