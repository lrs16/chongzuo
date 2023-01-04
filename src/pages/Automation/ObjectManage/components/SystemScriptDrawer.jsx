import React, { useState, useEffect } from 'react';
import { Drawer, Button, Form, Input, InputNumber, Radio, Select, message } from 'antd';
import SysUpload from './SysUpload/Upload';

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
function SystemScriptDrawer(props) {
  const {
    visible,
    ChangeVisible,
    title,
    handleSubmit,
    dispatch,
    scripttypemap,
    files,
    ChangeFiles,
    onChangeList,
    directormap,
    form: {
      getFieldDecorator,
      validateFields,
    },
  } = props;

  const required = true;
  const {
    id,
    scriptName,
    scriptSource,
    scriptType,
    scriptCont,
    scriptArgs,
    director,
    scriptSorts,
    scriptRemarks,
  } = props.record;

  const [showElem, setshowElem] = useState('none');
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 附件上传下载

  // 取消
  const hanldleCancel = () => {
    ChangeVisible(false);
  };

  // 保存->状态：已登记
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

  // 附件上传...
  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
    }
  }, [fileslist]);

  useEffect(() => {
    if (scriptSource === '本地上传') {
      setshowElem('block');
    } else {
      setshowElem('none');
    }
  }, [scriptSource]);

  useEffect(() => {
    setFilesList({ ...fileslist, arr: files });
  }, []);

  // 提交->状态：已发布
  const handletosave = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'scriptconfig/tosubmitsystemScript',
          payload: {
            ...values,
          },
        }).then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            onChangeList();
          } else {
            message.error(res.msg);
          }
        });
        hanldleCancel();
        props.form.resetFields();
      }
    });
  };

  const handletoChange = e => {
    if (e.target.value === '本地上传') {
      setshowElem('block');
    } else {
      setshowElem('none');
    }
  };

  return (
    <Drawer
      title={title}
      width={1000}
      onClose={hanldleCancel}
      visible={visible}
      bodyStyle={{ paddingBottom: 60 }}
      destroyOnClose
    >
      <Form {...formItemLayout} onSubmit={handleOk}>
        <Form.Item label="Id" style={{ display: 'none' }}>
          {getFieldDecorator('id', {
            initialValue: id,
          })(<Input disabled />)}
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
        <Form.Item label="脚本来源" span={12}>
          {getFieldDecorator('scriptSource', {
            rules: [
              {
                required,
                message: '请选择'
              },
            ],
            initialValue: scriptSource || '手动输入',
          })(<RadioGroup onChange={v => handletoChange(v)}>
            <Radio value="手动输入">手动输入</Radio>
            <Radio value="本地上传">本地上传</Radio>
          </RadioGroup>)}
        </Form.Item>
        <Form.Item label="上传" style={{ display: showElem }}>
          {getFieldDecorator('upload')(
            <div style={{ width: 400 }}>
              <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
            </div>,
          )}
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
            rules: [{ required, message: '请输入 ' }],
            initialValue: fileslist.ischange && files.length > 0 && files[0] ? files[0].scriptCont : scriptCont,
          })(<TextArea placeholder="请输入" autoSize={{ minRows: 30 }} allowClear />)}
        </Form.Item>
        <Form.Item label="脚本参数" extra="多个参数以 ; 符号分割 如 xxx;xxx;xxx">
          {getFieldDecorator('scriptArgs', {
            initialValue: scriptArgs,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="负责人">
          {getFieldDecorator('director', {
            rules: [
              {
                required,
                message: '请选择 '
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
        <Form.Item label="脚本排序">
          {getFieldDecorator('scriptSorts', {
            initialValue: scriptSorts,
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入数字..." />)}
        </Form.Item>
        <Form.Item label="脚本备注">
          {getFieldDecorator('scriptRemarks', {
            initialValue: scriptRemarks,
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
        <Button onClick={() => hanldleCancel()} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button style={{ marginRight: 8 }} onClick={() => handleOk()} type="primary">
          保存
        </Button>
        <Button onClick={() => handletosave()} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
}

SystemScriptDrawer.defaultProps = {
  record: {
    id: '',
    scriptName: '',
    scriptSource: '',
    scriptType: '',
    scriptCont: '',
    scriptArgs: '',
    director: '',
    scriptSorts: '',
    scriptRemarks: '',
    files: [],
  },
};

export default Form.create()(SystemScriptDrawer);