import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
// import moment from 'moment';
import {
  Card,
  Form,
  Button,
  Steps,
  Collapse,
  Popconfirm,
  message,
  Spin
} from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
// eslint-disable-next-line import/no-unresolved
import creatHistory from 'history/createHashHistory'; // 返回上一页
import styles from './index.less';
// import ModelCircula from './components/ModelCircula';
import ModelRollback from './components/ModelRollback'; // 回退组件
import SelectUser from './components/SelectUser'; // 选人组件

// 各个子组件
import RegisterChild from './components/RegisterChild';
import ExamineChild from './components/ExamineChild';
import HandleChild from './components/HandleChild';
import SummaryChild from './components/SummaryChild';
import CloseChild from './components/CloseChild';

// 故障查询详情子组件
import RegisterQuery from './components/RegisterQuery';
import ExamineQuery from './components/ExamineQuery';
import HandleQuery from './components/HandleQuery';
import SummaryQuery from './components/SummaryQuery';
// import CloseQuery from './components/CloseQuery';

const { Step } = Steps;
const { Panel } = Collapse;
let image;
const history1 = creatHistory(); // 返回上一页

let tosaveStatus; // 保存状态
const currenStatus = 'circle'; // 保存状态

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
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

const tabList = [
  {
    key: 'faultForm',
    tab: '故障工单',
  },
  {
    key: 'faultPro',
    tab: '故障流程',
  },
];

const Collapsekeymap = new Map([
  ['故障登记', 'RegisterChild'], // 登记  012,展开登记
  ['故障审核', 'ExamineChild'], // 审核 345展开审核，同时显示-- 登记查询详情
  ['故障处理', 'HandleChild'], // 处理 678展开处理， 同时展示登-- 记查询详情、审核查询详情
  ['registerDetails', 'RegisterQuery'], // 处理 678展开处理， 同时展示登-- 记查询详情、审核查询详情
  ['故障总结', 'SummaryChild'], // 总结 9，10，11展开总结， 同时展示-- 登记查询详情、审核查询详情，处理查询详情
  ['故障关闭', 'CloseChild'], // 关闭 12，13，14展开关闭， 同时展示-- 登记查询详情、审核查询详情，处理查询详情，总结查询详情
]);

const stepcurrentmap = new Map([ // 流程
  ['故障登记', 1], // 登记  012,展开登记
  ['故障审核', 2], // 审核 345展开审核，同时显示-- 登记查询详情
  ['故障处理', 3], // 处理 678展开处理， 同时展示登-- 记查询详情、审核查询详情
  ['故障总结', 4], // 总结 9，10，11展开总结， 同时展示-- 登记查询详情、审核查询详情，处理查询详情
  ['故障关闭', 5], // 关闭 12，13，14展开关闭， 同时展示-- 登记查询详情、审核查询详情，处理查询详情，总结查询详情
]);

