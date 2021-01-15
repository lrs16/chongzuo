import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
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
import SelectUser from '@/components/SelectUser'; // 选人组件
import styles from './index.less';
import ModelRollback from './components/ModelRollback'; // 回退组件

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
const history1 = creatHistory(); // 返回上一页

let image; // 流程图
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
  ['故障登记', 'RegisterChild'], // 登记
  ['故障审核', 'ExamineChild'], // 审核
  ['故障处理', 'HandleChild'], // 处理
  ['registerDetails', 'RegisterQuery'], // 处理
  ['故障总结', 'SummaryChild'], // 总结
  ['故障关闭', 'CloseChild'], // 关闭
]);

function Todolistdetails(props) {
  const pagetitle = props.route.name;
  const [activeKey, setActiveKey] = useState([]);
  const [tabActiveKey, setTabActiveKey] = useState('faultForm');

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
    });
  }

  const getFlowlog = () => { // 流程日志
    dispatch({
      type: 'fault/fetchGetFlowLog',
      payload: { id: tododetailslist.main.id }
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
    sessionStorage.setItem('Processtype', 'troub');
  }, []);

  useEffect(() => {
    sessionStorage.setItem('flowtype', '1');
  }, ['1']);

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
    // eslint-disable-next-line consistent-return
    RegisterRef.current.validateFields((err, values) => {
      if (cirStatus ? !err : true) {
        const formValues = values;
        formValues.registerOccurTime = values.registerOccurTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.registerTime = values.registerTime.format('YYYY-MM-DD HH:mm:ss');
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
            getfaultTodoDetailData();
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveExamine = (cirStatus) => { // 故障审核
    // eslint-disable-next-line consistent-return
    ExamineRef.current.validateFields((err, values) => {
      const formValues = values;
      formValues.checkTime = values.checkTime.format('YYYY-MM-DD HH:mm:ss');
      if (cirStatus ? !err : true) {
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
            getfaultTodoDetailData();
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveHandle = (cirStatus) => { // 故障处理
    // eslint-disable-next-line consistent-return
    HandleRef.current.validateFields((err, values) => {
      if (cirStatus ? !err : true) {
        const formValues = values;
        formValues.handleStartTime = values.handleStartTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.handleEndTime = values.handleEndTime.format('YYYY-MM-DD HH:mm:ss');
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
            getfaultTodoDetailData();
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveSummary = (cirStatus) => { // 故障总结
    // eslint-disable-next-line consistent-return
    SummaryRef.current.validateFields((err, values) => {
      if (cirStatus ? !err : true) {
        const formValues = values;
        formValues.finishTime = values.finishTime.format('YYYY-MM-DD HH:mm:ss');
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
            getfaultTodoDetailData();
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveClose = (cirStatus) => { // 故障关闭    跳转到故障查询页
    // eslint-disable-next-line consistent-return
    CloseRef.current.validateFields((err, values) => {
      if (cirStatus ? !err : true) {
        const formValues = values;
        formValues.closeTime = values.closeTime.format('YYYY-MM-DD HH:mm:ss');
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
            getfaultTodoDetailData();
            if (cirStatus) {
              const result = 1;
              const taskId = id;
              dispatch({
                type: 'fault/getSubmitProToNextNode',
                payload: { taskId, result }
              })
              getfaultTodoDetailData();
              router.push(`/ITSM/faultmanage/querylist`);
            } else {
              message.success(res.msg);
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
    const taskId = id;
    return dispatch({
      type: 'fault/troubleHandleOrder',
      payload: { taskId }
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        main.status = '45';
        getfaultTodoDetailData();
      } else {
        message.error(res.msg);
      }
    })
  }

  // const faulttransfer = () => { // 转单接口操作！
  // }

  return (
    <PageHeaderWrapper
      extra={
        <>
          { // 删除按钮只有故障登记有
            paneKey === '故障登记' && (
              <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete()}>
                <Button type="danger">删除</Button>
              </Popconfirm>
            )
          }
          { // 回退按钮--故障审核，故障处理， 故障总结有
            (paneKey !== '故障登记' && paneKey !== '故障关闭' && (main && main.status !== '45')) && (
              <ModelRollback title="填写回退意见" rollbackSubmit={values => rollbackSubmit(values)}>
                <Button type="danger" ghost>回退</Button>
              </ModelRollback>
            )
          }
          { // 接单只有故障处理时有
            (main && main.status === '29') && (
              <Button type="primary" onClick={() => handleReceivs()}>接单</Button>
            )
          }
          {(main && main.status !== '29') && (<Button type="primary" onClick={() => handleSave(tosaveStatus)}>保存</Button>)}
          { // 转单只有故障处理时有
            (main && main.status === '45') && (
              <Button type="primary">转单</Button>
            )
          }
          {(main && main.status !== '29') && (<SelectUser
            handleSubmit={() => handleSave(currenStatus)}
            taskId={id}
          >
            <Button
              type="primary"
            >
              流转
                </Button>
          </SelectUser>)}
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
            <Card
              style={{
                background: '#fff',
                // padding: 10,
                border: '1px solid #e8e8e8',
                overflowX: 'auto',
              }}
            >
              {
                troubleFlowLogs &&
                (<Steps
                  current={troubleFlowLogs.length - 1}
                  size="small"
                >
                  {
                    troubleFlowLogs && troubleFlowLogs.map(({ key, name, status, timeText, formHandler, startTime }) => [
                      name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})${'\xa0'}${'\xa0'}${timeText}`} description={
                        <div className={styles.stepDescription}>
                          处理人：{formHandler}
                          <div>开始时间：{moment(startTime).format('YYYY-MM-DD hh:mm:ss')}</div>
                        </div>
                      } />
                    ])}
                </Steps>)
              }
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
                    { // 故障审核编辑页
                      (paneKey === '故障审核') &&
                      ( // 展开审核表单时，显示故障登记详情（1）
                        <Panel header="系统运维商审核" key="ExamineChild">
                          <ExamineChild
                            ref={ExamineRef}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            check={check}
                            curruserinfo={curruserinfo}
                          />
                        </Panel>
                      )
                    }
                    { // 故障处理编辑页
                      (paneKey === '故障处理') && (main && main.status === '45') &&
                      ( // 展开处理表单时，显示故障审核详情以及登记详情（2）
                        <Panel header="系统运维商处理" key="HandleChild">
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
                    { // 故障总结编辑页
                      (paneKey === '故障总结') && (
                        <Panel header="系统运维商确认总结" key="SummaryChild">
                          <SummaryChild
                            ref={SummaryRef}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            finish={finish}
                            curruserinfo={curruserinfo}
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
                            curruserinfo={curruserinfo}
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
                    { // 故障审核详情页---（故障处理时）
                      (paneKey === '故障处理' || paneKey === '故障总结' || paneKey === '故障关闭') &&
                      ( // 审核详情
                        <Panel Panel header="系统运维商审核" key="ExamineQuery">
                          <ExamineQuery
                            ref={ExamineRef}
                            detailsdata={troubleFlowNodeRows !== undefined && troubleFlowNodeRows[1]}
                          />
                        </Panel>
                      )
                    }
                    { // 故障处理详情页---故障总结时
                      (paneKey === '故障总结' || paneKey === '故障关闭') &&
                      ( // 处理详情
                        <Panel header="系统运维商处理" key="HandleQuery">
                          <HandleQuery
                            ref={HandleRef}
                            detailsdata={troubleFlowNodeRows !== undefined && troubleFlowNodeRows[2]}
                          />
                        </Panel>
                      )
                    }
                    { // 故障总结详情页--（故障关闭时）
                      (paneKey === '故障关闭') &&
                      (
                        <Panel header="系统运维商确认总结" key="SummaryQuery">
                          <SummaryQuery
                            ref={SummaryRef}
                            detailsdata={troubleFlowNodeRows !== undefined && troubleFlowNodeRows[3]}
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
            <Card title='故障管理流程'>
              <div
                style={{
                  background: '#fff',
                  padding: 20,
                }}
              >
                {/* 通过图片--二进制 展示流程图 */}
                <img src={image} alt='' />
              </div>
            </Card>
            <Card title='流转日志' style={{ marginTop: '-1px' }}>
              {
                loading === false && flowlog &&
                (
                  <div className={styles.steps}>
                    <Steps
                      current={flowlog.troubleFlowLogs.length - 1}
                      size="small"
                      direction="vertical"
                      progressDot
                      style={{
                        background: '#fff',
                        padding: 24,
                        border: '1px solid #e8e8e8',
                      }}
                    >
                      {
                        flowlog && flowlog.troubleFlowLogs.map(({ key, name, status, startTime, formHandler, backReason }) => [
                          name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})`} description={
                            <div className={styles.stepDescription}>
                              处理人：{formHandler}
                              <div>{moment(startTime).format('YYYY-MM-DD hh:mm:ss')}</div>
                              <div>{status === '退回' && `回退原因：${backReason}`}</div>
                            </div>
                          } />
                        ])}
                    </Steps>
                  </div>
                )
              }
            </Card>
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