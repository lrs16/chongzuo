import React, { useState, createContext, useRef, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Collapse, message, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HadleContext from '@/layouts/MenuContext';
// import SelectUser from '@/components/SelectUser';
import SysDict from '@/components/SysDict';
import styles from './index.less';
import Handle from './components/Handle';
import Registrat from './components/Registrat';

const { Panel } = Collapse;

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

export const RegistratContext = createContext();

function Registration(props) {
  const pagetitle = props.route.name;
  const { dispatch, loading, userinfo, tabnew, location, tabdata } = props;
  const [formregistrat, setFormregistrat] = useState('');
  const [formhandle, setFormhandle] = useState('');
  const [show, setShow] = useState(false); // 自行处理
  const [check, setCheck] = useState(false); // 审批
  const [ischeck, setIscheck] = useState({ save: false, flow: false }); // 是否在校验状态
  const [activeKey, setActiveKey] = useState(['registratform']);
  const [defaultvalue, setDefaultvalue] = useState({});
  const [registratfiles, setRegistratFiles] = useState({ arr: [], ischange: false }); // 登记上传
  const [handlefiles, setHandleFiles] = useState({ arr: [], ischange: false }); // 处理上传
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [uploadStatus, setUploadStatus] = useState(false);
  const [handleUploadStatus, setHandleUploadStatus] = useState(false);
  const RegistratRef = useRef(null);
  const HandleRef = useRef(null);

  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'event');
  }, []);

  const callback = key => {
    setActiveKey(key);
  };

  const submittype = type => {
    switch (type) {
      case 'save':
        setIscheck({ ...ischeck, save: true });
        break;
      case 'flow':
        setIscheck({ ...ischeck, flow: true });
        break;
      default:
        break;
    }
  };

  const getregistrat = type => {
    const values = RegistratRef.current?.getVal();
    setFormregistrat({
      ...values,
      main_eventObject: values.main_eventObject?.slice(-1)[0],
      register_occurTime: values.register_occurTime.format('YYYY-MM-DD HH:mm:ss'),
      register_applicationUnit: values.applicationUnit,
      register_applicationUnitId: values.applicationUnit === '' ? '' : values.register_applicationUnitId,
      register_mobilePhone: values.main_revisitWay === '002' ? values.mobilePhone1 : values.mobilePhone2,
      register_applicationDept: values.register_applicationDept ? values.register_applicationDept : values.register_applicationUnit,
      register_applicationDeptId: values.register_applicationDeptId ? values.register_applicationDeptId : values.register_applicationUnitId,
      register_fileIds: JSON.stringify(registratfiles.arr),
      register_selfhandle: String(Number(values.register_selfhandle)),
      register_supplement: String(Number(values.register_supplement)),
    });
    if (show) {
      RegistratRef.current.Forms((err) => {
        if (err) {
          setIscheck({ save: false, flow: false });
          message.error('请将登记信息填写完整...');
        }
      })
    } else {
      RegistratRef.current.geteventObject(['main_eventObject'], err => {
        if (!err) {
          submittype(type);
        }
      });
    }
  };

  const gethandle = type => {
    RegistratRef.current.Forms((err) => {
      const values = RegistratRef.current?.getVal();
      setFormregistrat({
        ...values,
        main_eventObject: values.main_eventObject?.slice(-1)[0],
        register_occurTime: moment(values.register_occurTime).format('YYYY-MM-DD HH:mm:ss'),
        register_applicationUnit: values.applicationUnit,
        register_applicationUnitId: values.applicationUnit === '' ? '' : values.register_applicationUnitId,
        register_mobilePhone: values.main_revisitWay === '002' ? values.mobilePhone1 : values.mobilePhone2,
        register_applicationDept: values.register_applicationDept ? values.register_applicationDept : values.register_applicationUnit,
        register_applicationDeptId: values.register_applicationDeptId ? values.register_applicationDeptId : values.register_applicationUnitId,
        register_fileIds: JSON.stringify(registratfiles.arr),
        register_selfhandle: String(Number(values.register_selfhandle)),
        register_supplement: String(Number(values.register_supplement)),
      });
      if (!err) {
        const val = HandleRef.current?.getVal();
        setFormhandle({
          ...val,
          handle_endTime: moment(val.handle_endTime).format('YYYY-MM-DD HH:mm:ss'),
          handle_fileIds: JSON.stringify(handlefiles.arr),
        });
        setIscheck({ save: false, flow: false });
        submittype(type);
      }
    });
  };

  const eventsave = () => {
    dispatch({
      type: 'eventregist/eventstart',
      payload: {
        ...formregistrat,
        ...formhandle,
      },
    });
  };

  const eventflow = () => {
    dispatch({
      type: 'eventregist/eventsaveflow',
      payload: {
        formvalue: {
          ...formregistrat,
          ...formhandle,
        },
        // flowtype,
      },
    });
  };

  const handlesubmit = () => {
    if (show) {
      getregistrat('save');
      gethandle('save');
    } else {
      getregistrat('save');
    }
  };

  // const handleflow = () => {
  //   if (show) {
  //     getregistrat('flow');
  //     gethandle('flow');
  //   }
  //   getregistrat('flow');
  // };

  useEffect(() => {
    if (ischeck.save) {
      eventsave();
    }
    if (ischeck.flow) {
      eventflow();
    }
  }, [ischeck]);

  // 登记上传附件触发保存
  useEffect(() => {
    if (registratfiles.ischange && !handleUploadStatus) {
      handlesubmit();
    }
  }, [registratfiles]);

  useEffect(() => {
    if (location.query.save) {
      handlesubmit();
    }
  }, [location.query]);

  // 自行处理上传附件触发保存
  useEffect(() => {
    if (handlefiles.ischange && !uploadStatus) {
      handlesubmit();
    }
  }, [handlefiles]);

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/eventmanage/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  };


  // 重置表单信息
  useEffect(() => {
    if (tabnew) {
      RegistratRef.current.resetVal();
      setRegistratFiles([]);
      setHandleFiles([]);
      setShow(false)
    }
  }, [tabnew]);
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
        const main = {
          addTime: values.main_addTime,
          content: values.main_content,
          eventEffect: values.main_eventEffect,
          eventEmergent: values.main_eventEmergent,
          eventNo: '',
          eventObject: values.main_eventObject?.slice(-1)[0],
          eventPrior: values.main_eventPrior,
          eventSource: values.main_eventSource,
          eventType: values.main_eventType,
          revisitWay: values.main_revisitWay,
          title: values.main_title,
        };
        const register = {
          applicationDept: values.register_applicationDept,
          applicationDeptId: values.register_applicationDeptId,
          applicationUnit: values.register_applicationUnit,
          applicationUnitId: values.register_applicationUnitId,
          applicationUser: values.register_applicationUser,
          applicationUserId: values.register_applicationUserId,
          applicationUserPhone: values.register_applicationUserPhone,
          id: '',
          occurTime: moment(values.register_occurTime).format('YYYY-MM-DD HH:mm:ss'),
          selfhandle: values.register_selfhandle,
          supplement: values.register_supplement,
          mobilePhone: values.mobilePhone2 ? values.mobilePhone2 : values.mobilePhone1,
          fileIds: JSON.stringify(registratfiles.arr),
        }
        if (show) {
          const val = HandleRef.current.getVal();
          const handle = {
            addTime: moment(val.handle_addTime).format('YYYY-MM-DD HH:mm:ss'),
            content: val.handle_content,
            endTime: moment(val.handle_endTime).format('YYYY-MM-DD HH:mm:ss'),
            handle_id: '',
            fileIds: JSON.stringify(handlefiles.arr),
          };
          const handlemain = {
            eventObject: val.main_eventObject?.slice(-1)[0],
            main_eventObject: val.main_eventObject,
            main_eventType: val.main_eventType,
            eventResult: val.handle_handleResult
          }
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                register: { ...register },
                main: { ...main },
                handle: { ...handle },
                handlemain: { ...handlemain },
                show: true,
              },
              tabid: sessionStorage.getItem('tabid')
            },
          });
          RegistratRef.current?.resetVal();
          HandleRef.current?.resetVal();
          setShow(false);
        } else {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                register: { ...register },
                main: { ...main },
              },
              tabid: sessionStorage.getItem('tabid')
            },
          });
          RegistratRef.current?.resetVal();
        };
      }
    }
  }, [location]);

  useEffect(() => {
    if (tabdata && tabdata.show) {
      setShow(true);
      setActiveKey(["registratform", "handleform"]);
      setDefaultvalue({
        main_eventType: tabdata.handlemain.main_eventType,
        main_eventObject: tabdata.handlemain.main_eventObject,
      })
    }
    if (tabdata && tabdata.handle && tabdata.handle.fileIds) {
      setHandleFiles({ arr: JSON.parse(tabdata.handle.fileIds), ischange: false })
    }
  }, [tabdata]);

  const operations = (
    <>
      <Button type="primary" style={{ marginRight: 8 }} onClick={handlesubmit} disabled={uploadStatus || handleUploadStatus}>
        保存
      </Button>
      <Button type="default" onClick={() => handleclose()}>
        关闭
      </Button>
    </>
  );
  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <SysDict
        typeid="331"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Spin tip="正在提交数据..." spinning={!!loading}>
        <div className={styles.collapse}>
          <HadleContext.Provider value={{
            getUploadStatus: (v) => { setHandleUploadStatus(v) },
            getRegistUploadStatus: (v) => { setUploadStatus(v) }
          }}>
            <Collapse
              expandIconPosition="right"
              // defaultActiveKey={['1']}
              activeKey={activeKey}
              bordered={false}
              onChange={callback}
            >
              <Panel header="事件登记" key="registratform">
                <Registrat
                  ChangeShow={isshow => setShow(isshow)}
                  ChangeCheck={checked => setCheck(checked)}
                  ChangeActiveKey={keys => setActiveKey(keys)}
                  changeDefaultvalue={values => setDefaultvalue(values)}
                  ChangeFiles={newvalue => { setRegistratFiles(newvalue) }}
                  // getUploadStatus={v => { setUploadStatus(v) }}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  show={show}
                  wrappedComponentRef={RegistratRef}
                  userinfo={userinfo}
                  location={location}
                  files={registratfiles.arr}
                  selectdata={selectdata}
                  info={tabdata ? { register: tabdata.register } : undefined}
                  main={tabdata ? tabdata.main : undefined}
                />
              </Panel>
              {show && check === false && (
                <Panel header="事件处理" key="handleform">
                  <Handle
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    wrappedComponentRef={HandleRef}
                    userinfo={userinfo}
                    defaultvalue={defaultvalue}
                    location={location}
                    ChangeFiles={newvalue => { setHandleFiles(newvalue) }}
                    show={show}
                    selectdata={selectdata}
                    files={handlefiles.arr}
                    info={(!tabdata || !tabdata.handle) ? undefined : { handle: tabdata.handle }}
                    main={(!tabdata || !tabdata.handlemain) ? undefined : tabdata.handlemain}
                    uploadStatus={uploadStatus}
                  />
                </Panel>
              )}
            </Collapse>
          </HadleContext.Provider>
        </div>
      </Spin>
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, viewcache, loading }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  userinfo: itsmuser.userinfo,
  loading: loading.models.eventregist,
}))(Registration);
