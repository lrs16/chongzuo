import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Collapse, Steps, Spin, message } from 'antd';
import SysDict from '@/components/SysDict';
import styles from './index.less';
import Registrat from './components/Registrat';
import Check from './components/Check';
import Handle from './components/Handle';
import ReturnVisit from './components/ReturnVisit';
import Registratdes from './components/Registratdes';
import Checkdes from './components/Checkdes';
import Handledes from './components/Handledes';
import ReturnVisitdes from './components/ReturnVisitdes';

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
    errmsg,
    info,
    records,
    userinfo,
    type,
    userchoice,
    ChangeType,
    ChangeChoice,
    ChangeUserVisible,
  } = props;

  const { mainId, taskId, taskName } = location.query;
  const [formregistrat, setFormregistrat] = useState('');
  const [formcheck, setFormcheck] = useState('');
  const [formhandle, setFormhandle] = useState('');
  const [formvisit, setFormvisit] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [registratfiles, setRegistratFiles] = useState({ arr: [], ischange: false }); // 登记上传
  const [ischeck, setIscheck] = useState(false); // 是否在校验状态
  const [show, setShow] = useState(false); // 是否自行处理
  const [check, setCheck] = useState(false); // 事件分类是否权限账号
  const [activeKey, setActiveKey] = useState([]);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值

  const { flowInstanceId, flowNodeInstanceId, flowNodeName, editState, data, edit, main } = info; // 流程基本信息
  const HandleRef = useRef();
  const ReturnVisitRef = useRef();
  // console.log(registratfiles)

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
        flow: {
          paloadvalues,
          taskName,
          flowInstanceId,
        },
        locationquery: location.query
      },
    });
  };
  // 流转
  const eventflow = newflowtype => {
    const handleresult = HandleRef.current && HandleRef.current.getHandleResult();
    dispatch({
      type: 'eventtodo/eventflow',
      payload: {
        flow: {
          taskId,
          userIds: show ? data[1].register.registerUserId : sessionStorage.getItem('NextflowUserId'),
          type: (handleresult === '4' || handleresult === '5') ? handleresult : newflowtype,
        },
        paloadvalues,
      },
    });
  };
  // 确认
  const eventcheck = newflowtype => {
    const handleresult = HandleRef.current && HandleRef.current.getHandleResult();
    dispatch({
      type: 'eventtodo/eventflow',
      payload: {
        flow: {
          taskId,
          userIds: data[1].register.registerUserId,
          type: (handleresult === '4' || handleresult === '5') ? handleresult : newflowtype,
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
        mainId,
      },
    });
  };

  // 校验不通过
  const formerr = () => {
    message.error('请将信息填写完整...');
    ChangeType('');
  };
  // 保存不需要校验
  const noverification = () => {
    ChangeChoice(true);
    setIscheck(true);
  }
  // 自行处理保存、转回访、结束，需做校验无需打开选人组件
  const noUser = (err) => {
    if (!err) {
      ChangeChoice(true);
      setIscheck(true);
    } else {
      formerr();
    }
  }
  // 流转、转单，需做校验需打开选人组件
  const needUser = (err) => {
    if (!err) {
      ChangeUserVisible(true);
      setIscheck(true);
    } else {
      formerr();
    }
  }

  // 登记表单
  const RegistratRef = useRef();
  const getregistrats = () => {
    const values = RegistratRef.current.getVal();
    setFormregistrat({
      ...values,
      main_eventObject: values.main_eventObject.slice(-1)[0],
      register_occurTime: moment(values.register_occurTime).format('YYYY-MM-DD HH:mm:ss'),
      // register_applicationUserId: values.register_applicationUser === '' ? '' : values.register_applicationUser,
      register_mobilePhone: values.main_revisitWay === '002' ? values.mobilePhone1 : values.mobilePhone2,
      register_applicationUnit: values.applicationUnit,
      register_applicationUnitId: values.applicationUnit === '' ? '' : values.register_applicationUnitId,
      register_applicationDept:
        values.applicationDept !== ''
          ? values.register_applicationDept
          : values.register_applicationUnit,
      register_applicationDeptId:
        values.applicationDept !== ''
          ? values.register_applicationDeptId
          : values.register_applicationUnitId,
      register_selfhandle: String(Number(values.register_selfhandle)),
      register_supplement: String(Number(values.register_supplement)),
      register_fileIds: JSON.stringify(registratfiles.arr),
    });
    if (type === 'save') {
      noverification();
    } else {
      RegistratRef.current.Forms(err => {
        needUser(err);
      });
      //  console.clear()
    }
  };

  // 审核表单
  const CheckRef = useRef();
  const getchecks = () => {
    const values = CheckRef.current.getVal();
    setFormcheck({
      ...values,
      check_checkTime: moment(values.check_checkTime).format('YYYY-MM-DD HH:mm:ss'),
      check_fileIds: JSON.stringify(files.arr),
      check_content: values.check_checkResult === '001' ? values.content1 : values.content2,
    });
    switch (type) {
      case 'save':
        noverification();
        break;
      case 'check':
      case 'goback':
        CheckRef.current.Forms(err => {
          noUser(err);
        });
        break;
      case 'flow':
        CheckRef.current.Forms(err => {
          needUser(err);
        });
        break;
      default:
        break;
    }
  };

  // 处理表单
  // 自行处理
  const gethandleself = () => {
    RegistratRef.current.Forms((e, v) => {
      if (!e) {
        setFormregistrat({
          ...v,
          main_eventObject: v.main_eventObject.slice(-1)[0],
          register_occurTime: moment(v.register_occurTime).format('YYYY-MM-DD HH:mm:ss'),
          register_applicationUnit: v.applicationUnit,
          register_applicationUnitId: v.applicationUnit === '' ? '' : v.register_applicationUnitId,
          register_applicationDept: v.register_applicationDept !== '' ? v.register_applicationDept : v.register_applicationUnit,
          register_applicationDeptId: v.register_applicationDeptId !== '' ? v.register_applicationDeptId : v.register_applicationUnitId,
          register_selfhandle: String(Number(v.register_selfhandle)),
          register_supplement: String(Number(v.register_supplement)),
          register_fileIds: JSON.stringify(registratfiles.arr),
        });
        const values = HandleRef.current.getVal();
        setFormhandle({
          ...values,
          handle_endTime: moment(values.handle_endTime).format('YYYY-MM-DD HH:mm:ss'),
          handle_fileIds: JSON.stringify(files.arr),
        });
        if (type === 'save') {
          noverification();
        } else {
          HandleRef.current.Forms((err) => {
            noUser(err);
          })
          // console.clear();
        }
      } else {
        formerr();
      }
    })
  };
  const gethandles = () => {
    const values = HandleRef.current.getVal();
    setFormhandle({
      ...values,
      main_eventObject: values.main_eventObject?.slice(-1)[0],
      handle_endTime: moment(values.handle_endTime).format('YYYY-MM-DD HH:mm:ss'),
      handle_fileIds: JSON.stringify(files.arr),
    });
    switch (type) {
      case 'save':
        noverification();
        break;
      case 'flowcheck':
        HandleRef.current.Forms((err) => {
          noUser(err);
        })
        break;
      case 'other':
      case 'flow':
        HandleRef.current.Forms((err) => {
          needUser(err);
        })
        break;
      default:
        break;
    }
  };

  // 回访

  const getreturnvisit = () => {
    const values = ReturnVisitRef.current.getVal();
    setFormvisit({
      ...values,
      finish_revisitTime: moment(values.finish_revisitTime).format('YYYY-MM-DD HH:mm:ss'),
      finish_fileIds: JSON.stringify(files.arr),
    });
    switch (type) {
      case 'save':
        noverification()
        break;
      case 'other':
        ReturnVisitRef.current.Forms((err) => {
          needUser(err);
        })
        break;
      case 'over':
        ReturnVisitRef.current.Forms((err) => {
          noUser(err);
        })
        // console.clear()
        break;
      default:
        break;
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
          gethandleself();
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
    if (mainId) {
      dispatch({
        type: 'eventtodo/eventopenflow',
        payload: {
          taskId,
          mainId,
        },
      });
      dispatch({
        type: 'itsmuser/fetchuser',
      });
      sessionStorage.setItem('Processtype', 'event');
    }
    return () => {
      dispatch({
        type: 'eventtodo/clearinfo',
      });
    }
  }, [mainId, taskId]);

  // 获取事件流程记录
  useEffect(() => {
    dispatch({
      type: 'eventtodo/eventrecords',
      payload: {
        processId: mainId,
      },
    });
  }, [taskId]);

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      dispatch({
        type: 'eventtodo/eventopenflow',
        payload: {
          taskId,
          mainId,
        },
      });
      dispatch({
        type: 'itsmuser/fetchuser',
      });
      sessionStorage.setItem('Processtype', 'event');
    };
    if (taskId) {
      dispatch({
        type: 'eventtodo/eventrecords',
        payload: {
          processId: mainId,
        },
      });
    }
  }, [location.state])

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
      if (Object.values(edit)[0].fileIds !== '' && taskName === '已登记') {
        setRegistratFiles({
          ...files,
          arr: JSON.parse(Object.values(edit)[0].fileIds),
          ischange: false,
        });
      }
      if (Object.values(edit)[0].fileIds !== '' && taskName !== '已登记') {
        setFiles({ ...files, arr: JSON.parse(Object.values(edit)[0].fileIds), ischange: false });
      }
    };
  }, [info]);

  useEffect(() => {
    if (errmsg === '' && taskName === '待处理') {
      message.info('请接单..', 1);
    }
  }, [])

  useEffect(() => {
    if (type !== '') {
      handlesubmit();
    }
  }, [type]);

  // 选人完成触发流转
  useEffect(() => {
    if (userchoice && ischeck) {
      handletype();
    }
  }, [userchoice, ischeck])

  // 登记上传附件触发保存
  useEffect(() => {
    if (registratfiles.ischange) {
      ChangeType('save');
      setRegistratFiles({ ...registratfiles, ischange: false });
    }
  }, [registratfiles]);

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange === true) {
      ChangeType('save');
      setFiles({ ...files, ischange: false });
    }
  }, [files.ischange]);

  return (
    <div className={styles.collapse}>
      <SysDict
        typeid="331"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Spin spinning={loading}>
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
            let tempTime = '';
            if (obj.addTime && obj.endTime) {
              const addtime = moment(obj.addTime);
              const endtime = moment(obj.endTime);
              const dura = endtime.format('x') - addtime.format('x');
              tempTime = moment.duration(dura);
            }
            const desc = (
              <div className={styles.stepDescription}>
                处理人：{obj.user}
                {/* <DingdingOutlined /> */}
                <div>开始时间：{obj.addTime}</div>
                <div>结束时间：{obj.endTime}</div>
                {tempTime && (<div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '16px' }}>用时：
                  {tempTime.days() !== 0 && (<>{tempTime.days()}天</>)}
                  {tempTime.hours() !== 0 && (<>{tempTime.hours()}小时</>)}
                  {tempTime.minutes() !== 0 && (<>{tempTime.minutes()}分</>)}
                  {((tempTime.days() === 0 && tempTime.hours() === 0 && tempTime.minutes() === 0 && tempTime.seconds() === 0) || tempTime.seconds() !== 0) && (<>{tempTime.seconds()}秒</>)}
                </div>)}
              </div>
            );
            return <Step title={obj.nodeName} description={desc} key={index.toString()} />;
          })}
        </Steps>
        <Collapse
          expandIconPosition="right"
          // defaultActiveKey={['1']}
          activeKey={activeKey}
          bordered={false}
          onChange={callback}
          style={{ marginTop: '-25px' }}
        >
          {taskName === '已登记' && edit && edit.register && (
            <Panel header="事件登记" key="registratform">
              <Registrat
                ChangeShow={isshow => setShow(isshow)}
                ChangeCheck={checked => setCheck(checked)}
                ChangeActiveKey={keys => setActiveKey(keys)}
                ChangeFiles={newvalue => {
                  setRegistratFiles(newvalue);
                }}
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                show={show}
                wrappedComponentRef={RegistratRef}
                info={edit}
                main={main}
                userinfo={userinfo}
                location={location}
                files={edit.register.fileIds === '[]' ? [] : JSON.parse(edit.register.fileIds)}
                selectdata={selectdata}
              />
            </Panel>
          )}
          {show === true && taskName === '已登记' && (
            <Panel header="事件处理" key="handleform">
              <Handle
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                wrappedComponentRef={HandleRef}
                main={main}
                userinfo={userinfo}
                location={location}
                ChangeFiles={newvalue => {
                  setFiles(newvalue);
                }}
                files={[]}
                show={show}
                selectdata={selectdata}
                mainId={mainId}
              />
            </Panel>
          )}
          {taskName === '待审核' && (
            <Panel header="事件审核" key="checkform">
              <Check
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                wrappedComponentRef={CheckRef}
                main={main}
                userinfo={userinfo}
                location={location}
                ChangeFiles={newvalue => {
                  setFiles(newvalue);
                }}
                files={[]}
                selectdata={selectdata}
              />
            </Panel>
          )}
          {taskName === '审核中' && edit && edit.check && (
            <Panel header="事件审核" key="checkform">
              <Check
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                wrappedComponentRef={CheckRef}
                info={edit}
                main={main}
                userinfo={userinfo}
                location={location}
                ChangeFiles={newvalue => {
                  setFiles(newvalue);
                }}
                files={edit.check.fileIds === '[]' ? [] : JSON.parse(edit.check.fileIds)}
                selectdata={selectdata}
              />
            </Panel>
          )}
          {taskName === '处理中' && edit && !edit.handle && (
            <Panel header="事件处理" key="handleform">
              <Handle
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                wrappedComponentRef={HandleRef}
                main={main}
                userinfo={userinfo}
                location={location}
                ChangeFiles={newvalue => {
                  setFiles(newvalue);
                }}
                files={[]}
                show={show}
                selectdata={selectdata}
                mainId={mainId}
              />
            </Panel>
          )}
          {taskName === '处理中' && edit && edit.handle && (
            <Panel header="事件处理" key="handleform">
              <Handle
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                wrappedComponentRef={HandleRef}
                info={edit === null ? undefined : edit}
                main={main}
                userinfo={userinfo}
                location={location}
                ChangeFiles={newvalue => {
                  setFiles(newvalue);
                }}
                files={edit.handle.fileIds === '[]' ? [] : JSON.parse(edit.handle.fileIds)}
                show={show}
                selectdata={selectdata}
                mainId={mainId}
              />
            </Panel>
          )}
          {taskName === '待确认' && (
            <Panel header="事件确认" key="visitform">
              <ReturnVisit
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                wrappedComponentRef={ReturnVisitRef}
                main={main}
                userinfo={userinfo}
                location={location}
                ChangeFiles={newvalue => {
                  setFiles(newvalue);
                }}
                files={[]}
                selectdata={selectdata}
              />
            </Panel>
          )}
          {taskName === '确认中' && edit && edit.finish && (
            <Panel header="事件确认" key="visitform">
              <ReturnVisit
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                wrappedComponentRef={ReturnVisitRef}
                info={edit}
                main={main}
                userinfo={userinfo}
                location={location}
                ChangeFiles={newvalue => {
                  setFiles(newvalue);
                }}
                files={edit.finish.fileIds === '[]' ? [] : JSON.parse(edit.finish.fileIds)}
                selectdata={selectdata}
              />
            </Panel>
          )}

          {data && data.map((obj, index) => {
            // panel详情组件
            const Paneldesmap = new Map([
              ['register', <Registratdes info={Object.values(obj)[0]} main={data[0].main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
              ['handle', <Handledes info={Object.values(obj)[0]} main={data[0].main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
              ['check', <Checkdes info={Object.values(obj)[0]} main={data[0].main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
              ['finish', <ReturnVisitdes info={Object.values(obj)[0]} main={data[0].main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
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
          }
          )}
        </Collapse>
      </Spin>
    </div>
  );
}

export default connect(({ eventtodo, itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
  errmsg: eventtodo.errmsg,
  info: eventtodo.info,
  records: eventtodo.records,
  loading: loading.models.eventtodo,
  recordsloading: loading.effects['eventtodo/eventrecords'],
}))(WorkOrder2);
