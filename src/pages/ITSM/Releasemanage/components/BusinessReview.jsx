import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Select, Radio } from 'antd';
import DocumentAtt from './DocumentAtt';
import EditeTable from './EditeTable';

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
    sm: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 24 },
  },
};

function BusinessReview(props, ref) {
  const { taskName, userinfo, register, selectdata, isEdit } = props;
  const { getFieldDecorator } = props.form;
  const required = true;
  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    Forms: props.form,
  }))

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const functionmap = getTypebyId('1384052503909240833');   // 功能类型
  const modulamap = getTypebyId('1384430921586839554');     // 模块
  const unitmap = getTypebyId('1384056290929545218');       // 责任单位

  return (
    <Row gutter={12} style={{ paddingTop: 24, }}>
      <Form ref={formRef} {...formItemLayout}>
        <Col span={24} style={{ marginBottom: 12 }}>
          <EditeTable
            title='发布清单'
            functionmap={functionmap}
            modulamap={modulamap}
            isEdit={false}
            listType='临时'
            taskName={taskName}
          />
        </Col>
        <Col span={24} style={{ marginTop: 24 }}>
          <h4>发布结论：</h4>
          <p style={{ marginBottom: 0 }}>本次升级发布共计发布功能【N】个，通过【N】个，不通过【N】个。发布成功率 【N】%。</p>
          <p>其中【A公司】共计发布功能【N】个，通过【N】个，不通过【N】个。发布成功率 【N】%，【B公司】共计发布功能【】个，通过【】个，不通过【】个。发布成功率 【100】%</p>
        </Col>
        <Col span={24}>
          <Form.Item label="复核说明" {...formuintLayout} labelAlign='left'>
            {getFieldDecorator('form9', {
              rules: [{ required, message: `请填写复核说明` }],
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}><Button type='primary'>发起服务绩效考核</Button></Col>
        <Col span={24} style={{ marginBottom: 24, marginTop: 12 }}>
          <DocumentAtt rowkey={null} unitmap={unitmap} isEdit={isEdit} />
        </Col>
        <Col span={8}>
          <Form.Item label="复核人">
            {getFieldDecorator('form11', {
              rules: [{ required, message: `请选择复核人` }],
              initialValue: '',
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="复核时间" >
            {getFieldDecorator('form5', {
              rules: [{ required, message: `请选择复核时间` }],
              initialValue: moment().format("YYYY-MM-DD HH:mm:ss"),
            })(
              <Input disabled />
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="复核单位">
            {getFieldDecorator('form13', {
              rules: [{ required, message: `请选择复核单位` }],
              initialValue: '',
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
const WrappedForm = Form.create({ name: 'form' })(forwardRef(BusinessReview));
export default WrappedForm;