import React, { useState, useEffect } from 'react';
import { Drawer, Button, Form, Input, Radio, Select } from 'antd';
import DictLower from '@/components/SysDict/DictLower';
import moment from 'moment';
import SysUpload from './SysUpload/Upload';

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
  const { visible, ChangeVisible, title, handleSubmit,
    scriptsourcemap, scripttypemap, dispatch, userinfo, savetype,
    files,
    ChangeFiles,
  } = props;

  const { getFieldDecorator, validateFields, resetFields } = props.form;
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
    // createBy,
    hostZoneId,
  } = props.record;

  const [findhostname, setFindhostName] = useState([]); // 区域查询设备名称
  const [findhostip, setFindhostIp] = useState({}); // 设备名称查询主机IP
  const [showElem, setshowElem] = useState('none');
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 附件上传下载
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值

  const hanldleCancel = () => {
    resetFields();
    ChangeVisible(false);
  };

  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
    }
  }, [fileslist]);

//   useEffect(() => {
//     if (savetype !== '' && savetype !=='add' && (hostName !== undefined || hostName !== '')) {
//       dispatch({
//         type: 'softwaremanage/tofindCascade',
//         payload: { hostName },
//       }).then(res => {
//         console.log(res, 'res')
//         // setFindhostIp(res.data[0]);
//       });
//     }
// }, [savetype]);

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        // 关闭弹窗
        hanldleCancel();
        // 传数据
        handleSubmit(values);
        ChangeVisible(false);
        props.form.resetFields();
      }
    });
  };

  useEffect(() => {
    if (scriptSource === '本地上传') {
      setshowElem('block');
    } else {
      setshowElem('none');
    }
  }, [scriptSource]);

  const handleChange = v => {
    dispatch({
      type: 'softwaremanage/tofindCascade',
      payload: { hostZoneId: v },
    }).then(res => {
      setFindhostName(res.data);
    });
  };

  const handletoChange = e => {
    if (e.target.value === '本地上传') {
      setshowElem('block');
    } else {
      setshowElem('none');
    }
  };

  const handlehostNameChange = v => {
    dispatch({
      type: 'softwaremanage/tofindCascade',
      payload: { hostName: v },
    }).then(res => {
      setFindhostIp(res.data[0]);
    });
  };

  // useEffect(() => {
  //   return () => {
  //     setSelectData([]);
  //     setFindhostIp({});
  //   };
  // }, []);

  // useEffect(() => {
  //   setFindhostIp({});
  // }, [hostIp === undefined]);

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
      width={1000}
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
        {
          (savetype === 'add' || savetype === '') && (
            <Form.Item label="hostId" style={{ display: 'none' }}>
              {getFieldDecorator('hostId', {
                initialValue: findhostip.Id || '',
              })(<Input disabled />)}
            </Form.Item>
          )
        }
        {
          savetype === 'update' && (
            <Form.Item label="id">
              {getFieldDecorator('id', {
                initialValue: id,
              })(<Input disabled />)}
            </Form.Item>
          )
        }
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
        <Form.Item label="设备名称">
          {getFieldDecorator('hostName', {
            initialValue: hostName,
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
          })(<Select placeholder="请选择" allowClear onChange={v => handlehostNameChange(v)}>
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
            initialValue: savetype !== '' && savetype !=='add' && (hostName !== undefined || hostName !== '') ?  hostIp : findhostip.hostIp
          })(<Input allowClear />)}
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
          })(<Radio.Group onChange={v => handletoChange(v)}>
            {scriptsourcemap.map(obj => (
              <Radio key={obj.key} value={obj.title}>
                {obj.title}
              </Radio>
            ))}
          </Radio.Group>)}
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
            // initialValue: scriptCont,
            initialValue: fileslist.ischange && files.length > 0 && files[0] && savetype !== 'update'? files[0].scriptCont : scriptCont,
          })(<TextArea placeholder="请输入" autoSize={{ minRows: 30 }} allowClear />)}
        </Form.Item>
        <Form.Item label="脚本备注">
          {getFieldDecorator('scriptRemarks', {
            initialValue: scriptRemarks,
          })(<TextArea placeholder="请输入" autoSize={{ minRows: 3 }} allowClear />)}
        </Form.Item>
        <Form.Item label="脚本文件大小">
          {getFieldDecorator('scriptSize', {
            // initialValue: scriptSize,
            initialValue: fileslist.ischange && files.length > 0 && files[0] && savetype !== 'update'? files[0].fileSize : scriptSize,
          })(<Input style={{ width: '100%' }} placeholder="请输入" disabled />)}
        </Form.Item>
        <Form.Item label="上传时间">
          {getFieldDecorator('createTime', {
            initialValue: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="上传人">
          {getFieldDecorator('createBy', {
            initialValue: userinfo.userName,
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
  userinfo: {
    userName: '',
    userId: '',
  },
};

export default Form.create()(LocalScriptDrawer);