import React, { useEffect, useState, createContext, useRef } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Collapse,
  Form,
  message
} from 'antd';
import Link from 'umi/link';
import User from '@/components/SelectUser/User';
import router from 'umi/router';
import TaskCheck from './components/TaskCheck';
import OperationPlanfillin from './components/OperationPlanfillin';
import TaskExecute from './components/TaskExecute';
import OperationPlanfillindes from './components/OperationPlanfillindes';
import TaskCheckdes from './components/TaskCheckdes';
import TaskExecutedes from './components/TaskExecutedes';
import Back from './components/Back';
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
function Work(props) {
  const [flowtype, setFlowtype] = useState('001');
  const [selectdata, setSelectData] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const SaveRef = useRef();
  const [activeKey, setActiveKey] = useState([]);

  //  选人组件
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [changorder, setChangeOrder] = useState(undefined);

  const {
    form: { validateFields },
    location: { query: { mainId, status, checkStatus, auditLink } },
    userinfo,
    openViewlist,
    dispatch,
    loading
  } = props;
  // const { data } = openViewlist;
  // console.log('data: ', data);

  // panel详情
  const Panelheadermap = new Map([
    ['main', '作业登记'],
    ['check', '作业审核'],
    ['execute', '作业执行'],
  ]);

  const getInformation = () => {
    dispatch({
      type: 'processmodel/openView',
      payload: mainId
    })
  }

  // 初始化获取用户信息
  useEffect(() => {
    getInformation();
  }, [])

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/operationplan/operationplansearch`,
    });
  }

  return (
    <PageHeaderWrapper
      title={headTitle}
      extra={
        <>
          <Button onClick={handleClose}>关闭</Button>
        </>
      }
    >
      <SysDict
        typeid="1385513049263181825"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />

      <div className={styles.collapse}>
        {openViewlist && loading === false && (
          <Collapse
            expandIconPosition="right"
            defaultActiveKey={['0']}
            bordered={false}
          >
            {openViewlist.map((obj, index) => {
              // panel详情组件
              const Paneldesmap = new Map([
                ['main', <OperationPlanfillindes
                  info={Object.values(obj)[0]} main={openViewlist[0].main}
                />],
                ['check', <TaskCheckdes
                  info={Object.values(obj)[0]} main={openViewlist[0].main}
                // info={obj}
                // main={main}

                />],
                ['execute', <TaskExecutedes
                  info={Object.values(obj)[0]} main={openViewlist[0].main}
                // info={obj}
                // main={main}
                />],
              ]);
              return (
                <Panel
                  header={Panelheadermap.get(Object.keys(obj)[0])}
                  key={index}>
                  {Paneldesmap.get(Object.keys(obj)[0])}
                </Panel>
              );
            })}
          </Collapse>
        )}
      </div>

      {/* 选人组件 */}
      <User
        // taskId={id}
        visible={uservisible}
        ChangeUserVisible={v => setUserVisible(v)}
        changorder={changorder}
        ChangeChoice={v => setUserChoice(v)}
        ChangeType={() => 0}
      />

    </PageHeaderWrapper >


  )

}

export default Form.create({})(
  connect(({ processmodel, itsmuser, loading }) => ({
    userinfo: itsmuser.userinfo,
    openViewlist: processmodel.openViewlist,
    loading: loading.models.processmodel,
  }))(Work)
)