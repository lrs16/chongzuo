import React, { useEffect, useState, useRef } from 'react';
import {
  Collapse,
  Button,
  message
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
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
    location: { query: { id, search } },
    location,
    scorecardetail,
    maintenanceArr,
    tabnew, tabdata
  } = props;
  const RegistratRef = useRef();
  const [contractArr, setContractArr] = useState([]);
  const [editTablesource, setEditTablesource] = useState([]);
  // const [providerId, setProviderId] = useState(''); //  设置服务商的id
  // const [scoreId, setScoreId] = useState(''); //  设置服务商的id

  const handlePrint = () => {
    window.document.body.innerHTML = window.document.getElementById('alldom').innerHTML;
    // window.print();
    document.execCommand('print')
    window.location.reload();
  }

  //  获取合同名称
  const getContrractname = (providerId) => {
    contractProvider({id:providerId,status:'1'}).then(res => {
      if (res) {
        const arr = [...(res.data)];
        setContractArr(arr);
      }
    });
  }

  const handleSave = () => {
    RegistratRef.current.validateFields((err, values) => {
      console.log('values: ', values);
      if (!err) {
        dispatch({
          type: 'performanceappraisal/scorecardSave',
          payload: {
            ...values,
            cardYear: '2021',
            cardSeason: '1',
            details: editTablesource,
            beginTime: values.evaluationInterval?.length ? moment(values.evaluationInterval[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: values.evaluationInterval?.length ? moment(values.evaluationInterval[1]).format('YYYY-MM-DD HH:mm:ss') : '', // 发生时间
            evaluationInterval: '',
            assessType:(values.assessType && values.assessType === '功能开发') ? '1':'2'
            // assessTime:moment(values.assessTime).format('YYYY-MM-DD HH:mm:ss'),
            // applyTime:moment(values.applyTime).format('YYYY-MM-DD HH:mm:ss'),
          }
        })
      }
    })
  }

  const handleSubmit = () => {
    dispatch({
      type: 'performanceappraisal/scorecardPrint',
      payload: id
    }).then(res => {
      const filename = '下载.doc';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url)
    })
  }

  const scorecardUpdateRemark = (editid, remark) => {
    dispatch({
      type: 'qualityassessment/updateRemark',
      payload: {
        id: editid,
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

  const changeTablesource = (editid, target) => {
    scorecardUpdateRemark(editid, target)
  }

  useEffect(() => {
  
    if (id) {
      registerDetail();
      
    } else {
      dispatch({
        type: 'performanceappraisal/clear'
      })
    }
  }, [id]);

  useEffect(() => {
    const { providerId } = scorecardetail;
    if(providerId) {
      getContrractname(providerId);
      setEditTablesource(scorecardetail.details)
    }
  },[scorecardetail])


  //  重置表单信息
  // useEffect(() => {
  //   if (tabnew) {
  //     RegistratRef.current.resetFields()
  //   }
  // }, [tabnew])

  console.log(tabdata, 'tabdata')

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

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/servicequalityassessment/serviceperformanceappraisal/register`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  }

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>

          {!search && (
            <>
              <Button type='primary' onClick={handleSave}>保存</Button>
              {
                id && (
                  <Button type='primary' onClick={handleSubmit}>提交</Button>
                )
              }
            </>
          )}


          {/* {
            search && (
              
            )
          } */}
          {
            search && (
              <Button type='primary' onClick={handleSubmit}>下载</Button>
            )
          }

          <Button
            onClick={handleClose}
          >
            关闭
          </Button>


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
                register={id ? scorecardetail : tabdata}
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
  connect(({ eventstatistics, performanceappraisal, qualityassessment, viewcache, loading }) => ({
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