function Todolistdetails(props) {
  const pagetitle = props.route.name;
  // const [current, setCurrent] = useState(0);
  const [activeKey, setActiveKey] = useState([]);
  const [tabActiveKey, setTabActiveKey] = useState('faultForm');
  // const [modalVisible, setModalVisible] = useState(false);
  // const [treeDatas, setTreeData] = useState([]);

  const [transferpaneKey, setTransferpaneKey] = useState();
  const [notransferpaneKey, setnoTransferpaneKey] = useState();

  const RegisterRef = useRef(); // 故障登记
  const ExamineRef = useRef(); // 故障审核
  const HandleRef = useRef(); // 故障处理
  const SummaryRef = useRef(); // 故障总结
  const CloseRef = useRef(); // 故障关闭

  const {
    location: { paneKey }, // 获取传入数据 // paneKey故障登记传过来的当前状态以及待办页传过来的状态（故障登记）
    loading,
    tododetailslist, // 待办详情数据--编辑
    tododetailslist: { troubleFlowLogs, check, handle, finish, close, troubleFlowNodeRows, main }, // troubleFlowLogs流程图数据  troubleFlowNodeRows详情是数据
    flowimageview, // 故障流程的流程图片数据
    flowlog, // 故障流程的流程日志
    dispatch,
    curruserinfo, // 当前用户登录信息
  } = props;

  const { params: { id } } = props.match; // 获取taskId

  // 二进制展示流程图
  const blob = new Blob([flowimageview]);
  image = (window.URL || window.webkitURL).createObjectURL(blob);

  const handleClose = () => { // 返回上一页
    history1.goBack(); 
  }

  const getFlowImage = () => { // 流程图
    dispatch({
      type: 'fault/fetchGetFlowImage',
      payload: { id: tododetailslist.main.id }
      // payload: { id: tododetailslist.taskId }
    });
  }

  const getFlowlog = () => { // 流程日志
    dispatch({
      type: 'fault/fetchGetFlowLog',
      payload: { id: tododetailslist.main.id }
      // payload: { id: tododetailslist.taskId }
    })
  }

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
    getFlowImage();
    getFlowlog();
  };

  const callback = key => { // 激活tab
    setActiveKey(key);
  };

  const getfaultTodoDetailData = () => { // 故障待办详情数据
    dispatch({
      type: 'fault/getfaultTodoDetailData',
      payload: { id }
    })
  };

  const getCurrUserInfo = () => {  // 获取登录用户信息
    dispatch({
      type: 'fault/getCurrUserInfo'
    });
  }

  useEffect(() => {
    getCurrUserInfo(); // 获取登录用户信息
    setActiveKey([`${Collapsekeymap.get(paneKey)}`]);
    getfaultTodoDetailData();
    if (paneKey === '故障处理') {
      setActiveKey([`${Collapsekeymap.get('registerDetails')}`]);
    }
  }, []);

  const handleDelete = () => { // 删除操作！
    dispatch({
      type: 'fault/remove',
      payload: { id: tododetailslist.main.id }
    }).then(res => {
      if (res.code === 200) {
        getfaultTodoDetailData();
        message.success(res.msg);
        router.push(`/ITSM/faultmanage/todolist`);
      } else {
        message.error(res.msg);
      }
    })
  }

  const faultcircula = () => { // 流转
    const result = 1;
    const taskId = id;
    return dispatch({
      type: 'fault/getSubmitProToNextNode',
      payload: { taskId, result }
    }).then(res => {
      if (res.code === 200) {
        getfaultTodoDetailData();
        message.success(res.msg);
        router.push(`/ITSM/faultmanage/todolist`);
      } else {
        message.error(res.msg);
        router.push(`/ITSM/faultmanage/todolist`);
      }
    })
  }

  // 各个表单验证
  const saveRegister = (cirStatus) => { // 故障登记
    let happentime;
    let registtime;
    // eslint-disable-next-line consistent-return
    RegisterRef.current.validateFields((err, values) => {
      // 时间转换
      const createDateZero = (num) => {
        return (num < 10 ? `0${num}` : num);
      }
      const d = new Date(values.registerOccurTime);
      const d1 = new Date(values.registerTime);
      happentime = `${d.getFullYear()}-${createDateZero(d.getMonth() + 1)}-${createDateZero(d.getDate())} ${createDateZero(d.getHours())}:${createDateZero(d.getMinutes())}:${createDateZero(d.getSeconds())}`;
      registtime = `${d1.getFullYear()}-${createDateZero(d1.getMonth() + 1)}-${createDateZero(d1.getDate())} ${createDateZero(d1.getHours())}:${createDateZero(d1.getMinutes())}:${createDateZero(d1.getSeconds())}`;

      if (cirStatus?!err:true) {
        const formValues = values;
        formValues.registerOccurTime = happentime;
        formValues.registerTime = registtime;
        formValues.taskId = id;
        formValues.editState = tododetailslist.editState;
        // formValues.registerEffect = String(Number(values.registerEffect))
        if (tododetailslist.editState === 'edit') {
          formValues.registerId = tododetailslist.register.id;
        }
        formValues.editState = 'edit';
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues }

        }).then(res => {
          if (res.code === 200) {
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
              getfaultTodoDetailData();
              router.push(`/ITSM/faultmanage/todolist`);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveExamine = (cirStatus) => { // 故障审核
    let checktimes; // 审核时间

    // eslint-disable-next-line consistent-return
    ExamineRef.current.validateFields((err, values) => {
      const formValues = values;

      if (values.checkTime) {
        const addDateZero = (num) => {
          return (num < 10 ? `0${num}` : num);
        }
        const d = new Date(values.checkTime);
        checktimes = `${d.getFullYear()}-${addDateZero(d.getMonth() + 1)}-${addDateZero(d.getDate())} ${addDateZero(d.getHours())}:${addDateZero(d.getMinutes())}:${addDateZero(d.getMinutes())}`; // :${  addDateZero(d1.getSeconds())
        formValues.checkTime = checktimes;
      } else {
        formValues.checkTime = '';
      }
      if (cirStatus?!err:true) {
        formValues.taskId = id;
        if (tododetailslist.editState === 'edit') {
          formValues.checkId = tododetailslist.check.id;
          formValues.editState = tododetailslist.editState;
        } else {
          formValues.checkId = tododetailslist.editGuid;
          formValues.editState = 'add';
        }
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues }
        }).then(res => {
          if (res.code === 200) {
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
              getfaultTodoDetailData();
              router.push(`/ITSM/faultmanage/todolist`);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveHandle = (cirStatus) => { // 故障处理
    let handleStartTimes; // 故障处理开始时间
    let handleEndTimes; // 故障恢复时间
    // eslint-disable-next-line consistent-return
    HandleRef.current.validateFields((err, values) => {
      const addDateZero = (num) => {
        return (num < 10 ? `0${num}` : num);
      }
      const d = new Date(values.handleStartTime);
      handleStartTimes = `${d.getFullYear()}-${addDateZero(d.getMonth() + 1)}-${addDateZero(d.getDate())} ${addDateZero(d.getHours())}:${addDateZero(d.getMinutes())}:${addDateZero(d.getMinutes())}`; // :${  addDateZero(d1.getSeconds())
      const d1 = new Date(values.handleEndTime);
      handleEndTimes = `${d1.getFullYear()}-${addDateZero(d1.getMonth() + 1)}-${addDateZero(d1.getDate())} ${addDateZero(d1.getHours())}:${addDateZero(d1.getMinutes())}:${addDateZero(d1.getMinutes())}`; // :${  addDateZero(d1.getSeconds())
      if (cirStatus?!err:true) {
        const formValues = values;
        formValues.handleStartTime = handleStartTimes;
        formValues.handleEndTime = handleEndTimes;
        formValues.taskId = id;
        formValues.editState = tododetailslist.editState;
        if (tododetailslist.editState === 'edit') {
          formValues.handleId = tododetailslist.handle.id;
          formValues.editState = tododetailslist.editState;
        } else {
          formValues.handleId = tododetailslist.editGuid;
          formValues.editState = 'add';
        }

        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues }
        }).then(res => {
          if (res.code === 200) {
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
              getfaultTodoDetailData();
              router.push(`/ITSM/faultmanage/todolist`);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveSummary = (cirStatus) => { // 故障总结
    let finishTimes; // 审核时间
    // eslint-disable-next-line consistent-return
    SummaryRef.current.validateFields((err, values) => {
      const addDateZero = (num) => {
        return (num < 10 ? `0${num}` : num);
      }
      const d = new Date(values.finishTime);
      finishTimes = `${d.getFullYear()}-${addDateZero(d.getMonth() + 1)}-${addDateZero(d.getDate())} ${addDateZero(d.getHours())}:${addDateZero(d.getMinutes())}:${addDateZero(d.getMinutes())}`; // :${  addDateZero(d1.getSeconds())

      if (cirStatus?!err:true) {
        const formValues = values;
        formValues.finishTime = finishTimes;
        formValues.taskId = id;
        formValues.editState = tododetailslist.editState;
        if (tododetailslist.editState === 'edit') {
          formValues.finishId = tododetailslist.finish.id;
          formValues.editState = tododetailslist.editState;
        } else {
          formValues.finishId = tododetailslist.editGuid;
          formValues.editState = 'add';
        }
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues }
        }).then(res => {
          if (res.code === 200) {
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
              getfaultTodoDetailData();
              router.push(`/ITSM/faultmanage/todolist`);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveClose = (cirStatus) => { // 故障关闭    跳转到故障查询页
    let closeTimes; // 审核时间
    // eslint-disable-next-line consistent-return
    CloseRef.current.validateFields((err, values) => {
      const addDateZero = (num) => {
        return (num < 10 ? `0${num}` : num);
      }
      const d = new Date(values.closeTime);
      closeTimes = `${d.getFullYear()}-${addDateZero(d.getMonth() + 1)}-${addDateZero(d.getDate())} ${addDateZero(d.getHours())}:${addDateZero(d.getMinutes())}:${addDateZero(d.getMinutes())}`; // :${  addDateZero(d1.getSeconds())

      if (cirStatus?!err:true) {
        const formValues = values;
        formValues.closeTime = closeTimes;
        formValues.taskId = id;
        formValues.editState = tododetailslist.editState;
        if (tododetailslist.editState === 'edit') {
          formValues.closeId = tododetailslist.close.id;
        } else {
          formValues.closeId = tododetailslist.editGuid;
        }
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues }
        }).then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            router.push(`/ITSM/faultmanage/todolist`);
            if (cirStatus) {
              const result = 1;
              const taskId = id;
              dispatch({
                type: 'fault/getSubmitProToNextNode',
                payload: { taskId, result }
              })
              router.push(`/ITSM/faultmanage/querylist`);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const handleSave = (savestatus) => { // 表单编辑保存，流转
    switch (paneKey) {
      case '故障登记':
        saveRegister(savestatus);
        break;
      case '故障审核':
        saveExamine(savestatus);
        break;
      case '故障处理':
        saveHandle(savestatus);
        break;
      case '故障总结':
        saveSummary(savestatus);
        break;
      case '故障关闭':
        saveClose(savestatus);
        break;
      default:
        break
    }
  };

  const rollbackSubmit = (values) => { // 回退操作
    dispatch({
      type: 'fault/rollback',
      payload: { taskId: id, backReason: values.rollbackOpinion, result: -1 }
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        router.push(`/ITSM/faultmanage/todolist`);
      } else {
        message.error(res.msg);
      }
    })
  }

  const handleReceivs = () => { // 接单接口
    setTransferpaneKey('故障处理');
    setnoTransferpaneKey('转单');
    setActiveKey([`${Collapsekeymap.get('故障处理')}`]);
    const taskId = id;
    return dispatch({
      type: 'fault/troubleHandleOrder',
      payload: { taskId }
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
      } else {
        message.error(res.msg);
      }
    })
  }

  const faulttransfer = () => { // 转单接口操作！
    
  }

  return (
    <PageHeaderWrapper
      extra={
        <>
          {
            paneKey === '故障登记' && (
              <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete()}>
                <Button type="danger">删除</Button>
              </Popconfirm>
            )
          }
          {
            paneKey === '故障处理' && notransferpaneKey !== '转单' && (
              <Button type="primary" onClick={() => handleReceivs()}>接单</Button>
            )
          }
          {
            paneKey !== '故障登记' && paneKey !== '故障关闭' && notransferpaneKey !== '转单' && (
              <ModelRollback title="填写回退意见" rollbackSubmit={values => rollbackSubmit(values)}>
                <Button type="danger" ghost>回退</Button>
              </ModelRollback>
            )
          }
          {
            (transferpaneKey || paneKey === '故障登记' || paneKey === '故障审核' || paneKey === '故障总结' || paneKey === '故障关闭') && (
              <Button type="primary" onClick={() => handleSave(tosaveStatus)}>保存</Button>
            )
          }
          {
            paneKey === '故障处理' && transferpaneKey && (
              <SelectUser handleSubmit={() => faulttransfer()}>
                <Button type="primary">转单</Button>
              </SelectUser>
            )
          }
          {
            (transferpaneKey || paneKey === '故障登记' || paneKey === '故障审核' || paneKey === '故障总结' || paneKey === '故障关闭') && (
              <SelectUser
                handleSubmit={() => handleSave(currenStatus)}
              >
                <Button
                  type="primary"
                  // onClick={() => handleSave(currenStatus)}
                >
                  流转
                </Button>
              </SelectUser>
            )
          }
          <Button type="default" onClick={handleClose}>返回</Button>
        </>
      }
      title={pagetitle}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      {
        (tabActiveKey === 'faultForm' &&
          <div className={styles.collapse}>
            <Card>
              <>
                <Steps
                  current={stepcurrentmap.get(paneKey)} 
                  // current={troubleFlowLogs && troubleFlowLogs.length - 1}
                  size="small"
                  style={{
                    background: '#fff',
                    padding: 20,
                    // border: '1px solid #e8e8e8',
                    overflowX: 'auto',
                  }}
                >
                  {
                    troubleFlowLogs && troubleFlowLogs.map(({ key, name, status, timeText, formHandler, startTime }) => [
                      name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})${'\xa0'}${'\xa0'}${timeText}`} description={
                        <div className={styles.stepDescription}>
                          处理人：{formHandler}
                          <div>开始时间：{startTime}</div>
                        </div>
                      } />
                    ])}
                </Steps>
              </>
            </Card>
            <Spin spinning={loading}>
              {
                loading === false && tododetailslist !== undefined && (
                  <Collapse
                    expandIconPosition="right"
                    activeKey={activeKey}
                    bordered={false}
                    style={{ marginTop: '-25px' }}
                    onChange={callback}
                  >
                    { // 故障登记编辑页---（故障登记时）
                      (paneKey === '故障登记') && (
                        <Panel header="故障登记" key="RegisterChild">
                          <RegisterChild
                            ref={RegisterRef}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            tododetailslist={tododetailslist}
                          />
                        </Panel>
                      )
                    }


                    { // 故障登记详情页---（故障审核时）
                      (paneKey === '故障审核' || paneKey === '故障处理' || paneKey === '故障总结' || paneKey === '故障关闭') &&
                      ( // 登记详情 后续的项展开都会被显示
                        <Panel header="故障登记" key="RegisterQuery">
                          <RegisterQuery
                            ref={RegisterRef}
                            detailsdata={troubleFlowNodeRows}
                            maindata={main}
                          />
                        </Panel>
                      )
                    }
                    { // 故障审核编辑页
                      (paneKey === '故障审核') &&
                      ( // 展开审核表单时，显示故障登记详情（1）
                        <Panel header="故障审核" key="ExamineChild">
                          <ExamineChild
                            ref={ExamineRef}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            check={check}
                          />
                        </Panel>
                      )
                    }


                    { // 故障审核详情页---（故障处理时）
                      (paneKey === '故障处理' || paneKey === '故障总结' || paneKey === '故障关闭') &&
                      ( // 审核详情
                        <Panel Panel header="故障审核" key="ExamineQuery">
                          <ExamineQuery
                            ref={ExamineRef}
                            detailsdata={troubleFlowNodeRows !== undefined && troubleFlowNodeRows[1]}
                          />
                        </Panel>
                      )
                    }
                    { // 故障处理编辑页
                      (paneKey === transferpaneKey) &&
                      ( // 展开处理表单时，显示故障审核详情以及登记详情（2）
                        <Panel header="故障处理" key="HandleChild">
                          <HandleChild
                            ref={HandleRef}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            handle={handle}
                            curruserinfo={curruserinfo}
                          />
                        </Panel>
                      )
                    }


                    { // 故障处理详情页---故障总结时
                      (paneKey === '故障总结' || paneKey === '故障关闭') &&
                      ( // 处理详情
                        <Panel header="故障处理" key="HandleQuery">
                          <HandleQuery
                            ref={HandleRef}
                            detailsdata={troubleFlowNodeRows !== undefined && troubleFlowNodeRows[2]}
                          />
                        </Panel>
                      )
                    }
                    { // 故障总结编辑页
                      (paneKey === '故障总结') && (
                        <Panel header="故障总结" key="SummaryChild">
                          <SummaryChild
                            ref={SummaryRef}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            finish={finish}
                          />
                        </Panel>
                      )
                    }



                    { // 故障总结详情页--（故障关闭时）
                      (paneKey === '故障关闭') &&
                      (
                        <Panel header="故障总结" key="SummaryQuery">
                          <SummaryQuery
                            ref={SummaryRef}
                            detailsdata={troubleFlowNodeRows !== undefined && troubleFlowNodeRows[3]}
                          />
                        </Panel>
                      )
                    }
                    {// 故障关闭编辑页
                      (paneKey === '故障关闭') &&
                      (
                        <Panel header="故障关闭" key="CloseChild">
                          <CloseChild
                            ref={CloseRef}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            close={close}
                          />
                        </Panel>
                      )
                    }
                  </Collapse>
                )
              }
            </Spin>
          </div>
        )
      }
      {
        (tabActiveKey === 'faultPro' && (
          <div className={styles.collapse}>
            <Card>
              <div 
                  style={{
                    background: '#fff',
                    padding: 20,
                    overflowX: 'auto',
                  }}
              >
                {/* 通过图片--二进制 展示流程图 */}
                <img src={image} alt='' />
              </div>
            </Card>
            <Collapse
              expandIconPosition="right"
              bordered={false}
              style={{ marginTop: '-25px' }}
              defaultActiveKey={['1']}
            >
              <Panel header="流转日志" key="1" showArrow={false}>
                <div className={styles.steps}>
                  <Steps
                    current={stepcurrentmap.get(paneKey)} 
                    // current={flowlog && flowlog.troubleFlowLogs.length - 1}
                    size="small"
                    direction="vertical"
                    progressDot
                    style={{
                      background: '#fff',
                      padding: 24,
                      border: '1px solid #e8e8e8',
                      overflowX: 'auto',
                      marginTop: '20px'
                    }}
                  >
                    {
                      flowlog && flowlog.troubleFlowLogs.map(({ key, name, status, startTime, formHandler, backReason }) => [
                        name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})`} description={
                          <div className={styles.stepDescription}>
                            处理人：{formHandler}
                            <div>{startTime}</div>
                            <div>{status === '退回' && `回退原因：${backReason}`}</div>
                          </div>
                        } />
                      ])}
                  </Steps>
                </div>
              </Panel>
            </Collapse>
          </div>
        ))
      }

    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ fault, loading }) => ({
    tododetailslist: fault.tododetailslist, // 详情的编辑数据
    flowimageview: fault.flowimageview, // 流程图view
    flowlog: fault.flowlog, // 流转日志
    html: fault.html,
    loading: loading.models.fault,
    curruserinfo: fault.curruserinfo, // 获取登录用户信息
  }))(Todolistdetails),
);