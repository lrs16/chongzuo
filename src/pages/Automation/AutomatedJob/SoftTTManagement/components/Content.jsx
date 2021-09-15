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

const formItemLayout444 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const Content = forwardRef((props, ref) => {
  const {
    userinfo,
    form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue }
  } = props;

  // const [showexpand, setshowExpand] = useState(false);
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState([]);
  // const [rowkeys, setRowkeys] = useState([]);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleShowDrawer = (drwertitle) => {
    setVisible(!visible);
    setTitle(drwertitle);
  };

  // 确认提交
  // const handleSubmit = values => {
  //   dispatch({
  //     type: '',
  //     payload: {
  //       ...values,
  //     },
  //   }).then(res => {
  //     if (res.code === 200) {
  //       message.success(res.msg);
  //     }
  //   });
  // };

  return (
    <div style={{ marginRight: 24, marginTop: 24 }}>
      <Row gutter={24}>
        <Form {...formallItemLayout}>
          <Col span={24} >
            <Form.Item label="启停对象" {...formItemLayout1}>
              {getFieldDecorator('workSoftIds', {
                rules: [{ required: true, message: '请选择作业对象' }],
                initialValue: [""],
              })(<Button block onClick={() => {
                handleShowDrawer('添加作业对象');
              }}>+添加对象</Button>)}
            </Form.Item>
            <Form.Item span={24} {...formItemLayout444}>
                <SoftTaskObjectList selectrowsData={rows} GetRowskeysData={(v) => { setFieldsValue({ workSoftIds: v });}}/>
              </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="申请说明" {...formItemLayout} >
              {getFieldDecorator('workRemarks', {
                rules: [{ required: true, message: '请输入审核说明' }],
                initialValue: '',
              })(<TextArea autoSize={{ minRows: 5 }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人">
              {getFieldDecorator('createBy', {
                rules: [{ required: true }],
                initialValue: userinfo.userName ? userinfo.userName : '',
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="申请人单位">
              {getFieldDecorator('createDept', {
                rules: [{ required: true }],
                initialValue: userinfo.unitName ? userinfo.unitName : '',
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请时间">
              {getFieldDecorator('createTime', {
                rules: [{ required: true }],
                initialValue: moment(new Date()),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled />)}
            </Form.Item>
          </Col>
          {/* <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人ID">
              {getFieldDecorator('checkUserId', {
                rules: [{ required: true }],
                initialValue: userinfo.userId ? userinfo.userId : check.checkUserId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人单位ID">
              {getFieldDecorator('checkUnitId', {
                rules: [{ required: true }],
                initialValue: userinfo.unitId ? userinfo.unitId : check.checkUnitId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col> */}
        </Form>
      </Row>
      {/* 抽屉 */}
      <AddagentObjDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        // handleSubmit={newvalue => handleSubmit(newvalue)}
        // record={data}
        GetRowsData={newvalue => setRows(newvalue)}
        GetRowskeysData={(v) => { setFieldsValue({ workSoftIds: v });}}
        destroyOnClose
      />
    </div>
  );
});

Content.defaultProps = {
  userinfo: {}
}

export default Form.create()(Content);