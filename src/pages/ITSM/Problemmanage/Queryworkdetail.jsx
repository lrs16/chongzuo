import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Steps,
  Collapse,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
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

  const { id, taskName } = props.location.query;

  if (queryDetaildata.main) {
    currntStatus = Number(queryDetaildata.main.status);
    problemFlowid = queryDetaildata.main.id;
  }

  const getInformation = () => {
    dispatch({
      type: 'problemmanage/queryDetail',
      payload: { id },
    });
  };

  useEffect(() => {
    getInformation()
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

  const handleClose = () => { // 返回上一页
    router.push({
      pathname: `/ITSM/problemmanage/problemquery`,
      query: { pathpush: true },
      state: { cache: false }
    });
  }

  return (
    <PageHeaderWrapper
      title={taskName}
      extra={
        <>
          <Button style={{ marginRight: 8 }} onClick={() => handleClose()}>
            返回
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
                  current={problemFlowLogs.length - 1}
                  size="small"
                  style={{
                    background: '#fff',
                    padding: 24,
                    border: '1px solid #e8e8e8',
                    overflowX: 'auto',
                  }}
                >
                  {
                    problemFlowLogs && problemFlowLogs.map(({ key, name, status, timeText, formHandler, startTime }) => [
                      name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})${'\xa0'}${'\xa0'}${timeText}`} description={
                        <div className={styles.stepDescription}>
                          处理人：{formHandler}
                          <div>结束时间：{moment(startTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                        </div>
                      } />
                    ])}
                </Steps>
              )
              }
            </div>

            <div className={styles.collapse}>
              {problemFlowNodeRows && loading === false && (
                <Collapse
                  expandIconPosition="right"
                  defaultActiveKey={['0']}
                  bordered={false}
                >
                  {problemFlowNodeRows.map((obj, index) => {
                    // panel详情组件
                    const Paneldesmap = new Map([
                      ['问题登记', <Problemregistration
                        key={index}
                        info={obj}
                        statue={currntStatus}
                        problemFlowNodeRows={problemFlowNodeRows}
                        main={main}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                      />],
                      ['系统运维商审核', <Problemreview
                        key={index}
                        info={obj}
                        main={main}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                      />],
                      ['自动化科审核', <Problemreview
                        key={index}
                        info={obj}
                        main={main}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                      />],
                      ['系统开发商处理', <Problemsolving
                        key={index}
                        info={obj}
                        main={main}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                      />],
                      ['系统运维商确认', <Operatorconfirmades
                        key={index}
                        info={obj}
                        main={main}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                      />],
                      ['自动化科业务人员确认', <Operatorconfirmades
                        key={index}
                        info={obj}
                        main={main}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                      />],
                      ['问题登记人员确认', <Operatorconfirmades
                        key={index}
                        info={obj}
                        main={main}
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                      />],
                    ]);
                    return (
                      <Panel Panel header={obj.fnname} key={index}>
                        {Paneldesmap.get(obj.fnname)}
                      </Panel>
                    );
                  })}
                </Collapse>
              )}
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
