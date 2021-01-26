import React, { useEffect,useState } from 'react';
import {
  Form,
  Button,
  Steps,
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
                  {problemFlowLogs.map(obj => {
                    const desc = (
                      <div className={styles.stepDescription}>
                        处理人：{obj.formHandler}
                        <div>开始时间：{obj.startTime}</div>
                      </div>
                    );
                    return <Step title={obj.name} description={desc} />;
                  })}
                </Steps>

              )
              }

            </div>
            
            { problemFlowNodeRows.length >= 1 && (
            <Problemregistration
            registrationDetail={queryDetaildata}
            statue={currntStatus}
            problemFlowNodeRows={problemFlowNodeRows}
            main={main}
            querySign='yes'
            loading={loading}
           />
           )}

          { problemFlowNodeRows.length >= 2 && (
            <Problemreview 
            reviesDetail={queryDetaildata}
            statue={currntStatus}
            querySign='yes'
            loading={loading}
            />
          )}

          {
             problemFlowNodeRows.length >= 3 && (
              <Businessaudes
              reviesDetail={queryDetaildata}
              loading={loading}
            />
             )
          }

          { problemFlowNodeRows.length >= 4 && (
            <Problemsolving 
            solvingDetail={queryDetaildata}
            statue={currntStatus}
            querySign='yes'
            loading={loading}
              />
          )}

          { problemFlowNodeRows.length >= 5 && (
            <Operatorconfirmades 
            confirmationDetail={queryDetaildata}
            statue={currntStatus}
            querySign='yes'
            loading={loading}
            />
          )}

          { problemFlowNodeRows.length >= 6 && (
           <Automaticconfirmdes
           confirmationDetail={queryDetaildata}
           loading={loading}
         />
          )}

          { problemFlowNodeRows.length >= 7 && (
           <Registrationconfirmdes
           confirmationDetail={queryDetaildata}
           loading={loading}
         />
          )}
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
