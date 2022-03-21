import React, { useState, useRef, useEffect, useContext } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Collapse, Steps, Spin, message, Icon } from 'antd';
import SysDict from '@/components/SysDict';
import SubmitTypeContext from '@/layouts/MenuContext';
import { openNotification } from '@/utils/utils';
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
  ['事件登记', 'registratform'],
  ['待审核', 'checkform'],
  ['审核中', 'checkform'],
  ['事件响应', '1'],
  ['事件处理', 'handleform'],
  ['事件确认', 'visitform'],
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
    registUploadStatus,
    olduploadstatus
  } = props;

  const { mainId, taskId, taskName } = location.query;
  const [formregistrat, setFormregistrat] = useState('');
  const [formcheck, setFormcheck] = useState('');
  const [formhandle, setFormhandle] = useState('');
  const [formvisit, setFormvisit] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [registratfiles, setRegistratFiles] = useState({ arr: [], ischange: false }); // 登记上传
  // const [ischeck, setIscheck] = useState(false); // 是否在校验状态
  const [show, setShow] = useState(false); // 是否自行处理
  // const [check, setCheck] = useState(false); // 事件分类是否权限账号
  const [activeKey, setActiveKey] = useState([]);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值

  const { flowInstanceId, flowNodeInstanceId, flowNodeName, editState, data, edit, main } = info; // 流程基本信息
  const { submittype } = useContext(SubmitTypeContext);
  const HandleRef = useRef();
  const ReturnVisitRef = useRef();

  // console.log(info, info.edit);

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
      },
    });
  };
  // 流转    4转问题，5转故障，3审核且是档案或高级，4审核其它选项
  const eventflow = (val) => {
    //  const handleresult = HandleRef.current && HandleRef.current.getHandleResult();
    const getuserIds = () => {
      const nextNode = new Map([
        ['运维商经理审核', '事件处理'],
        ['自动化科审核', '事件处理'],
        ['数据科审核', '事件处理'],
        ['事件处理', '事件确认'],
        ['事件确认', '结束'],
      ]);
      const userIds = [{ nodeName: nextNode.get(taskName), userIds: [info?.data[1]?.register?.registerUserId || '1'] }];
      if (taskName === '运维商经理审核' || taskName === '自动化科审核' || taskName === '数据科审核' || type === '登记' || type === '回访' || type === '结束') {
        return JSON.stringify(userIds);
      }
      return sessionStorage.getItem('NextflowUserId');
    }
    dispatch({
      type: 'eventtodo/eventflow',
      payload: {
        flow: {
          taskId,
          userIds: getuserIds(),
          // type: (handleresult === '4' || handleresult === '5') ? handleresult : sessionStorage.getItem('flowtype'),
          type: val || sessionStorage.getItem('flowtype'),
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
          type: taskName === '事件登记' ? '2' : '1',
        },
        paloadvalues,
        mainId,
      },
    });
  };

  // 校验不通过
  const formerr = (err) => {
    // message.error('请将信息填写完整...');
    openNotification(Object.values(err))
    ChangeType('');
  };
  // 保存不需要校验
  const noverification = () => {
    ChangeChoice(true);
    // setIscheck(true);
  }
  // 自行处理保存、转回访、结束，需做校验无需打开选人组件
  const noUser = (err) => {
    if (!err) {
      ChangeChoice(true);
      // setIscheck(true);
    } else {
      formerr(err);
    }
  }
  // 流转、转单，需做校验需打开选人组件
  const needUser = (err) => {
    if (!err) {
      ChangeUserVisible(true);
      ChangeChoice(false);
      // setIscheck(true);
    } else {
      formerr(err);
    }
  }
  // console.log(type);
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
      register_applicationDept: values.applicationDept ? values.register_applicationDept : values.register_applicationUnit,
      register_applicationDeptId: values.applicationDept ? values.register_applicationDeptId : values.register_applicationUnitId,
      register_selfhandle: String(Number(values.register_selfhandle)),
      register_supplement: String(Number(values.register_supplement)),
      register_isCheck: String(Number(values.register_isCheck)),
      register_fileIds: (registratfiles.arr && registratfiles.arr.length) ? JSON.stringify(registratfiles.arr) : null,
    });
    if (type === 'save') {
      noverification();
    }
    if (type === '结束') {
      noUser(false);
    }
    if (type === '处理' || type === '审核') {
      RegistratRef.current.Forms(err => {
        needUser(err);
      });
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
      check_checkType: info.flowNodeName
    });
    switch (type) {
      case 'save':
        noverification();
        break;
      case '处理':
      case '登记':
        CheckRef.current.Forms(err => {
          noUser(err);
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
        formerr(e);
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
      case '回访':
        HandleRef.current.Forms((err) => {
          noUser(err);
        })
        break;
      case '转单':
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
      case '重分派':
        ReturnVisitRef.current.Forms((err) => {
          needUser(err);
        })
        break;
      case '结束':
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
      case '事件登记': {
        if (show) {
          gethandleself();
        } else {
          getregistrats();
        }
        break;
      }
      case '运维商经理审核':
      case '自动化科审核':
      case '数据科审核':
        getchecks();
        break;
      case '事件处理':
        gethandles();
        break;
      case '事件确认':
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
      case '处理':
      case '审核':
      case '登记':
      case '回访':
      case '重分派':
        eventflow();
        break;
      case '转单':
        eventflow('3');
        break;
      case '结束':
        overflow();
        break;
      default:
        break;
    }
  };

  // 初始化打开编辑,获取用户信息，流转类型
  useEffect(() => {
    if (mainId && taskId) {
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
  }, [taskId]);

  // 获取事件流程记录
  useEffect(() => {
    sessionStorage.removeItem('NextflowUserId');
    if (taskId) {
      dispatch({
        type: 'eventtodo/eventrecords',
        payload: {
          processId: mainId,
        },
      });
      if (!errmsg && taskName === '事件响应') {
        message.info('请接单..', 1);
      }
    }
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
    if (taskName) {
      setActiveKey([`${Collapsekeymap.get(taskName)}`]);
    }
    return () => {
      setActiveKey([]);
    };
  }, [taskName]);

  // 初始化历史附件
  useEffect(() => {
    if (edit && Object.values(edit)[0] !== null) {
      if (Object.values(edit)[0].fileIds !== '' && taskName === '事件登记') {
        setRegistratFiles({
          ...files,
          arr: JSON.parse(Object.values(edit)[0].fileIds),
          ischange: false,
        });
      }
      if (Object.values(edit)[0].fileIds !== '' && taskName !== '事件登记') {
        setFiles({ ...files, arr: JSON.parse(Object.values(edit)[0].fileIds), ischange: false });
      }
    };
    if (info.flowNodeName === '运维商经理审核' || info.flowNodeName === '数据科审核' || info.flowNodeName === '自动化科审核') {
      setActiveKey('checkform')
    }
  }, [info]);


  useEffect(() => {
    if (type) {
      handlesubmit();
    }
  }, [type]);

  // 选人完成触发流转
  useEffect(() => {
    if (userchoice) {
      handletype();
    }
  }, [userchoice])

  // 登记上传附件触发保存
  useEffect(() => {
    if (registratfiles.ischange && !olduploadstatus) {
      ChangeType('save');
      setRegistratFiles({ ...registratfiles, ischange: false });
    }
  }, [registratfiles]);

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      ChangeType('save');
      setFiles({ ...files, ischange: false });
    }
  }, [files.ischange]);

  return (
    <div className='ordercollapse'>
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
              <div className='stepDescription'>
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
            return <Step title={obj.nodeName} description={desc} key={index.toString()} icon={!obj.endTime ? <Icon type="loading" spin style={{ color: '#0124c5' }} /> : ''} />;
          })}
        </Steps>
        <Collapse
          expandIconPosition="right"
          // defaultActiveKey={['1']}
          activeKey={activeKey}
          bordered={false}
          onChange={callback}
        >
          {info?.flowNodeName === '事件登记' && (
            <Panel header="事件登记" key="registratform">
              <Registrat
                ChangeShow={v => setShow(v)}
                // ChangeCheck={checked => setCheck(checked)}
                ChangeActiveKey={keys => setActiveKey(keys)}
                ChangeFiles={newvalue => setRegistratFiles(newvalue)}
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                show={show}
                wrappedComponentRef={RegistratRef}
                info={edit}
                main={main}
                userinfo={userinfo}
                location={location}
                files={(!edit.register || edit.register?.fileIds === '[]' || !edit.register?.fileIds) ? [] : JSON.parse(edit.register.fileIds)}
                selectdata={selectdata}
                loading={loading}
              />
            </Panel>
          )}
          {show === true && taskName === '事件登记' && (
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
                loading={loading}
                uploadStatus={registUploadStatus}
              />
            </Panel>
          )}
          {(info.flowNodeName === '运维商经理审核' || info.flowNodeName === '数据科审核' || info.flowNodeName === '自动化科审核') && edit && (
            <Panel header={info.flowNodeName} key="checkform">
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
                files={(!edit.check || edit.check.fileIds === '[]' || !edit.check.fileIds) ? [] : JSON.parse(edit.check.fileIds)}
                selectdata={selectdata}
                loading={loading}
              />
            </Panel>
          )}
          {info?.flowNodeName === '事件处理' && edit && (
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
                files={(!edit.handle || edit.handle.fileIds === '[]' || !edit.handle.fileIds) ? [] : JSON.parse(edit.handle.fileIds)}
                show={show}
                selectdata={selectdata}
                mainId={mainId}
                loading={loading}
              />
            </Panel>
          )}
          {taskName === '事件确认' && edit && (
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
                files={(!edit.finish || edit.finish.fileIds === '[]' || !edit.finish.fileIds) ? [] : JSON.parse(edit.finish.fileIds)}
                selectdata={selectdata}
                loading={loading}
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
                  header={Object.keys(obj)[0] === 'check' ? (obj.check?.checkType || '事件审核') : Panelheadermap.get(Object.keys(obj)[0])}
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

export default connect(({ eventtodo, itsmuser, viewcache, loading }) => ({
  olduploadstatus: viewcache.olduploadstatus,
  userinfo: itsmuser.userinfo,
  errmsg: eventtodo.errmsg,
  info: eventtodo.info,
  records: eventtodo.records,
  loading: loading.models.eventtodo,
  recordsloading: loading.effects['eventtodo/eventrecords'],
}))(WorkOrder2);
