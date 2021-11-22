import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Alert, DatePicker, Select, Radio } from 'antd';
import SubmitTypeContext from '@/layouts/MenuContext';
import EditeTable from './EditeTable';
import TestingFacility from './TestingFacility';
import DocumentAtt from './DocumentAtt';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const Attaches = [
  { docName: '功能出厂测试报告', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '平台验证测试报告', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '业务功能测试报告', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '功能清单终稿', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '发布实施方案', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '计划发布申请审批表', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '临时发布申请审批表', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '功能发布报告', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '其它附件', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
];

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
  ['新建', '1'],
  ['出厂测试', '1'],
  ['平台验证', '2'],
  ['业务验证', '3'],
]);

function Registrat(props, ref) {
  const { taskName, info, userinfo, selectdata, isEdit, listmsg, timeoutinfo } = props;
  const { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue } = props.form;
  const required = true;

  const [alertvisible, setAlertVisible] = useState(false);  // 超时告警是否显示
  const [alertmessage, setAlertMessage] = useState('');
  const [check, setCheck] = useState(false);
  // const [adopt, setAdopt] = useState('通过');
  const { ChangeSubmitType, ChangeButtype, location } = useContext(SubmitTypeContext);

  const formmap = new Map([
    ['新建', info.releaseRegister],
    ['出厂测试', info.releaseRegister],
    ['平台验证', info.platformValid],
    ['业务验证', info.releaseBizValid],
  ]);

  // 校验测试环境与发布清 
  const handleListValidator = (rule, value, callback) => {
    if (value === '' || value.length === 0) {
      callback()
    }
    callback()
  }

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

  const changeatt = (v, files) => {
    setFieldsValue({ releaseAttaches: v });
    const key = statumap.get(taskName);
    const target = v.filter(item => item.key === key)[0];
    if (target && target.attachFile !== '[]') {
      setCheck(false);
    };
    if (files === 'files') {
      ChangeButtype('save')
    };
  }

  const handleAdopt = e => {
    // setAdopt(e.target.value);
    if (e.target.value === '通过') {
      ChangeSubmitType(1)
    };
    if (e.target.value === '不通过') {
      ChangeSubmitType(0)
    }
  };

  useEffect(() => {
    if (info && info.platformValid && info.platformValid.validResult && isEdit) {
      // setAdopt(info.platformValid.validResult);
      if (info.platformValid.validResult === '通过') {
        ChangeSubmitType(1)
      };
      if (info.platformValid.validResult === '不通过') {
        ChangeSubmitType(0)
      }
    };
    if (info && info.releaseBizValid && info.releaseBizValid.validResult && isEdit) {
      // setAdopt(info.releaseBizValid.validResult);
      if (info.releaseBizValid.validResult === '通过') {
        ChangeSubmitType(1)
      };
      if (info.releaseBizValid.validResult === '不通过') {
        ChangeSubmitType(0)
      }
    }
  }, [info])

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

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const typemap = getTypebyId(460);       // 发布类型
  const unitmap = getTypebyId(1052);       // 责任单位
  const functionmap = getTypebyId(451);   // 功能类型
  const modulamap = getTypebyId(466);     // 模块
  const testunitmap = getTypebyId(1288);     // 参与测试单位
  const docunitmap = getTypebyId(1289);     // 出具文档单位

  return (
    <>
      {alertvisible && (<Alert message={alertmessage.mes} type='warning' showIcon />)}
      <Row gutter={12} style={{ marginTop: 24, }}>
        <Form ref={formRef} {...formItemLayout}>
          {(taskName === '出厂测试' || taskName === '新建') && (
            <>
              <Col span={8}>
                <Form.Item label="发布编号">
                  {getFieldDecorator('releaseNo', {
                    initialValue: info.releaseNo || info.releaseMain.releaseNo || '',
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
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
          {(taskName === '出厂测试' || taskName === '新建' || taskName === '平台验证') && (
            <>
              <Col span={8}>
                <Form.Item label="测试开始时间">
                  {getFieldDecorator('testStart', {
                    rules: [{ required, message: `请选择出厂测试开始时间` }],
                    initialValue: moment(formmap.get(taskName).testStart || undefined),
                  })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="测试结束时间">
                  {getFieldDecorator('testEnd', {
                    rules: [{ required, message: `请选择出厂测试结束时间` }],
                    initialValue: moment(formmap.get(taskName).testEnd || undefined),
                  })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="测试地点">
                  {getFieldDecorator('testPlace', {
                    rules: [{ required, message: `请输入出厂测试地点` }],
                    initialValue: formmap.get(taskName).testPlace,
                  })(<Input disabled={!isEdit} />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="参与测试单位" {...formuintLayout}>
                  {getFieldDecorator('testUnit', {
                    rules: [{ required, message: `请选择参与测试单位` }],
                    initialValue: formmap.get(taskName).testUnit && formmap.get(taskName).testUnit.length ? formmap.get(taskName).testUnit.split(',') : [],
                  })(
                    <Select placeholder="请选择" disabled={!isEdit} mode="multiple">
                      {testunitmap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="测试人员" {...formuintLayout}>
                  {getFieldDecorator('testOperator', {
                    rules: [{ required, message: `请输入测试人员` }],
                    initialValue: formmap.get(taskName).testOperator,
                  })(<TextArea autoSize disabled={!isEdit} />)}
                </Form.Item>
              </Col>
            </>
          )}
          {(taskName === '出厂测试' || taskName === '新建') && (
            <Col span={24}>
              <Form.Item label="受影响业务范围" {...formuintLayout}>
                {getFieldDecorator('influenceScope', {
                  rules: [{ required, message: `请填写受影响业务范围` }],
                  initialValue: info.releaseRegister.influenceScope,
                })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <TestingFacility
              title='测试环境'
              isEdit={isEdit}
              dataSource={info.releaseEnvs}
              ChangeValue={v => setFieldsValue({ releaseEnvs: v })}
            />
            <Form.Item wrapperCol={{ span: 24 }}>
              {getFieldDecorator('releaseEnvs', {
                rules: [{ required, message: '请选择测试环境' }, {
                  validator: handleListValidator
                }],
                initialValue: info.releaseEnvs,
              })(
                <></>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <EditeTable
              title='发布清单'
              functionmap={functionmap}
              modulamap={modulamap}
              isEdit={isEdit}
              taskName={taskName}
              dataSource={info.releaseLists}
              ChangeValue={v => { setFieldsValue({ releaseLists: v }); }}
              listmsg={listmsg}
            />
            <Form.Item wrapperCol={{ span: 24 }}>
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
          {(taskName === '平台验证') && (
            <>
              <Col span={24}>
                <Form.Item label='验证结果' {...forminladeLayout} labelAlign='left'>
                  {getFieldDecorator('validResult', {
                    rules: [{ required, message: '请选择验证结果' }],
                    initialValue: formmap.get(taskName).validResult || '通过',
                  })(<RadioGroup onChange={handleAdopt} disabled={!isEdit}>
                    <Radio value='通过'>通过</Radio>
                    <Radio value='不通过'>不通过</Radio>
                  </RadioGroup>
                  )}
                </Form.Item>
              </Col>
              {/* {adopt === '通过' ? (
                <Col span={24}>
                  <Form.Item label='验证意见' {...forminladeLayout} labelAlign='left'>
                    {getFieldDecorator('validComments', {
                      initialValue: formmap.get(taskName).validComments,
                    })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
                  </Form.Item>
                </Col>)
                :
                (<Col span={24}>
                  <Form.Item label='验证意见' {...forminladeLayout} labelAlign='left'>
                    {getFieldDecorator('validComments1', {
                      rules: [{ required, message: `请输入验证意见` }],
                      initialValue: formmap.get(taskName).validComments,
                    })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
                  </Form.Item>
                </Col>)} */}
            </>
          )}
          {taskName !== '业务验证' && (
            <Col span={24}>
              <Form.Item label={taskName === '新建' ? `出厂测试结论` : `${taskName}结论`} {...forminladeLayout} labelAlign='left'>
                {getFieldDecorator('testResult', {
                  rules: [{ required, message: taskName === '新建' ? `请填写出厂测试结论` : `请填写${taskName}结论` }],
                  initialValue: formmap.get(taskName).testResult,
                })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
              </Form.Item>
            </Col>
          )}
          <Col span={24} style={{ marginBottom: 24 }}>
            <DocumentAtt
              rowkey={statumap.get(taskName)}
              isEdit={isEdit}
              unitmap={docunitmap}
              dataSource={info && info.releaseAttaches && info.releaseAttaches.length > 0 ? info.releaseAttaches : Attaches}
              Unit={getFieldsValue(['dutyUnit'])}
              ChangeValue={(v, files) => changeatt(v, files)}
              check={check}
            />
            <Form.Item wrapperCol={{ span: 24 }} >
              {getFieldDecorator('releaseAttaches', {
                // rules: [{ required, message: '请上传附件' }, {
                //   validator: handleAttValidator
                // }],
                initialValue: info.releaseAttaches,
              })(<></>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            {info.releaseRegister && (
              <Form.Item label="登记人" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('registerUser', {
                  rules: [{ required, message: `请输入登记人` }],
                  initialValue: userinfo ? userinfo.userName : info.releaseRegister.registerUser,
                })(<Input disabled />)}
              </Form.Item>
            )}
            {info.platformValid && (
              <Form.Item label="登记人" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('registerUser', {
                  rules: [{ required, message: `请输入登记人` }],
                  initialValue: userinfo ? userinfo.userName : info.platformValid.register,
                })(<Input disabled />)}
              </Form.Item>
            )}
            {info.releaseBizValid && (
              <Form.Item label="登记人" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('registerUser', {
                  rules: [{ required, message: `请输入登记人` }],
                  initialValue: userinfo ? userinfo.userName : info.releaseBizValid.register,
                })(<Input disabled />)}
              </Form.Item>
            )}
            {/* <Form.Item label="登记人Id" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ display: 'none' }}>
              {getFieldDecorator('registerUserId', {
                rules: [{ required, message: `请输入登记人` }],
                initialValue: userinfo ? userinfo.userId : info.releaseRegister.userId,
              })(<Input disabled />)}
            </Form.Item> */}
          </Col>

          <Col span={8}>
            <Form.Item label="登记时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('registerTime', {
                rules: [{ required, message: `请选择登记时间` }],
                initialValue: moment(formmap.get(taskName).registerTime || undefined).format('YYYY-MM-DD HH:mm:ss'),
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记单位" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('registerUnit', {
                rules: [{ required, message: `请选择登记单位` }],
                initialValue: userinfo ? userinfo.unitName : formmap.get(taskName).registerUnit,
              })(<Input disabled />)}
            </Form.Item>
            {/* <Form.Item label="登记单位Id" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ display: 'none' }}>
              {getFieldDecorator('registerUnitId', {
                rules: [{ required, message: `请选择登记单位` }],
                initialValue: userinfo ? userinfo.unitId : info.releaseRegister.registerUnitId,
              })(<Input disabled />)}
            </Form.Item> */}
          </Col>
        </Form>
      </Row>
    </>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(Registrat))

WrappedForm.defaultProps = {
  info: {
    releaseMain: {
      releaseNo: '',
      releaseType: '',
      dutyUnit: '',
      releaseStatus: '',
      timeoutTime: undefined,
      remindTime: undefined,
      revisitWay: ''
    },
    releaseRegister: {
      testStart: undefined,
      testEnd: undefined,
      testPlace: '',
      testUnit: '',
      testOperator: '',
      influenceScope: '',
      testResult: ''
    },
  },
};

export default WrappedForm;