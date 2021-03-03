import React, { useState, createContext, useRef, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Collapse, Steps, Spin, message } from 'antd';
import styles from './index.less';
import Registrat from './components/Registrat';
import Check from './components/Check';
import Handle from './components/Handle';
import ReturnVisit from './components/ReturnVisit';
import Registratdes from './components/Registratdes';
import Checkdes from './components/Checkdes';
import Handledes from './components/Handledes';
import ReturnVisitdes from './components/ReturnVisitdes';
import SelectData from './components/SelectData';

const { Panel } = Collapse;
const { Step } = Steps;

// panle,map
const Collapsekeymap = new Map([
  ['已登记', 'registratform'],
  ['待审核', 'checkform'],
  ['审核中', 'checkform'],
  ['待处理', '1'],
  ['处理中', 'handleform'],
  ['待确认', 'visitform'],
  ['确认中', 'visitform'],
]);
// panel详情
const Panelheadermap = new Map([
  ['register', '事件登记'],
  ['handle', '事件处理'],
  ['check', '事件审核'],
  ['finish', '事件确认'],
]);

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

function WorkOrder2(props) {
  const {
    location,
    dispatch,
    loading,
    recordsloading,
    info,
    records,
    userinfo,
    type,
    ChangeType,
  } = props;
  const { mainId, taskId, taskName } = location.query;
  const [formregistrat, setFormregistrat] = useState('');
  const [formcheck, setFormcheck] = useState('');
  const [formhandle, setFormhandle] = useState('');
  const [formvisit, setFormvisit] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [handefiles, setHandleFiles] = useState({ arr: [], ischange: false }); // 登记时自行处理附件列表
  const [ischeck, setIscheck] = useState(false); // 是否在校验状态
  const [show, setShow] = useState(false); // 是否自行处理
  const [check, setCheck] = useState(false); // 事件分类是否权限账号
  const [defaultvalue, setDefaultvalue] = useState(''); // 自行处理后处理表单回填信息
  const [activeKey, setActiveKey] = useState([]);
  const [isnew, setIsNew] = useState(false);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const { flowInstanceId, flowNodeInstanceId, flowNodeName, editState, data, edit, main } = info; // 流程基本信息
  // console.log(location);
  // 保存、流转表单信息
  const paloadvalues = {
    ...formregistrat,
    ...formcheck,
    ...formhandle,
    ...formvisit,
    flowInstanceId,
    flowNodeInstanceId,
    flowNodeName,
    editState,
  };

  // 保存
  const eventsave = () => {
    dispatch({
      type: 'eventtodo/eventsave',
      payload: {
        paloadvalues,
        taskName,
        flowInstanceId,
      },
    });
  };
  // 流转
  const eventflow = newflowtype => {
    dispatch({
      type: 'eventtodo/eventflow',
      payload: {
        flow: {
          taskId,
          userIds: sessionStorage.getItem('NextflowUserId'),
          type: newflowtype,
        },
        paloadvalues,
      },
    });
  };
  // 确认
  const eventcheck = newflowtype => {
    dispatch({
      type: 'eventtodo/eventflow',
      payload: {
        flow: {
          taskId,
          userIds: data[1].register.registerUserId,
          type: newflowtype,
        },
        paloadvalues,
      },
    });
  };

  // 结束
  const overflow = () => {
    dispatch({
      type: 'eventtodo/overflow',
      payload: {
        flow: {
          id: taskId,
          userIds: sessionStorage.getItem('userauthorityid'),
          type: '1',
        },
        paloadvalues,
      },
    });
  };

  const formerr = () => {
    message.error('请将信息填写完整...');
    ChangeType('');
  };

  // 登记表单
  const RegistratRef = useRef();
  const getregistrats = () => {
    if (type === 'save') {
      if (show) {
        RegistratRef.current.validateFields((err, values) => {
          if (!err) {
            setIscheck(true);
            setFormregistrat({
              ...values,
              main_eventObject: values.main_eventObject.slice(-1)[0],
              register_occurTime: values.register_occurTime.format('YYYY-MM-DD HH:mm:ss'),
              register_selfhandle: String(Number(values.register_selfhandle)),
              register_supplement: String(Number(values.register_supplement)),
              register_fileIds: JSON.stringify(files.arr),
            });
          } else {
            formerr();
          }
        });
      } else {
        RegistratRef.current.validateFields((err, values) => {
          setIscheck(true);
          setFormregistrat({
            ...values,
            main_eventObject: values.main_eventObject.slice(-1)[0],
            register_occurTime: values.register_occurTime.format('YYYY-MM-DD HH:mm:ss'),
            register_selfhandle: String(Number(values.register_selfhandle)),
            register_supplement: String(Number(values.register_supplement)),
            register_fileIds: JSON.stringify(files.arr),
          });
        });
      }
    } else {
      RegistratRef.current.validateFields((err, values) => {
        if (!err) {
          setIscheck(true);
          setFormregistrat({
            ...values,
            main_eventObject: values.main_eventObject.slice(-1)[0],
            register_occurTime: values.register_occurTime.format('YYYY-MM-DD HH:mm:ss'),
            register_selfhandle: String(Number(values.register_selfhandle)),
            register_supplement: String(Number(values.register_supplement)),
            register_fileIds: JSON.stringify(files.arr),
          });
        } else {
          formerr();
        }
      });
    }
  };

  // 审核表单
  const CheckRef = useRef();
  const getchecks = () => {
    if (type === 'save') {
      CheckRef.current.validateFields((err, values) => {
        setIscheck(true);
        setFormcheck({
          ...values,
          check_checkTime: values.check_checkTime.format('YYYY-MM-DD HH:mm:ss'),
          check_fileIds: JSON.stringify(files.arr),
        });
      });
    } else {
      CheckRef.current.validateFields((err, values) => {
        if (!err) {
          setIscheck(true);
          setFormcheck({
            ...values,
            check_checkTime: values.check_checkTime.format('YYYY-MM-DD HH:mm:ss'),
            check_fileIds: JSON.stringify(files.arr),
          });
        } else {
          formerr();
        }
      });
    }
  };

  // 处理表单
  const HandleRef = useRef();
  const gethandles = () => {
    if (type === 'save') {
      if (show) {
        HandleRef.current.validateFields((err, values) => {
          if (!err) {
            setIscheck(true);
            setFormhandle({
              ...values,
              main_eventObject: values.main_eventObject?.slice(-1)[0],
              handle_endTime: values.handle_endTime.format('YYYY-MM-DD HH:mm:ss'),
              handle_fileIds: JSON.stringify(handefiles.arr),
            });
          } else {
            formerr();
          }
        });
      } else {
        HandleRef.current.validateFields((err, values) => {
          setIscheck(true);
          setFormhandle({
            ...values,
            main_eventObject: values.main_eventObject.slice(-1)[0],
            handle_endTime: values.handle_endTime.format('YYYY-MM-DD HH:mm:ss'),
            handle_fileIds: JSON.stringify(files.arr),
          });
        });
      }
    } else {
      HandleRef.current.validateFields((err, values) => {
        if (!err) {
          setIscheck(true);
          setFormhandle({
            ...values,
            main_eventObject: values.main_eventObject?.slice(-1)[0],
            handle_endTime: values.handle_endTime.format('YYYY-MM-DD HH:mm:ss'),
            handle_fileIds: JSON.stringify(files.arr),
          });
        } else {
          formerr();
        }
      });
    }
  };

  // 回访
  const ReturnVisitRef = useRef();
  const getreturnvisit = () => {
    if (type === 'save') {
      ReturnVisitRef.current.validateFields((err, values) => {
        setIscheck(true);
        setFormvisit({
          ...values,
          finish_revisitTime: values.finish_revisitTime.format('YYYY-MM-DD HH:mm:ss'),
          finish_fileIds: JSON.stringify(files.arr),
        });
      });
    } else {
      ReturnVisitRef.current.validateFields((err, values) => {
        if (!err) {
          setIscheck(true);
          setFormvisit({
            ...values,
            finish_revisitTime: values.finish_revisitTime.format('YYYY-MM-DD HH:mm:ss'),
            finish_fileIds: JSON.stringify(files.arr),
          });
        } else {
          formerr();
        }
      });
    }
  };

  //  console.log(records);
  const callback = key => {
    setActiveKey(key);
  };

  // 点击保存，流转触发表单校验
  const handlesubmit = () => {
    switch (taskName) {
      case '已登记': {
        if (show) {
          getregistrats();
          gethandles();
        } else {
          getregistrats();
        }
        break;
      }
      case '待审核':
      case '审核中':
        getchecks();
        break;
      case '处理中':
      case '重分派':
        gethandles();
        break;
      case '待确认':
      case '确认中':
        getreturnvisit();
        break;
      default:
        break;
    }
  };
  // 保存、流转
  const handletype = () => {
    switch (type) {
      case 'save':
        eventsave();
        break;
      case 'flow':
        eventflow('1');
        break;
      case 'other':
        eventflow('3');
        break;
      case 'check':
        eventcheck('3');
        break;
      case 'flowcheck':
        eventcheck('1');
        break;
      case 'over':
        overflow();
        break;
      default:
        break;
    }
    ChangeType('');
    setIscheck(false);
  };

  // 初始化打开编辑,获取用户信息，流转类型
  useEffect(() => {
    dispatch({
      type: 'eventtodo/eventopenflow',
      payload: {
        taskId,
      },
    });
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'event');
  }, []);

  // 获取事件流程记录
  useEffect(() => {
    dispatch({
      type: 'eventtodo/eventrecords',
      payload: {
        processId: mainId,
      },
    });
  }, [taskId]);

  // 初始化值panel
  useEffect(() => {
    setActiveKey([`${Collapsekeymap.get(taskName)}`]);
    return () => {
      setActiveKey([]);
    };
  }, [taskName]);

  // 初始化历史附件
  useEffect(() => {
    if (edit !== undefined && edit !== '' && Object.values(edit)[0] !== null) {
      if (Object.values(edit)[0].fileIds !== '') {
        setFiles({ ...files, arr: JSON.parse(Object.values(edit)[0].fileIds), ischange: false });
      }
    }
  }, [info]);

  // 监听info是否已更新
  useEffect(() => {
    if (loading) {
      setIsNew(true);
    }
    return () => {
      setIsNew(false);
    };
  }, [info]);

  //
  useEffect(() => {
    if (type !== '') {
      handlesubmit();
    }
  }, [type]);

  useEffect(() => {
    if (ischeck) {
      handletype();
    }
  }, [ischeck]);

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange === true) {
      ChangeType('save');
      setFiles({ ...files, ischange: false });
    }
  }, [files.ischange]);

  // 请求下拉值
  useEffect(() => {
    let doCancel = false;
    if (!doCancel) {
      dispatch({
        type: 'dicttree/childdictLower',
        payload: { id: '1354273739344187393' },
      }).then(res => {
        if (res.code === 200) {
          selectdata.arr.push(...res.data);
          if (!doCancel) {
            dispatch({
              type: 'dicttree/childdictLower',
              payload: { id: '1354288354950123522' },
            }).then(ress => {
              if (ress.code === 200) {
                selectdata.arr.push(...ress.data);
                setSelectData({ ...selectdata, ischange: true });
              }
            });
          }
        }
      });
    }
    return () => {
      setSelectData({ arr: [], ischange: false });
      doCancel = true;
    };
  }, []);

  return (
    <div className={styles.collapse}>
      {recordsloading === false && records !== '' && (
        <Steps
          current={records.length - 1}
          size="small"
          // progressDot
          style={{
            background: '#fff',
            padding: 24,
            border: '1px solid #e8e8e8',
            overflowX: 'auto',
          }}
        >
          {records.map((obj, index) => {
            const desc = (
              <div className={styles.stepDescription}>
                处理人：{obj.user}
                {/* <DingdingOutlined /> */}
                <div>开始时间：{obj.addTime}</div>
                <div>结束时间：{obj.endTime}</div>
              </div>
            );
            return <Step title={obj.nodeName} description={desc} key={index.toString()} />;
          })}
        </Steps>
      )}
      <Spin spinning={loading || !selectdata.ischange}>
        {loading === false &&
          isnew &&
          selectdata.ischange &&
          data !== undefined &&
          edit !== undefined && (
            <Collapse
              expandIconPosition="right"
              // defaultActiveKey={['1']}
              activeKey={activeKey}
              bordered={false}
              onChange={callback}
              style={{ marginTop: '-25px' }}
            >
              {taskName === '已登记' && (
                <Panel header="事件登记" key="registratform">
                  <Registrat
                    ChangeShow={isshow => setShow(isshow)}
                    ChangeCheck={checked => setCheck(checked)}
                    ChangeActiveKey={keys => setActiveKey(keys)}
                    changeDefaultvalue={values => setDefaultvalue(values)}
                    ChangeFiles={newvalue => {
                      setFiles(newvalue);
                    }}
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    show={show}
                    ref={RegistratRef}
                    info={edit}
                    main={main}
                    userinfo={userinfo}
                    sethandlevalue="true"
                    location={location}
                    files={edit.register.fileIds === '[]' ? [] : JSON.parse(edit.register.fileIds)}
                    selectdata={selectdata.arr}
                  />
                </Panel>
              )}
              {show === true && taskName === '已登记' && (
                <Panel header="事件处理" key="handleform">
                  <Handle
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    ref={HandleRef}
                    main={main}
                    userinfo={userinfo}
                    defaultvalue={defaultvalue}
                    location={location}
                    ChangeFiles={newvalue => {
                      setHandleFiles(newvalue);
                    }}
                    files={[]}
                    show={show}
                    selectdata={selectdata.arr}
                  />
                </Panel>
              )}
              {taskName === '待审核' && (
                <Panel header="事件审核" key="checkform">
                  <Check
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    ref={CheckRef}
                    main={main}
                    userinfo={userinfo}
                    location={location}
                    ChangeFiles={newvalue => {
                      setFiles(newvalue);
                    }}
                    files={[]}
                    selectdata={selectdata.arr}
                  />
                </Panel>
              )}
              {taskName === '审核中' && edit.check.fileIds !== undefined && (
                <Panel header="事件审核" key="checkform">
                  <Check
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    ref={CheckRef}
                    info={edit}
                    main={main}
                    userinfo={userinfo}
                    location={location}
                    ChangeFiles={newvalue => {
                      setFiles(newvalue);
                    }}
                    files={edit.check.fileIds === '[]' ? [] : JSON.parse(edit.check.fileIds)}
                    selectdata={selectdata.arr}
                  />
                </Panel>
              )}
              {taskName === '处理中' && edit.handle === null && (
                <Panel header="事件处理" key="handleform">
                  <Handle
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    ref={HandleRef}
                    main={main}
                    userinfo={userinfo}
                    defaultvalue={defaultvalue}
                    location={location}
                    ChangeFiles={newvalue => {
                      setFiles(newvalue);
                    }}
                    files={[]}
                    show={show}
                    selectdata={selectdata.arr}
                  />
                </Panel>
              )}
              {taskName === '处理中' && edit.handle !== null && edit.handle.fileIds !== undefined && (
                <Panel header="事件处理" key="handleform">
                  <Handle
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    ref={HandleRef}
                    info={edit === null ? undefined : edit}
                    main={main}
                    userinfo={userinfo}
                    defaultvalue={defaultvalue}
                    location={location}
                    ChangeFiles={newvalue => {
                      setFiles(newvalue);
                    }}
                    files={edit.handle.fileIds === '[]' ? [] : JSON.parse(edit.handle.fileIds)}
                    show={show}
                    selectdata={selectdata.arr}
                  />
                </Panel>
              )}
              {taskName === '待确认' && (
                <Panel header="事件确认" key="visitform">
                  <ReturnVisit
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    ref={ReturnVisitRef}
                    main={main}
                    userinfo={userinfo}
                    location={location}
                    ChangeFiles={newvalue => {
                      setFiles(newvalue);
                    }}
                    files={[]}
                    selectdata={selectdata.arr}
                  />
                </Panel>
              )}
              {taskName === '确认中' && edit.finish !== null && edit.finish.fileIds !== undefined && (
                <Panel header="事件确认" key="visitform">
                  <ReturnVisit
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    ref={ReturnVisitRef}
                    info={edit}
                    main={main}
                    userinfo={userinfo}
                    location={location}
                    ChangeFiles={newvalue => {
                      setFiles(newvalue);
                    }}
                    files={edit.finish.fileIds === '[]' ? [] : JSON.parse(edit.finish.fileIds)}
                    selectdata={selectdata.arr}
                  />
                </Panel>
              )}

              {data.map((obj, index) => {
                // panel详情组件
                const Paneldesmap = new Map([
                  ['register', <Registratdes info={Object.values(obj)[0]} main={data[0].main} />],
                  ['handle', <Handledes info={Object.values(obj)[0]} main={data[0].main} />],
                  ['check', <Checkdes info={Object.values(obj)[0]} main={data[0].main} />],
                  ['finish', <ReturnVisitdes info={Object.values(obj)[0]} main={data[0].main} />],
                ]);
                if (index > 0)
                  return (
                    <Panel
                      Panel
                      header={Panelheadermap.get(Object.keys(obj)[0])}
                      key={index.toString()}
                    >
                      {Paneldesmap.get(Object.keys(obj)[0])}
                    </Panel>
                  );
              })}
            </Collapse>
          )}
      </Spin>
    </div>
  );
}

export default connect(({ eventtodo, itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
  info: eventtodo.info,
  records: eventtodo.records,
  loading: loading.models.eventtodo,
  recordsloading: loading.effects['eventtodo/eventrecords'],
}))(WorkOrder2);
