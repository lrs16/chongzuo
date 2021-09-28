import React, {
  useState,
  forwardRef, useImperativeHandle
} from 'react';
import moment from 'moment';
import { Button, Form, Input, DatePicker, Row, Col } from 'antd';
import AddagentObjDrawer from './AddagentObjDrawer';
import SoftTaskObjectList from './SoftTaskObjectList';

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

const formItemLayout1 = {
  labelCol: {
    xs: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
};

// const formItemLayout444 = {
//   labelCol: {
//     xs: { span: 2 },
//     sm: { span: 1 },
//   },
//   wrapperCol: {
//     xs: { span: 22 },
//     sm: { span: 2 },
//   },
// };

const Content = forwardRef((props, ref) => {
  const {
    userinfo, Noediting,
    registrat,
    form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue }
  } = props;

  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState([]);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleShowDrawer = (drwertitle) => {
    setVisible(!visible);
    setTitle(drwertitle);
  };

  return (
    <div style={{ marginRight: 24, marginTop: 24 }}>
      <Row gutter={24}>
        <Form {...formallItemLayout}>
          <Col span={24} >
            {
              registrat.id && (
                <Col span={8} style={{ display: 'none' }}>
                  <Form.Item label="审核表单id">
                    {getFieldDecorator('id', {
                      initialValue: registrat.id,
                    })(<Input placeholder="请输入" disabled />)}
                  </Form.Item>
                </Col>
              )
            }
            <Form.Item label="启停对象" {...formItemLayout1}>
              {getFieldDecorator('workSoftIds', {
                rules: [{ required: true, message: '请选择作业对象' }],
                initialValue: [""] || registrat.workSoftIds,
              })(<Button block onClick={() => {
                handleShowDrawer('添加作业对象');
              }} disabled={Noediting}>+添加对象</Button>)}
            </Form.Item>
            <Form.Item span={24} {...formItemLayout}>
              <SoftTaskObjectList onChangeSelect={(v)=>setRows(v)} selectrowsData={rows} GetRowskeysData={ (v) => { setFieldsValue({ workSoftIds: v }); }} Noediting={Noediting}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="申请说明" {...formItemLayout} >
              {getFieldDecorator('workRemarks', {
                rules: [{ required: true, message: '请输入审核说明' }],
                initialValue: registrat.workRemarks || '',
              })(<TextArea autoSize={{ minRows: 5 }} placeholder="请输入" disabled={Noediting}/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人">
              {getFieldDecorator('createByName', {
                rules: [{ required: true }],
                initialValue: userinfo.userName ? userinfo.userName : registrat.createBy,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="申请人单位">
              {getFieldDecorator('createDeptName', {
                rules: [{ required: true }],
                initialValue: userinfo.unitName ? userinfo.unitName : registrat.createDept,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请时间">
              {getFieldDecorator('createTime', {
                rules: [{ required: true }],
                initialValue: moment(registrat.createTime),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申请人ID">
              {getFieldDecorator('createBy', {
                rules: [{ required: true }],
                initialValue: userinfo.userId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="申请人单位ID">
              {getFieldDecorator('createDept', {
                rules: [{ required: true }],
                initialValue: userinfo.unitId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
      {/* 抽屉 */}
      <AddagentObjDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        GetRowsData={newvalue => setRows(newvalue)}
        GetRowskeysData={(v) => { setFieldsValue({ workSoftIds: v }); }}
        rows={rows}
        destroyOnClose
      />
    </div>
  );
});

Content.defaultProps = {
  registrat: {
    workRemarks: '',
    workSoftIds: [""],
    createTime: new Date(),
  },
  userinfo: {}
}

export default Form.create()(Content);