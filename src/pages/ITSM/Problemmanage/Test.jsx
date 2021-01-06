import React, { useEffect, useState } from 'react';
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
  Divider,
  Collapse,
  Descriptions,
  Menu,
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
const { Panel } = Collapse;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

function Test(props) {
  const [expand, setExpand] = useState(false);
  return (
    <PageHeaderWrapper>
      <Card>
        <Tabs>
          <TabPane tab="问题工单" key={1}>
            <Collapse defaultActiveKey={['1']}>
              <Panel header="This is panel header 1" key="1">
                <p>GGG</p>
              </Panel>
              <Panel header="This is panel header 2" key="2">
                <p>GGG</p>
              </Panel>
              <Panel header="This is panel header 3" key="3" disabled>
                <p>GGG</p>
              </Panel>
            </Collapse>
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  );
}
export default Test;
