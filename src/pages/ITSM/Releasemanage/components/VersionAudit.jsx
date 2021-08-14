import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Form, Input, Alert, DatePicker, Select, Checkbox, Button, Radio, Tabs } from 'antd';
import SubmitTypeContext from '@/layouts/MenuContext';
import DocumentAtt from './DocumentAtt';
import EditeTable from './EditeTable';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;

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
  const { dispatch, taskName, userinfo, register, selectdata, isEdit, info } = props;
  const { getFieldDecorator, setFieldsValue, getFieldsValue, resetFields } = props.form;
  const [check, setCheck] = useState(false);
  const [mergeNo, setMergeNo] = useState('');
  const [attaches, setAttaches] = useState([]);
  const { ChangeButtype } = useContext(SubmitTypeContext);
  const required = true;

  const [alertvisible, setAlertVisible] = useState(false);  // 超时告警是否显示

  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  useEffect(() => {
    if (isEdit && (moment(register.creationTime).format('DD') > 15 || moment(register.creationTime).format('DD') < 11)) {
      setAlertVisible(true);
    };
  }, [register])

  const changeatt = (v, files) => {
    setFieldsValue({ releaseAttaches: v });
    const key = '5';
    const target = v.filter(item => item.key === key)[0];
    if (target && target.attachFile !== '[]') {
      setCheck(false);
    };
    if (files === 'files') {
      ChangeButtype('save')
    };
  };
  // 校验文档
  const handleAttValidator = (rule, value, callback) => {
    if (value) {
      const target = value.filter(item => item.editable && item.attachFile === '[]' && item.docName !== '其它附件');
      if (target.length > 0) {
        setCheck(true);
        callback(`请上传附件`);
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  // 校验发布清单
  const handleListValidator = (rule, value, callback) => {
    if (value === '' || value.length === 0) {
      callback()
    }
    callback()
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
  const reasonmap = getTypebyId('1387231433545748481');     // 发布变更原因
  const contentmap = getTypebyId('1387231738408734721');    // 发布变更内容

  // 复选框
  const onCheckboxChange = (checkds) => {
    setMergeNo(checkds.toString())
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
  }

  // 已合并工单
  const orderkeys = info.releaseMains && info.releaseMains.map((item) => {
    return item.releaseNo
  })

  const descriptionopion = (
    <>
      {info.releaseMains && (
        <Checkbox.Group
          options={orderkeys}
          onChange={onCheckboxChange}
        />
      )}
      <Button style={{ marginLeft: 30 }} type='link' onClick={() => cancelMerge()}>取消合并</Button>
    </>
  )

  // 切换附件
  const handleTabChange = (key) => {
    setAttaches(info.releaseAttaches[key]);
  }
  // 初始化附件页签
  useEffect(() => {
    if (info.releaseAttaches && orderkeys) {
      handleTabChange(orderkeys[0])
    }
  }, [info.releaseAttaches])

  return (
    <>
      {alertvisible && (<Alert
        message={`${taskName}超时,${taskName}时间在每月11日至14日之间`}
        type='warning'
        showIcon style={{ marginBottom: 12 }}
      />)}
      {info.releaseMains && info.releaseMains.length > 1 && (<Alert message='已合并工单' description={descriptionopion} type='info' style={{ marginBottom: 24, }} />)}
      <Row gutter={12}>
        <Form ref={formRef} {...formItemLayout}>
          <Col span={24}>
            <EditeTable
              title='功能验证表'
              functionmap={functionmap}
              modulamap={modulamap}
              isEdit={isEdit}
              taskName={taskName}
              dataSource={undefined}
              ChangeValue={v => { setFieldsValue({ releaseLists: v }); }}
              dutyUnits={info.releaseListClassify.dutyUnits}
              dutyUnitTotalMsg={info.releaseListClassify.dutyUnitTotalMsg}        // 公司总统计，页签上
              dutyUnitListMsg={info.releaseListClassify.dutyUnitListMsg}          // 公司清单统计，页签下
              releaseMains={info.releaseListClassify.releaseMains}                // 已合并工单
              dutyUnitList={info.releaseListClassify.dutyUnitList}                // 公司清单
              orderkeys={orderkeys || []}
            />
            <Form.Item wrapperCol={{ span: 24 }} >
              {getFieldDecorator('releaseLists', {
                rules: [{ required, message: '请填写发布清单' }, {
                  validator: handleListValidator
                }],
                initialValue: info.releaseLists,
              })(
                <></>
              )}
            </Form.Item>
          </Col>
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
                initialValue: moment(info.mergeOrder && info.mergeOrder.releaseBeginTime ? info.mergeOrder.releaseBeginTime : undefined).format('YYYY-MM-DD HH:mm:ss'),
              })(<Input disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="发布结束时间">
              {getFieldDecorator('releaseEndTime', {
                rules: [{ required, message: `请选择发布结束时间` }],
                initialValue: moment(info.mergeOrder && info.mergeOrder.releaseEndTime ? info.mergeOrder.releaseEndTime : undefined).format('YYYY-MM-DD HH:mm:ss'),
              })(<Input disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="停止业务访问" >
              {getFieldDecorator('bizStopVisit', {
                rules: [{ required, message: `请选择停止业务访问` }],
                initialValue: info.mergeOrder ? info.mergeOrder.releaseLevel : '是',
              })(
                <RadioGroup disabled={!isEdit}>
                  <Radio value='是'>是</Radio>
                  <Radio value='否'>否</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: 24 }}>
            {info.releaseMains && info.releaseMains.length > 1 && (<Tabs type='card' onChange={handleTabChange}>
              {orderkeys.length > 1 && orderkeys.map((obj) => {
                return [
                  <TabPane key={obj} tab={obj} />,
                ]
              })}
            </Tabs>)}
            <DocumentAtt
              rowkey='6'
              isEdit={isEdit}
              unitmap={unitmap}
              dataSource={attaches}
              Unit={{ dutyUnit: undefined }}
              ChangeValue={(v, files) => changeatt(v, files)}
              check={check}
            />
            <Form.Item wrapperCol={{ span: 24 }} style={{ display: 'none' }}>
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
                initialValue: userinfo ? userinfo.userName : '',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('checkTime', {
                rules: [{ required, message: `请选择审批时间` }],
                initialValue: moment(info.mergeOrder ? info.mergeOrder.checkTime : undefined).format('YYYY-MM-DD HH:mm:ss'),
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核单位" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('checkUnit', {
                rules: [{ required, message: `请选择审批单位` }],
                initialValue: userinfo ? userinfo.unitName : '',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(VersionAudit));

WrappedForm.defaultProps = {
  register: {
    creationTime: undefined,
  },
  userinfo: {
    deptName: '',
    deptId: '',
    unitName: '',
    unitId: '',
    userName: '',
    userId: '',
  },
};

export default connect()(WrappedForm);