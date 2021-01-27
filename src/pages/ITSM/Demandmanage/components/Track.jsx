import React, { useState, useEffect } from 'react';
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
} from 'antd';
import { DownloadOutlined, PaperClipOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './style.less';

const { Option } = Select;

const progressmap = [
  { key: '001', value: '计划中' },
  { key: '002', value: '已开发' },
  { key: '003', value: '已部署' },
  { key: '003', value: '已发布' },
];

function Track(props) {
  const { dispatch, userinfo, demandId, trackslist, loading } = props;
  const [data, setData] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [uploadkey, setKeyUpload] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'chacklist/fetchtracklist',
      payload: {
        demandId,
      },
    });
  }, []);

  useEffect(() => {
    if (trackslist.length > 0) {
      const newarr = trackslist.map((item, index) => {
        return Object.assign(item, { key: index });
      });
      setData(newarr);
    }
  }, [trackslist]);

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
        id: info.id,
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
      stalker: '',
      trackUnit: '',
      trackDepartment: '',
      gmtCreate: moment().format(),
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
  const toggleEditable = (e, key) => {
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
    delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    dispatch({
      type: 'chacklist/tracksave',
      payload: {
        ...target,
        id,
        demandId,
        stalker: userinfo.userName,
        trackDepartment: userinfo.deptName,
        trackUnit: userinfo.unitName,
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg, 2);
        dispatch({
          type: 'chacklist/fetchtracklist',
          payload: {
            demandId,
          },
        });
      }
    });
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
        dispatch({
          type: 'chacklist/fetchtracklist',
          payload: {
            demandId,
          },
        });
      }
    });
  };

  // 取消按钮
  const cancel = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (cacheOriginData[key]) {
      Object.assign(target, cacheOriginData[key]);
      delete cacheOriginData[key];
    }
    target.editable = false;
    setData(newData);
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
    // multiple: true,
    showUploadList: { showDownloadIcon: true },
    defaultFileList: fileslist,
    onChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          message.success(`${info.file.name} 上传成功`);
          const voice = {};
          voice.uid = info.file.response.data.id;
          voice.id = info.file.response.data.id;
          voice.name = info.file.response.data.fileName;
          voice.status = 'done';
          voice.fileUrl = '';
          fileslist.push(voice);
          handleFieldChange(JSON.stringify(fileslist), 'attachment', uploadkey);
        }
        if (info.file.response.code === -1) {
          message.error(`${info.file.name} 上传失败`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
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
      const newfilelist = fileslist.filter(item => item.id !== info.id);
      handleFieldChange(JSON.stringify(newfilelist), 'attachment', uploadkey);
      const target = getRowByKey(uploadkey) || {};
      delete target.isNew;
      delete target.editable;
      // 删除文件
      dispatch({
        type: 'sysfile/deletefile',
        payload: {
          id: info.id,
        },
      });
    },
  };

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
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              defaultValue={text}
              onChange={e => handleFieldChange(e, 'developSchedule', record.key)}
            >
              {progressmap.map(({ key, value }) => {
                return (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                );
              })}
            </Select>
          );
        }
        return text;
      },
    },
    {
      title: '跟踪说明',
      dataIndex: 'trackDirections',
      key: 'trackDirections',
      width: 200,
      render: (text, record) => {
        if (record.editable) {
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
        const dateFormat = 'YYYY-MM-DD HH:mm';
        if (record.editable) {
          return (
            <DatePicker
              showTime
              defaultValue={moment(text, dateFormat)}
              // format={dateFormat}
              onChange={e => handleFieldChange(e.format(), 'gmtCreate', record.key)}
            />
          );
        }
        return moment(text).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      title: '跟踪人',
      dataIndex: 'stalker',
      key: 'stalker',
      width: 100,
      render: (text, record) => {
        return userinfo.userName;
      },
    },
    {
      title: '所在单位',
      dataIndex: 'trackUnit',
      key: 'trackUnit',
      width: 120,
      render: (text, record) => {
        return userinfo.unitName;
      },
    },
    {
      title: '所在部门',
      dataIndex: 'trackDepartment',
      key: 'trackDepartment',
      width: 120,
      render: (text, record) => {
        return userinfo.deptName;
      },
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
                toggleEditable(e, record.key);
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

export default connect(({ chacklist, loading }) => ({
  trackslist: chacklist.trackslist,
  loading: loading.models.chacklist,
}))(Track);
