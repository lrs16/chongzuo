import React, { useRef, useImperativeHandle, forwardRef, useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, DatePicker, Select, Radio } from 'antd';
import SubmitTypeContext from '@/layouts/MenuContext';
import DocumentAtt from './NewDocAtt';

const { TextArea } = Input;
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
const formuintLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const taskmap = new Map([
  ['开发商项目经理审核', '出厂测试结论'],
  ['系统运维商经理审核', '平台验证结论'],
]);

function Examine(props, ref) {
  const { dispatch, taskName, userinfo, selectdata, isEdit, info, listmsg, timeoutinfo } = props;
  const { getFieldDecorator, setFieldsValue, getFieldsValue, resetFields } = props.form;
  const [adopt, setAdopt] = useState('通过');

  const { ChangeSubmitType, ChangeButtype, releaseType } = useContext(SubmitTypeContext);

  const formmap = new Map([
    ['开发商项目经理审核', info.devmanageCheck],
    ['系统运维商经理审核', info.devopsCheck],
  ]);

  const required = true;
  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  // 选择通过不通过改变流转类型
  const handleAdopt = value => {
    setAdopt(value);
    if (value === '通过' && isEdit) {
      ChangeSubmitType(1)
    };
    if (value === '不通过' && isEdit) {
      ChangeSubmitType(taskName === '开发商项目经理审核' ? 0 : 3)
    }
  };

  const changeatt = (v, files) => {
    setFieldsValue({ releaseAttaches: v });
    if (files === 'files') {
      ChangeButtype('save')
    };
  };

  useEffect(() => {
    if (info && formmap.get(taskName) && formmap.get(taskName).checkResult) {
      handleAdopt(formmap.get(taskName).checkResult);
    }
  }, [info]);

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const docunitmap = getTypebyId(1289);       // 出具文档单位

  return (
    <Row gutter={12}>
      <Form ref={formRef} {...formItemLayout}>
        <Col span={24}>
          <Form.Item label='审核结果' {...formuintLayout}>
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
        <Col span={24}>
          <Form.Item label={taskName === '开发商项目经理审核' ? '出厂测试结论' : '审核说明'} {...formuintLayout}>
            {getFieldDecorator('testResult', {
              rules: [{ required, message: `请输入${taskName === '开发商项目经理审核' ? '出厂测试' : '审核说明'}` }],
              initialValue: formmap.get(taskName).testResult,
            })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('checkTime', {
              rules: [{ required, message: `请选择审核时间` }],
              initialValue: moment(formmap.get(taskName).checkTime || undefined).format('YYYY-MM-DD HH:mm:ss'),
            })(
              <><DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                defaultValue={moment(formmap.get(taskName).checkTime || undefined)}
                onChange={(v) => { setFieldsValue({ checkTime: moment(v) }) }}
                disabled={!isEdit}
              /></>
            )}
          </Form.Item>
        </Col>
        <Col span={24} style={{ marginBottom: 16, marginTop: 4 }}>
          <DocumentAtt
            // rowkey={statumap.get(taskName)}
            isEdit={isEdit}
            unitmap={docunitmap}
            dataSource={info.releaseAttaches}
            Unit={getFieldsValue(['dutyUnit'])}
            ChangeValue={(v, files) => changeatt(v, files)}
            check={false}
            taskName={taskName}
          />
          <Form.Item wrapperCol={{ span: 24 }} >
            {getFieldDecorator('releaseAttaches', {
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
          <Form.Item label="审核单位" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('checkUnit', {
              rules: [{ required, message: `请选择审批单位` }],
              initialValue: userinfo ? userinfo.unitName : formmap.get(taskName).checkUnit,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
const WrappedForm = Form.create({ name: 'form' })(forwardRef(Examine));
export default WrappedForm;