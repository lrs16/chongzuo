import React, { useState, useEffect } from 'react';
import { Drawer, Button, Form, Input, Radio, Select } from 'antd';
import DictLower from '@/components/SysDict/DictLower';
import moment from 'moment';

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

function LocalScriptDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit, scriptsourcemap, scripttypemap, dispatch } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const {
    id,
    hostName,
    hostIp,
    scriptName,
    scriptPath,
    scriptSource,
    scriptType,
    scriptCont,
    scriptRemarks,
    scriptSize,
    createBy,
    hostZoneId,
  } = props.record;

  const [findhostname, setFindhostName] = useState([]); // 区域查询主机名称
  const [findhostip, setFindhostIp] = useState([]); // 主机名称查询主机IP
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

  useEffect(() => {
    return () => {
      setSelectData([]);
    };
  }, []);

  const handleChange = v => {
    dispatch({
      type: 'softwaremanage/tofindCascade',
      payload: { cabinetZoneId: v },
    }).then(res => {
      setFindhostName(res.data);
      setFindhostIp(res.data);
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
          {getFieldDecorator('hostZoneId', {
            rules: [
              {
                required,
                message: '请选择 '
              },
            ],
            initialValue: hostZoneId,
          })(
            <Select placeholder="请选择" allowClear onChange={v => handleChange(v)}>
              {zonemap.map(obj => (
                <Option key={obj.key} value={obj.title}>
                  {obj.title}
                </Option>
              ))}
            </Select>)}
        </Form.Item>
        <Form.Item label="主机名称">
          {getFieldDecorator('hostName', {
            initialValue: hostName,
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
          })(<Select placeholder="请选择" allowClear>
            {findhostname !== undefined && findhostname.map(obj => (
              <Option key={obj.Id} value={obj.hostName}>
                {obj.hostName}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="主机IP">
          {getFieldDecorator('hostIp', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: hostIp,
          })(<Select placeholder="请选择" allowClear>
            {findhostip !== undefined && findhostip.map(obj => (
              <Option key={obj.Id} value={obj.hostIp}>
                {obj.hostIp}
              </Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="脚本名称">
          {getFieldDecorator('scriptName', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: scriptName,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="存放路径">
          {getFieldDecorator('scriptPath', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: scriptPath,
          })(<Input placeholder="请输入" allowClear />)}
        </Form.Item>
        <Form.Item label="脚本来源">
          {getFieldDecorator('scriptSource', {
            rules: [
              {
                required,
                message: '请选择'
              },
            ],
            initialValue: scriptSource || '手动输入',
          })(<Radio.Group>
            {scriptsourcemap.map(obj => (
              <Radio key={obj.key} value={obj.title}>
                {obj.title}
              </Radio>
            ))}
          </Radio.Group>)}
        </Form.Item>
        <Form.Item label="脚本类型">
          {getFieldDecorator('scriptType', {
            rules: [{ required }],
            initialValue: scriptType || 'shell',
          })(<Radio.Group>
            {scripttypemap.map(obj => (
              <Radio key={obj.key} value={obj.title}>
                {obj.title}
              </Radio>
            ))}
          </Radio.Group>)}
        </Form.Item>
        <Form.Item label="脚本内容">
          {getFieldDecorator('scriptCont', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: scriptCont,
          })(<TextArea placeholder="请输入" autoSize={{ minRows: 10 }} allowClear />)}
        </Form.Item>
        <Form.Item label="脚本备注">
          {getFieldDecorator('scriptRemarks', {
            initialValue: scriptRemarks,
          })(<TextArea placeholder="请输入" autoSize={{ minRows: 3 }} allowClear />)}
        </Form.Item>
        <Form.Item label="脚本文件大小">
          {getFieldDecorator('scriptSize', {
            initialValue: scriptSize,
          })(<Input style={{ width: '100%' }} placeholder="请输入" disabled />)}
        </Form.Item>
        <Form.Item label="上传时间">
          {getFieldDecorator('createTime', {
            initialValue: moment(new Date()).format('YY-MM-DD: HH:mm:ss'),
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="上传人">
          {getFieldDecorator('createBy', {
            initialValue: createBy,
          })(<Input disabled />)}
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
        <Button style={{ marginRight: 8 }}>
          保存
        </Button>
        <Button onClick={handleOk} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
}

LocalScriptDrawer.defaultProps = {
  record: {
    id: '',
    hostZoneId: '',
    hostName: '',
    hostIp: '',
    scriptName: '',
    scriptPath: '',
    scriptSource: '',
    scriptType: '',
    scriptCont: '',
    scriptRemarks: '',
    scriptSize: '',
    createTime: '',
    createBy: '',
  },
};

export default Form.create()(LocalScriptDrawer);