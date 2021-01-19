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
  Menu,
  message,
  Select,
  Collapse,
  Descriptions,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';

import Problemsolving from './Problemsolving';
import Problemreview from './Problemreview';
import Problemconfirmation from './Problemconfirmation';
import Problemregistration from './Problemregistration';
import Confirmationcountersignature from './Confirmationcountersignature';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;

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

let formatdatetime;
let createDatetime;
let currntStatus = '';
let queryStatue = '';
let contentChange = '流转';
let circulationSign = '';
function queryDetail(props) {
  const pagetitle = props.route.name;
  useEffect(() => {
    getInformation();
  }, []);

  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
    todoDetail,
    location: {
      state: { currentProcess, currentObj },
    },
    todoDetail: { check, handle, confirm },
  } = props;
  console.log(!currentObj, 'currentObj');
  const {
    params: { id },
  } = props.match;
  const panes = ['1', '2', '3'];
  const required = true;
  const [activekey, setActivekey] = useState(panes[0]);
  const [expand, setExpand] = useState('');
  if (todoDetail) {
    currntStatus = Number(todoDetail.main.status);
  }
  if (currentObj) {
    queryStatue = currentObj;
    console.log('queryStatue: ', !queryStatue);
  }
  const onChange = activekey => {
    setActivekey(activekey);
  };

  const getInformation = () => {
    dispatch({
      type: 'problemmanage/ToDodetails',
      payload: { id },
    });
  };

  return (
    <>
      {activekey === '1' && currntStatus !== 5 && (
        <Problemregistration registrationDetail={todoDetail} statue={currntStatus} />
      )}

      {activekey === '1' && queryStatue && currntStatus >= 29 && (
        <Problemreview reviesDetail={todoDetail} />
      )}

      {activekey === '1' && queryStatue && currntStatus >= 45 && (
        <Problemsolving solvingDetail={todoDetail} />
      )}

      {activekey === '1' && queryStatue && currntStatus > 45 && currentProcess !== '问题确认' && (
        <Problemconfirmation confirmationDetail={todoDetail} />
      )}

      {activekey === '1' && queryStatue && currntStatus > 65 && currentProcess !== '确认会签' && (
        <Confirmationcountersignature countersignatureDetail={todoDetail} />
      )}
    </>
  );
}
export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    todoDetail: problemmanage.todoDetail,
    loading: loading.models.problemmanage,
  }))(queryDetail),
);
