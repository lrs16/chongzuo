import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Input, message, AutoComplete, Select } from 'antd';
import SysUpload from '@/components/SysUpload';
import { PaperClipOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { TextArea } = Input;
const { Option } = AutoComplete;

const files9 = [
  {
    uid: "b0d423fb46744bceb1f1aaf0a33d2081",
    name: "bbe6edf9-2211-41c4-96e8-75c140407104.jpg",
    fileUrl: "",
    status: "done"
  },
  {
    uid: "e8415f46ee8f431b84d716112215afa5",
    name: "计量主站运维辅助系统建设项目-工作计划20210129--细化_(林玉娇).xlsx",
    fileUrl: "",
    status: "done"
  },
];
const files1 = [{
  uid: "0d31cdd63d3c474896b02869c086705d",
  name: "nginx.conf",
  nowtime: "2021-04-22 08:16:28",
  fileUrl: "", status: "done"
}];
const files2 = [{
  uid: "0d31cdd63d3c474896b02869c086705d",
  name: "nginx.conf",
  nowtime: "2021-04-22 08:16:28",
  fileUrl: "", status: "done"
},
{
  uid: "b0d423fb46744bceb1f1aaf0a33d2081",
  name: "bbe6edf9-2211-41c4-96e8-75c140407104.jpg",
  fileUrl: "",
  status: "done"
},
{
  uid: "e8415f46ee8f431b84d716112215afa5",
  name: "计量主站运维辅助系统建设项目-工作计划20210129.xlsx",
  fileUrl: "",
  status: "done"
},];

const dataSource = [
  { key: '1', name: '功能出厂测试报告', type: files1, unit: '', mobail: '', des: '功能出厂测试', editable: false },
  { key: '2', name: '平台验证测试报告', type: files2, unit: '', mobail: '', des: '平台验证测试', editable: false },
  { key: '3', name: '业务功能测试报告', type: '', unit: '', mobail: '', des: '业务功能测试', editable: false },
  { key: '4', name: '功能清单终稿', type: '', unit: '', mobail: '', des: '功能清单', editable: false },
  { key: '5', name: '发布实施方案', type: '', unit: '', mobail: '', des: '实施方案', editable: false },
  { key: '6', name: '计划发布申请审批表', type: '', unit: '', mobail: '', des: '计划发布申请', editable: false },
  { key: '7', name: '临时发布申请审批表', type: '', unit: '', mobail: '', des: '临时发布申请', editable: false },
  { key: '8', name: '功能发布报告', type: '', unit: '', mobail: '', des: '功能发布', editable: false },
  { key: '9', name: '其它附件', type: files9, unit: '', mobail: '', des: '', editable: false },
];

function DocumentAtt(props) {
  const { dispatch, rowkey, unitmap, isEdit } = props;
  const [data, setData] = useState([]);
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false });
  const [keyupload, setKeyUpload] = useState('');

  useEffect(() => {
    if (keyupload !== '') {
      setFilesList({ ...fileslist, arr: data[keyupload - 1].type });
    }
  }, [keyupload]);
  useEffect(() => {
    if (fileslist.ischange) {
      // ChangeFiles(fileslist);
      setFilesList({ ...fileslist, ischange: false });
    }
  }, [fileslist]);

  useEffect(() => {
    dataSource[rowkey - 1].editable = true;
    dataSource[8].editable = true;
    if (rowkey === '3') {
      dataSource[3].editable = true;
    };
    setData(dataSource);
  }, [rowkey])

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || dataSource).filter(item => item.key === key)[0];
  };

  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = dataSource.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  };

  // 保存记录
  const saveRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    // if (!target.t2 || !target.t3) {
    //   message.error('请填写完整信息。');
    //   e.target.focus();
    //   return;
    // }
    // delete target.key;
    if (target && target.editable) {
      target.editable = !target.editable;
      setData(newData);
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


  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      align: 'center',
      render: (text, record, index) => {
        return <>{`${index + 1}`}</>;
      },
    },
    {
      title: '文档名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text, record) => {
        if (isEdit && record.editable && (record.key === rowkey || record.key !== '9' || rowkey === '3')) {
          return (<><span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>{text} </>)
        }
        return text;
      },
    },
    {
      title: '附件上传',
      dataIndex: 'type',
      key: 'type',
      width: 300,
      render: (text, record) => {
        if (isEdit && record.editable && (record.key === rowkey || record.key === '9' || rowkey === '3')) {
          return (
            <div onMouseOver={() => { setKeyUpload(record.key) }} onFocus={() => 0} style={{ width: 300 }}>
              <SysUpload fileslist={text} ChangeFileslist={newvalue => setFilesList(newvalue)} />
            </div>
          )
        }
        return (
          <>
            {text !== '' && (
              <div className={styles.greylink}>
                {text.map((obj, index) => {
                  return (
                    <div key={index.toString()}>
                      <PaperClipOutlined
                        style={{ marginRight: 8, fontSize: 11, color: 'rgba(0, 0, 0, 0.45)' }}
                      />
                      <a onClick={() => handledownload(obj)}>{obj.name}</a>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      },
    },
    {
      title: '责任单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 200,
      render: (text, record) => {
        if (isEdit && record.editable && (record.key === rowkey || record.key === '9' || rowkey === '3')) {
          return (
            <Select placeholder="请选择" >
              {unitmap.map(obj => [
                <Option key={obj.key} value={obj.title}>
                  {obj.title}
                </Option>,
              ])}
            </Select>
          )
        }
        return text;
      }
    },
    {
      title: '文档模板',
      dataIndex: 'mobail',
      key: 'mobail',
      with: 80,
      render: (text, record) => {
        if (record.key === '9') {
          return null;
        }
        return <><Button type='link'><Icon type='download' />下载</Button></>;
      },
    },
    {
      title: '备注',
      dataIndex: 'des',
      key: 'des',
      render: (text, record) => {
        if (isEdit && record.editable && (record.key === rowkey || record.key === '9' || rowkey === '3')) {
          return (
            <TextArea
              defaultValue={text}
              autoSize
              placeholder="请输入"
              onChange={e => handleFieldChange(e.target.value, 'des', record.key)}
            />
          )
        }
        return text;
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Button type='link' onClick={e => saveRow(e, record.key)}>保存</Button>
          );
        }
        return null;
      },
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      size='middle'
      rowKey={(_, index) => index.toString()}
      pagination={false}
    />
  );
}

export default connect(({ sysfile, loading }) => ({
  sysfile,
  loading: loading.models.sysfile,
}))(DocumentAtt);