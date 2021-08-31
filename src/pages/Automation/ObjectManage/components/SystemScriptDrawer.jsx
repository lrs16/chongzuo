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

const directormap = [
  { key: '1', title: '张三' },
  { key: '2', title: '李四' },
  { key: '3', title: '王五' },
  { key: '3', title: '赵六' },
];
function SystemScriptDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit, dispatch,
    // scriptsourcemap, 
    scripttypemap,
    files,
    ChangeFiles,
    onChangeList,
  } = props;

  const { getFieldDecorator, validateFields } = props.form;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showElem, setshowElem] = useState('none');
  // const [toshowElem, settoshowElem] = useState('block');
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 附件上传下载

  const hanldleCancel = () => {
    ChangeVisible(false);
  };

  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
    }
  }, [fileslist]);

  useEffect(() => {
    if (scriptSource === '本地上传') {
      setshowElem('block');
      // settoshowElem('none');
    }else {
      setshowElem('none');
      // settoshowElem('block');
    }
  }, [scriptSource]);

  useEffect(() => {
    setFilesList({ ...fileslist, arr: files });
  }, []);

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
      // settoshowElem('none');
    } else {
      setshowElem('none');
      // settoshowElem('block');
    }
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
        {showElem==='none'&&(
        <Form.Item label="脚本内容">
          {getFieldDecorator('scriptCont', {
            rules: [{ required,message: '请输入 ' }],
            initialValue: scriptCont,
          })(<TextArea placeholder="请输入" autoSize={{ minRows: 10 }} allowClear />)}
        </Form.Item>
        )}
        <Form.Item label="脚本参数">
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
              <Option key={obj.key} value={obj.title}>
                {obj.title}
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
        <Button onClick={hanldleCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button style={{ marginRight: 8 }} onClick={handleOk} >
          保存
        </Button>
        <Button onClick={handletosave} type="primary">
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
  },
};

export default Form.create()(SystemScriptDrawer);