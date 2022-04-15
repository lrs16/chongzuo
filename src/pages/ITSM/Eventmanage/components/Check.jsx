import React, { useImperativeHandle, forwardRef, useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, DatePicker } from 'antd';
import SubmitContext from '@/layouts/MenuContext';
import SysUpload from '@/components/SysUpload';
import FormTextArea from '@/components/FormTextArea';

// const { TextArea } = Input;

const typemaps = new Map([
  ['001', '1'],
  ['002', '3'],
]);

const Check = forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, info, userinfo, files, ChangeFiles, loading } = props;
  const { check } = info;
  const { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue } = props.form;
  const [adopt, setAdopt] = useState('001');
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false });
  const { ChangeSubmitType, ChangeButtonName } = useContext(SubmitContext);
  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
      setFilesList({ ...fileslist, ischange: false });
    }
  }, [fileslist]);

  useEffect(() => {
    setFilesList({ ...fileslist, arr: files });
  }, [info]);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleAdopt = val => {
    setAdopt(val);
    if (val === '001') {
      ChangeSubmitType('1');
      ChangeButtonName('处理');
      sessionStorage.setItem('flowtype', '1');
    } else {
      ChangeSubmitType('3');
      ChangeButtonName('登记');
      sessionStorage.setItem('flowtype', '3');
    }
  };

  useEffect(() => {
    if (check) {
      sessionStorage.setItem('flowtype', typemaps.get(check.checkResult));
      handleAdopt(check.checkResult);
    } else {
      handleAdopt('001');
    }
  }, [info]);

  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={24}>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核表单id">
              {getFieldDecorator('check_id', {
                initialValue: check?.id || '',
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Form.Item label="审核结果" {...forminladeLayout}>
            {getFieldDecorator('check_checkResult', {
              rules: [{ required: true, message: '请选择审核结果' }],
              initialValue: check?.checkResult || '',
            })(
              <Radio.Group onChange={(e) => handleAdopt(e.target.value)}>
                <Radio value="001">通过</Radio>
                <Radio value="002">不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={24} style={{ marginBottom: '-10px' }}>
          {(adopt === '001' || !adopt) && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('content1', {
                initialValue: check?.content || '',
              })(<FormTextArea
                autoSize={1}
                indexText={check?.content || ''}
                isEdit
                getVal={v => setFieldsValue({ content1: v })}
              />)}
            </Form.Item>
          )}
          {adopt === '002' && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('content2', {
                rules: [{ required: true, message: '请输入审核意见' }],
                initialValue: check?.content || '',
              })(<FormTextArea
                autoSize={1}
                indexText={check?.content || ''}
                isEdit
                getVal={v => setFieldsValue({ content2: v })}
              />)}
            </Form.Item>
          )}
        </Col>
        <Col span={8} >
          <div onClick={e => e.stopPropagation()}>
            <Form.Item label="接单时间">
              {getFieldDecorator('check_addTime', {
                rules: [{ required: true }],
                initialValue: moment(check?.addTime || undefined).format("YYYY-MM-DD HH:mm:ss"),
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </div>
        </Col>
        <Col span={8}>
          <Form.Item label="审核时间">
            {getFieldDecorator('check_checkTime', {
              rules: [{ required: true }],
              initialValue: moment(check?.checkTime || undefined),
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
          // extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            <div>
              {!loading && (
                <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
              )}
            </div>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核人">
            {getFieldDecorator('check_checkUser', {
              rules: [{ required: true }],
              initialValue: userinfo.userName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="审核人ID">
            {getFieldDecorator('check_checkUserId', {
              rules: [{ required: true }],
              initialValue: userinfo.userId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核人单位">
            {getFieldDecorator('check_checkUnit', {
              rules: [{ required: true }],
              initialValue: userinfo.unitName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="审核人单位ID">
            {getFieldDecorator('check_checkUnitId', {
              rules: [{ required: true }],
              initialValue: userinfo.unitId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核人部门">
            {getFieldDecorator('check_checkDept', {
              rules: [{ required: true }],
              initialValue: userinfo.deptName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="审核人部门ID">
            {getFieldDecorator('check_checkDeptId', {
              rules: [{ required: true }],
              initialValue: userinfo.deptId,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
      </Form>
    </Row >
  );
});

export default Form.create({})(Check);
