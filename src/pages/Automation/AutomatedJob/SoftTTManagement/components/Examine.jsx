import React, { useState, useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, DatePicker } from 'antd';
import SysUpload from '@/components/SysUpload/Upload';
import FilesContext from '@/layouts/MenuContext';

const { TextArea } = Input;

const formallItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
};
const formItemLayout = {
  labelCol: {
    xs: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 22 },
  },
};

const Examine = forwardRef((props, ref) => {
  const {
    userinfo, check, Noediting,
    form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue },
  } = props;

  const { location } = useContext(FilesContext);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [adopt, setAdopt] = useState('0');
  const [files, setFiles] = useState([]);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleAdopt = e => {
    setAdopt(e.target.value);
  }

  useEffect(() => {
    if (check !== undefined) {
      setAdopt(check.examineStatus);
    }
  }, [check]);

  const handleAttValidator = (rule, value, callback) => {
    if (value === '') {
      callback()
    }
    callback()
  };

  return (
    <div style={{ marginRight: 24, marginTop: 24 }}>
      <Row gutter={24}>
        <Form {...formallItemLayout}>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核表单id">
              {getFieldDecorator('id', {
                initialValue: check.id,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="审核结果">
              {getFieldDecorator('examineStatus', {
                rules: [{ required: true, message: '请选择审核结果' }],
                initialValue: check.examineStatus || '0',
              })(
                <Radio.Group onChange={handleAdopt} disabled={Noediting}>
                  <Radio value="1">通过</Radio>
                  <Radio value="0">不通过</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间">
              {getFieldDecorator('examineTime', {
                rules: [{ required: true }],
                initialValue: moment(check.examineTime),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={Noediting} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            {adopt === '1' && (
              <Form.Item label="审核说明" {...formItemLayout}>
                {getFieldDecorator('examineRemarks', {
                  initialValue: check.examineRemarks,
                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" disabled={Noediting} />)}
              </Form.Item>
            )}
            {adopt === '0' && (
              <Form.Item label="审核说明" {...formItemLayout}>
                {getFieldDecorator('examineRemarks', {
                  rules: [{ required: true, message: '请输入审核说明' }],
                  initialValue: check.examineRemarks,
                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" disabled={Noediting} />)}
              </Form.Item>
            )}
          </Col>
          <Col span={24} >
            <Form.Item label="上传附件" {...formItemLayout}
            >{getFieldDecorator('examineFiles', {
              rules: [{ required: true, message: '请上传附件' }, {
                validator: handleAttValidator
              }],
              initialValue: check && check.examineFiles && check.examineFiles !== '[]' && Array.isArray(check.examineFiles) ? check.examineFiles : '',
            })( // 位置已调
              <div>
                {
                  location && (!location.state || (location.state && !location.state.cache)) && (
                    <FilesContext.Provider value={{
                      files: check && check.examineFiles && Array.isArray(check.examineFiles) ? JSON.parse(check.examineFiles) : files,
                      ChangeFiles: (v => { setFieldsValue({ examineFiles: JSON.stringify(v) }); setFiles(v); }),
                      getUploadStatus: (v) => { setUploadStatus(v) },
                    }}>
                      <SysUpload banOpenFileDialog={uploadStatus} />
                    </FilesContext.Provider>
                  )
                }
              </div>
            )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人">
              {getFieldDecorator('examineByName', {
                rules: [{ required: true }],
                initialValue: userinfo.userName ? userinfo.userName : check.examineBy,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人ID">
              {getFieldDecorator('examineBy', {
                rules: [{ required: true }],
                initialValue: userinfo.userId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人单位">
              {getFieldDecorator('examineDeptName', {
                rules: [{ required: true }],
                initialValue: userinfo.unitName ? userinfo.unitName : check.examineDept,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人单位ID">
              {getFieldDecorator('examineDept', {
                rules: [{ required: true }],
                initialValue: userinfo.unitId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </div>
  );
});

Examine.defaultProps = {
  check: {
    id: '',
    examineStatus: '0',
    checkTime: new Date(),
    examineRemarks: '',
  },
  userinfo: {}
}

export default Form.create()(Examine);