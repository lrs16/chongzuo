import React, { useState, createContext, useRef, useEffect } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import router from 'umi/router';
import { Button, Collapse, message, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
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
  const [defaultvalue, setDefaultvalue] = useState('');
  const [registratfiles, setRegistratFiles] = useState({ arr: [], ischange: false }); // 登记上传
  const [handlefiles, setHandleFiles] = useState({ arr: [], ischange: false }); // 处理上传
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const RegistratRef = useRef();
  const HandleRef = useRef();

  // useEffect(() => {
  //   if (tabnew) {
  //     const registdata = getregistdata();
  //     const handledata = gethandledata();
  //     dispatch({
  //       type: 'viewcache/gettabstate',
  //       payload: {
  //         ...registdata,
  //         ...handledata,
  //         register_occurTime: registdata.register_occurTime.format('YYYY-MM-DD HH:mm:ss'),
  //       },
  //     });
  //   }
  // }, [tabnew])

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
    RegistratRef.current.validateFields((err, values) => {
      setFormregistrat({
        ...values,
        main_eventObject: values.main_eventObject?.slice(-1)[0],
        register_occurTime: values.register_occurTime.format('YYYY-MM-DD HH:mm:ss'),
        register_applicationUnit: values.applicationUnit,
        register_applicationUnitId: values.applicationUnit === '' ? '' : values.register_applicationUnitId,
        register_mobilePhone: values.main_revisitWay === '002' ? values.mobilePhone1 : values.mobilePhone2,
        register_applicationDept:
          values.register_applicationDept !== ''
            ? values.register_applicationDept
            : values.register_applicationUnit,
        register_applicationDeptId:
          values.register_applicationDeptId !== ''
            ? values.register_applicationDeptId
            : values.register_applicationUnitId,
        register_fileIds: JSON.stringify(registratfiles.arr),
        register_selfhandle: String(Number(values.register_selfhandle)),
        register_supplement: String(Number(values.register_supplement)),
      });
      if (show) {
        if (err) {
          setIscheck({ save: false, flow: false });
          message.error('请将登记信息填写完整...');
        }
      } else {
        submittype(type);
      }
    });
  };

  const gethandle = type => {
    RegistratRef.current.validateFields(err => {
      if (!err) {
        HandleRef.current.validateFields((e, values) => {
          setFormhandle({
            ...values,
            main_eventObject: values.main_eventObject?.slice(-1)[0],
            handle_endTime: values.handle_endTime.format('YYYY-MM-DD HH:mm:ss'),
            handle_fileIds: JSON.stringify(handlefiles.arr),
          });
          setIscheck({ save: false, flow: false });
          submittype(type);
        });
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

  const handleflow = () => {
    if (show) {
      getregistrat('flow');
      gethandle('flow');
    }
    getregistrat('flow');
  };

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
    if (registratfiles.ischange) {
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
    if (handlefiles.ischange) {
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
      RegistratRef.current.resetFields();
    }
  }, [tabnew]);
  // 获取页签信息
  useEffect(() => {
    if (location.state.cache) {
      const formr = RegistratRef.current.getFieldsValue();
      if (show) {
        const formh = HandleRef.current.getFieldsValue();
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...formr,
              ...formh,
              main_eventObject: formr.main_eventObject?.slice(-1)[0],
              register_occurTime: formr.register_occurTime.format('YYYY-MM-DD HH:mm:ss'),
              register_applicationUnit: formr.applicationUnit,
              register_applicationUnitId: formr.applicationUnit === '' ? '' : formr.register_applicationUnitId,
              register_mobilePhone: formr.main_revisitWay === '002' ? formr.mobilePhone1 : formr.mobilePhone2,
              register_applicationDept:
                formr.register_applicationDept !== ''
                  ? formr.register_applicationDept
                  : formr.register_applicationUnit,
              register_applicationDeptId:
                formr.register_applicationDeptId !== ''
                  ? formr.register_applicationDeptId
                  : formr.register_applicationUnitId,
              register_fileIds: JSON.stringify(registratfiles.arr),
              register_selfhandle: String(Number(formr.register_selfhandle)),
              register_supplement: String(Number(formr.register_supplement)),
              handle_endTime: formh.handle_endTime.format('YYYY-MM-DD HH:mm:ss'),
            },
            tabid: sessionStorage.getItem('tabid')
          },
        });
      } else {
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...formr,
              main_eventObject: formr.main_eventObject?.slice(-1)[0],
              register_occurTime: formr.register_occurTime.format('YYYY-MM-DD HH:mm:ss'),
              register_applicationUnit: formr.applicationUnit,
              register_applicationUnitId: formr.applicationUnit === '' ? '' : formr.register_applicationUnitId,
              register_mobilePhone: formr.main_revisitWay === '002' ? formr.mobilePhone1 : formr.mobilePhone2,
              register_applicationDept:
                formr.register_applicationDept !== ''
                  ? formr.register_applicationDept
                  : formr.register_applicationUnit,
              register_applicationDeptId:
                formr.register_applicationDeptId !== ''
                  ? formr.register_applicationDeptId
                  : formr.register_applicationUnitId,
              register_fileIds: JSON.stringify(registratfiles.arr),
              register_selfhandle: String(Number(formr.register_selfhandle)),
              register_supplement: String(Number(formr.register_supplement)),
            },
            tabid: sessionStorage.getItem('tabid')
          },
        });
      }
      RegistratRef.current.resetFields();
    }
  }, [location]);

  const operations = (
    <>
      <Button type="primary" style={{ marginRight: 8 }} onClick={handlesubmit}>
        保 存
      </Button>
      <Button type="default" onClick={() => handleclose()}>
        关 闭
      </Button>
    </>
  );

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <SysDict
        typeid="1354273739344187393"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Spin tip="正在提交数据..." spinning={!!loading}>
        <div className={styles.collapse}>
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
                ChangeFiles={newvalue => {
                  setRegistratFiles(newvalue);
                }}
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                show={show}
                ref={RegistratRef}
                userinfo={userinfo}
                sethandlevalue="true"
                location={location}
                files={registratfiles.arr}
                selectdata={selectdata}
                info={tabdata}
                main={tabdata}
              />
            </Panel>
            {show === true && check === false && (
              <Panel header="事件处理" key="handleform">
                <Handle
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  ref={HandleRef}
                  userinfo={userinfo}
                  defaultvalue={defaultvalue}
                  location={location}
                  ChangeFiles={newvalue => {
                    setHandleFiles(newvalue);
                  }}
                  show={show}
                  selectdata={selectdata}
                  files={[]}
                // info={tabdata}
                // main={tabdata}
                />
              </Panel>
            )}
          </Collapse>
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
