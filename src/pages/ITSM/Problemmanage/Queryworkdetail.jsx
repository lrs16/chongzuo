import React, { useEffect,useState } from 'react';
import {
  Form,
  Button,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Problemsolving from './components/Problemsolving';
import Problemreview from './components/Problemreview';
import Operatorconfirmades from './components/Operatorconfirmades';
import Problemregistration from './components/Problemregistration';
import Problemclosed from './components/Problemclosed';
import Problemflow from './components/Problemflow';

let currntStatus = '';
let problemFlowid;

function Queryworkdetail(props) {
  const pagetitle = props.route.name;
  const [tabActiveKey, setTabActiveKey] = useState('workorder');
  const {
    dispatch,
    queryDetaildata,
    queryDetaildata:{ problemFlowNodeRows,main},
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
        (tabActiveKey === 'workorder' && 
          <>
            { currntStatus >= 5 && (
            <Problemregistration
            registrationDetail={queryDetaildata}
            statue={currntStatus}
            problemFlowNodeRows={problemFlowNodeRows}
            main={main}
            querySign='yes'
            loading={loading}
           />
           )}

          { currntStatus >= 25 && (
            <Problemreview 
            reviesDetail={queryDetaildata}
            statue={currntStatus}
            querySign='yes'
            loading={loading}
            />
          )}

          { currntStatus >= 45 && (
            <Problemsolving 
            solvingDetail={queryDetaildata}
            statue={currntStatus}
            querySign='yes'
            loading={loading}
              />
          )}

          { currntStatus >=65 && (
            <Operatorconfirmades 
            confirmationDetail={queryDetaildata}
            statue={currntStatus}
            querySign='yes'
            loading={loading}
            />
          )}

          { currntStatus >=85 && (
            <Problemclosed 
            closeInfo={queryDetaildata}
            statue={currntStatus}
            querySign='yes'
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
