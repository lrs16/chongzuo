import React, { useState } from 'react';
import { Drawer, Button, Form, Input, AutoComplete } from 'antd';
import { phone_reg } from '@/utils/Regexp';
import { queryUnitList, queryDeptList } from '@/services/common';
import DeptSlectId from '@/components/DeptTree/SelectID';
import { CaretRightOutlined } from '@ant-design/icons';

const InputGroup = Input.Group;
const { Search } = Input;
const { Option } = AutoComplete;

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

function DisableduserDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit } = props;
  const { getFieldDecorator, validateFields, setFieldsValue } = props.form;
  const required = true;
  const { id, user, unit, dept, phone, mobile, unitId, deptId } = props.record;
  const [detpdrawer, SetDetpDrawer] = useState(false);
  const [type, setType] = useState('');
  const [unitrecord, setUnitRecord] = useState('');
  const [unitdata, setUnitdata] = useState([]);
  const [deptdata, setDeptdata] = useState([]);

  // setFieldsValue({ unit: unitrecord.title, unitId: unitrecord.key })

  const hanldleCancel = () => {
    ChangeVisible(false);
    setUnitRecord('');
    setUnitdata([]);
    setDeptdata([]);
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
        setUnitRecord('');
      }
    });
  };

  // 关闭组织机构树抽屉
  const onDeptDrawerClose = () => {
    SetDetpDrawer(false);
  };

  // 查询单位
  const handleUnitSearch = value => {
    queryUnitList({ key: value }).then(res => {
      if (res.data !== undefined) {
        const arr = [...res.data];
        setUnitdata(arr);
      }
    });
  };

  // 查询部门
  const handleDeptSearch = value => {
    const unitIdkey = unitrecord.key !== undefined ? unitrecord.key : unitId;
    queryDeptList({ key: value, unitId: unitIdkey }).then(res => {
      if (res.data !== undefined) {
        const arr = [...res.data];
        setDeptdata(arr);
      }
    });
  };

  // 选择单位树结点
  const handleUnitTreeNode = value => {
    setUnitRecord(value);
    setFieldsValue({ unit: value.title });
    setFieldsValue({ unitId: value.key });
    setFieldsValue({ dept: '' });
    setFieldsValue({ deptId: '' });
    SetDetpDrawer(false);
  };

  // 选择部门树结点
  const handleDeptTreeNode = value => {
    setFieldsValue({ dept: value.title });
    setFieldsValue({ deptId: value.key });
    SetDetpDrawer(false);
  };

  // 自动完成单位
  const unitoptions = unitdata.map(opt => (
    <Option key={opt.id} value={opt.deptName}>
      {opt.deptName}
    </Option>
  ));

  // 自动完成部门
  const deptoptions = deptdata.map(opt => (
    <Option key={opt.id} value={opt.deptName}>
      {opt.deptName}
    </Option>
  ));

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
        <Form.Item label="Id" style={{ display: 'none' }}>
          {getFieldDecorator('id', {
            initialValue: id,
          })(<Input placeholder="系统生成" disabled />)}
        </Form.Item>
        <Form.Item label="用户名">
          {getFieldDecorator('user', {
            rules: [
              {
                required,
                message: '请输入用户名',
              },
            ],
            initialValue: user,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="电话">
          {getFieldDecorator('phone', {
            rules: [
              {
                required,
                message: '请输入电话',
              },
            ],
            initialValue: phone,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('mobile', {
            rules: [
              {
                required,
                len: 11,
                validator: phone_reg,
                message: '请输入正确的手机号码',
              },
            ],
            initialValue: mobile,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        {/* <Form.Item label="地址">
          {getFieldDecorator('address', {
            initialValue: address,
          })(<Input placeholder="请输入" />)}
        </Form.Item> */}
        <Form.Item label="单位">
          <InputGroup compact>
            {getFieldDecorator('unit', {
              rules: [
                {
                  required,
                  message: '请选择单位',
                },
              ],
              initialValue: unit,
            })(
              <AutoComplete
                dataSource={unitoptions}
                optionLabelProp="value"
                style={{ width: '85%' }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                onSelect={(v, opt) => {
                  setUnitRecord({ ...unitrecord, title: v, value: opt.key });
                  setFieldsValue({ unit: v });
                  setFieldsValue({ unitId: opt.key });
                  setFieldsValue({ dept: '' });
                  setFieldsValue({ deptId: '' });
                  setUnitdata([]);
                }}
              >
                <Search
                  placeholder="可输入关键字搜索单位"
                  onSearch={values => handleUnitSearch(values)}
                />
              </AutoComplete>,
            )}
            <Button
              style={{ width: '15%' }}
              onClick={() => {
                SetDetpDrawer(!detpdrawer);
                setType('unit');
              }}
            >
              <CaretRightOutlined />
            </Button>
          </InputGroup>
        </Form.Item>
        <Form.Item label="单位Id" style={{ display: 'none' }}>
          {getFieldDecorator('unitId', {
            rules: [
              {
                required,
                message: '请输入单位Id',
              },
            ],
            initialValue: unitId,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="部门">
          <InputGroup compact>
            {getFieldDecorator('dept', {
              initialValue: dept,
            })(
              <AutoComplete
                dataSource={deptoptions}
                optionLabelProp="value"
                style={{ width: '85%' }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                onSelect={(v, opt) => {
                  setFieldsValue({ dept: v });
                  setFieldsValue({ deptId: opt.key });
                  setDeptdata([]);
                }}
              >
                <Search
                  placeholder="可输入关键字搜索部门"
                  onSearch={values => handleDeptSearch(values)}
                />
              </AutoComplete>,
            )}
            <Button
              style={{ width: '15%' }}
              onClick={() => {
                validateFields(['unit', 'unitId'], err => {
                  if (!err) {
                    SetDetpDrawer(!detpdrawer);
                    setType('dept');
                  }
                });
              }}
            >
              <CaretRightOutlined />
            </Button>
          </InputGroup>
        </Form.Item>
        <Form.Item label="部门Id" style={{ display: 'none' }}>
          {getFieldDecorator('deptId', {
            initialValue: deptId,
          })(<Input />)}
        </Form.Item>
      </Form>
      <Drawer
        title="组织机构"
        width={320}
        closable={false}
        onClose={onDeptDrawerClose}
        visible={detpdrawer}
      >
        {type === 'unit' && (
          <DeptSlectId
            GetTreenode={newvalue => handleUnitTreeNode(newvalue)}
            pid="7AC3EF0F701402A2E0530A644F130365"
          />
        )}
        {type === 'dept' && (
          <DeptSlectId
            GetTreenode={newvalue => handleDeptTreeNode(newvalue)}
            pid={unitrecord.key !== undefined ? unitrecord.key : unitId}
          />
        )}
      </Drawer>
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

DisableduserDrawer.defaultProps = {
  record: { id: '', user: '', unit: '', dept: '', phone: '', mobile: '', unitId: '', deptId: '' },
};

export default Form.create()(DisableduserDrawer);
