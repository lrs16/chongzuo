import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Collapse
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import BusinessAudit from './components/BusinessAudit';
import ProviderConfirmation from './components/ProviderConfirmation';
import AssessmentConfirmation from './components/AssessmentConfirmation';
import Achievementsflow from './Achievementsflow';
import Relatedorder from './Relatedorder';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


import styles from './index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
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

const { Panel } = Collapse;

function TobedealtForm(props) {
  const pagetitle = props.route.name;
  const {
    userinfo,
    dispatch,
  } = props;
  const formRef = useRef();
  const [tabActiveKey, setTabActiveKey] = useState('workorder')

  const handleSubmit = () => {
    console.log(formRef, 'formRef')
  }

  const getUserinfo = () => {
    dispatch({
      type: 'itsmuser/fetchuser'
    })
  }

  useEffect(() => {
    getUserinfo()
  }, [])

  const tabList = [
    {
      key: 'workorder',
      tab: '服务绩效考核工单'
    },
    {
      key: 'process',
      tab: '服务绩效考核流程'
    },
    {
      key: 'associatedWorkorder',
      tab: '关联工单'
    },
  ]

  const handleTabChange = (key) => {
    setTabActiveKey(key)
  }

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button type='primary' onClick={handleSubmit}>保存</Button>
          <Button type='primary'>流转</Button>
          <Button type='primary'>关闭</Button>
        </>
      }
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      {
        tabActiveKey === 'workorder' && (
          <div className={styles.collapse}>
            <Collapse
              expandIconPosition='right'
              defaultActiveKey={['1']}
              bordered={false}
            >
              <Panel
                header='业务负责人审核'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                <BusinessAudit
                  ref={formRef}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel>

              <Panel
                header='自动化科专责审核'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                <BusinessAudit
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel>

              <Panel
                header='服务商确认'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                <ProviderConfirmation
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel>

              <Panel
                header='业务负责人复核'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                <BusinessAudit
                  repeatAudit='true'
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel>

              <Panel
                header='服务绩效考核确认'
                key='1'
                style={{ backgroundColor: 'white' }}
              >
                <AssessmentConfirmation
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel>
            </Collapse>

          </div>
        )
      }

      {
        tabActiveKey === 'process' && (
          <Achievementsflow />
        )
      }

      {
        tabActiveKey === 'associatedWorkorder' && (
          <Relatedorder />
        )
      }

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ itsmuser }) => ({
    userinfo: itsmuser.userinfo,
  }))(TobedealtForm)
)

