import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, DatePicker } from 'antd';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;

const nextsmap = new Map([
  ['001', '处理'],
  ['002', '确认'],
]);

const typemaps = new Map([
  ['001', '1'],
  ['002', '3'],
]);

const Check = forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, info, userinfo, location, files, ChangeFiles, loading } = props;
  const { taskName, taskId, mainId, orderNo } = location.query;
  const { check } = info;
  const { getFieldDecorator, getFieldsValue, resetFields } = props.form;
  const [adopt, setAdopt] = useState('001');
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false });
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

  const routerRefresh = () => {
    router.push({
      pathname: location.pathname,
      query: {
        taskName,
        taskId,
        mainId,
        next: sessionStorage.getItem('Nextflowmane'),
        orderNo,
      },
    });
  };

  useEffect(() => {
    if (check !== undefined) {
      sessionStorage.setItem('Nextflowmane', nextsmap.get(check.checkResult));
      sessionStorage.setItem('flowtype', typemaps.get(check.checkResult));
      setAdopt(check.checkResult);
    }
    routerRefresh();
  }, [info]);

  const handleAdopt = e => {
    setAdopt(e.target.value);
    if (e.target.value === '001') {
      //  ChangeFlowtype('1');
      sessionStorage.setItem('Nextflowmane', '处理');
      sessionStorage.setItem('flowtype', '1');
    } else {
      //  ChangeFlowtype('3');
      sessionStorage.setItem('Nextflowmane', '确认');
      sessionStorage.setItem('flowtype', '3');
    }
    routerRefresh();
  };

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={24}>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核表单id">
              {getFieldDecorator('check_id', {
                initialValue: check.id,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Form.Item label="审核结果" {...forminladeLayout}>
            {getFieldDecorator('check_checkResult', {
              rules: [{ required: true, message: '请选择审核结果' }],
              initialValue: check.checkResult,
            })(
              <Radio.Group onChange={handleAdopt}>
                <Radio value="001">通过</Radio>
                <Radio value="002">不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          {adopt === '001' && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('content1', {
                initialValue: check.content,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
          {adopt === '002' && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('content2', {
                rules: [{ required: true, message: '请输入审核意见' }],
                initialValue: check.content,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
        </Col>
        <Col span={8}>
          <Form.Item label="接单时间">
            {getFieldDecorator('check_addTime', {
              rules: [{ required: true }],
              initialValue: check.addTime,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核时间">
            {getFieldDecorator('check_checkTime', {
              rules: [{ required: true }],
              initialValue: moment(check.checkTime),
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
          // extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            <div style={{ width: '50%' }}>
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
    </Row>
  );
});

Check.defaultProps = {
  info: {
    check: {
      checkResult: '001',
      content: '',
      addTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      checkTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      id: '',
    },
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

export default Form.create({})(Check);
