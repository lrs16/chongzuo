import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, DatePicker, Select, Radio, Alert } from 'antd';
import SubmitTypeContext from '@/layouts/MenuContext';
import DocumentAtt from './DocumentAtt';
import BusinessEditTable from './BusinessEditTable';

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
    sm: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 22 },
  },
};

function Implementation(props, ref) {
  const { taskName, userinfo, register, selectdata, isEdit, info } = props;
  const { getFieldDecorator, setFieldsValue, getFieldsValue, resetFields } = props.form;
  const required = true;
  const [alertvisible, setAlertVisible] = useState(false);  // 超时告警是否显示
  const [check, setCheck] = useState(false);
  const { ChangeSubmitType, ChangeButtype } = useContext(SubmitTypeContext);

  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const changeatt = (v, files) => {
    setFieldsValue({ releaseAttaches: v });
    const target = v.filter(item => item.key === '8')[0];
    if (target && target.attachFile !== '[]') {
      setCheck(false);
    };
    if (files === 'files') {
      ChangeButtype('save')
    };
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

  useEffect(() => {
    if (isEdit && (moment(register.creationTime).format('DD') > 20 || moment(register.creationTime).format('DD') < 15)) {
      setAlertVisible(true);
    };
  }, [register])

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const unitmap = getTypebyId('1384056290929545218');       // 责任单位
  return (
    <>
      {alertvisible && (<Alert
        message={`${taskName}超时,${taskName}时间在每月15日至20日之间`}
        type='warning'
        showIcon style={{ marginBottom: 12 }}
      />)}
      <Row gutter={12} >
        <Form ref={formRef} {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="发布实施时间" >
              {getFieldDecorator('practiceTime', {
                rules: [{ required, message: `请选择发布实施时间` }],
                initialValue: moment(info.practiceDone.practiceTime || undefined),
              })(
                <DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} />
              )}
            </Form.Item>
          </Col>
          {/* <Col span={8} >
            <Form.Item label="发布结果">
              {getFieldDecorator('form2', {
                rules: [{ required, message: `请选择发布结果` }],
                initialValue: '001',
              })(
                <Select placeholder="请选择" disabled={!isEdit}>
                  {resultmap.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item label="发布实施人" {...formuintLayout}>
              {getFieldDecorator('practicer', {
                rules: [{ required, message: `请输入发布实施人员名` }],
                initialValue: info.practiceDone.practicer || '',
              })(<TextArea autoSize disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="实施情况说明" {...formuintLayout}>
              {getFieldDecorator('doneDesc', {
                initialValue: info.practiceDone.doneDesc || '',
              })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="遗留问题说明" {...formuintLayout}>
              {getFieldDecorator('legacyDesc', {
                initialValue: info.practiceDone.legacyDesc || '',
              })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <BusinessEditTable
              title='发布清单'
              type='发布实施'
              dataSource={info.releaseLists || []}
              ChangeValue={v => { setFieldsValue({ releaseLists: v }); }}
              scroll={{ x: 1740 }}
            />
            <Form.Item wrapperCol={{ span: 24 }}>
              {getFieldDecorator('releaseLists', {
                initialValue: info.releaseLists,
              })(<></>)}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: 24 }}>
            <DocumentAtt
              rowkey='8'
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
        </Form>
      </Row>
    </>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(Implementation));
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
export default WrappedForm;