import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Collapse, message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import HadleContext from '@/layouts/MenuContext';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { contractProvider } from '../services/quality';
import Register from './components/Register';

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
    userinfo,
    dispatch,
    target1,
    target2,
    clauseList,
    tabnew,
    tabdata,
    location,
    loading
  } = props;
  const RegistratRef = useRef(null);
  const [contractArr, setContractArr] = useState([]);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [activeKey, setActiveKey] = useState(['registratform']);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [handleUploadStatus, setHandleUploadStatus] = useState(false);

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/servicequalityassessment/creditcard/creditcardregister`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
    });
  };

  const callback = key => {
    setActiveKey(key);
  };

  const handleSubmit = () => {
    const values = RegistratRef.current.getVal();
    RegistratRef.current.Forms((err) => {
      if (!err) {
        if (values.directorName) {
          const submitIfnfo = values;
          delete submitIfnfo.provider;
          delete submitIfnfo.score;
          delete values.ifscore;
          delete values.ifproviderName;
          dispatch({
            type: 'performanceappraisal/assessRegister',
            payload: {
              ...submitIfnfo,
              assessType: values.assessType === '系统运维' ? '2' : '1',
              assessTime: moment(values.assessTime).format('YYYY-MM-DD HH:mm:ss'),
              applyTime: moment(values.applyTime).format('YYYY-MM-DD HH:mm:ss'),
              attachment: files.ischange ? JSON.stringify(files.arr) : '',
            },
          });
        } else {
          message.error('请通过责任人下拉值形式选择责任人')
        }
      }
    })
  };

  const getUserinfo = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };

  //  根据考核类型查询一级指标
  const getTarget1 = type => {
    dispatch({
      type: 'qualityassessment/scoreGetTarget1',
      payload: type,
    });
  };

  //  根据考核类型查询二级指标
  const getTarget2 = id => {
    dispatch({
      type: 'qualityassessment/scoreGetTarget2',
      payload: id,
    });
  };

  //  获取详细条款数据
  const getclausedetail = (targetId, scoreId) => {
    dispatch({
      type: 'qualityassessment/clauseListpage',
      payload: {
        targetId,
        scoreId,
        pageNum: 1,
        pageSize: 1000,
      },
    });
  };

  //  获取合同名称
  const getContrractname = id => {
    contractProvider({ id, status: '1' }).then(res => {
      if (res) {
        const arr = [...res.data];
        setContractArr(arr);
      }
    });
  };

  useEffect(() => {
    // setShow(true)
    dispatch({
      type: 'qualityassessment/clearRegister'
    })
    getUserinfo();
    setContractArr([])
  }, []);

  useEffect(() => {
    if (files.ischange && !handleUploadStatus) {
      handleSubmit(0);
    }
  }, [files]);

  // 重置表单信息
  useEffect(() => {
    if (tabnew) {
      RegistratRef.current.resetVal();
      // setShow(false)
    }
  }, [tabnew]);

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state) {
      if (location.state.reset) {
        RegistratRef.current.resetVal();
      } else {
        dispatch({
          type: 'qualityassessment/clearRegister'
        });
        setContractArr([])
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (tabdata) {
      if (tabdata.providerId) {
        getContrractname(tabdata.providerId)
      }

      if (tabdata.assessType) {
        getTarget1(tabdata.assessType === '功能开发' ? '1' : '2')
      }

      if (tabdata.target1Id) {
        getTarget2(tabdata.target1Id)
      }

      if (tabdata.target2Id) {
        getclausedetail(tabdata.target2Id)
      }
    }
  }, [tabdata])

  // 获取页签信息
  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        if (uploadStatus || handleUploadStatus) {
          setUploadStatus(false);
          setHandleUploadStatus(false);
        };
        if (uploadStatus) { message.info('页签切换，中止文件上传...') }
        const values = RegistratRef.current.getVal();
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...values,
              applyTime: values.applyTime.format('YYYY-MM-DD HH:mm:ss'),
              assessTime: values.assessTime.format('YYYY-MM-DD HH:mm:ss'),
            },
            tabid: sessionStorage.getItem('tabid')
          },
        });
        RegistratRef.current.resetVal();
      }
    }
  }, [location]);

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={handleSubmit}
            disabled={uploadStatus || handleUploadStatus || loading}
          >
            保存
          </Button>

          <Button onClick={handleClose}>关闭</Button>
        </>
      }
    >
      <div className={styles.collapse}>
        <Collapse
          expandIconPosition="right"
          defaultActiveKey={['1']}
          bordered={false}
          onChange={callback}
        >
          <Panel header="服务绩效考核登记" key="1">
            <HadleContext.Provider value={{
              handleUploadStatus,
              getUploadStatus: (v) => { setHandleUploadStatus(v) },
              getRegistUploadStatus: (v) => { setUploadStatus(v) }
            }}>
              <Register
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                wrappedComponentRef={RegistratRef}
                userinfo={userinfo}
                getUploadStatus={v => { setUploadStatus(v) }}
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
                register={tabdata}
                tabdata={tabdata}
              />
            </HadleContext.Provider>
          </Panel>
        </Collapse>
      </div>

    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ qualityassessment, itsmuser, viewcache, loading }) => ({
    target2: qualityassessment.target2,
    target1: qualityassessment.target1,
    clauseList: qualityassessment.clauseList,
    userinfo: itsmuser.userinfo,
    loading: loading.models.qualityassessment,
    tabnew: viewcache.tabnew,
    tabdata: viewcache.tabdata,
  }))(Registertion),
);
