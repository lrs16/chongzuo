import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  Card,
  Collapse
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { contractProvider } from '../services/quality';
import { operationPerson } from '@/services/common';
import { connect } from 'dva';
import Register from './components/Register';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

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

const { Panel } = Collapse;
function Registertion(props) {
  const pagetitle = props.route.name;
  const {
    location: { query: { taskId, assessNo, mainId } },
    userinfo,
    dispatch,
    target1,
    target2,
    clauseList,
    loading
  } = props;
  const RegistratRef = useRef();
  const [contractArr, setContractArr] = useState([]);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [activeKey, setActiveKey] = useState(['registratform']);
  const handleClose = () => {
    router.push({
      pathname: `/ITSM/servicequalityassessment/creditcard/creditcardregister`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  }

  const callback = key => {
    console.log('key: ', key);
    setActiveKey(key);
  };

  const handleSubmit = (params) => {
    RegistratRef.current.validateFields((err, values) => {
      if (params ? !err : true) {
        const submitIfnfo = values;
        delete submitIfnfo.provider;
        // delete submitIfnfo.clause;
        delete submitIfnfo.score;
        // delete submitIfnfo.contract;
        dispatch({
          type: 'performanceappraisal/assessRegister',
          payload: {
            ...submitIfnfo,
            assessTime: moment(values.assessTime).format('YYYY-MM-DD HH:mm:ss'),
            applyTime: moment(values.applyTime).format('YYYY-MM-DD HH:mm:ss'),
            attachment: files.ischange ? JSON.stringify(files.arr) : ''
          }
        })
      }
    })
  }

  const getUserinfo = () => {
    dispatch({
      type: 'itsmuser/fetchuser'
    })
  }

  //  根据考核类型查询一级指标
  const getTarget1 = (type) => {
    dispatch({
      type: 'qualityassessment/scoreGetTarget1',
      payload: type
    })
  }
  //  根据考核类型查询二级指标
  const getTarget2 = (id) => {
    dispatch({
      type: 'qualityassessment/scoreGetTarget2',
      payload: id
    })
  }

  //  获取详细条款数据
  const getclausedetail = (targetId, scoreId) => {
    dispatch({
      type: 'qualityassessment/clauseListpage',
      payload: {
        targetId,
        scoreId,
        pageNum: 1,
        pageSize: 1000
      }
    })
  }

  //  获取合同名称
  const getContrractname = (providerId) => {
    contractProvider(providerId).then(res => {
      if (res) {
        const arr = [...(res.data)];
        setContractArr(arr);
      }
    });
  }


  useEffect(() => {
    getUserinfo();
  }, [])

  useEffect(() => {
    if (files.ischange) {
      handleSubmit(0)
    }
  }, [files])



  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button
            type='primary'
            style={{ marginRight: 8 }}
            onClick={handleSubmit}
          >
            保存
          </Button>

          <Button
            onClick={handleClose}
          >
            关闭
          </Button>
        </>
      }
    >
      {/* {
        loading !== true && ( */}
      <div className={styles.collapse}>
        <Collapse
          expandIconPosition='right'
          defaultActiveKey={['1']}
          bordered={false}
          onChange={callback}
        >
          <Panel
            header='服务绩效考核登记'
            key='1'
          >
            <Register
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
              ref={RegistratRef}
              userinfo={userinfo}
              getTarget1={getTarget1}
              getTarget2={getTarget2}
              target1={target1}
              target2={target2}
              getclausedetail={getclausedetail}
              clauseList={clauseList}
              contractArr={contractArr}
              getContrractname={getContrractname}
              files={[]}
              ChangeFiles={newvalue => {
                setFiles(newvalue);
              }}
              loading={loading}
            />
          </Panel>
        </Collapse>
      </div>
      {/* //   )
      // } */}

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ qualityassessment, itsmuser, loading }) => ({
    target2: qualityassessment.target2,
    target1: qualityassessment.target1,
    clauseList: qualityassessment.clauseList,
    userinfo: itsmuser.userinfo,
    loading: loading.models.qualityassessment
  }))(Registertion)
)

