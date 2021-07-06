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
import BusinessAudit from './components/BusinessAudit';
import ProviderConfirmation from './components/ProviderConfirmation';
import AssessmentConfirmation from './components/AssessmentConfirmation';
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
  const formRef = useRef();

  const handleSubmit = () => {
    console.log(formRef,'formRef')
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
    >
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
            />
          </Panel>
        </Collapse>

      </div>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(TobedealtForm)
