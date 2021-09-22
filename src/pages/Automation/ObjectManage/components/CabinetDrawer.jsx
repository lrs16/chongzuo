import React, { useState } from 'react';
import { Drawer, Button, Form, Input, Select, InputNumber } from 'antd';
import DictLower from '@/components/SysDict/DictLower';

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
function CabinetDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit, directormap } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const {
    id,
    cabinetZoneId,
    cabinetName,
    cabinetNo,
    cabinetSeat,
    cabinetU,
    cabinetResidueU,
    director,
    cabinetSorts,
    cabinetRemarks,
  } = props.record;

  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值

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

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const zonemap = getTypebyId('1428182995477942274'); // 区域

  return (
    <Drawer
      title={title}
      width={600}
      onClose={hanldleCancel}
      visible={visible}
      bodyStyle={{ paddingBottom: 60 }}
      destroyOnClose
    >
      <DictLower
        typeid="1428178684907835393"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Form {...formItemLayout} onSubmit={handleOk}>
        <Form.Item label="Id">
          {getFieldDecorator('id', {
            initialValue: id,
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="区域">
          {getFieldDecorator('cabinetZoneId', {
            rules: [
              {
                required,
                message: '请输入'
              },
            ],
            initialValue: cabinetZoneId,
          })(<Select placeholder="请选择" allowClear>
            {zonemap.map(obj => (
              <Option key={obj.key} value={obj.title}>
                {obj.title}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="机柜名称">
          {getFieldDecorator('cabinetName', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: cabinetName,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="机柜编码">
          {getFieldDecorator('cabinetNo', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: cabinetNo,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="机柜位置">
          {getFieldDecorator('cabinetSeat', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: cabinetSeat,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="机柜容量">
          {getFieldDecorator('cabinetU', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: cabinetU,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="剩余容量">
          {getFieldDecorator('cabinetResidueU', {
            // rules: [
            //   {
            //     required,
            //     message: '请输入 '
            //   },
            // ],
            initialValue: cabinetResidueU,
          })(<Input placeholder="请输入" disabled/>)}
        </Form.Item>
        <Form.Item label="负责人">
          {getFieldDecorator('director', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: director,
          })(<Select placeholder="请选择" allowClear>
          {directormap.map(obj => (
            <Option key={obj.userId} value={obj.userName}>
              {obj.userName}
            </Option>
          ))}
        </Select>)}
        </Form.Item>
        <Form.Item label="机柜排序">
          {getFieldDecorator('cabinetSorts', {
            initialValue: cabinetSorts,
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入数字..." />)}
        </Form.Item>
        <Form.Item label="机柜备注">
          {getFieldDecorator('cabinetRemarks', {
            initialValue: cabinetRemarks,
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

CabinetDrawer.defaultProps = {
  record: {
    id: '',
    cabinetZoneId: '',
    cabinetName: '',
    cabinetNo: '',
    cabinetSeat: '',
    cabinetU: '',
    cabinetResidueU: '',
    director: '',
    cabinetSorts: '',
    cabinetRemarks: '',
  },
};

export default Form.create()(CabinetDrawer);