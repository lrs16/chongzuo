import React, { useEffect, createContext } from 'react';
import { connect } from 'dva';
import {
  Button,
  Collapse,
  Form,
} from 'antd';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import OperationPlanfillindes from './components/OperationPlanfillindes';
import TaskCheckdes from './components/TaskCheckdes';
import TaskExecutedes from './components/TaskExecutedes';
import styles from './index.less';

const { Panel } = Collapse;

let headTitle;

export const FatherContext = createContext();
function Work(props) {
  const {
    location: { query: { mainId, } },
    openViewlist,
    dispatch,
    loading,
    location
  } = props;

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

  useEffect(() => {
    getInformation();
  }, [])

  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      getInformation()
    }
  }, [location.state]);


  // 点击页签右键刷新
  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      getInformation();
    }
  }, [location.state]);

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/operationplan/operationplansearch`,
      query: { pathpush: true }
    });
  }

  return (
    <PageHeaderWrapper
      title={headTitle}
      extra={
        <>
          <Button onClick={handleClose}>返回</Button>
        </>
      }
    >
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
                  info={Object.values(obj)[0]}
                  main={openViewlist[0].main}
                />],
                ['check', <TaskCheckdes
                  info={Object.values(obj)[0]}
                  main={openViewlist[0].main}
                />],
                ['execute', <TaskExecutedes
                  info={Object.values(obj)[0]}
                  main={openViewlist[0].main}
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