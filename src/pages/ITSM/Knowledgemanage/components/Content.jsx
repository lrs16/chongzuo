import React, { useState, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Select } from 'antd';
import RichTextEditor from '@/components/RichTextEditor';
import SysUpload from '@/components/SysUpload/Upload';
import DictLower from '@/components/SysDict/DictLower';
import UploadContext from '@/layouts/MenuContext';

const { Option } = Select;

const formallItemLayout = {
  labelCol: {
    xs: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 22 },
  },
  labelAlign: 'right',
};
const forItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
  labelAlign: 'right',
};

const Content = forwardRef((props, ref) => {
  const {
    formrecord, isedit, Noediting,
    form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue }
  } = props;
  const [selectdata, setSelectData] = useState('');
  const required = true;

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleFormValidator = (rule, value, callback) => {
    if (value === '' || value === '<p></p>') {
      callback(rule)
    }
    callback()
  }

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const typemap = getTypebyId('1412301574201413634');         // 知识分类

  return (
    <div style={{ paddingRight: 24 }}>
      <DictLower
        typeid="1412301036722327553"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Row gutter={24}>
        <Form {...forItemLayout} >
          <Col span={8}>
            <Form.Item label="表单id" style={{ display: 'none' }}>
              {getFieldDecorator('id', {
                initialValue: formrecord.id,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="知识编号" >
              {getFieldDecorator('no', {
                initialValue: formrecord.no,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="知识分类">
              {getFieldDecorator('type', {
                rules: [{ required, message: '请选择知识分类' }],
                initialValue: formrecord.type,
              })(<Select placeholder="请选择" allowClear disabled={Noediting}>
                {typemap.map(obj => (
                  <Option key={obj.key} value={obj.title}>
                    {obj.title}
                  </Option>
                ))}
              </Select>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记时间">
              {getFieldDecorator('addTime', {
                initialValue: formrecord.addTime === undefined ? moment().format('YYYY-MM-DD HH:mm:ss') : formrecord.addTime,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="知识标题" {...formallItemLayout}>
              {getFieldDecorator('title', {
                rules: [{ required, message: '请输入知识标题' }],
                initialValue: formrecord.title,
              })(<Input disabled={Noediting} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="知识内容" {...formallItemLayout}>
              {getFieldDecorator('content', {
                rules: [{ required, message: '请输入知识内容' }, {
                  validator: handleFormValidator
                }],
              })(
                <RichTextEditor
                  cachevalue={formrecord.content}
                  ChangeValue={v => setFieldsValue({ content: v })}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ paddingBottom: 24 }}>
            <Row>
              <Col span={2} style={{ paddingTop: 4, textAlign: 'right' }}>上传附件：</Col>
              <Col span={22} >
                {!Noediting && (
                  <div style={{ width: 400, paddingLeft: 12, float: 'left' }}>
                    <SysUpload />
                  </div>
                )}
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Form.Item label="作者">
              {getFieldDecorator('addUser', {
                initialValue: formrecord.addUser,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="作者ID" style={{ display: 'none' }}>
              {getFieldDecorator('addUserId', {
                initialValue: formrecord.addUserId,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          {isedit && (
            <>
              <Col span={8}>
                <Form.Item label="编辑人">
                  <Input disabled defaultValue={sessionStorage.getItem('userName')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="编辑时间">
                  <Input disabled defaultValue={moment().format('YYYY-MM-DD HH:mm:ss')} />
                </Form.Item>
              </Col>
            </>
          )}
        </Form>
      </Row>
    </div>
  );
});

Content.defaultProps = {
  formrecord: {
    id: '',
    no: '',
    type: '',
    title: '',
    content: '',
    addUser: sessionStorage.getItem('userName'),
    addUserId: sessionStorage.getItem('userauthorityid'),
  }
}

export default Form.create()(Content);