import React,{useEffect,useState} from 'react';
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
  Alert,
  Table,
  Select,
  DatePicker,
  Message,
  Descriptions,
  Menu
} from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Problemworkorder from './components/Problemworkorder';
import Problemflow from './components/Problemflow';
import Problemsolving from './components/Problemsolving';
import Problemregistration from './components/Problemregistration';
import Associateworkorder from './components/Associateworkorder';

const { TabPane } = Tabs;
const { SubMenu } = Menu;
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

function Test(props) {
  const [expand,setExpand] = useState(false);
  return (
    <PageHeaderWrapper>
      <Card
        // extra = {
        //   <>
        //     <Button 
        //       type='primary'
        //       style={{ marginRight: 8}}
        //     >
        //       保存
        //     </Button>
    
        //     <Button
        //       type='primary'
        //       style={{marginRight: 8}}
        //     >
        //       流转
        //     </Button>
    
        //     <Button 
        //       type='default'
        //     >
        //       关闭
        //     </Button>
        //   </>
        // }
      
      >
        <Tabs>
          <TabPane tab='问题工单' key={1}>
             <Menu mode='inline'>
                <SubMenu title='问题登记'>
                  <Menu.ItemGroup key="g1">
                    {/* <Card> */}
                      <Descriptions>
                        <Descriptions.Item label='问题编号'>h</Descriptions.Item>
                        <Descriptions.Item label='问题来源'>j</Descriptions.Item>
                        <Descriptions.Item label='问题分类'>j</Descriptions.Item>
                        <Descriptions.Item label='紧急度'>j</Descriptions.Item>
                        <Descriptions.Item label='影响度'></Descriptions.Item>
                        <Descriptions.Item label='优先级'></Descriptions.Item>
                        <Descriptions.Item label='填报人单位'></Descriptions.Item>
                        <Descriptions.Item label='填报人部门'></Descriptions.Item>
                        <Descriptions.Item label='填报人'></Descriptions.Item>
                        <Descriptions.Item label='联系电话'></Descriptions.Item>
                        <Descriptions.Item label='登记时间'>{}</Descriptions.Item>
                        <Descriptions.Item label='建单时间'>{}</Descriptions.Item>
                        <Descriptions.Item label='问题标题'></Descriptions.Item>
                        <Descriptions.Item label='问题描述'></Descriptions.Item>
                        <Descriptions.Item label='上传附件'></Descriptions.Item>
                      </Descriptions>
                    {/* </Card> */}
                  </Menu.ItemGroup>
                </SubMenu>
            </Menu>
        </TabPane>
      </Tabs>
    </Card>
    </PageHeaderWrapper>
  )
}
export default Test;