import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Table,
  Select,
  Input,
  Button,
  Upload,
  DatePicker,
  Divider,
  Popconfirm,
  message,
  Row,
  Col,
  Form,
  Radio
} from 'antd';
import { DownloadOutlined, PaperClipOutlined } from '@ant-design/icons';
import KeyVal from '@/components/SysDict/KeyVal';
import { getFileSecuritySuffix } from '@/services/upload';
import EditContext from '@/layouts/MenuContext';
import { demandToRelease } from '../services/api';
import styles from './style.less';


const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

function Track(props) {
  const { dispatch, userinfo, demandId, loading, ChangeTrackLength } = props;
  const { getFieldDecorator, setFieldsValue, validateFields, setFields, getFieldsValue, resetFields, } = props.form;
  const required = true;
  const [data, setData] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [uploadkey, setKeyUpload] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectdata, setSelectData] = useState(undefined);
  const [trackslist, setTracksList] = useState('');
  const [filetype, setFileType] = useState('');
  const [status, setStatus] = useState('open');
  const { ChangeReleaseTaskName } = useContext(EditContext);

  // 加载列表
  const getlistdata = () => {
    dispatch({
      type: 'chacklist/fetchtracklist',
      payload: {
        demandId,
      },
    }).then(res => {
      if (res.code === 200) {
        const newarr = res.data.map((item, index) => {
          return Object.assign(item, { key: index });
        });
        setData(newarr);
        setStatus(res.status);
        ChangeReleaseTaskName(res.status);
        ChangeTrackLength(res.data.length);
        setNewButton(false);
      }
    });
  };

  // 提交保存数据
  const savedata = (target, id) => {
    const timevals = getFieldsValue();
    dispatch({
      type: 'chacklist/tracksave',
      payload: {
        ...target,
        id,
        demandId,
        stalker: userinfo.userName,
        trackDepartment: userinfo.deptName,
        trackUnit: userinfo.unitName,
        releaseTime: timevals.releaseTime ? timevals.releaseTime.format('YYYY-MM-DD HH:mm:ss') : '',
        devFinishTime: timevals.devFinishTime ? timevals.devFinishTime.format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg, 2);
        getlistdata();
      }
    });
  };

  useEffect(() => {
    ChangeReleaseTaskName('open')
    getlistdata();
    sessionStorage.setItem('flowtype', '1');
    return () => {
      setData([]);
      setFilesList([]);
      setSelectData([]);
      setNewButton(false);
    };
  }, []);

  // 不允许上传类型
  useEffect(() => {
    getFileSecuritySuffix().then(res => {
      if (res.code === 200) {
        const arr = [...res.data];
        setFileType(arr);
      }
    });
  }, []);

  // 点击编辑生成filelist,
  const handlefileedit = (key, values) => {
    setKeyUpload(key);
    if (!values) {
      setFilesList([]);
    } else {
      setFilesList(JSON.parse(values));
    }
  };

  // 列表中下载附件
  const handledownload = info => {
    dispatch({
      type: 'sysfile/downloadfile',
      payload: {
        id: info.uid,
      },
    }).then(res => {
      const filename = info.name;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  // 新增一条记录
  const newMember = () => {
    setFilesList([]);
    setKeyUpload('');
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      id: '',
      developSchedule: '',
      trackDirections: '',
      attachment: '[]',
      attachmentId: '',
      stalker: userinfo.userName,
      trackUnit: userinfo.unitName,
      trackDepartment: userinfo.deptName,
      gmtCreate: moment().format('YYYY-MM-DD HH:mm:ss'),
      editable: true,
      isNew: true,
    });
    setData(newData);
    setNewButton(true);
  };

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  };

  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  };

  // 编辑记录
  const toggleEditable = (e, key, record) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        setcacheOriginData({ key: { ...target } });
      }
      target.editable = !target.editable;
      setData(newData);
    }
  };

  // 保存记录
  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    if (!target.developSchedule || !target.trackDirections) {
      message.error('请填写完整信息。');
      e.target.focus();
      return;
    }
    delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    savedata(target, id);
    if (target.isNew) {
      setNewButton(false);
    }
  };

  const remove = key => {
    const target = getRowByKey(key) || {};
    dispatch({
      type: 'chacklist/trackdelete',
      payload: {
        id: target.id,
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg, 2);
        getlistdata();
      }
    });
  };

  // 取消按钮
  const cancel = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    const newArr = newData.filter(item => item.key !== target.key);
    setData(newArr);
    setNewButton(false);
  };

  // 上传
  const uploadprops = {
    name: 'file',
    // action: { FileUpload },
    action: '/sys/file/upload',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    multiple: true,
    showUploadList: { showDownloadIcon: true },
    defaultFileList: fileslist,

    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const type = file.name.lastIndexOf('.');
        const filesuffix = file.name.substring(type + 1, file.name.length);
        const correctfiletype = filetype.indexOf(filesuffix);
        if (correctfiletype === -1) {
          message.error(`${file.name}文件不符合上传规则,禁止上传...`);
          return reject();
        }
        return resolve(file);
      });
    },

    onChange({ file, fileList }) {
      const allsuccess = fileList.map(item => item.response && item.response.fileUploadInfo && item.response.fileUploadInfo.length > 0);
      const alldone = fileList.map(item => item.status !== 'done');
      if (file.status === 'done' && alldone.indexOf(true) === -1 && file.response && file.response.code === 200 && allsuccess.indexOf(true) === -1) {
        message.success(`文件上传成功`);
        const arr = [...fileList];
        const newarr = [];
        for (let i = 0; i < arr.length; i += 1) {
          const vote = {};
          vote.uid =
            arr[i]?.response?.data[0]?.id !== undefined
              ? arr[i]?.response?.data[0]?.id
              : arr[i].uid;
          vote.name = arr[i].name;
          vote.fileUrl = '';
          vote.status = arr[i].status;
          newarr.push(vote);
        }
        setFilesList([...newarr]);
        const newData = data.map(item => ({ ...item }));
        const target = getRowByKey(uploadkey, newData);
        target.attachment = JSON.stringify([...newarr]);
        delete target.key;
        target.editable = false;
        const id = target.id === '' ? '' : target.id;
        savedata(target, id);
      }
    },
    onPreview(info) {
      handledownload(info);
    },
    onDownload(info) {
      handledownload(info);
    },
    onRemove(info) {
      // 删除记录，并保存信息
      const newfilelist = fileslist.filter(item => item.uid !== info.uid);
      const target = getRowByKey(uploadkey) || {};
      target.attachment = JSON.stringify(newfilelist);
      delete target.isNew;
      target.editable = false;
      savedata(target, target.id);
      // 删除文件
      dispatch({
        type: 'sysfile/deletefile',
        payload: {
          id: info.uid,
        },
      });
    },
  };

  const torelease = () => {
    demandToRelease(demandId).then(res => {
      if (res.code === 200) {
        message.success('发布流程启动成功')
        setStatus(res.data.taskName);
        ChangeReleaseTaskName(res.data.taskName);
      } else {
        message.error(res.msg)
      }
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      render: (text, record, index) => {
        return <>{`${index + 1}`}</>;
      },
    },
    {
      title: '开发进度',
      dataIndex: 'developSchedule',
      key: 'developSchedule',
      width: 150,
      render: (text, record) => {
        if (record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
              <Select
                style={{ width: '100%' }}
                placeholder="请选择"
                defaultValue={text}
                onChange={e => handleFieldChange(e, 'developSchedule', record.key)}
              >
                {selectdata.schedule.map(obj => {
                  return (
                    <Option key={obj.key} value={obj.val}>
                      {obj.val}
                    </Option>
                  );
                })}
              </Select>
            </div>
          );
        }
        return text;
      },
    },
    {
      title: `跟踪说明`,
      dataIndex: 'trackDirections',
      key: 'trackDirections',
      width: 200,
      render: (text, record) => {
        if (record.editable) {
          if (text === '') {
            return (
              <Input
                defaultValue={text}
                onChange={e => handleFieldChange(e.target.value, 'trackDirections', record.key)}
                style={{ borderColor: '#ff4d4f' }}
              />
            );
          }
          return (
            <Input
              placeholder="请输入"
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'trackDirections', record.key)}
            />
          );
        }
        return text;
      },
    },
    {
      title: '上传附件',
      dataIndex: 'attachment',
      key: 'attachment',
      width: 250,
      render: (text, record) => {
        if (record.editable) {
          return (
            <div
              onMouseOver={() => {
                setKeyUpload(record.key);
              }}
              onFocus={() => 0}
            >
              <Upload {...uploadprops}>
                <Button type="primary">
                  <DownloadOutlined /> 添加附件
                </Button>
              </Upload>
              {filetype && filetype.length > 0 && (<div style={{ color: '#ccc' }}>仅能上传{filetype.join('，')}格式文件</div>)}
            </div>
          );
        }
        return (
          <>
            {text !== null && trackslist !== [] && (
              <div className={styles.greylink}>
                {JSON.parse(text).map(obj => {
                  return (
                    <div key={obj.id}>
                      <PaperClipOutlined
                        style={{ marginRight: 8, fontSize: 11, color: 'rgba(0, 0, 0, 0.45)' }}
                      />
                      <a onClick={() => handledownload(obj)}>{obj.name}</a>
                    </div>
                  );
                })}
              </div>
            )}
            {text === '' && <>{text}</>}
          </>
        );
      },
    },
    {
      title: '跟踪时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 200,
      render: (text, record) => {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        if (record.isNew) {
          return (
            <DatePicker
              showTime
              defaultValue={moment(text, dateFormat)}
              // format={dateFormat}
              onChange={e =>
                handleFieldChange(e.format('YYYY-MM-DD HH:mm:ss'), 'gmtCreate', record.key)
              }
            />
          );
        }
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '跟踪人',
      dataIndex: 'stalker',
      key: 'stalker',
      width: 100,
    },
    {
      title: '所在单位',
      dataIndex: 'trackUnit',
      key: 'trackUnit',
      width: 120,
    },
    {
      title: '所在部门',
      dataIndex: 'trackDepartment',
      key: 'trackDepartment',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        if (record.editable === '') {
          return null;
        }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span
                onMouseOver={() => {
                  setKeyUpload(record.key);
                }}
                onFocus={() => 0}
              >
                <a onClick={e => saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span
              onMouseOver={() => {
                setKeyUpload(record.key);
              }}
              onFocus={() => 0}
            >
              <a onClick={e => saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        }

        return (
          <span>
            <a
              onClick={e => {
                toggleEditable(e, record.key, record);
                handlefileedit(record.key, record.attachment);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <>
      <KeyVal
        style={{ display: 'none' }}
        dictModule="demand"
        dictType="schedule"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
      />
      <Form {...formItemLayout}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="预计开发完成时间">
              {getFieldDecorator('devFinishTime', {
                rules: [{ required, message: '请选择预计开发完成时间' }],
                initialValue: moment(data.length > 0 && data[data.length - 1].devFinishTime ? data[data.length - 1].devFinishTime : undefined),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预计发布时间">
              {getFieldDecorator('releaseTime', {
                rules: [{ required, message: '请选择预计发布时间' }],
                initialValue: moment(data.length > 0 && data[data.length - 1].releaseTime ? data[data.length - 1].releaseTime : undefined),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ paddingTop: 4 }}>
            {status === '' ? (
              <Button type='primary' onClick={() => torelease()}>启动发布</Button>
            ) : <Radio checked style={{ marginTop: 8 }}>已启动发布流程</Radio>}
          </Col>
        </Row>
      </Form>
      <Table
        columns={columns}
        scroll={{ x: 1400 }}
        dataSource={data}
        rowClassName={record => (record.editable ? styles.editable : '')}
        rowKey={record => record.id}
        loading={loading}
        pagination={false}
      />
      <Button
        style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
        type="primary"
        ghost
        onClick={() => newMember()}
        icon="plus"
        disabled={newbutton}
      >
        新增跟踪记录
      </Button>
    </>
  );
}

export default Form.create()(connect(({ chacklist, loading }) => ({
  trackslist: chacklist.trackslist,
  loading: loading.models.chacklist,
}))(Track));
