import React, { useEffect,useState } from 'react';
import {
  Form,
  Button,
  Steps,
  Collapse,
  Card
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Problemsolving from './components/Problemsolving';
import Problemreview from './components/Problemreview';
import Operatorconfirmades from './components/Operatorconfirmades';
import Problemregistration from './components/Problemregistration';
import Problemflow from './components/Problemflow';
import Businessaudes from './components/Businessaudes';
import Automaticconfirmdes from './components/Automaticconfirmdes';
import Registrationconfirmdes from './components/Registrationconfirmdes';

import styles from './index.less';

let currntStatus = '';
let problemFlowid;

const { Step } = Steps;
const { Panel } = Collapse;

function Queryworkdetail(props) {
  const pagetitle = props.route.name;
  const [tabActiveKey, setTabActiveKey] = useState('workorder');
  const {
    dispatch,
    queryDetaildata,
    queryDetaildata:{ problemFlowNodeRows,main,problemFlowLogs},
    loading
  } = props;
  const {
    params: { id },
  } = props.match;
 
  if (queryDetaildata.main) {
    currntStatus = Number(queryDetaildata.main.status);
    problemFlowid =  queryDetaildata.main.id;
  }

  const getInformation = () => {
    dispatch({
      type: 'problemmanage/queryDetail',
      payload: { id },
    });
  };

  useEffect(() => {
    getInformation()
  }, []);

  const tabList = [
    {
      key: 'workorder',
      tab: '查询工单',
    },
    {
      key: 'process',
      tab: '问题流程',
    },
  ];

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
  };

  return (
    <PageHeaderWrapper 
      title={pagetitle}
      extra={
        <>
          <Button style={{ marginRight: 8 }}>
            <Link to="/ITSM/problemmanage/besolved">返回</Link>
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
                                // progressDot
                                style={{
                                  background: '#fff',
                                  padding: 24,
                                  border: '1px solid #e8e8e8',
                                  overflowX: 'auto',
                                }}
                              >
                                {problemFlowLogs.map((obj,index) => {
                                  const desc = (
                                    <div className={styles.stepDescription}>
                                      处理人：{obj.formHandler}
                                      <div>开始时间：{obj.startTime}</div>
                                    </div>
                                  );
                                  return <Step title={obj.name} description={desc} key={index}/>;
                                })}
                              </Steps>
                )
                }
            </div>

           <div className={styles.collapse}>
              {problemFlowNodeRows && loading === false && (
                    <Collapse
                    expandIconPosition="right"
                    // activeKey={activeKey}
                    bordered={false}
                    // onChange={callback}
                    >
                        {problemFlowNodeRows.map((obj, index) => {
                            // panel详情组件
                            const Paneldesmap = new Map([
                              ['问题登记', <Problemregistration 
                              info={obj}
                              statue={currntStatus}
                              problemFlowNodeRows={problemFlowNodeRows}
                              main={main}
                            />],
                            ['系统运维商审核', <Problemreview 
                                info={obj}
                                main={main}
                            
                            />],
                            ['自动化科审核', <Problemreview 
                                info={obj}
                                main={main}
                            />],
                            ['系统开发商处理', <Problemsolving 
                            info={obj}
                            main={main}
                            />],
                            ['系统运维商确认', <Operatorconfirmades
                              info={obj}
                              main={main}
                            />],
                            ['自动化科业务人员确认', <Operatorconfirmades 
                            info={obj}
                            main={main}
                            />],
                            ['问题登记人员确认', <Operatorconfirmades 
                            info={obj}
                            main={main}
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
            
            {/* </Collapse> */}
          </>
        )
      }


      {
        (tabActiveKey === 'process' && (
          <Problemflow  id={problemFlowid}/>
        ))
      }
    
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    queryDetaildata: problemmanage.queryDetaildata,
    loading: loading.models.problemmanage,
  }))(Queryworkdetail),
);
