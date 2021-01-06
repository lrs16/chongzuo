import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import route from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Problemworkorder from './components/Problemworkorder';
import Problemflow from './components/Problemflow';
import Problemsolving from './components/Problemsolving';
import Problemreview from './components/Problemreview';
import Problemconfirmation from './components/Problemconfirmation';
import Problemregistration from './components/Problemregistration';
import Confirmationcountersignature from './components/Confirmationcountersignature';
import Problemclosed from './components/Problemclosed';
import Associateworkorder from './components/Associateworkorder';
import Circulation from './components/Circulation';
import Reasonregression from './components/Reasonregression';


let currntStatus = '';
let queryStatue = '';

let confirmType;


function Queryworkdetail(props) {
  const pagetitle = props.route.name;
  useEffect(() => {
    getInformation()
  }, []);

  const {
    dispatch,
    queryDetaildata
  } = props;
  const {
    params: { id },
  } = props.match;
 console.log(queryDetaildata.main,'fff');
 if (queryDetaildata.main) {
  currntStatus = Number(queryDetaildata.main.status);
}
  // if(!queryDetaildata['confirmType']){
  //   confirmType = '';
  // }else {
  //   confirmType = queryDetaildata.confirmType;
  // }

  const getInformation = () => {
    dispatch({
      type: 'problemmanage/queryDetail',
      payload: { id },
    });
  };
  if (queryDetaildata.main) {
    currntStatus = Number(queryDetaildata.main.status);
    console.log('status: ', currntStatus);
  }

  const tabList = [
    {
      key: 'queryworkdetail',
      tab: '查询工单',
    },
    {
      key: 'process',
      tab: '问题流程',
    },
  ];

  const handleTabChange = key => {
    const { match } = props;
    switch (key) {
      case 'queryworkdetail':
        route.push(`/ITSM/problemmanage/querydetail/${id}/queryworkdetail`);
        break;
      case 'process':
        route.push(`/ITSM/problemmanage/querydetail/${id}/process`);
        break;
      default:
        break;
    }
  }
  const { match, children, location } = props;


  return (
    <PageHeaderWrapper 
      title='工单查询'
      extra={
        <>
          <Button style={{ marginRight: 8 }}>
            <Link to="/ITSM/problemmanage/besolved">返回</Link>
          </Button>
        </>
      }
      tabList={tabList}
      tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
      onTabChange={handleTabChange}
    >
   
      {/* 查询详情 */}
      { currntStatus >= 5 && (
        <Problemregistration
          registrationDetail={queryDetaildata}
          statue={currntStatus}
          querySign='yes'
        />
      )}

      { currntStatus >= 25 && (
        <Problemreview 
        reviesDetail={queryDetaildata}
        statue={currntStatus}
        querySign='yes'
         />
      )}

      { currntStatus >= 45 && (
        <Problemsolving 
        solvingDetail={queryDetaildata}
        statue={currntStatus}
        querySign='yes'
         />
      )}

      { currntStatus >=65 && (
        <Problemconfirmation 
        confirmationDetail={queryDetaildata}
        statue={currntStatus}
        querySign='yes'
         />
      )}

      { currntStatus >=85 && (
        <Problemclosed 
        closeInfo={queryDetaildata}
        statue={currntStatus}
        querySign='yes'
         />
      )}
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    queryDetaildata: problemmanage.queryDetaildata,
    loading: loading.models.problemmanage,
  }))(Queryworkdetail),
);
