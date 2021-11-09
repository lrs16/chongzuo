import React, { useEffect, useState, useRef } from 'react';
import { Collapse, Button, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Register from './components/Register';
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
};
const formItemdeLayout = {
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
function CreditCardRegister(props) {
  const pagetitle = props.route.name;
  const {
    loading,
    dispatch,
    clauseList,
    location,
    location: {
      query: { paramId, search },
    },
    scorecardetail,
    maintenanceArr,
    tabnew,
    tabdata,
  } = props;

  const RegistratRef = useRef(null);
  const [contractArr, setContractArr] = useState([]);
  const [editTablesource, setEditTablesource] = useState([]);
  const [rangerTime, setRangerTime] = useState({ start: '', end: '' });

  //  获取合同名称

  const timeOK = data => {
    const startTime = moment(data[0]).format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(data[1]).format('YYYY-MM-DD HH:mm:ss');
    setRangerTime({
      start: startTime,
      end: endTime,
    });
  };

  const getContrractname = providerId => {
    contractProvider({ id: providerId, status: '1' }).then(res => {
      if (res) {
        const arr = [...res.data];
        setContractArr(arr);
      }
    });
  };

  const registerDetail = () => {
    dispatch({
      type: 'performanceappraisal/getScorecardetail',
      payload: { id: paramId },
    });
  };

  useEffect(() => {
    if (location.state && location.state.reset && paramId) {
      registerDetail();
    }
  }, [location.state]);

  const handleSave = () => {
    const values = RegistratRef.current.getVal();
    RegistratRef.current.Forms((err) => {
      if (!err) {
        if (paramId) {
          return dispatch({
            type: 'performanceappraisal/scorecardSave',
            payload: {
              id: paramId,
              ...values,
              details: editTablesource,
              beginTime:
                rangerTime.start ||
                (values.evaluationInterval?.length
                  ? moment(values.evaluationInterval[0]).format('YYYY-MM-DD HH:mm:ss')
                  : ''),
              endTime:
                rangerTime.end ||
                (values.evaluationInterval?.length
                  ? moment(values.evaluationInterval[1]).format('YYYY-MM-DD HH:mm:ss')
                  : ''),
              evaluationInterval: '',
              assessType: values.assessType && values.assessType === '功能开发' ? '1' : '2',
            },
          }).then(res => {
            if (res.code === 200) {
              message.success(res.msg);
              registerDetail();
            }
          });
        }

        if (!paramId) {
          dispatch({
            type: 'performanceappraisal/scorecardSave',
            payload: {
              id: paramId,
              ...values,
              details: editTablesource,
              beginTime:
                rangerTime.start ||
                (values.evaluationInterval?.length
                  ? moment(values.evaluationInterval[0]).format('YYYY-MM-DD HH:mm:ss')
                  : ''),
              endTime:
                rangerTime.end ||
                (values.evaluationInterval?.length
                  ? moment(values.evaluationInterval[1]).format('YYYY-MM-DD HH:mm:ss')
                  : ''),
              evaluationInterval: '',
              assessType: values.assessType && values.assessType === '功能开发' ? '1' : '2',
            },
          });
        }
      }
      return null;
    });
  };

  const handleSubmit = () => {
    return dispatch({
      type: 'performanceappraisal/scorecardSubmit',
      payload: paramId,
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        router.push({
          pathname: `/ITSM/servicequalityassessment/creditcard/creditcardregisterdetail`,
          query: {
            mainId: paramId,
            closetab: true,
          },
        });

        router.push({
          pathname: `/ITSM/servicequalityassessment/creditcard/creditcardtobe`,
          query: { pathpush: true },
          state: { cache: false },
        });
      }
    });
  };

  const download = () => {
    dispatch({
      type: 'performanceappraisal/scorecardPrint',
      payload: paramId,
    }).then(res => {
      const filename = '下载.doc';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const scorecardUpdateRemark = (editid, remark) => {
    dispatch({
      type: 'qualityassessment/updateRemark',
      payload: {
        id: editid,
        remark,
      },
    });
  };

  const changeTablesource = (editid, target) => {
    scorecardUpdateRemark(editid, target);
  };

  useEffect(() => {
    if (paramId) {
      registerDetail();
    } else {
      dispatch({
        type: 'performanceappraisal/clear',
      });
    }
  }, [paramId]);

  useEffect(() => {
    if (loading === false && scorecardetail) {
      const { providerId } = scorecardetail;
      if (providerId) {
        getContrractname(providerId);
        setEditTablesource(scorecardetail.details);
      }
    }
  }, [loading]);

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/servicequalityassessment/serviceperformanceappraisal/register`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
    });
  };

  const handleback = () => {
    if (search) {
      router.push({
        pathname: `/ITSM/servicequalityassessment/creditcard/creditcardsearch`,
        query: { pathpush: true },
        state: { cach: false }
      });
    } else {
      router.push({
        pathname: `/ITSM/servicequalityassessment/creditcard/creditcardtobe`,
        query: { pathpush: true },
        state: { cach: false }
      });
    }
  };

  // useEffect(() => {
  //   if (tabdata) {
  //     if (tabdata.providerId) {
  //       getContrractname(tabdata.providerId)
  //     }
  //   }
  // }, [tabdata])

  // 获取页签信息
  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.cache) {
  //       const values = RegistratRef.current.getVal();
  //       console.log('values:', values.evaluationInterval?.length ? moment(values.evaluationInterval[0]).format('YYYY-MM-DD HH:mm:ss'):'');
  //       dispatch({
  //         type: 'viewcache/gettabstate',
  //         payload: {
  //           cacheinfo: {
  //             ...values,
  //             beginTime:values.evaluationInterval?.length ? moment(values.evaluationInterval[0]).format('YYYY-MM-DD HH:mm:ss'):'',
  //             endTime:values.evaluationInterval?.length ? moment(values.evaluationInterval[1]).format('YYYY-MM-DD HH:mm:ss'):'',
  //             // evaluationInterval: values.evaluationInterval?.length ? [moment(values.evaluationInterval[0]), moment(values.evaluationInterval[1])]:'',
  //           },
  //           tabid: sessionStorage.getItem('tabid')
  //         },
  //       });
  //       RegistratRef.current.resetVal();
  //     }
  //   }
  // }, [location]);

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          {!search && (
            <>
              {!search && (
                <Button type="primary" onClick={handleSave}>
                  保存
                </Button>
              )}

              {paramId && !search && (
                <Button type="primary" onClick={handleSubmit}>
                  提交
                </Button>
              )}
            </>
          )}

          {paramId && (
            <Button type="primary" onClick={download}>
              下载
            </Button>
          )}

          {
            !paramId && (

              <Button onClick={handleClose}>关闭</Button>
            )
          }

          {
            paramId && (
              <Button onClick={handleback}>返回</Button>
            )
          }

        </>
      }
    >
      {(paramId ? loading === false && scorecardetail && scorecardetail.cardNo : true) && (
        <div className={styles.collapse}>
          <Collapse expandIconPosition="right" defaultActiveKey={['1']} bordered={false}>
            <Panel header="计分卡登记" key="1">
              <Register
                loading={loading}
                id={paramId}
                tableSource={maintenanceArr.data}
                formItemLayout={formItemLayout}
                formItemdeLayout={formItemdeLayout}
                wrappedComponentRef={RegistratRef}
                register={scorecardetail}
                clauseList={clauseList}
                contractArr={contractArr}
                getContrractname={getContrractname}
                changeTablesource={changeTablesource}
                search={search}
                timeOK={timeOK}
              />
            </Panel>
          </Collapse>
        </div>
      )}
    </PageHeaderWrapper>
  );
}

export default connect(
  ({ eventstatistics, performanceappraisal, qualityassessment, viewcache, loading }) => ({
    maintenanceArr: eventstatistics.maintenanceArr,
    target2: performanceappraisal.target2,
    target1: performanceappraisal.target1,
    clauseList: qualityassessment.clauseList,
    scorecardetail: performanceappraisal.scorecardetail,
    tabnew: viewcache.tabnew,
    tabdata: viewcache.tabdata,
    loading: loading.models.performanceappraisal,
  }),
)(CreditCardRegister);
