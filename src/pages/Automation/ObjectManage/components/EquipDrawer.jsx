import React, {
  useState
} from 'react';
// import { connect } from 'dva';
import DictLower from '@/components/SysDict/DictLower';
import { Drawer, Button, Form, Input, Select, InputNumber } from 'antd';

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

const directormap = [
  { key: '1', title: '张三' },
  { key: '2', title: '李四' },
  { key: '3', title: '王五' },
  { key: '3', title: '赵六' },
];
function EquipDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit, dispatch } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const {
    // id,
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

  const [equipCabinet, setEquipCabinet] = useState([]);
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

  const handleChange = v => {
    dispatch({
      type: 'equipmanage/getCabinetMsgs',
      payload: { cabinetZoneId: v },
    }).then(res => {
      setEquipCabinet(res.data);
    });
  };

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const zonemap = getTypebyId('1428182995477942274'); // 主机区域
  const hoststatusmap = getTypebyId('1428184619231432705'); // 设备状态
  const hostosmap = getTypebyId('1428185083276644354'); // 操作系统
  const electrictype = getTypebyId('1428185267658248193'); // 供电类型
  const hosttype = getTypebyId('1428185403339788289'); // 设备类型
  const hostphysicmap = getTypebyId('1428185541785374722'); // 物理机

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
        {/* <Form.Item label="Id">
          {getFieldDecorator('id', {
            initialValue: id,
          })(<Input disabled />)}
        </Form.Item> */}
        <Form.Item label="区域">
          {getFieldDecorator('hostZoneId', {
            rules: [
              {
                required,
                message: '请选择',
              },
            ],
            initialValue: hostZoneId,
          })(<Select placeholder="请选择" allowClear
            onChange={v => handleChange(v)}
          >
            {zonemap.map(obj => (
              <Option key={obj.key} value={obj.title}>
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
            initialValue: hostStatus,
          })(
            // <Radio.Group>
            //   <Radio value="1">在用</Radio>
            //   <Radio value="0">停用</Radio>
            // </Radio.Group>
            <Select placeholder="请选择" allowClear>
              {hoststatusmap.map(obj => (
                <Option key={obj.key} value={obj.title}>
                  {obj.title}
                </Option>
              ))}
            </Select>
          )}
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
              <Option key={obj.key} value={obj.title}>
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
              <Option key={obj.key} value={obj.title}>
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
              <Option key={obj.key} value={obj.title}>
                {obj.title}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="是否物理机">
          {getFieldDecorator('hostPhysicId', {
            rules: [{ required }],
            initialValue: hostPhysicId,
          })(<Select placeholder="请选择" allowClear>
            {hostphysicmap.map(obj => (
              <Option key={obj.key} value={obj.title}>
                {obj.title}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="设备机柜">
          {getFieldDecorator('hostCabinetId', {
            rules: [
              {
                required,
                message: '请选择',
              },
            ],
            initialValue: hostCabinetId,
            // initialValue: (equipCabinet && equipCabinet[0]) ? equipCabinet[0].tital : hostCabinetId,
          })(
            <Select placeholder="请选择" allowClear>
              {equipCabinet.map(obj => (
                <Option key={obj.key} value={obj.key}>
                  {obj.tital}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="占用U位">
          {getFieldDecorator('enployU', {
            rules: [
              {
                required,
                message: '请输入',
              },
            ],
            initialValue: enployU,
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
        <Form.Item label="设备排序">
          {getFieldDecorator('hostSorts', {
            initialValue: hostSorts,
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入数字..." />)}
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
    // id: '',
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
// export default Form.create({})(
//   connect(({ equipmanage, loading }) => ({
//       list: equipmanage.hostList,
//       loading: loading.models.equipmanage,
//   }))(EquipDrawer),
// );