import React from 'react';
import { Drawer, Button, Form, Input, Radio, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

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

const zonemap = [
  { key: '0', title: '一区' },
  { key: '1', title: '二区' },
  { key: '2', title: '三区' },
  { key: '3', title: '安全接入区' },
];

const hostosmap = [
  { key: '1', title: 'linux' },
  { key: '2', title: 'windows' },
  { key: '3', title: 'mac' },
  { key: '4', title: '其他' },
];

const directormap = [
  { key: '1', title: '张三' },
  { key: '2', title: '李四' },
  { key: '3', title: '王五' },
  { key: '3', title: '赵六' },
];

const hosttype = [
  { key: '1', title: '服务器' },
  { key: '2', title: '网络设备' },
  { key: '3', title: '安防设备' },
];

const electrictype = [
  { key: '1', title: '单电源' },
  { key: '2', title: '双电源' },
];

function EquipDrawer(props) {
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
    hostType,
    electricType,
    positionChange,
    enployU,
    deployChange,
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
            rules: [
              {
                required,
                message: '请选择',
              },
            ],
            initialValue: hostZoneId,
          })(<Select placeholder="请选择" allowClear>
            {zonemap.map(obj => (
              <Option key={obj.key} value={obj.key}>
                {obj.title}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="设备名称">
          {getFieldDecorator('hostName', {
            rules: [
              {
                required,
                message: '请输入',
              },
            ],
            initialValue: hostName,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="设备IP">
          {getFieldDecorator('hostIp', {
            rules: [
              {
                required,
                message: '请输入',
              },
            ],
            initialValue: hostIp,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="设备状态">
          {getFieldDecorator('hostStatus', {
            rules: [
              {
                required,
                message: '请选择',
              },
            ],
            initialValue: hostStatus || '1',
          })(<Radio.Group>
            <Radio value="1">在用</Radio>
            <Radio value="0">停用</Radio>
          </Radio.Group>)}
        </Form.Item>
        <Form.Item label="操作系统">
          {getFieldDecorator('hostOsId', {
            rules: [
              {
                required,
                message: '请选择',
              },
            ],
            initialValue: hostOsId,
          })(<Select placeholder="请选择" allowClear>
            {hostosmap.map(obj => (
              <Option key={obj.key} value={obj.key}>
                {obj.title}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="设备类型">
          {getFieldDecorator('hostType', {
            rules: [
              {
                required,
                message: '请选择',
              },
            ],
            initialValue: hostType,
          })(<Select placeholder="请选择" allowClear>
            {hosttype.map(obj => (
              <Option key={obj.key} value={obj.key}>
                {obj.title}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="供电类型">
          {getFieldDecorator('electricType', {
            rules: [
              {
                required,
                message: '请选择',
              },
            ],
            initialValue: electricType,
          })(<Select placeholder="请选择" allowClear>
            {electrictype.map(obj => (
              <Option key={obj.key} value={obj.key}>
                {obj.title}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="是否物理机">
          {getFieldDecorator('hostPhysicId', {
            initialValue: hostPhysicId || '1',
          })(<Radio.Group>
            <Radio value="1">是</Radio>
            <Radio value="2">否</Radio>
          </Radio.Group>)}
        </Form.Item>
        <Form.Item label="设备机柜">
          {getFieldDecorator('hostCabinetId', {
            //  rules: [
            //   {
            //     required,
            //     message: '请选择',
            //   },
            // ],
            initialValue: hostCabinetId,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="负责人">
          {getFieldDecorator('director', {
            initialValue: director,
          })(<Select placeholder="请选择" allowClear>
            {directormap.map(obj => (
              <Option key={obj.key} value={obj.title}>
                {obj.title}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="位置变更">
          {getFieldDecorator('positionChange', {
            initialValue: positionChange,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="配置变更">
          {getFieldDecorator('deployChange', {
            initialValue: deployChange,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="占用U位">
          {getFieldDecorator('enployU', {
            initialValue: enployU,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="设备排序">
          {getFieldDecorator('hostSorts', {
            initialValue: hostSorts,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="设备备注">
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

EquipDrawer.defaultProps = {
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
    hostType: '',
    electricType: '',
    positionChange: '',
    deployChange: '',
    enployU: '',
  },
};

export default Form.create()(EquipDrawer);