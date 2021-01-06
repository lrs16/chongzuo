import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Tabs,
  Upload,
  Icon,
  message,
  Select,
  Collapse,
  Steps,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import route from 'umi/router';
import Regexp, { phone_reg } from '@/utils/Regexp';
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

let currntStatus = '';
let queryStatue = '';

let confirmType;


function Querydetail(props) {
  const pagetitle = props.route.name;
  useEffect(() => {
    getInformation()
  }, []);

  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
    todoDetail,
    // location: {
    //   state: { currentObj },
    // },
    todoDetail: { check, handle, confirm },
  } = props;
  const {
    params: { id },
  } = props.match;
  console.log(todoDetail,'todoDetail');
  // if (todoDetail) {
  //   currntStatus = Number(todoDetail.main.status);
  //   //  currntStatus = Number(5);
  //    console.log('currntStatus: ', currntStatus);
  // }
  // if(!todoDetail['confirmType']){
  //   confirmType = '';
  // }else {
  //   confirmType = todoDetail.confirmType;
  // }

  const getInformation = () => {
    dispatch({
      type: 'problemmanage/ToDodetails',
      payload: { id },
    });
  };

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
          registrationDetail={todoDetail}
          statue={currntStatus}
          queryStatue={queryStatue}
        />
      )}

      { currntStatus >= 29 && (
        <Problemreview 
        reviesDetail={todoDetail}
        statue={currntStatus}
        />
      )}

      { currntStatus >= 49 && (
        <Problemsolving 
        solvingDetail={todoDetail} 
        statue={currntStatus}
        />
      )}

      { currntStatus >=65 && confirmType > '0' && (
        <Problemconfirmation 
        confirmationDetail={todoDetail}
        statue={currntStatus}
         />
      )}

      { currntStatus >=69 && confirmType === '1' && (
        <Confirmationcountersignature 
        countersignatureDetail={todoDetail}
        statue={currntStatus}
         />
      )}
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    todoDetail: problemmanage.todoDetail,
    loading: loading.models.problemmanage,
  }))(Querydetail),
);
