import React, {
  useState
} from 'react';
import DictLower from '@/components/SysDict/DictLower';
import { Drawer, Button, Form, Input, Select, InputNumber, Radio } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

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
function SoftwareDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit, dispatch, directormap } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const {
    hostZoneId,
    hostName,
    hostIp,
    director,
    softRemarks,
    softUse,
    softSorts,
    softStatus,
    softVersion,
    softPath,
    softPort,
    softName,
    startupScriptPath,
    stopScriptPath,
    startupScriptArgs,
    stopScriptArgs,
    monitor,
    patrolInspection,
    hostId
  } = props.record;

  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [findhostname, setFindhostName] = useState([]); // 区域查询主机名称
  const [findhostip, setFindhostIp] = useState([]); // 主机名称查询主机IP
  const [getId, setId] = useState([]);

  // 取消
  const hanldleCancel = () => {
    ChangeVisible(false);
  };

  // 提交
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

  // 区域选择
  const handleChange = v => {
    dispatch({
      type: 'softwaremanage/tofindCascade',
      payload: { hostZoneId: v },
    }).then(res => {
      setFindhostName(res.data);
      setFindhostIp(res.data);
    });
  };

  // 设备名称选择
  const handleChangegetId = v => {
    dispatch({
      type: 'softwaremanage/tofindCascade',
      payload: { hostName: v },
    }).then(res => {
      setId(res.data[0]);
    });
  };

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const zonemap = getTypebyId(717); // 主机区域
  const hoststatusmap = getTypebyId(1258); // 软件状态
  // const whethermap = getTypebyId('1428185541785374722'); // 是否是否

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
        typeid={710}
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Form {...formItemLayout} onSubmit={handleOk}>
        <Form.Item label="区域">
          {getFieldDecorator('hostZoneId', {
            rules: [
              {
                required,
                message: '请选择',
              },
            ],
            initialValue: hostZoneId,
          })(<Select placeholder="请选择" allowClear onChange={v => handleChange(v)}>
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
          })(<Select placeholder="请选择" allowClear onChange={item => handleChangegetId(item)}>
            {findhostname !== undefined && findhostname.map(obj => (
              <Option key={obj.Id} value={obj.hostName}>
                {obj.hostName}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="设备IP" style={{ display: 'none' }}>
          {getFieldDecorator('hostIp', {
            initialValue: hostIp,
          })(<Select placeholder="请选择" allowClear>
            {findhostip !== undefined && findhostip.map(obj => (
              <Option key={obj.Id} value={obj.hostIp}>
                {obj.hostIp}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="设备ID" style={{ display: 'none' }}>
          {getFieldDecorator('hostId', {
            initialValue: getId && getId.Id ? getId.Id : hostId,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="软件名称">
          {getFieldDecorator('softName', {
            rules: [
              {
                required,
                message: '请输入',
              },
            ],
            initialValue: softName,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="软件端口">
          {getFieldDecorator('softPort', {
            rules: [
              {
                required,
                message: '请输入',
              },
            ],
            initialValue: softPort,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="软件路径">
          {getFieldDecorator('softPath', {
            rules: [
              {
                required,
                message: '请输入',
              },
            ],
            initialValue: softPath,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="软件版本号">
          {getFieldDecorator('softVersion', {
            initialValue: softVersion,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="软件状态">
          {getFieldDecorator('softStatus', {
            rules: [
              {
                required,
                message: '请选择',
              },
            ],
            initialValue: softStatus,
          })(
            <Select placeholder="请选择" allowClear>
              {hoststatusmap.map(obj => (
                <Option key={obj.key} value={obj.title}>
                  {obj.title}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="负责人">
          {getFieldDecorator('director', {
            rules: [
              {
                required,
                message: '请选择',
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
        <Form.Item label="软件排序">
          {getFieldDecorator('softSorts', {
            initialValue: softSorts,
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入数字..." />)}
        </Form.Item>
        <Form.Item label="启动脚本路径">
          {getFieldDecorator('startupScriptPath', {
            initialValue: startupScriptPath,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="停止脚本路径">
          {getFieldDecorator('stopScriptPath', {
            initialValue: stopScriptPath,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="启动参数">
          {getFieldDecorator('startupScriptArgs', {
            initialValue: startupScriptArgs,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="停止参数">
          {getFieldDecorator('stopScriptArgs', {
            initialValue: stopScriptArgs,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="是否巡检">
          {getFieldDecorator('patrolInspection', {
            rules: [{ required, message: `请选择` }],
            initialValue: patrolInspection || '是',
          })(
            <RadioGroup>
              <Radio value="是">是</Radio>
              <Radio value="否">否</Radio>
            </RadioGroup>
          )}
        </Form.Item>
        <Form.Item label="是否监控">
          {getFieldDecorator('monitor', {
            rules: [{ required, message: `请选择` }],
            initialValue: monitor || '是',
          })(
            <RadioGroup>
              <Radio value="是">是</Radio>
              <Radio value="否">否</Radio>
            </RadioGroup>
          )}
        </Form.Item>
        <Form.Item label="软件用途">
          {getFieldDecorator('softUse', {
            initialValue: softUse,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="软件备注">
          {getFieldDecorator('softRemarks', {
            initialValue: softRemarks,
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

SoftwareDrawer.defaultProps = {
  record: {
    hostZoneId: '',
    hostName: '',
    hostIp: '',
    director: '',
    softRemarks: '',
    softUse: '',
    softSorts: '',
    softStatus: '',
    softVersion: '',
    softPath: '',
    softPort: '',
    softName: '',
    startupScriptPath: '',
    stopScriptPath: '',
    startupScriptArgs: '',
    stopScriptArgs: '',
    patrolInspection: '',
    monitor: '',
    hostId: '',
  },
};

export default Form.create()(SoftwareDrawer);