import React, { useState, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Select, message } from 'antd';
import RichTextEditor from '@/components/RichTextEditor';
import SysUpload from '@/components/SysUpload/Upload';
import DictLower from '@/components/SysDict/DictLower';
import Downloadfile from '@/components/SysUpload/Downloadfile';

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
    formrecord, isedit, Noediting, location,
    form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue, validateFields }
  } = props;
  const [selectdata, setSelectData] = useState('');
  const [banOpenFileDialog, setBanOpenFileDialog] = useState(false);
  const [openFileMsg, setOpenFileMsg] = useState(undefined);

  const required = true;

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleFormValidator = (rule, value, callback) => {
    if (value === '' || value === '<p></p>') {
      callback()
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
  const typemap = getTypebyId(585);         // 知识分类

  return (
    <div style={{ paddingRight: 24 }}>
      <DictLower
        typeid="584"
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
          <Col span={24} style={{ marginTop: 4 }}>
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
          <Col span={24} style={{ padding: '8px 0' }}>
            <Row>
              <Col span={2} style={{ paddingTop: 4, textAlign: 'right' }}>上传附件：</Col>
              <Col span={22} >
                {!Noediting && location && (!location.state || (location.state && !location.state.cache)) && (
                  <div
                    style={{ paddingLeft: 12, float: 'left' }}
                    onMouseDown={() => {
                      validateFields((err) => {
                        if (err) {
                          setOpenFileMsg('请将信息填写完整');
                          setBanOpenFileDialog(true);
                        } else {
                          setBanOpenFileDialog(false)
                        }
                      })
                    }}
                  >
                    <SysUpload banOpenFileDialog={banOpenFileDialog} openFileMsg={openFileMsg} msgType='error' />
                  </div>
                )}
                {formrecord.fileIds !== '' && Noediting && <Downloadfile files={formrecord.fileIds} />}
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Form.Item label="作者">
              {getFieldDecorator('addUser', {
                initialValue: formrecord.addUser ? formrecord.addUser : sessionStorage.getItem('userName'),
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="作者ID" style={{ display: 'none' }}>
              {getFieldDecorator('addUserId', {
                initialValue: formrecord.addUserId ? formrecord.addUserId : sessionStorage.getItem('userauthorityid'),
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
  }
}

export default Form.create()(Content);