import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Alert, DatePicker, Select, Radio, message } from 'antd';
import SubmitTypeContext from '@/layouts/MenuContext';
import FormTextArea from '@/components/FormTextArea';
import EditeTable from './EditeTable';
import TestingFacility from './TestingFacility';
import DocumentAtt from './NewDocAtt';
import { saveVersion } from '../services/api';

// const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

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
  const [testResultText, setTestResultText] = useState({ show: false, text: '' });
  // const [adopt, setAdopt] = useState('通过');
  const { ChangeSubmitType, ChangeButtype, location } = useContext(SubmitTypeContext);

  const formmap = new Map([
    ['新建', info.releaseRegister],
    ['出厂测试', info.releaseRegister],
    ['平台验证', info.platformValid],
    ['业务验证', info.releaseBizValid],
  ]);

  // 校验测试环境
  const handleListValidator = (rule, value, callback) => {
    if (value === '' || value.length === 0) {
      callback()
    }
    callback()
  }


  // 校验发布清单
  const releaseListsValidator = (rule, value, callback) => {
    if (!value || value.length === 0) {
      callback()
    } if (isEdit) {
      let target = []
      if (taskName === '新建' || taskName === '出厂测试') {
        target = value.filter(item => !item.module || !item.abilityType || !item.appName || !item.problemType || !item.testMenu || !item.testResult || !item.testStep || !item.developer || !item.responsible || !item.passTest);
        if (target.length > 0) {
          setCheck(true);
          callback(`请填写完整的发布清单信息`);
        } else {
          callback()
        }
      } else {
        target = value.filter(item => !item.platformValidator || !item.passTest);
        const backmsg = new Map([
          ['平台验证', '发布清单平台验证人不能为空'],
          ['业务验证', '发布清单还未全部验证']
        ])
        if (target.length > 0) {
          setCheck(true);
          callback(backmsg.get(taskName) || `请填写完整的发布清单信息`);
        } else {
          callback()
        }
      };
    } else {
      callback()
    }
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
      setCheck(false);      // 旧需求:校验文档必填
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
    };
    if (info) {
      const v = info.releaseLists;
      if (info.releaseLists
        && info.releaseLists.length
        && info.releaseLists.length > 0
        && (taskName === '出厂测试' || taskName === '平台验证')
      ) {
        if (!formmap.get(taskName).testResult) {
          const passTotal = v.filter(item => item.passTest === '通过')?.length;
          const noPassTotal = v.filter(item => item.passTest === '不通过')?.length;
          setFieldsValue({ testResult: `总功能共${v.length}项，通过${passTotal}项，不通过${noPassTotal}项。` });
          setTestResultText({ show: true, text: `总功能共${v.length}项，通过${passTotal}项，不通过${noPassTotal}项。` })
        } else {
          setTestResultText({ show: true, text: formmap.get(taskName).testResult })
        }
      };
      if (taskName === '新建') {
        setFieldsValue({ testResult: `总功能共0项，通过0项，不通过0项。` });
        setTestResultText({ show: true, text: `总功能共0项，通过0项，不通过0项。` })
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
  }, [timeoutinfo]);

  const VersionChange = (versionNo, releaseNo) => {
    if (!versionNo) {
      message.error('版本号不能为空')
    } else {
      saveVersion({ versionNo, releaseNo }).then(res => {
        if (res.code !== 200) {
          message.error(res.msg)
        } else {
          message.success(res.msg)
        }
      })
    }
  }

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

  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i += 1) {
      result.push(i);
    }
    return result;
  }

  return (
    <>
      {alertvisible && (<Alert message={alertmessage.mes} type='warning' showIcon style={{ marginBottom: 6 }} />)}
      <Row gutter={12}>
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
                    initialValue: info.releaseMain.releaseType || '计划发布',
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
          {taskName === '平台验证' && (
            <Col span={8}>
              <Form.Item label='版本号' labelAlign='right'>
                {getFieldDecorator('versionNo', {
                  rules: [{ required, message: `版本号不能为空` }],
                  initialValue: info.versionNo,
                })(
                  < Input onChange={(e) => VersionChange(e.target.value, info.releaseNo)} disabled={!isEdit} />
                )}
              </Form.Item>
            </Col>
          )}
          {(taskName === '出厂测试' || taskName === '新建' || taskName === '平台验证') && (
            <>
              <Col span={8}>
                <div id='StartTime' onClick={e => e.stopPropagation()}>
                  <Form.Item label="测试开始时间">
                    {getFieldDecorator('testStart', {
                      rules: [{ required, message: `请选择出厂测试开始时间` }],
                      initialValue: moment(formmap.get(taskName).testStart || undefined),
                    })(<DatePicker
                      showTime
                      placeholder="请选择时间"
                      format="YYYY-MM-DD HH:mm:ss"
                      disabled={!isEdit}
                      style={{ width: '100%' }}
                      allowClear={false}
                      disabledDate={(v) => {
                        return getFieldsValue(['testEnd'])?.testEnd && v && moment(v) > moment(getFieldsValue(['testEnd'])?.testEnd);
                      }}
                      disabledTime={() => {
                        const time = getFieldsValue(['testEnd', 'testStart']);
                        const Hours = moment(time.testEnd).format('HH');
                        const Minutes = moment(time.testEnd).format('mm');
                        const Seconds = moment(time.testEnd).format('ss');
                        if (time.testStart && time.testEnd && moment(time.testStart).format('YYYY-MM-DD') === moment(time.testEnd).format('YYYY-MM-DD')) {
                          return {
                            disabledHours: () => range(Hours, 24),
                            disabledMinutes: () => {
                              if (moment(time.testStart).format('YYYY-MM-DD HH') === moment(time.testEnd).format('YYYY-MM-DD HH')) {
                                return range(Minutes, 60)
                              }
                              return []
                            },
                            disabledSeconds: () => {
                              if (moment(time.testStart).format('YYYY-MM-DD HH:mm') === moment(time.testEnd).format('YYYY-MM-DD HH:mm')) {
                                return range(Seconds, 60)
                              }
                              return []
                            },
                          };
                        }
                        return null
                      }}
                    />)}
                  </Form.Item>
                </div>
              </Col>
              <Col span={8}>
                <div id='EendTime' onClick={e => e.stopPropagation()}>
                  <Form.Item label="测试结束时间">
                    {getFieldDecorator('testEnd', {
                      rules: [{ required, message: `请选择出厂测试结束时间` }],
                      initialValue: moment(formmap.get(taskName).testEnd || undefined),
                    })(<DatePicker
                      showTime
                      placeholder="请选择时间"
                      format="YYYY-MM-DD HH:mm:ss"
                      disabled={!isEdit}
                      style={{ width: '100%' }}
                      allowClear={false}
                      disabledDate={(v) => {
                        return getFieldsValue(['testStart'])?.testStart && v && moment(v) < moment(getFieldsValue(['testStart'])?.testStart);
                      }}
                      disabledTime={() => {
                        const time = getFieldsValue(['testEnd', 'testStart']);
                        const Hours = moment(time.testStart).format('HH');
                        const Minutes = moment(time.testStart).format('mm');
                        const Seconds = moment(time.testStart).format('ss');
                        if (time.testStart && time.testEnd && moment(time.testStart).format('YYYY-MM-DD') === moment(time.testEnd).format('YYYY-MM-DD')) {
                          return {
                            disabledHours: () => range(0, Hours),
                            disabledMinutes: () => {
                              if (moment(time.testStart).format('YYYY-MM-DD HH') === moment(time.testEnd).format('YYYY-MM-DD HH')) {
                                return range(0, Minutes)
                              }
                              return []
                            },
                            disabledSeconds: () => {
                              if (moment(time.testStart).format('YYYY-MM-DD HH:mm') === moment(time.testEnd).format('YYYY-MM-DD HH:mm')) {
                                return range(0, Seconds)
                              }
                              return []
                            },
                          };
                        }
                        return null
                      }}
                    />)}
                  </Form.Item>
                </div>
              </Col>
              <Col span={24}>
                <Form.Item label="测试地点" {...formuintLayout}>
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
              <Col span={24} style={{ marginTop: 4, marginBottom: '-6px' }}>
                <Form.Item label="测试人员" {...formuintLayout}>
                  {getFieldDecorator('testOperator', {
                    rules: [{ required, message: `请输入测试人员` }],
                    initialValue: formmap.get(taskName).testOperator,
                  })(
                    <FormTextArea
                      autoSize={1}
                      indexText={formmap.get(taskName).testOperator}
                      isEdit={isEdit}
                      getVal={v => setFieldsValue({ testOperator: v })}
                    />
                  )}
                </Form.Item>
              </Col>
            </>
          )}
          {(taskName === '出厂测试' || taskName === '新建') && (
            <Col span={24} style={{ marginBottom: '-6px' }}>
              <Form.Item label="受影响业务范围" {...formuintLayout}>
                {getFieldDecorator('influenceScope', {
                  rules: [{ required, message: `请填写受影响业务范围` }],
                  initialValue: info.releaseRegister.influenceScope,
                })(
                  // <TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />
                  <FormTextArea
                    autoSize={1}
                    indexText={info.releaseRegister.influenceScope}
                    isEdit={isEdit}
                    getVal={v => setFieldsValue({ influenceScope: v })}
                  />
                )}
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
            <Form.Item wrapperCol={{ span: 24 }} extra='双击行编辑表格信息，整行信息填写完整鼠标移开保存信息'>
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
              isEdit={taskName !== '业务验证' && isEdit}
              taskName={taskName}
              dataSource={info.releaseLists}
              ChangeValue={v => {
                const Text = getFieldsValue(['testResult']);
                const text1 = Text?.testResult?.indexOf('总功能共');
                const text2 = Text?.testResult?.indexOf('项，通过');
                const text3 = Text?.testResult?.indexOf('项，不通过');
                const text4 = Text?.testResult?.indexOf('项。');
                if ((taskName === '新建' || taskName === '平台验证' || taskName === '出厂测试') && text1 > -1 && text2 > -1 && text3 > -1 && text4 > -1) {
                  setTestResultText(false);
                  const passTotal = v.filter(item => item.passTest === '通过')?.length;
                  const noPassTotal = v.filter(item => item.passTest === '不通过')?.length;
                  const index = Text?.testResult?.indexOf('项。');
                  const afterStr = Text?.testResult?.substr(index + 2, Text?.testResult?.length) || '';
                  setFieldsValue({ releaseLists: v, testResult: `总功能共${v.length}项，通过${passTotal}项，不通过${noPassTotal}项。${afterStr}` });
                  setTimeout(() => { setTestResultText({ show: true, text: `总功能共${v.length}项，通过${passTotal}项，不通过${noPassTotal}项。${afterStr}` }) }, 50)
                } else {
                  setFieldsValue({ releaseLists: v });
                }
              }}
              listmsg={listmsg}
            />
            <Form.Item wrapperCol={{ span: 24 }}>
              {getFieldDecorator('releaseLists', {
                rules: [{ required, message: '请填写发布清单' }, {
                  validator: releaseListsValidator
                }],
                initialValue: info.releaseLists,
              })(
                <></>
              )}
            </Form.Item>
          </Col>
          {(taskName === '平台验证 ') && (
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
          {taskName !== '业务验证' && testResultText.show && (
            <Col span={24}>
              <Form.Item
                label={taskName === '新建' ? `出厂测试结论` : `${taskName}结论`}
                {...forminladeLayout}
                labelAlign='left'
              >
                {getFieldDecorator('testResult', {
                  rules: [{ required, message: taskName === '新建' ? `请填写出厂测试结论` : `请填写${taskName}结论` }],
                  initialValue: testResultText.text,
                })(
                  <FormTextArea
                    autoSize={1}
                    indexText={testResultText.text}
                    isEdit={isEdit}
                    getVal={v => {
                      if (v) {
                        setFieldsValue({ testResult: v });
                      } else {
                        const val = getFieldsValue(['releaseLists'])?.releaseLists;
                        setTestResultText(false);
                        const passTotal = val.filter(item => item.passTest === '通过')?.length;
                        const noPassTotal = val.filter(item => item.passTest === '不通过')?.length;
                        setFieldsValue({ testResult: `总功能共${val.length}项，通过${passTotal}项，不通过${noPassTotal}项。` });
                        setTimeout(() => { setTestResultText({ show: true, text: `总功能共${val.length}项，通过${passTotal}项，不通过${noPassTotal}项。` }) }, 50)
                      }
                    }}
                  />
                )}
              </Form.Item>
            </Col>
          )}
          <Col span={24} style={{ marginBottom: 16, marginTop: 4 }}>
            {((location && location.state && !location.state.cache && isEdit) || !isEdit) && (
              <DocumentAtt
                // rowkey={statumap.get(taskName)}
                isEdit={isEdit}
                unitmap={docunitmap}
                dataSource={info.releaseAttaches}
                Unit={getFieldsValue(['dutyUnit'])}
                ChangeValue={(v, files) => changeatt(v, files)}
                check={check}
                taskName={taskName}
              />
            )}
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