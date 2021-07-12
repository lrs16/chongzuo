import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import RichTextEditor from '@/components/RichTextEditor';
import SysUpload from '@/components/SysUpload';

const formallItemLayout = {
  labelCol: {
    xs: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
  },
  labelAlign: 'left',
};

function New(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, getFieldsValue },
    dispatch,
  } = props;
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false });
  const [editorhtml, setEditorHtml] = useState(null);
  const required = true;

  useEffect(() => {
    if (fileslist.ischange) {
      setFilesList({ ...fileslist, ischange: false });
    }
  }, [fileslist]);

  // 自定义表单验证规则
  const validateEditorFrom = (rule, value, callback) => {
    if (editorhtml === '') {
      callback('知识内容不能为空');
    }
    callback();
  }

  const handleSave = () => {
    console.log('保存')
  }

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/knowledgemanage/myknowledge`,
      query: { pathpush: true },
      state: { cache: false }
    });
  };

  const operations = (
    <>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => { handleSave() }}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => { handleSave() }}
      >
        提交
      </Button>
      <Button onClick={handleclose}>返回</Button>
    </>
  )

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <Card>
        <Row gutter={24}>
          <Form {...formallItemLayout} >
            <Col span={8}>
              <Form.Item label="知识编号">
                {getFieldDecorator('form1', {
                  initialValue: '',
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="知识分类">
                {getFieldDecorator('form2', {
                  rules: [{ required, message: '请选择知识分类' }],
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="发布时间">
                {getFieldDecorator('form3', {
                  initialValue: '',
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="知识标题">
                {getFieldDecorator('form3', {
                  rules: [{ required, message: '请输入知识标题' }],
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="知识内容">
                {getFieldDecorator('form4', {
                  rules: [
                    { required, message: '请填写知识内容' },
                    { validator: validateEditorFrom }
                  ],
                  initialValue: '',
                })(<RichTextEditor ChangeValue={v => setEditorHtml(v)} />)}
              </Form.Item>
            </Col>
            <Col span={24} style={{ paddingBottom: 24 }}>
              <span style={{ float: 'left', paddingTop: 4 }}>上传附件：</span>
              <div style={{ width: 400, paddingLeft: 12, float: 'left' }}>
                <SysUpload fileslist={fileslist.arr} ChangeFileslist={newvalue => setFilesList(newvalue)} />
              </div>
            </Col>
            <Col span={8}>
              <Form.Item label="作者">
                {getFieldDecorator('form5', {
                  initialValue: '',
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasetodo, loading }) => ({
    list: releasetodo.list,
    loading: loading.models.releasetodo,
  }))(New),
);