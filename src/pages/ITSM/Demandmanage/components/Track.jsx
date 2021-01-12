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
import { DownloadOutlined } from '@ant-design/icons';
import styles from './style.less';
import { FileUpload } from '@/services/upload';

const { Option } = Select;

const progressmap = [
  { key: '001', value: '计划中' },
  { key: '002', value: '已开发' },
  { key: '003', value: '已部署' },
  { key: '003', value: '已发布' },
];

function Track(props) {
  const { dispatch, userinfo, demandId, tracklist, loading } = props;
  const [data, setData] = useState([]);
  const [cacheOriginData, SetcacheOriginData] = useState({});
  const [uploadkey, SetKeyUpload] = useState('');

  useEffect(() => {
    dispatch({
      type: 'demandtodo/fetchtracklist',
      payload: {
        demandId,
      },
    });
  }, [demandId]);

  useEffect(() => {
    if (tracklist !== '') {
      const newarr = tracklist.map((item, index) => {
        return Object.assign(item, { key: index });
      });
      setData(newarr);
    }
  }, [tracklist]);

  // 新增一条记录
  const newMember = () => {
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      id: '',
      developSchedule: '',
      trackDirections: '',
      attachment: '',
      stalker: '',
      trackUnit: '',
      trackDepartment: '',
      gmtCreate: moment().format(),
      editable: true,
      isNew: true,
    });
    setData(newData);
  };

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  };

  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    console.log(target);
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
        SetcacheOriginData({ key: { ...target } });
      }
      target.editable = !target.editable;
      setData(newData);
    }
  };
  // 保存记录
  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    delete target.isNew;
    toggleEditable(e, key);
    const id = target.id === '' ? '' : target.id;
    dispatch({
      type: 'demandtodo/tracksave',
      payload: {
        ...target,
        id,
        demandId,
      },
    });
  };

  const remove = key => {
    dispatch({
      type: 'demandtodo/tracksave',
      payload: {
        id: key,
        demandId,
      },
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
    //action: `${FileUpload}`,
    action: 'http://172.16.4.211:9901/sys/file/upload',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          message.success(`${info.file.name} 上传成功`);
          const attachmentlist = [];
          console.log(info.fileList);
          info.fileList.forEach(e => {
            // const vote = {};
            // vote.uid = e.uid;
            // vote.
            attachmentlist.push(e.response.data);
          });
          console.log(attachmentlist);
          // handleFieldChange(info.file.response.data, 'attachment', uploadkey);
        }
        if (info.file.response.code === -1) {
          message.error(`${info.file.name} 上传失败`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
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
      width: 150,
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
      width: 120,
      render: (text, record) => {
        if (record.editable) {
          return (
            // <Input placeholder="请输入"
            //   defaultValue={text}
            //   onChange={e => handleFieldChange(e.target.value, 'attachment', record.key)}
            // />
            <>
              <Upload {...uploadprops} onClick={SetKeyUpload(record.key)}>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                </Button>
              </Upload>
            </>
          );
        }
        return text;
      },
    },
    {
      title: '跟踪时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 180,
      render: (text, record) => {
        if (record.editable) {
          const dateFormat = 'YYYY-MM-DD HH:mm:ss';
          return (
            <DatePicker
              showTime
              defaultValue={moment(text, dateFormat)}
              // format={dateFormat}
              onChange={e => handleFieldChange(e.format(), 'gmtCreate', record.key)}
            />
          );
        }
        return text;
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
              <span>
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
              <a onClick={e => saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={e => toggleEditable(e, record.key)}>编辑</a>
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
      >
        新增跟踪记录
      </Button>
    </>
  );
}

export default connect(({ demandtodo, loading }) => ({
  tracklist: demandtodo.tracklist,
  loading: loading.models.demandtodo,
}))(Track);
