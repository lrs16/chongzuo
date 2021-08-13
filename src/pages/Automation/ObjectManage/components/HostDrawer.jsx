import React from 'react';
import { Drawer, Button, Form, Input } from 'antd';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
  colon: false,
};

function HostDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const { 
    id, 
    hostZoneId, 
    hostName, 
    hostIp, 
    hostStatus, 
    hostOsId, 
    hostPhysicId, 
    hostCabinetId,
    director,
    hostSorts,
    hostRemarks,
   } = props.record;

  const hanldleCancel = () => {
    ChangeVisible(false);
  };
  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        // 关闭弹窗
        hanldleCancel();
        // 传数据
        handleSubmit(values);
        props.form.resetFields();
        ChangeVisible(false);
      }
    });
  };


  return (
    <Drawer
      title={title}
      width={600}
      onClose={hanldleCancel}
      visible={visible}
      bodyStyle={{ paddingBottom: 60 }}
      destroyOnClose
    >
      <Form {...formItemLayout} onSubmit={handleOk}>
        <Form.Item label="Id">
          {getFieldDecorator('id', {
            initialValue: id,
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="区域">
          {getFieldDecorator('hostZoneId', {
            initialValue: hostZoneId,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="主机名称">
          {getFieldDecorator('hostName', {
            initialValue: hostName,
          })(<Input placeholder="请输入" disabled />)}
        </Form.Item>
        <Form.Item label="主机IP">
          {getFieldDecorator('hostIp', {
            initialValue: hostIp,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="主机状态">
          {getFieldDecorator('hostStatus', {
            initialValue: hostStatus,
          })(<Input placeholder="请输入" disabled />)}
        </Form.Item>
        <Form.Item label="操作系统">
          {getFieldDecorator('hostOsId', {
            initialValue: hostOsId,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="是否物理机">
          {getFieldDecorator('hostPhysicId', {
            initialValue: hostPhysicId,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="主机机柜">
          {getFieldDecorator('hostCabinetId', {
            initialValue: hostCabinetId,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        {/* <Form.Item label="所在U位">
          {getFieldDecorator('''', {
            initialValue: '',
          })(<Input placeholder="请输入" />)}
        </Form.Item> */}
        <Form.Item label="负责人">
          {getFieldDecorator('director', {
            initialValue: director,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="主机排序">
          {getFieldDecorator('hostSorts', {
            initialValue: hostSorts,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="主机备注">
          {getFieldDecorator('hostRemarks', {
            initialValue: hostRemarks,
          })(<TextArea placeholder="请输入" autoSize={{ minRows: 3 }} allowClear />)}
        </Form.Item>
      </Form>

      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={hanldleCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={handleOk} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
}

HostDrawer.defaultProps = {
  record: { 
    id: '', 
    hostZoneId: '', 
    hostName: '', 
    hostIp: '', 
    hostStatus: '', 
    hostOsId: '', 
    hostPhysicId: '', 
    hostCabinetId: '',
    director: '',
    hostSorts: '',
    hostRemarks: '',
  },
};

export default Form.create()(HostDrawer);