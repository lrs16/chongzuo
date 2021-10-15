import React from 'react';
import { Drawer, Button, Form, Input, InputNumber, Select } from 'antd';

const InputGroup = Input.Group;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
  colon: false,
};

function agentDrawer(props) {
  const { visible, ChangeVisible, title, selectdata, handleSubmit, savetype } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const { id, releaseType, taskName, beginDay, endDay, remindDay, beginMonth, endMonth } = props.record;

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

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const typemap = getTypebyId(460);       // 发布类型
  const statumap = getTypebyId(469);       // 处理环节

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
        <Form.Item label="发布类型">
          {getFieldDecorator('releaseType', {
            rules: [{ required, message: `请选择发布类型` }],
            initialValue: releaseType,
          })(
            <Select placeholder="请选择" allowClear disabled={savetype === 'update'}>
              {typemap.map(obj => (
                <Option key={obj.key} value={obj.title}>
                  {obj.title}
                </Option>
              ))}
            </Select>)}
        </Form.Item>
        <Form.Item label="环节名称">
          {getFieldDecorator('taskName', {
            rules: [{ required, message: `请选择环节名称` }],
            initialValue: taskName,
          })(
            <Select placeholder="请选择" allowClear disabled={savetype === 'update'}>
              {statumap.map(obj => (
                <Option key={obj.key} value={obj.title}>
                  {obj.title}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="操作开始时间（日）">
          <InputGroup compact>
            {getFieldDecorator('beginMonth', {
              rules: [{ required, message: `请选择` }],
              initialValue: beginMonth,
            })(
              <Select style={{ width: '30%' }} >
                <Option value="本月">本月</Option>
                <Option value="下月">下月</Option>
              </Select>
            )}
            {getFieldDecorator('beginDay', {
              rules: [{ required, message: `请填写操作开始时间` }],
              initialValue: beginDay,
            })(<InputNumber min={1} max={31} style={{ width: '70%' }} />)}
          </InputGroup>
        </Form.Item>
        <Form.Item label="操作结束时间（日）">
          <InputGroup compact>
            {getFieldDecorator('endMonth', {
              rules: [{ required, message: `请选择` }],
              initialValue: endMonth,
            })(
              <Select style={{ width: '30%' }} >
                <Option value="本月">本月</Option>
                <Option value="下月">下月</Option>
              </Select>
            )}
            {getFieldDecorator('endDay', {
              rules: [{ required, message: `请填写操作结束时间` }],
              initialValue: endDay,
            })(<InputNumber min={1} max={31} style={{ width: '70%' }} />)}
          </InputGroup>
        </Form.Item>
        <Form.Item label="超时提醒（日）">
          {getFieldDecorator('remindDay', {
            rules: [{ required, message: `请填写超时提醒` }],
            initialValue: remindDay,
          })(<InputNumber min={1} max={31} style={{ width: '100%' }} />)}
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

agentDrawer.defaultProps = {
  record: { id: '', releaseType: '', taskName: '', beginDay: '1', endDay: '1', remindDay: '1', },
};

export default Form.create()(agentDrawer);