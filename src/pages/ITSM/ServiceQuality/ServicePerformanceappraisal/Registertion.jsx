import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  Card,
  Collapse
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Register from './components/Register';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import styles from './index.less';

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

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const { Panel } = Collapse;
function Registertion(props) {
  const pagetitle = props.route.name;
  const {
    userinfo,
    dispatch,
  } = props;
  const RegistratRef = useRef();
  const [activeKey, setActiveKey] = useState(['registratform']);
  const handleClose = () => {

  }

  const callback = key => {
    console.log('key: ', key);
    setActiveKey(key);
  };

  const handleSubmit = () => {
    RegistratRef.current.validateFields((_, values) => {
      dispatch({
        type:'qualityassessment/gotoNextprocess'
      })
    })
  }

  const getUserinfo = () => {
    dispatch({
      type:'itsmuser/fetchuser'
    })
  }

  useEffect(() => {
    getUserinfo()
  },[])



  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button
            type='primary'
            style={{ marginRight: 8 }}
            onClick={handleSubmit}
          >
            保存
          </Button>

          <Button
            onClick={handleClose}
          >
            关闭
          </Button>
        </>
      }
    >
      <div className={styles.collapse}>
        <Collapse
          expandIconPosition='right'
          defaultActiveKey={['1']}
          bordered={false}
          onChange={callback}
        > 
          <Panel 
          header='服务绩效考核登记'
           key='1'
           >
            <Register
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
              ref={RegistratRef}
              userinfo={userinfo}
            />
          </Panel>
        </Collapse>
      </div>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ qualityassessment,itsmuser,loading }) => ({
    maintenanceData: qualityassessment.maintenanceData,
    userinfo: itsmuser.userinfo,
  }))(Registertion)
)

