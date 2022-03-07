import React, { useEffect, useState, createContext } from 'react';
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
import RelationOrder from './components/RelationOrder';

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
  const [tabActiveKey, setTabActiveKey] = useState('workorder');

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
      pathname: `/ITSM/operationplan/operationplansearchdetail`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true }
    });
  }

  const handleTabChange = key => {
    // tab切换
    setTabActiveKey(key);
  };

  const tabList = [
    {
      key: 'workorder',
      tab: '作业计划工单',
    },
    {
      key: 'relevancy',
      tab: '关联工单',
    },
  ];

  return (
    <PageHeaderWrapper
      title={headTitle}
      extra={
        <>
          <Button onClick={handleClose}>关闭</Button>
        </>
      }
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      {
        tabActiveKey === 'workorder' && (
          <div className='noexplain'>
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
                        key="0"
                      />],
                      ['check', <TaskCheckdes
                        info={Object.values(obj)[0]}
                        main={openViewlist[0].main}
                        key="0"
                      />],
                      ['execute', <TaskExecutedes
                        info={Object.values(obj)[0]}
                        main={openViewlist[0].main}
                        key="0"
                      />],
                    ]);
                    return (
                      <Panel
                        header={Panelheadermap.get(Object.keys(obj)[0])}
                        key='0'>
                        {Paneldesmap.get(Object.keys(obj)[0])}
                      </Panel>
                    );
                  })}
                </Collapse>
              )}
            </div>
          </div>

        )
      }

      {
        tabActiveKey === 'relevancy' && <RelationOrder orderId={location.query.mainId} relation search />
      }

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