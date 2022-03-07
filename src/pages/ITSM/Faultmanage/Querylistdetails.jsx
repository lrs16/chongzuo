import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Form,
  Button,
  Collapse,
  Card,
  Steps,
  Icon
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
// 各个子组件
import RegisterQuery from './components/RegisterQuery'; // 故障登记
import ExamineQuery from './components/ExamineQuery'; // 系统运维商审核
import HandleQuery from './components/HandleQuery'; // 系统运维商处理
import SummaryQuery from './components/SummaryQuery'; // 系统运维商确认总结
import ExamineSecondQuery from './components/ExamineSecondQuery'; // 自动化科业务负责人审核
import ConfirmQuery from './components/ConfirmQuery'; // 自动化科专责确认
import RelationOrder from './RelationOrder';

const { Panel } = Collapse;
const { Step } = Steps;
let image;

const tabList = [
  {
    key: 'faultForm',
    tab: '故障工单',
  },
  {
    key: 'faultPro',
    tab: '故障流程',
  },
  {
    key: 'relevancy',
    tab: '关联工单',
  }
];

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

function Querylistdetails(props) {
  const [activeKey, setActiveKey] = useState();
  const [tabActiveKey, setTabActiveKey] = useState('faultForm'); // tab切换

  const {
    dispatch,
    loading,
    querydetailslist,
    querydetailslist: { troubleFlowNodeRows, main, troubleFlowLogs },
    flowimageview,
    flowlog,
    location,
  } = props;

  const { id } = props.location.query;

  // 二进制展示流程图
  const blob = new Blob([flowimageview]);
  image = (window.URL || window.webkitURL).createObjectURL(blob);

  const getFlowImage = () => { // 流程图片
    dispatch({
      type: 'fault/fetchGetFlowImage',
      payload: { mainId: querydetailslist.main.id }
    });
  }

  const getFlowlog = () => { // 流程日志
    dispatch({
      type: 'fault/fetchGetFlowLog',
      payload: { id: querydetailslist.main.id }
    })
  }

  const querydetailsList = () => { // 故障查询详情数据
    dispatch({
      type: 'fault/getfaultQueryDetailData',
      payload: { id },
    });
  }

  useEffect(() => {
    querydetailsList();
    setTabActiveKey('faultForm');
  }, [id]);

  useEffect(() => {
    if (location.state && location.state.reset && id) {
      querydetailsList();
      setTabActiveKey('faultForm');
    }
  }, [location.state]);

  const handleClose = () => { // 返回上一页
    router.push({
      pathname: '/ITSM/faultmanage/querylist/record',
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true }
    });
  }

  const callback = key => {
    setActiveKey(key);
  };

  // 初始化值panel
  useEffect(() => {
    setActiveKey('0'); // 初始化值panel
  }, [troubleFlowNodeRows]);

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
    getFlowImage();
    getFlowlog();
  };

  return (
    <PageHeaderWrapper
      extra={<Button type="default" onClick={handleClose}>关 闭</Button>}
      title={main && main.statuscn}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      <div className='noexplain'>
        {
          (tabActiveKey === 'faultForm' &&
            (<div className={styles.collapse}>
              <Card
                style={{
                  background: '#fff',
                  // padding: 10,
                  border: '1px solid #e8e8e8',
                  overflowX: 'auto',
                }}
              >
                {troubleFlowLogs &&
                  (<Steps
                    // current={stepcurrentmap.get(paneKey)}
                    current={troubleFlowLogs.length - 1}
                    size="small"
                  >
                    {
                      troubleFlowLogs && troubleFlowLogs.map(({ key, name, status, timeText, formHandler, startTime }) => [
                        name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})${'\xa0'}${'\xa0'}${timeText}`}
                          icon={(name === troubleFlowLogs[troubleFlowLogs.length - 1].name && status === troubleFlowLogs[troubleFlowLogs.length - 1].status) ? <Icon type="loading" spin /> : ''}
                          description={
                            <div className={styles.stepDescription}>
                              处理人：{formHandler}
                              <div>结束时间：{moment(startTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                            </div>
                          } />
                      ])}
                  </Steps>)
                }
              </Card>
              <div className={styles.collapse}>
                {troubleFlowNodeRows && loading === false && (
                  <Collapse
                    expandIconPosition="right"
                    activeKey={activeKey}
                    bordered={false}
                    onChange={callback}
                  >
                    {troubleFlowNodeRows.map((obj, index) => {
                      // panel详情组件
                      const Paneldesmap = new Map([
                        ['故障登记', <RegisterQuery info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                        ['系统运维商审核', <ExamineQuery info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                        ['系统运维商处理', <HandleQuery info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                        ['系统运维商确认总结', <SummaryQuery info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} showFilelist={troubleFlowNodeRows[1]} showFilelist2={troubleFlowNodeRows[2]} />],
                        ['自动化科业务负责人审核', <ExamineSecondQuery info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                        // ['自动化科专责确认', <ConfirmQuery info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                        ['自动化科审核', <ConfirmQuery info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                      ]);
                      return (
                        <Panel Panel header={obj.fnname} key={index.toString()}>
                          {Paneldesmap.get(obj.fnname)}
                        </Panel>
                      );
                    })}
                  </Collapse>
                )}
              </div>
            </div>)
          )
        }
        {
          (tabActiveKey === 'faultPro' && (
            <div className={styles.collapse}>
              <Card title='故障管理流程'>
                <div
                  style={{
                    background: '#fff',
                    // padding: 20,
                  }}
                >
                  <img src={image} alt='' />
                </div>
              </Card>
              <Card title='流转日志' style={{ marginTop: '-1px' }}>
                {
                  loading === false && flowlog &&
                  (
                    <div className={styles.steps}>
                      <Steps
                        // current={stepcurrentmap.get(paneKey)}
                        current={flowlog.troubleFlowLogs.length - 1}
                        size="small"
                        direction="vertical"
                        progressDot
                        style={{
                          background: '#fff',
                          padding: 24,
                          border: '1px solid #e8e8e8',
                        }}
                      >
                        {
                          flowlog && flowlog.troubleFlowLogs.map(({ key, name, status, startTime, formHandler, backReason }) => [
                            name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})`} description={
                              <div className={styles.stepDescription}>
                                处理人：{formHandler}
                                <div>{moment(startTime).format('YYYY-MM-DD hh:mm:ss')}</div>
                                <div>{status === '退回' && `回退原因：${backReason}`}</div>
                              </div>
                            } />
                          ])}
                      </Steps>
                    </div>
                  )
                }
              </Card>
            </div>
          ))
        }
        {tabActiveKey === 'relevancy' && <RelationOrder orderId={location.query.id} relation={false} />}
      </div>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ fault, loading }) => ({
    html: fault.html,
    loading: loading.models.fault,
    querydetailslist: fault.querydetailslist,
    flowimageview: fault.flowimageview, // 流程图view
    flowlog: fault.flowlog, // 流转日志
  }))(Querylistdetails),
);
