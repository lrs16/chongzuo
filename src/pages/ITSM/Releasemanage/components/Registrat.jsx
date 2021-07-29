import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Alert, DatePicker, Select } from 'antd';
import FilesContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import EditeTable from './EditeTable';
import TestingFacility from './TestingFacility';
import DocumentAtt from './DocumentAtt';

const { TextArea } = Input;
const { Option } = Select;

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
    sm: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 24 },
  },
};

const formuintLayout = {
  labelCol: {
    sm: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 22 },
  },
};

const statumap = new Map([
  ['发布登记', '1'],
  ['平台验证', '2'],
  ['业务验证', '3'],
]);

function Registrat(props, ref) {
  const { taskName, mainId, info, userinfo, register, selectdata, isEdit } = props;
  const { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue } = props.form;
  const required = true;

  const [alertvisible, setAlertVisible] = useState(false);  // 超时告警是否显示
  const [alertmessage, setAlertMessage] = useState('');

  const ChangeFiles = (v) => {
    console.log(v)
  }

  // 校验测试环境与发布清 
  const handleListValidator = (rule, value, callback) => {
    console.log(value)
    if (value === '' || value.length === 0) {
      callback()
    }
    callback()
  }


  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  useEffect(() => {
    if (isEdit && taskName === '发布登记' && moment(register.creationTime).format('DD') > 25) {
      setAlertVisible(true);
      setAlertMessage({ mes: `${taskName}超时,${taskName}的登记时间为每月1日至25日之间`, des: `` });
    };
    if (isEdit && taskName === '平台验证' && moment(register.creationTime).format('DD') > 28) {
      setAlertVisible(true);
      setAlertMessage({ mes: `${taskName}超时,${taskName}的登记时间为每月1日至28日之间`, des: `` });
    }
    if (isEdit && taskName === '业务验证' && (moment(register.creationTime).format('DD') > 29 || moment(register.creationTime).format('DD') < 7)) {
      setAlertVisible(true);
      setAlertMessage({ mes: `${taskName}超时,${taskName}的登记时间为每月7日至28日之间`, des: `` });
    }
  }, [register])

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const typemap = getTypebyId('1384055209809940482');       // 发布类型
  const unitmap = getTypebyId('1384056290929545218');       // 责任单位
  const functionmap = getTypebyId('1384052503909240833');   // 功能类型
  const modulamap = getTypebyId('1384430921586839554');  // 模块


  return (
    <>
      {alertvisible && (<Alert message={alertmessage.mes} type='warning' showIcon />)}
      <Row gutter={12} style={{ paddingTop: 24, }}>
        <Form ref={formRef} {...formItemLayout}>
          {taskName === '发布登记' && (
            <Col span={8}>
              <Form.Item label="发布编号">
                {getFieldDecorator('releaseNo', {
                  initialValue: info.releaseMain.releaseNo,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          )}
          {taskName === '发布登记' && (
            <>
              <Col span={8}>
                <Form.Item label="发布类型">
                  {getFieldDecorator('releaseType', {
                    rules: [{ required, message: `请选择发布类型` }],
                    initialValue: info.releaseMain.releaseType,
                  })(
                    <Select placeholder="请选择" disabled={!isEdit}>
                      {typemap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="责任单位">
                  {getFieldDecorator('dutyUnit', {
                    rules: [{ required, message: `请选择责任单位` }],
                    initialValue: info.releaseMain.dutyUnit,
                  })(
                    <Select placeholder="请选择" disabled={!isEdit}>
                      {unitmap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={8}>
            <Form.Item label="测试开始时间">
              {getFieldDecorator('testStart', {
                rules: [{ required, message: `请选择出厂测试开始时间` }],
                initialValue: moment(info.releaseRegister.testStart),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="测试结束时间">
              {getFieldDecorator('testEnd', {
                rules: [{ required, message: `请选择出厂测试结束时间` }],
                initialValue: moment(info.releaseRegister.testEnd),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="测试地点">
              {getFieldDecorator('testPlace', {
                rules: [{ required, message: `请输入出厂测试地点` }],
                initialValue: info.releaseRegister.testPlace,
              })(<Input disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="参与测试单位" {...formuintLayout}>
              {getFieldDecorator('testUnit', {
                rules: [{ required, message: `请选择参与测试单位` }],
                initialValue: info.releaseRegister.testUnit,
              })(<TextArea autoSize disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="测试人员" {...formuintLayout}>
              {getFieldDecorator('testOperator', {
                rules: [{ required, message: `请输入测试人员` }],
                initialValue: info.releaseRegister.testOperator,
              })(<TextArea autoSize disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          {taskName === '发布登记' && (
            <Col span={24}>
              <Form.Item label="受影响业务范围" {...formuintLayout}>
                {getFieldDecorator('influenceScope', {
                  rules: [{ required, message: `请填写受影响业务范围` }],
                  initialValue: info.releaseRegister.influenceScope,
                })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
              </Form.Item>
            </Col>
          )}
          <Col span={24} style={{ marginBottom: 24 }}>
            <Form.Item wrapperCol={{ span: 24 }}>
              {getFieldDecorator('releaseEnvs', {
                rules: [{ required, message: '请选择测试环境' }, {
                  validator: handleListValidator
                }],
                initialValue: info.releaseEnvs,
              })(
                <TestingFacility
                  title='测试环境'
                  isEdit={isEdit}
                  dataSource={info.releaseEnvs}
                  ChangeValue={v => setFieldsValue({ releaseEnvs: v })}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: 12 }}>
            <Form.Item wrapperCol={{ span: 24 }}>
              {getFieldDecorator('releaseLists', {
                rules: [{ required, message: '请填写发布清单' }, {
                  validator: handleListValidator
                }],
                initialValue: info.releaseLists,
              })(
                <EditeTable
                  title='发布清单'
                  functionmap={functionmap}
                  modulamap={modulamap}
                  isEdit={isEdit}
                  taskName={taskName}
                  mainId={mainId}
                  dataSource={info.releaseLists}
                />
              )}
            </Form.Item>
          </Col>
          {taskName !== '业务验证' && (
            <Col span={24}>
              <Form.Item label={`${taskName}结论`} {...forminladeLayout} labelAlign='left'>
                {getFieldDecorator('testResult', {
                  rules: [{ required, message: `请填写${taskName}结论` }],
                  initialValue: '',
                })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
              </Form.Item>
            </Col>
          )}
          <Col span={24} style={{ marginBottom: 24 }}>
            <FilesContext.Provider value={{
              files: [],
              ChangeFiles,
            }}>
              <DocumentAtt
                rowkey={statumap.get(taskName)}
                unitmap={unitmap}
                isEdit={isEdit}
                dataSource={info && info.releaseAttaches ? info.releaseAttaches : []}
                Uint={getFieldsValue(['dutyUnit'])}
              />
            </FilesContext.Provider>
          </Col>
          <Col span={8}>
            <Form.Item label="登记人" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('registerUser', {
                rules: [{ required, message: `请输入登记人` }],
                initialValue: taskName === '发布登记' ? userinfo.userName : info.releaseRegister.registerUser,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="登记人Id" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ display: 'none' }}>
              {getFieldDecorator('registerUser', {
                rules: [{ required, message: `请输入登记人` }],
                initialValue: taskName === '发布登记' ? userinfo.userId : info.releaseRegister.userId,
              })(<Input disabled />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="登记时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('registerTime', {
                rules: [{ required, message: `请选择登记时间` }],
                initialValue: moment(register.registerTime).format("YYYY-MM-DD HH:mm:ss"),
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记单位" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('registerUnit', {
                rules: [{ required, message: `请选择登记单位` }],
                initialValue: taskName === '发布登记' ? userinfo.unitName : info.releaseRegister.registerUnit,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="登记单位Id" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ display: 'none' }}>
              {getFieldDecorator('registerUnitId', {
                rules: [{ required, message: `请选择登记单位` }],
                initialValue: taskName === '发布登记' ? userinfo.unitId : info.releaseRegister.registerUnitId,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(Registrat))

WrappedForm.defaultProps = {
  mainId: '',
  register: {
    registerTime: undefined,
    // completeTime: moment().format(),
    demandId: '',
    demandType: '',
    detail: '',
    functionalModule: '',
    proposer: '',
    proposerId: '',
    proposerPhone: '',
    proposingDepartment: '',
    proposingDepartmentId: '',
    proposingUnit: '',
    proposingUnitId: '1',
    reason: '',
    title: '',
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

export default WrappedForm;