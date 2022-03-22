import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Steps,
  Collapse,
  Icon,
  Badge
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import Problemsolving from './components/Problemsolving';
import Problemreview from './components/Problemreview';
import Operatorconfirmades from './components/Operatorconfirmades';
import Problemregistration from './components/Problemregistration';
import Problemflow from './components/Problemflow';
import RelationOrder from './RelationOrder';                          // 关联工单

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

let currntStatus = '';
let problemFlowid;

const { Step } = Steps;
const { Panel } = Collapse;

function Queryworkdetail(props) {
  const [tabActiveKey, setTabActiveKey] = useState('workorder');
  const {
    dispatch,
    queryDetaildata,
    queryDetaildata: { problemFlowNodeRows, main, problemFlowLogs },
    loading,
    location
  } = props;
  const { No } = props.location.query;

  const { id, taskName } = props.location.query;

  if (queryDetaildata.main) {
    currntStatus = Number(queryDetaildata.main.status);
    problemFlowid = queryDetaildata.main.id;
  }

  const getInformation = () => {
    if (id) {
      dispatch({
        type: 'problemmanage/queryDetail',
        payload: { id, No },
      });
    }
  };

  const getArrayindex = (data) => {
   return data.map((obj,index) => {
      return index
    })
  }

  useEffect(() => {
    getInformation()
    setTabActiveKey('workorder')
  }, [id]);

  useEffect(() => {
    if (location.state && location.state.reset && id) {
      getInformation()
    }
  }, [location.state]);

  const tabList = [
    {
      key: 'workorder',
      tab: '问题工单',
    },
    {
      key: 'process',
      tab: '问题流程',
    },
    {
      key: 'relevancy',
      tab: '关联工单'
    }
  ];

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
  };

  const pheadertitle = (obj, index) => {
    return (
      <>
        <Badge
          count={index}
          style={{
            backgroundColor: '#C1EB08',
            color: '#10C510',
            // boxShadow: '0 0 0 1px #10C510 inset',
            marginRight: 4,
            marginBottom: 2,
          }}
        />
        <span>
          {obj.fnname}
        </span>
      </>
    );
  };

  const handClose = () => {
    router.push({
      pathname: `/ITSM/problemmanage/problemquery/detail`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true }
    });
  };

  return (
    <PageHeaderWrapper
      title={taskName}
      extra={
        <>
          <Button style={{ marginRight: 8 }} onClick={() => handClose()}>
            关 闭
          </Button>
        </>
      }
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >

      {/* 查询详情 */}
      {
        (tabActiveKey === 'workorder' && problemFlowNodeRows &&
          <>
            <div className={styles.collapse}>
              {problemFlowLogs && (
                <Steps
                  current={problemFlowLogs[problemFlowLogs.length - 1].name === '结束节点' ? problemFlowLogs.length : problemFlowLogs.length - 1}
                  size="small"
                  style={{
                    background: '#fff',
                    padding: 24,
                    border: '1px solid #e8e8e8',
                    overflowX: 'auto',
                  }}
                >
                  {problemFlowLogs &&
                    problemFlowLogs.map((obj, index) => {
                      let params;
                      if (obj.name === '结束节点') {
                        params = `${obj.name}${'\xa0'}${'\xa0'}${obj.timeText}`
                      } else {
                        params = `${obj.name}${'\xa0'}${'\xa0'}(${obj.status})${'\xa0'}${'\xa0'}${obj.timeText}`
                      }
                      return (
                        <Step
                          key={index}
                          title={params}
                          description={
                            <div className={styles.stepDescription}>
                              处理人：{obj.formHandler}
                              <div>结束时间：{moment(obj.startTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                            </div>
                          }
                          icon={(obj.name !== '结束节点' && index === problemFlowLogs.length - 1 || obj.status === '待审核') ? <Icon type="loading" spin /> : ''}
                        />
                      )
                    }
                    )
                  }
                </Steps>
              )
              }
            </div>

            <div className='noexplain'>
              <div className={styles.collapse}>
                {problemFlowNodeRows && loading === false && (
                  <Collapse
                    expandIconPosition="right"
                    defaultActiveKey={getArrayindex(problemFlowNodeRows)}
                    bordered={false}
                  >
                    {problemFlowNodeRows.map((obj, index) => {
                      // panel详情组件
                      const Paneldesmap = new Map([
                        ['问题登记', <Problemregistration
                          key='0'
                          info={obj}
                          statue={currntStatus}
                          problemFlowNodeRows={problemFlowNodeRows}
                          main={main}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                        />],
                        ['系统运维商审核', <Problemreview
                          key='0'
                          info={obj}
                          main={main}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                        />],
                        ['自动化科审核', <Problemreview
                          key='0'
                          info={obj}
                          main={main}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                        />],
                        ['系统开发商处理', <Problemsolving
                          key='0'
                          info={obj}
                          main={main}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                        />],
                        ['系统运维商确认', <Operatorconfirmades
                          key='0'
                          info={obj}
                          main={main}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                        />],
                        ['自动化科业务人员确认', <Operatorconfirmades
                          key='0'
                          info={obj}
                          main={main}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                        />],
                        ['问题登记人员确认', <Operatorconfirmades
                          key='0'
                          info={obj}
                          main={main}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                        />],
                      ]);
                      return (
                        <Panel
                          Panel
                          header={pheadertitle(obj, index + 1)}
                          key={index.toString()}
                        >
                          {Paneldesmap.get(obj.fnname)}
                        </Panel>
                      );
                    })}
                  </Collapse>
                )}
              </div>
            </div>


          </>
        )
      }

      {
        (tabActiveKey === 'process' && (
          <Problemflow id={problemFlowid} />
        ))
      }
      {tabActiveKey === 'relevancy' && <RelationOrder orderId={location.query.id} relation={false} />}
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    queryDetaildata: problemmanage.queryDetaildata,
    loading: loading.models.problemmanage,
  }))(Queryworkdetail),
);
