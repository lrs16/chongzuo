import React, { useEffect, useState, useRef } from 'react';
import {
  Collapse,
  Button,
  message
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Register from './components/Register';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { contractProvider } from '../services/quality';
import styles from '../ServicePerformanceappraisal/index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
}
const formItemdeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
}

const { Panel } = Collapse;
function CreditCardRegister(props) {
  const pagetitle = props.route.name;
  const {
    loading,
    dispatch,
    clauseList,
    location: { query: { id,search } },
    location,
    scorecardetail,
    maintenanceArr,
    tabnew,tabdata
  } = props;
  const RegistratRef = useRef();
  const [contractArr, setContractArr] = useState([]);
  const [editTablesource,setEditTablesource]=useState([]);
  // const [providerId, setProviderId] = useState(''); //  设置服务商的id
  // const [scoreId, setScoreId] = useState(''); //  设置服务商的id

  useEffect(() => {
    dispatch({
      type: 'eventstatistics/fetchMaintenancelist',
      payload: {
        tabActiveKey: 'week',
        startTime: '2021-06-28',
        endTime: '2021-07-04'
      }
    })
  }, [])


  const handlePrint = () => {
    window.document.body.innerHTML = window.document.getElementById('alldom').innerHTML;
    // window.print();
    document.execCommand('print')
    window.location.reload();
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

  const handleSave = () => {
    RegistratRef.current.validateFields((err, values) => {
      if (!err) {
         dispatch({
          type: 'performanceappraisal/scorecardSave',
          payload: {
            ...values,
            cardYear: '2021',
            cardSeason: '1',
            details:editTablesource
            // assessTime:moment(values.assessTime).format('YYYY-MM-DD HH:mm:ss'),
            // applyTime:moment(values.applyTime).format('YYYY-MM-DD HH:mm:ss'),
          }
        })
      }
    })
  }

  const handleSubmit = () => {
    return dispatch({
      type:'performanceappraisal/scorecardSubmit',
      payload:id
    }).then(res => {
      if(res.code === 200) {
        message.info(res.msg);
      } else {
        message.error(res.msg);
      }
    })
  }

  const scorecardUpdateRemark = (editid,remark) => {
    console.log('remark: ', remark);
   dispatch({
      type:'qualityassessment/updateRemark',
      payload:{
        id:editid,
        remark
      }
    })
  }

  const registerDetail = () => {
    dispatch({
      type: 'performanceappraisal/getScorecardetail',
      payload: id
    })
  }

  const changeTablesource = (editid,target) => {
    scorecardUpdateRemark(editid,target)
  }

  useEffect(() => {
    const { providerId } = scorecardetail;
    if (id) {
      registerDetail();
      getContrractname(providerId);
      setEditTablesource(scorecardetail.details)
    } else {
      dispatch({
        type: 'performanceappraisal/clear'
      })
    }
  }, [id]);


  //  重置表单信息
  useEffect(() => {
    if(tabnew) {
      RegistratRef.current.resetFields()
    }
  },[tabnew])

  console.log(tabdata,'tabdata')

  //  获取页签信信息
  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        RegistratRef.current.validateFields((_, values) => {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                ...values,
              },
              tabid: sessionStorage.getItem('tabid')
            },
          });
        });
        RegistratRef.current.resetFields();
      }
    }
  }, [location]);

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button type='primary' onClick={handleSave}>保存</Button>
          <Button type='primary' onClick={handleSubmit}>提交</Button>
          {/* {
            search && (
              
            )
          } */}
          {
            search && (
              <Button type='primary' onClick={handleSubmit}>打印</Button>
            )
          }
        </>
      }
    >

      {loading !== true && (
        <div className={styles.collapse}>
          <Collapse
            expandIconPosition='right'
            defaultActiveKey={['1']}
            bordered={false}
          >
            <Panel header='计分卡登记' key='1'>
              <Register
                loading={loading}
                id={id}
                tableSource={maintenanceArr.data}
                formItemLayout={formItemLayout}
                formItemdeLayout={formItemdeLayout}
                ref={RegistratRef}
                register={id?scorecardetail:tabdata}
                clauseList={clauseList}
                contractArr={contractArr}
                getContrractname={getContrractname}
                changeTablesource={changeTablesource}
                search={search}
              />
            </Panel>
          </Collapse>
        </div>
      )}
    </PageHeaderWrapper>
  )
}

export default (
  connect(({ eventstatistics, performanceappraisal, qualityassessment,viewcache,loading }) => ({
    tabnew: viewcache.tabnew,
    tabdata: viewcache.tabdata,
    maintenanceArr: eventstatistics.maintenanceArr,
    target2: performanceappraisal.target2,
    target1: performanceappraisal.target1,
    clauseList: qualityassessment.clauseList,
    scorecardetail: performanceappraisal.scorecardetail,
    loading: loading.models.performanceappraisal
  }))(CreditCardRegister)
)