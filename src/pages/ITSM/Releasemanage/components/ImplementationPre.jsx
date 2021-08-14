import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Alert, DatePicker, Select, Radio, Divider } from 'antd';
import SubmitTypeContext from '@/layouts/MenuContext';
import EditeTable from './EditeTable';
import DocumentAtt from './DocumentAtt';
import ImplementationEditTalbe from './ImplementationEditTalbe';
import Implementationsteps from './Implementationsteps';

const { TextArea } = Input;
const { Option } = Select;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 9 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 15 },
//   },
// };

const forminladeLayout = {
  labelCol: {
    sm: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 24 },
  },
};

const implementequipment = [
  { key: 'deviceName', title: '系统（设备）名称' },
  { key: 'ipAddr', title: 'IP地址' },
  { key: 'useFor', title: '用途' },
  { key: 'director', title: '负责人' },
  { key: 'remarks', title: '备注' },
];
const implementequipmentnew = { deviceName: '', ipAddr: '', useFor: '', director: '', remarks: '无' };

const inplementers = [
  { key: 'roles', title: '角色' },
  { key: 'duty', title: '职责' },
  { key: 'contacts', title: '联系人' },
  { key: 'tel', title: '联系方式' },
];
const inplementersnew = { roles: '', duty: '', contacts: '', tel: '' }

const inplementrisk = [
  { key: 'riskAnaly', title: '主要风险分析' },
  { key: 'resolve', title: '应对措施' },
  { key: 'remarks', title: '备注' },
];
const inplementrisknew = { riskAnaly: '', resolve: '', remarks: '无' };

