import React, { useEffect, useState, createContext, useRef } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Collapse,
  Form
} from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import TaskCheck from './components/TaskCheck';
import OperationPlanfillin from './components/OperationPlanfillin';
import TaskExecute from './components/TaskExecute';
import OperationPlanfillindes from './components/OperationPlanfillindes';
import TaskCheckdes from './components/TaskCheckdes';
import TaskExecutedes from './components/TaskExecutedes';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
import styles from './index.less';

const { Panel } = Collapse;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
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

let headTitle;

export const FatherContext = createContext();
function OperationplansearchDetail(props) {
  // const {
  //   params: { id },
  // } = props.match; // 获取taskId

  const {
    form: { validateFields },
    location: { paneKey },
    match: { params: { id, status, checkoutstatus, type } },
    userinfo,
    dispatch
  } = props;

  // const title = props.route.name;
  const [flowtype, setFlowtype] = useState('1');
  const [selectdata, setSelectData] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const SaveRef = useRef();





  return (
    <PageHeaderWrapper
      title={status}
      extra={
        <>

          <Button >
            <Link
              to='/ITSM/operationplan/operationplansearch'>
              返回
            </Link>
          </Button>

        </>
      }
    >

      <div className={styles.collapse}>
        <Collapse
          expandIconPosition="right"
          bordered={false}
        // defaultActiveKey={['0']}
        // style={{ backgroundColor: 'white' }}
        >
          {/* 后端返回的数据，数据太多，就不mock了 */}
          <Panel
            header='作业计划中'
          >
            <OperationPlanfillindes />
          </Panel>

          <Panel
            header='作业计划审核'
          >
            <TaskCheckdes />
          </Panel>

          <Panel
            header='作业计划执行'
          >
            <TaskExecutedes />
          </Panel>
        </Collapse>
      </div>


    </PageHeaderWrapper>


  )

}

export default Form.create({})(
  connect(({ processmodel, itsmuser, loading }) => ({
    userinfo: itsmuser.userinfo,
    loading: loading.models.processmodel,
  }))(OperationplansearchDetail)
)