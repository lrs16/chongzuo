import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Form, Input, Alert, DatePicker, Select, Checkbox, Button, Radio, Tabs, message } from 'antd';
import SubmitTypeContext from '@/layouts/MenuContext';
import DocumentAtt from './DocumentAtt';
import EditeTable from './EditeTable';
import TimeoutModal from '../../components/TimeoutModal';
import { saveTimeoutMsg, saveReleaseTimeoutMsg } from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;

const formuintLayout = {
  labelCol: {
    sm: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 24 },
  },
};

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

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}

function VersionAudit(props, ref) {
  const { dispatch, taskName, userinfo, selectdata, isEdit, info, listmsg, timeoutinfo } = props;
  const { getFieldDecorator, setFieldsValue, getFieldsValue, resetFields } = props.form;
  const [check, setCheck] = useState(false);
  const [mergeNo, setMergeNo] = useState('');
  const [attaches, setAttaches] = useState([]);
  const [activeKey, setActiveKey] = useState('');
  const [adopt, setAdopt] = useState('通过');
  const [rowkey, setRowKey] = useState('0');
  const [newList, setNewList] = useState(false);
  const [alertvisible, setAlertVisible] = useState(false);  // 超时告警是否显示
  const [alertmessage, setAlertMessage] = useState('');
  const [modalvisible, setModalVisible] = useState(false);
  const [timeoutPost, setTimeoutPost] = useState({});
  const { ChangeSubmitType, ChangeButtype, releaseType } = useContext(SubmitTypeContext);
  const required = true;

  const formmap = new Map([
    ['版本管理员审核', info.mergeOrder],
    ['科室负责人审核', info.checkMerge],
    ['中心领导审核', info.checkMerge],
  ])

  // 已合并工单,获取工单号生成数组
  const orderkeys = info.releaseMains && info.releaseMains.map((item) => {
    return item.releaseNo
  })

  // 已合并工单,已超时且未填写超时原因的工单
  const orderkeyAndTimeout = info.releaseMains && info.releaseMains.filter(item => item.timeoutResult && item.timeoutResult.timeout && !item.timeoutResult.reason);

  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  useEffect(() => {
    if (isEdit && timeoutinfo) {
      setAlertVisible(true);
      setAlertMessage({ mes: `${taskName}超时，${taskName}${timeoutinfo}`, des: `` });
    };
    if (!isEdit && timeoutinfo) {
      setAlertVisible(true);
      setAlertMessage({ mes: `超时原因：${timeoutinfo}`, des: `` });
    };
  }, [timeoutinfo])


  // 切换附件
  const handleTabChange = (key) => {
    setActiveKey(key);
    setAttaches(info.releaseAttaches[key]);
  }
  // 初始化附件页签
  useEffect(() => {
    if (info.releaseAttaches && orderkeys) {
      if (activeKey) {
        handleTabChange(activeKey);
      } else {
        const flowId = getQueryVariable("Id");
        handleTabChange(flowId)
      }
    }
  }, [info.releaseAttaches])

  const changeatt = (v, files) => {
    setFieldsValue({ releaseAttaches: v });
    const target = v.filter(item => item.key !== '9' && item.editable && item.attachFile === '[]');
    if (target.length === 0) {
      setCheck(false);
    };
    if (files === 'files') {
      ChangeButtype('save')
    };
  };

  // 数组扁平
  const toAllCheck = (arr) => {
    let newArr = [];
    if (!Array.isArray(arr)) {
      return newArr;
    }
    for (let i = 0; i < arr.length; i += 1) {
      if (Array.isArray(arr[i])) {
        const sunarr = newArr.concat(arr[i]);
        newArr = sunarr;
      } else {
        newArr.push(arr[i])
      };
    }
    return newArr
  };
  // 数组去重
  const uniqueNo = (arr) => {
    const res = new Map();
    return arr.filter((item) => !res.has(item.releaseNo) && res.set(item.releaseNo, 1))
  }
  // 校验文档
  const handleAttValidator = (rule, value, callback) => {
    if (info && info.releaseAttaches) {
      const releaseNos = Object.keys(info.releaseAttaches);
      const checkList = releaseNos.map(key => {
        const releaseNo = key;
        const values = info.releaseAttaches[key];
        const endatt = values[values.length - 1].docName;
        const checkAtt = values[rowkey - 1];
        if (endatt === '发布实施方案') {
          const replenishAtt = values.slice(-5);
          replenishAtt.unshift(checkAtt);
          const arr = replenishAtt.map(obj => ({ ...obj, releaseNo }));
          return arr;
        }
        return { ...checkAtt, releaseNo }
      });
      const values = toAllCheck(checkList);
      const target = values.filter(item => item.attachFile === '[]' && item.docName !== '其它附件');
      const tabKeyObject = uniqueNo(target)
      const TabKeys = tabKeyObject.map((item) => {                              // 提醒哪个页签未添加附件
        return item.releaseNo
      });
      // const flowId = getQueryVariable("Id");
      // if (TabKeys.indexOf(flowId) !== -1 && tabKeyObject.length > 0) {
      //   handleTabChange(TabKeys[0]);
      // } else {
      //   handleTabChange(flowId);
      // };
      if (target.length > 0) {
        setCheck(true);
        callback(`工单${JSON.stringify(TabKeys)}有附件未上传`);
      } else {
        callback()
      }
    } else {
      callback()
    }
  }


  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const unitmap = getTypebyId('1384056290929545218');       // 责任单位
  const functionmap = getTypebyId('1384052503909240833');   // 功能类型
  const modulamap = getTypebyId('1384430921586839554');     // 模块
  const grademap = getTypebyId('1387229272208314369');      // 发布等级


  // 复选框
  const onCheckboxChange = (checkds) => {
    setMergeNo(checkds.toString())
    if (checkds.length === 1) {
      const target = info.releaseMains.filter(item => item.releaseNo === checkds[0])[0];
      if (target) {
        setTimeoutPost(target)
      }
    }
  }

  // 取消合并
  const cancelMerge = () => {
    const flowId = getQueryVariable("Id");
    dispatch({
      type: 'releasetodo/cancelmerge',
      payload: {
        values: { releaseNo: mergeNo, },
        flowId,
      },
    });
  };

  // 填写超时原因
  const handleTimeoutMsg = () => {
    if (mergeNo.length === 0 || mergeNo.split(',').length !== 1) {
      message.error('请选择一条工单填写超时原因')
    } else if (timeoutPost.timeoutResult && timeoutPost.timeoutResult.timeout && !timeoutPost.timeoutResult.reason) {
      setModalVisible(true);
    } else if (timeoutPost.timeoutResult && !timeoutPost.timeoutResult.timeout) {
      message.error('您选择的工单未超时')
    } else if (timeoutPost.timeoutResult && timeoutPost.timeoutResult.timeout && timeoutPost.timeoutResult.reason) {
      message.error('您选择的工单已填写超时原因')
    }
  }

  // 保存超时信息,成功校验表单
  const postTimeOutMsg = (v) => {
    saveReleaseTimeoutMsg({
      taskId: timeoutPost.taskId,
      orderId: timeoutPost.id,
      msgType: 'timeout',
      orderType: 'release',
      ...v
    }).then(res => {
      if (res.code === 200) {
        const releaseNo = getQueryVariable("Id");
        dispatch({
          type: 'releasetodo/openflow',
          payload: { releaseNo, taskName },
        });
      }
    });
  }

  const descriptionopion = (
    <>
      {info.releaseMains && (
        <Checkbox.Group onChange={onCheckboxChange}>
          {info.releaseMains.map((obj) => {
            return [
              <Checkbox
                key={obj.releaseNo}
                value={obj.releaseNo}
              // disabled={taskName === '版本管理员审核' && obj === flowId}
              >
                <span style={{ color: `${obj.timeoutResult.timeout && !obj.timeoutResult.reason ? '#f00' : ''}` }}>
                  {`${obj.releaseNo}${obj.timeoutResult.timeout && !obj.timeoutResult.reason ? `${obj.timeoutResult.msg}，未填写超时原因` : (obj.timeoutResult.msg || '')}`}
                </span>
              </Checkbox>,
            ]
          })}
        </Checkbox.Group>
      )}
      {taskName === '版本管理员审核' && (<Button style={{ marginLeft: 30 }} type='link' onClick={() => cancelMerge()}>取消合并</Button>)}
      {orderkeyAndTimeout.length > 0 && (<Button style={{ marginLeft: 12 }} type='link' onClick={() => handleTimeoutMsg()}>填写超时原因</Button>)}
    </>
  )
  // 选择通过不通过改变流转类型
  const handleAdopt = value => {
    setAdopt(value);
    if (value === '通过' && isEdit) {
      ChangeSubmitType(1)
    };
    if (value === '不通过' && isEdit) {
      ChangeSubmitType(0)
    }
  };


  useEffect(() => {
    if (taskName === '版本管理员审核') {
      if (releaseType === '计划发布') {
        setRowKey('6')
      };
      if (releaseType === '临时发布') {
        setRowKey('7')
      }
    } else {
      setRowKey('0')
    };
    if (info && info.checkMerge && info.checkMerge.checkResult) {
      handleAdopt(info.checkMerge.checkResult);
    }
  }, [info]);

  return (
    <>
      {info.releaseMains && info.releaseMains.length === 1 && alertvisible && (<Alert message={alertmessage.mes} type='warning' showIcon style={{ marginBottom: 12 }} />)}
      {info.releaseMains && info.releaseMains.length > 1 && (
        <Alert message='已合并工单' description={descriptionopion} type='info' />
      )}
      <Row gutter={12} style={{ paddingTop: 24, }}>
        <Form ref={formRef} {...formItemLayout}>
          {taskName === '版本管理员审核' && (<>
            <Col span={8} >
              <Form.Item label="申请发布等级">
                {getFieldDecorator('releaseLevel', {
                  rules: [{ required, message: `请选择发布等级` }],
                  initialValue: info.mergeOrder ? info.mergeOrder.releaseLevel : '',
                })(
                  <Select placeholder="请选择" disabled={!isEdit}>
                    {grademap.map(obj => [
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="发布开始时间">
                {getFieldDecorator('releaseBeginTime', {
                  rules: [{ required, message: `请选择发布开始时间` }],
                  initialValue: moment(info.mergeOrder && info.mergeOrder.releaseBeginTime ? info.mergeOrder.releaseBeginTime : undefined),
                })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="发布结束时间">
                {getFieldDecorator('releaseEndTime', {
                  rules: [{ required, message: `请选择发布结束时间` }],
                  initialValue: moment(info.mergeOrder && info.mergeOrder.releaseEndTime ? info.mergeOrder.releaseEndTime : undefined),
                })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="停止业务访问" >
                {getFieldDecorator('bizStopVisit', {
                  rules: [{ required, message: `请选择停止业务访问` }],
                  initialValue: info.mergeOrder ? info.mergeOrder.bizStopVisit : '是',
                })(
                  <RadioGroup disabled={!isEdit}>
                    <Radio value='是'>是</Radio>
                    <Radio value='否'>否</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
          </>)}
          {(taskName === '科室负责人审核' || taskName === '中心领导审核') && (
            <>
              <Col span={24}>
                <Form.Item label='审核结果' {...formuintLayout} labelAlign='left'>
                  {getFieldDecorator('checkResult', {
                    rules: [{ required, message: '请选择验证结果' }],
                    initialValue: formmap.get(taskName).checkResult || '通过',
                  })(<RadioGroup onChange={(e) => handleAdopt(e.target.value)} disabled={!isEdit}>
                    <Radio value='通过'>通过</Radio>
                    <Radio value='不通过'>不通过</Radio>
                  </RadioGroup>
                  )}
                </Form.Item>
              </Col>
              {adopt === '通过' ? (
                <Col span={24}>
                  <Form.Item label='审核说明' {...formuintLayout} labelAlign='left'>
                    {getFieldDecorator('checkComment', {
                      initialValue: formmap.get(taskName).checkComment,
                    })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
                  </Form.Item>
                </Col>)
                :
                (<Col span={24}>
                  <Form.Item label='审核说明' {...formuintLayout} labelAlign='left'>
                    {getFieldDecorator('checkComment', {
                      rules: [{ required, message: `请输入审核说明` }],
                      initialValue: formmap.get(taskName).checkComment,
                    })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
                  </Form.Item>
                </Col>)}
            </>)}
          <Col span={24}>
            <EditeTable
              title='功能验证表'
              functionmap={functionmap}
              modulamap={modulamap}
              isEdit={taskName === '版本管理员审核' && isEdit}
              taskName={taskName}
              dataSource={undefined}
              ChangeValue={v => { setFieldsValue({ releaseLists: v }); }}
              dutyUnits={info.releaseListClassify.dutyUnits}
              dutyUnitTotalMsg={info.releaseListClassify.dutyUnitTotalMsg}        // 公司总统计，页签上
              dutyUnitListMsg={info.releaseListClassify.dutyUnitListMsg}          // 公司清单统计，页签下
              releaseMains={info.releaseListClassify.releaseMains}                // 已合并工单
              dutyUnitList={info.releaseListClassify.dutyUnitList}                // 公司清单
              ChangeAttActiveKey={(v) => handleTabChange(v)}                      // 选择所属工单对应的附件页签切换
              orderNos={orderkeys}
              ChangeTabdisabled={v => setNewList(v)}
              listmsg={listmsg}
            />
          </Col>
          <Col span={24} style={{ marginBottom: 24 }}>
            {info.releaseMains && info.releaseMains.length > 1 && (
              <Tabs type='card' onChange={handleTabChange} activeKey={activeKey}>
                {orderkeys.length > 1 && orderkeys.map((obj) => {
                  return [
                    <TabPane key={obj} tab={obj} disabled={newList} />,
                  ]
                })}
              </Tabs>)}
            <DocumentAtt
              rowkey={rowkey}
              isEdit={isEdit}
              unitmap={unitmap}
              dataSource={attaches}
              Unit={{ dutyUnit: undefined }}
              ChangeValue={(v, files) => changeatt(v, files)}
              check={check}
            />
            <Form.Item wrapperCol={{ span: 24 }}>
              {getFieldDecorator('releaseAttaches', {
                rules: [{ required, message: '请上传附件' }, {
                  validator: handleAttValidator
                }],
                initialValue: info.releaseAttaches,
              })(<></>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('checkUser', {
                rules: [{ required, message: `请选择审批人` }],
                initialValue: userinfo ? userinfo.userName : formmap.get(taskName).checkUser,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('checkTime', {
                rules: [{ required, message: `请选择审批时间` }],
                initialValue: moment(formmap.get(taskName).checkTime || undefined).format('YYYY-MM-DD HH:mm:ss'),
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核单位" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('checkUnit', {
                rules: [{ required, message: `请选择审批单位` }],
                initialValue: userinfo ? userinfo.unitName : formmap.get(taskName).checkUnit,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
      <TimeoutModal
        modalvisible={modalvisible}
        ChangeModalVisible={v => setModalVisible(v)}
        ChangeTimeOutMsg={v => postTimeOutMsg(v)}
      />
    </>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(VersionAudit));

WrappedForm.defaultProps = {
  register: {
    creationTime: undefined,
  },
};

export default connect()(WrappedForm);