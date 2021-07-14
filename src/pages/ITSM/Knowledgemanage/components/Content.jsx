import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, Row, Col, Form, Input, Select } from 'antd';
import RichTextEditor from '@/components/RichTextEditor';
import SysUpload from '@/components/SysUpload';
import DictLower from '@/components/SysDict/DictLower';

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
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false });
  const required = true;

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  useEffect(() => {
    if (fileslist.ischange) {
      setFilesList({ ...fileslist, ischange: false });
    }
  }, [fileslist]);


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
            <Form.Item label="知识编号" >
              {getFieldDecorator('form1', {
                initialValue: formrecord.form1,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="知识分类">
              {getFieldDecorator('form2', {
                rules: [{ required, message: '请选择知识分类' }],
                initialValue: formrecord.form2,
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
            <Form.Item label="发布时间">
              {getFieldDecorator('form3', {
                initialValue: formrecord.form3,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="知识标题" {...formallItemLayout}>
              {getFieldDecorator('form4', {
                rules: [{ required, message: '请输入知识标题' }],
                initialValue: formrecord.form4,
              })(<Input disabled={Noediting} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="知识内容" {...formallItemLayout}>
              {getFieldDecorator('form5', {
                rules: [{ required, message: '请输入知识内容' }, {
                  validator: handleFormValidator
                }],
              })(
                <RichTextEditor cachevalue={formrecord.form5} ChangeValue={v => setFieldsValue({ form5: v })} />
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ paddingBottom: 24 }}>
            <Row>
              <Col span={2} style={{ paddingTop: 4, textAlign: 'right' }}>上传附件：</Col>
              <Col span={22} >
                <div style={{ width: 400, paddingLeft: 12, float: 'left' }}>
                  <SysUpload fileslist={fileslist.arr} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Form.Item label="作者">
              {getFieldDecorator('form6', {
                initialValue: '',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          {isedit && (
            <>
              <Col span={8}>
                <Form.Item label="编辑人">
                  {getFieldDecorator('form7', {
                    initialValue: '',
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="编辑时间">
                  {getFieldDecorator('form8', {
                    initialValue: '',
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </>
          )}
        </Form>
      </Row>
    </div>
  );
});

export default Form.create()(Content);