function ImplementationPre(props, ref) {
  const { taskName, userinfo, selectdata, isEdit, info } = props;
  const { getFieldDecorator, setFieldsValue, getFieldsValue, resetFields } = props.form;
  const [check, setCheck] = useState(false);
  const [stopVisit, setStopVisit] = useState('否');
  const { ChangeButtype } = useContext(SubmitTypeContext);
  const required = true;

  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleStopVisit = (e) => {
    setStopVisit(e.target.value)
  }

  // 发布清单，实施涉及系统（设备），实施人员，主要风险分析与应对措施
  const handleListValidator = (rule, value, callback) => {
    if (value === '' || value.length === 0) {
      callback()
    }
    callback()
  }

  // 实施步骤验证
  const practiceStepsValidator = (rule, value, callback) => {
    if (value) {
      const target1 = value.filter(item => item.stepType === '实施前准备');
      const target2 = value.filter(item => item.stepType === '实施过程');
      const target3 = value.filter(item => item.stepType === '实施后');
      if (target1.length === 0 || target2.length === 0 || target3.length === 0) {
        callback('请填写实施步骤')
      } else {
        callback()
      }
    }
    callback()
  }

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  useEffect(() => {
    if (info && info.practicePre) {
      setStopVisit(info.practicePre.bizStopVisit)
    }
  }, [info])


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
    const key = '5';
    const target = v.filter(item => item.key === key)[0];
    if (target && target.attachFile !== '[]') {
      setCheck(false);
    };
    if (files === 'files') {
      ChangeButtype('save')
    };
  }

  const unitmap = getTypebyId('1384056290929545218');       // 责任单位
  const functionmap = getTypebyId('1384052503909240833');   // 功能类型
  const modulamap = getTypebyId('1384430921586839554');  // 模块

  return (
    <Row gutter={12}>
      <Form ref={formRef}>
        <Col span={24}>
          <Form.Item label="总述" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('summary', {
              rules: [{ required, message: `请填写总述` }],
              initialValue: info.practicePre ? info.practicePre.summary : '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <ImplementationEditTalbe
            title='实施涉及系统（设备）'
            isEdit={isEdit}
            tablecolumns={implementequipment}
            newkeys={implementequipmentnew}
            dataSource={info && info.practiceDevices ? info.practiceDevices : []}
            ChangeValue={v => { setFieldsValue({ practiceDevices: v }); }}
          />
          <Form.Item wrapperCol={{ span: 24 }} extra="点击行编辑表格信息，整行信息填写完整鼠标移开保存信息">
            {getFieldDecorator('practiceDevices', {
              rules: [{ required, message: '请填写实施涉及系统（设备）' }, {
                validator: handleListValidator
              }],
              initialValue: info.practiceDevices,
            })(<></>)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="系统（设备）运行方式调整" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('adjustRunMode', {
              rules: [{ required, message: `请填写系统（设备）运行方式调整` }],
              initialValue: info.practicePre ? info.practicePre.adjustRunMode : '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="涉级功能模块" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('appModule', {
              rules: [{ required, message: `请填写涉级功能模块` }],
              initialValue: info.practicePre ? info.practicePre.appModule : '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <ImplementationEditTalbe
            title='实施人员'
            isEdit={isEdit}
            tablecolumns={inplementers}
            newkeys={inplementersnew}
            dataSource={info.practicePersonList ? info.practicePersonList : []}
            ChangeValue={v => { setFieldsValue({ practicePersonList: v }); }}
          />
          <Form.Item wrapperCol={{ span: 24 }} extra="点击行编辑表格信息，整行信息填写完整鼠标移开保存信息">
            {getFieldDecorator('practicePersonList', {
              rules: [{ required, message: '请填写实施人员信息' }, {
                validator: handleListValidator
              }],
              initialValue: info.practicePersonList,
            })(<></>)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginTop: 24 }}>
          <Form.Item label="实施计划开始时间">
            {getFieldDecorator('beginPlanTime', {
              rules: [{ required, message: `请选择实施计划开始时间` }],
              initialValue: moment(info.practicePre && info.practicePre.beginPlanTime ? info.practicePre.beginPlanTime : undefined),
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginTop: 24 }}>
          <Form.Item label="实施计划结束时间" >
            {getFieldDecorator('endPlanTime', {
              rules: [{ required, message: `请选择实施计划结束时间` }],
              initialValue: moment(info.practicePre && info.practicePre.endPlanTime ? info.practicePre.endPlanTime : undefined),
            })(
              <DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} style={{ width: '100%' }} />
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="影响业务范围" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('affectBiz', {
              rules: [{ required, message: `请填写影响范围` }],
              initialValue: info.practicePre ? info.practicePre.affectBiz : '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="影响用户范围" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('affectUser', {
              rules: [{ required, message: `请填写影响范围` }],
              initialValue: info.practicePre ? info.practicePre.affectUser : '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="停止业务访问" >
            {getFieldDecorator('bizStopVisit', {
              rules: [{ required, message: `请选择实停止业务访问` }],
              initialValue: info.practicePre ? info.practicePre.bizStopVisit : '否',
            })(
              <RadioGroup disabled={!isEdit} onChange={handleStopVisit}>
                <Radio value='是'>是</Radio>
                <Radio value='否'>否</Radio>
              </RadioGroup>
            )}
          </Form.Item>
        </Col>
        {stopVisit === '是' && (
          <>
            <Col span={8}>
              <Form.Item label="中断开始时间" >
                {getFieldDecorator('bizStopBegin', {
                  rules: [{ required, message: `请选择中断开始时间` }],
                  initialValue: moment(info.practicePre && info.practicePre.bizStopBegin ? info.practicePre.bizStopBegin : undefined),
                })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="中断结束时间">
                {getFieldDecorator('bizStopEnd', {
                  rules: [{ required, message: `请选择中断结束时间` }],
                  initialValue: moment(info.practicePre && info.practicePre.bizStopEnd ? info.practicePre.bizStopEnd : undefined),
                })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={24}>
          <Form.Item label="数据同步影响情况" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('syncData', {
              rules: [{ required, message: `请填写数据同步影响情况` }],
              initialValue: info.practicePre ? info.practicePre.syncData : '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Implementationsteps
            title='实施步骤'
            isEdit={isEdit}
            dataSource={info.practiceSteps ? info.practiceSteps : []}
            ChangeValue={v => { setFieldsValue({ practiceSteps: v }); }}
          />
          <Form.Item wrapperCol={{ span: 24 }}>
            {getFieldDecorator('practiceSteps', {
              rules: [{ required, message: '请填写实施步骤' }, {
                validator: practiceStepsValidator
              }],
              initialValue: info.practiceSteps,
            })(<></>)}
          </Form.Item>
        </Col>
        <Col span={24} style={{ marginTop: 24 }}>
          <ImplementationEditTalbe
            title='主要风险分析与应对措施'
            isEdit={isEdit}
            tablecolumns={inplementrisk}
            newkeys={inplementrisknew}
            dataSource={info.practiceRisks ? info.practiceRisks : []}
            ChangeValue={v => { setFieldsValue({ practiceRisks: v }); }}
          />
          <Form.Item wrapperCol={{ span: 24 }} extra="点击行编辑表格信息，整行信息填写完整鼠标移开保存信息">
            {getFieldDecorator('practiceRisks', {
              rules: [{ required, message: '请填写主要风险分析与应对措施' }, {
                validator: handleListValidator
              }],
              initialValue: info.practiceRisks,
            })(<></>)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="特殊要求" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('specialRequest', {
              initialValue: info.practicePre ? info.practicePre.specialRequest : '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="回退方案" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('rollbackPaln', {
              rules: [{ required, message: `请填写回退方案` }],
              initialValue: info.practicePre ? info.practicePre.rollbackPaln : '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <EditeTable
            title='功能验证表'
            functionmap={functionmap}
            modulamap={modulamap}
            isEdit={false}
            taskName={taskName}
            dataSource={info.releaseLists}
            ChangeValue={v => { setFieldsValue({ releaseLists: v }); }}
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
        <Col span={24}>
          <Form.Item label="系统平台检查" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('platformCheck', {
              rules: [{ required, message: `请填写系统平台检查` }],
              initialValue: info.practicePre ? info.practicePre.platformCheck : '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24} style={{ marginBottom: 24 }}>
          <DocumentAtt
            rowkey='5'
            isEdit={isEdit}
            unitmap={unitmap}
            dataSource={info && info.releaseAttaches ? info.releaseAttaches : []}
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
          <Form.Item label="登记人" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('registerUser', {
              rules: [{ required, message: `请输入登记人` }],
              initialValue: userinfo ? userinfo.userName : '',
            })(<Input disabled />)}
          </Form.Item>
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
              initialValue: moment(info.practicePre ? info.practicePre.registerTime : undefined).format('YYYY-MM-DD HH:mm:ss'),
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记单位" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('registerUnit', {
              rules: [{ required, message: `请选择登记单位` }],
              initialValue: userinfo ? userinfo.unitName : '',
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
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(ImplementationPre));

WrappedForm.defaultProps = {
  register: {
    form4: undefined,
    form5: undefined,
    form6: '001',
    form60: `影响业务范围：\n\n影响用户范围：`,
    form7: undefined,
    form8: undefined,
  }
};
export default WrappedForm;